const Queue = require('bull');
const Redis = require('ioredis');
const aiService = require('./ai.service');
const VideoJob = require('../models/VideoJob');
const User = require('../models/User');

// Redis connection
const redisClient = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

// Create queues
const videoGenerationQueue = new Queue('video generation', process.env.REDIS_URL || 'redis://localhost:6379');
const scriptGenerationQueue = new Queue('script generation', process.env.REDIS_URL || 'redis://localhost:6379');
const webhookQueue = new Queue('webhooks', process.env.REDIS_URL || 'redis://localhost:6379');

class QueueService {
  constructor() {
    this.setupVideoGenerationProcessor();
    this.setupScriptGenerationProcessor();
    this.setupWebhookProcessor();
  }

  /**
   * Add video generation job to queue
   * @param {Object} jobData - Job data
   * @returns {Promise<Object>} - Bull job
   */
  async addVideoGenerationJob(jobData) {
    const { videoJobId, userId, prompt, referenceImage, settings } = jobData;
    
    const job = await videoGenerationQueue.add({
      videoJobId,
      userId,
      prompt,
      referenceImage,
      settings,
      type: referenceImage ? 'image-to-video' : 'text-to-video',
    }, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 5000,
      },
      removeOnComplete: 100,
      removeOnFail: 50,
    });

    return job;
  }

  /**
   * Setup video generation processor
   */
  setupVideoGenerationProcessor() {
    videoGenerationQueue.process(async (job) => {
      const { videoJobId, type, prompt, referenceImage, settings } = job.data;
      
      try {
        // Update job status to processing
        await VideoJob.findByIdAndUpdate(videoJobId, {
          status: 'processing',
          progress: 10,
        });

        // Emit progress update via Redis
        await this.emitProgress(videoJobId, 10, 'processing');

        let predictionId;
        
        if (type === 'image-to-video') {
          // Upload image to cloud storage first
          const imageUrl = await aiService.uploadToReplicate(`./uploads/${referenceImage}`);
          
          predictionId = await aiService.generateVideoFromImage({
            imageUrl,
            settings,
          });
        } else {
          // Text-to-video
          const result = await aiService.generateVideoFromText({
            prompt,
            settings,
          });
          predictionId = result.imagePredictionId;
        }

        // Update job with prediction ID
        await VideoJob.findByIdAndUpdate(videoJobId, {
          'metadata.predictionId': predictionId,
          progress: 25,
        });

        await this.emitProgress(videoJobId, 25, 'processing');

        // Poll for completion
        await this.pollPredictionStatus(videoJobId, predictionId);

        return { success: true, videoJobId };
      } catch (error) {
        console.error('Video generation job error:', error);
        
        await VideoJob.findByIdAndUpdate(videoJobId, {
          status: 'failed',
          errorMessage: error.message,
        });

        await this.emitProgress(videoJobId, 0, 'failed', error.message);
        
        throw error;
      }
    });

    // Handle job events
    videoGenerationQueue.on('completed', (job, result) => {
      console.log(`Video job ${job.id} completed:`, result);
    });

    videoGenerationQueue.on('failed', (job, err) => {
      console.error(`Video job ${job.id} failed:`, err);
    });
  }

  /**
   * Poll Replicate prediction status
   * @param {string} videoJobId - Video job ID
   * @param {string} predictionId - Replicate prediction ID
   */
  async pollPredictionStatus(videoJobId, predictionId) {
    const maxAttempts = 60; // 5 minutes with 5 second intervals
    let attempts = 0;

    const poll = async () => {
      if (attempts >= maxAttempts) {
        throw new Error('Video generation timeout');
      }

      attempts++;
      
      const status = await aiService.checkPredictionStatus(predictionId);
      
      // Calculate progress (25% to 95%)
      const progress = Math.min(25 + (attempts / maxAttempts) * 70, 95);
      
      await VideoJob.findByIdAndUpdate(videoJobId, {
        progress: Math.round(progress),
      });

      await this.emitProgress(videoJobId, Math.round(progress), 'processing');

      if (status.status === 'succeeded') {
        // Video generation complete
        const outputUrl = Array.isArray(status.output) ? status.output[0] : status.output;
        
        await VideoJob.findByIdAndUpdate(videoJobId, {
          status: 'completed',
          progress: 100,
          outputUrl,
          thumbnailUrl: outputUrl.replace('.mp4', '.jpg'), // Assuming thumbnail generation
          completedAt: new Date(),
        });

        await this.emitProgress(videoJobId, 100, 'completed', null, outputUrl);
        
        return status;
      } else if (status.status === 'failed') {
        throw new Error(status.error || 'Video generation failed');
      } else if (status.status === 'canceled') {
        throw new Error('Video generation was canceled');
      }

      // Continue polling
      await new Promise(resolve => setTimeout(resolve, 5000));
      return poll();
    };

    return poll();
  }

  /**
   * Setup script generation processor
   */
  setupScriptGenerationProcessor() {
    scriptGenerationQueue.process(async (job) => {
      const { params } = job.data;
      
      try {
        const script = await aiService.generateScript(params);
        return script;
      } catch (error) {
        console.error('Script generation error:', error);
        throw error;
      }
    });
  }

  /**
   * Setup webhook processor
   */
  setupWebhookProcessor() {
    webhookQueue.process(async (job) => {
      const { url, payload } = job.data;
      
      try {
        const axios = require('axios');
        await axios.post(url, payload, {
          timeout: 10000,
        });
      } catch (error) {
        console.error('Webhook delivery failed:', error);
        throw error;
      }
    });
  }

  /**
   * Emit progress update via Redis Pub/Sub
   * @param {string} videoJobId - Video job ID
   * @param {number} progress - Progress percentage
   * @param {string} status - Job status
   * @param {string} error - Error message (if any)
   * @param {string} outputUrl - Output URL (if completed)
   */
  async emitProgress(videoJobId, progress, status, error = null, outputUrl = null) {
    const message = JSON.stringify({
      videoJobId,
      progress,
      status,
      error,
      outputUrl,
      timestamp: new Date().toISOString(),
    });

    await redisClient.publish(`video:${videoJobId}`, message);
  }

  /**
   * Subscribe to job progress updates
   * @param {string} videoJobId - Video job ID
   * @param {Function} callback - Callback function
   * @returns {Function} - Unsubscribe function
   */
  subscribeToProgress(videoJobId, callback) {
    const subscriber = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
    const channel = `video:${videoJobId}`;

    subscriber.subscribe(channel);
    
    subscriber.on('message', (chan, message) => {
      if (chan === channel) {
        callback(JSON.parse(message));
      }
    });

    return () => {
      subscriber.unsubscribe(channel);
      subscriber.quit();
    };
  }

  /**
   * Get queue statistics
   * @returns {Promise<Object>} - Queue stats
   */
  async getQueueStats() {
    const [videoWaiting, videoActive, videoCompleted, videoFailed] = await Promise.all([
      videoGenerationQueue.getWaitingCount(),
      videoGenerationQueue.getActiveCount(),
      videoGenerationQueue.getCompletedCount(),
      videoGenerationQueue.getFailedCount(),
    ]);

    return {
      videoGeneration: {
        waiting: videoWaiting,
        active: videoActive,
        completed: videoCompleted,
        failed: videoFailed,
      },
    };
  }

  /**
   * Cancel a job
   * @param {string} jobId - Bull job ID
   * @returns {Promise<void>}
   */
  async cancelJob(jobId) {
    const job = await videoGenerationQueue.getJob(jobId);
    if (job) {
      await job.remove();
    }
  }
}

module.exports = new QueueService();