const express = require('express');
const { body, validationResult } = require('express-validator');
const VideoJob = require('../models/VideoJob');
const User = require('../models/User');
const Subscription = require('../models/Subscription');
const { authMiddleware, requireSubscription } = require('../middleware/auth');
const upload = require('../middleware/upload');
const queueService = require('../services/queue.service');

const router = express.Router();

// Credit costs for different video settings
const CREDIT_COSTS = {
  duration: {
    5: 10,
    10: 20,
    15: 30,
    30: 50,
    60: 80
  },
  resolution: {
    '480p': 1,
    '720p': 1.5,
    '1080p': 2,
    '4k': 4
  }
};

// Calculate credit cost
const calculateCreditCost = (settings) => {
  const baseCost = CREDIT_COSTS.duration[settings.duration] || 10;
  const resolutionMultiplier = CREDIT_COSTS.resolution[settings.resolution] || 1;
  return Math.round(baseCost * resolutionMultiplier);
};

// Create video generation job
router.post('/generate', authMiddleware, upload.single('referenceImage'), [
  body('prompt').trim().notEmpty().withMessage('Prompt is required'),
  body('settings').optional().isObject().withMessage('Settings must be an object')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { prompt, settings = {} } = req.body;
    const userId = req.user._id;

    // Get user subscription to check limits
    const subscription = await Subscription.findOne({ userId });
    const planLimits = Subscription.PLANS[subscription?.plan || 'free'].features;

    // Validate video length against plan limits
    const duration = parseInt(settings.duration) || 5;
    if (duration > planLimits.maxVideoLength) {
      return res.status(403).json({
        message: `Your plan allows maximum ${planLimits.maxVideoLength}s videos`,
        upgradeRequired: true
      });
    }

    // Validate resolution against plan limits
    const resolutionOrder = ['480p', '720p', '1080p', '4k'];
    const userMaxResIndex = resolutionOrder.indexOf(planLimits.maxResolution);
    const requestedResIndex = resolutionOrder.indexOf(settings.resolution);
    
    if (requestedResIndex > userMaxResIndex) {
      return res.status(403).json({
        message: `Your plan allows maximum ${planLimits.maxResolution} resolution`,
        upgradeRequired: true
      });
    }

    // Validate and set default settings
    const videoSettings = {
      duration: duration,
      resolution: settings.resolution || '720p',
      aspectRatio: settings.aspectRatio || '16:9',
      style: settings.style || 'realistic',
      cameraMovement: settings.cameraMovement || 'static',
      fps: settings.fps || 6
    };

    // Calculate credit cost
    const creditCost = calculateCreditCost(videoSettings);

    // Check user credits
    const user = await User.findById(userId);
    if (user.credits < creditCost) {
      return res.status(400).json({ 
        message: 'Insufficient credits',
        required: creditCost,
        available: user.credits,
        purchaseUrl: '/credits'
      });
    }

    // Check monthly video limit
    const videosThisMonth = await VideoJob.countDocuments({
      userId,
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    });

    if (planLimits.maxVideosPerMonth !== -1 && videosThisMonth >= planLimits.maxVideosPerMonth) {
      return res.status(403).json({
        message: `You have reached your monthly limit of ${planLimits.maxVideosPerMonth} videos`,
        upgradeRequired: true
      });
    }

    // Create video job
    const videoJob = new VideoJob({
      userId,
      prompt,
      referenceImage: req.file ? req.file.filename : null,
      settings: videoSettings,
      creditsUsed: creditCost,
      status: 'pending',
      metadata: {
        type: req.file ? 'image-to-video' : 'text-to-video'
      }
    });

    await videoJob.save();

    // Deduct credits
    user.credits -= creditCost;
    await user.save();

    // Add to queue for processing
    await queueService.addVideoGenerationJob({
      videoJobId: videoJob._id,
      userId,
      prompt,
      referenceImage: req.file ? req.file.filename : null,
      settings: videoSettings
    });

    // Subscribe to progress updates and emit via WebSocket
    queueService.subscribeToProgress(videoJob._id.toString(), (update) => {
      req.io.to(`video:${videoJob._id}`).emit('progress', update);
    });

    res.status(201).json({
      message: 'Video generation started',
      job: {
        id: videoJob._id,
        prompt: videoJob.prompt,
        settings: videoJob.settings,
        status: videoJob.status,
        creditsUsed: creditCost,
        createdAt: videoJob.createdAt
      },
      remainingCredits: user.credits
    });
  } catch (error) {
    console.error('Video generation error:', error);
    res.status(500).json({ message: 'Server error during video generation' });
  }
});

// Get all user's video jobs
router.get('/my-videos', authMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const videos = await VideoJob.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-__v');

    const total = await VideoJob.countDocuments({ userId: req.user._id });

    res.json({
      videos,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get videos error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get specific video job
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const video = await VideoJob.findOne({
      _id: req.params.id,
      userId: req.user._id
    }).select('-__v');

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    res.json({ video });
  } catch (error) {
    console.error('Get video error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get video status/progress
router.get('/:id/status', authMiddleware, async (req, res) => {
  try {
    const video = await VideoJob.findOne({
      _id: req.params.id,
      userId: req.user._id
    }).select('status progress outputUrl thumbnailUrl errorMessage metadata');

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    res.json({
      status: video.status,
      progress: video.progress,
      outputUrl: video.outputUrl,
      thumbnailUrl: video.thumbnailUrl,
      errorMessage: video.errorMessage,
      predictionId: video.metadata?.predictionId
    });
  } catch (error) {
    console.error('Get video status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Cancel video generation (only if still pending)
router.post('/:id/cancel', authMiddleware, async (req, res) => {
  try {
    const video = await VideoJob.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    if (video.status !== 'pending') {
      return res.status(400).json({ message: 'Can only cancel pending videos' });
    }

    video.status = 'canceled';
    await video.save();

    // Refund credits
    const user = await User.findById(req.user._id);
    user.credits += video.creditsUsed;
    await user.save();

    res.json({ 
      message: 'Video generation canceled',
      refundedCredits: video.creditsUsed
    });
  } catch (error) {
    console.error('Cancel video error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete video job
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const video = await VideoJob.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    res.json({ message: 'Video deleted successfully' });
  } catch (error) {
    console.error('Delete video error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Regenerate video (copy settings)
router.post('/:id/regenerate', authMiddleware, async (req, res) => {
  try {
    const originalVideo = await VideoJob.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!originalVideo) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Check credits
    const user = await User.findById(req.user._id);
    if (user.credits < originalVideo.creditsUsed) {
      return res.status(400).json({ 
        message: 'Insufficient credits',
        required: originalVideo.creditsUsed,
        available: user.credits
      });
    }

    // Create new job with same settings
    const newVideoJob = new VideoJob({
      userId: req.user._id,
      prompt: originalVideo.prompt,
      referenceImage: originalVideo.referenceImage,
      settings: originalVideo.settings,
      creditsUsed: originalVideo.creditsUsed,
      status: 'pending',
      metadata: {
        type: originalVideo.metadata?.type || 'text-to-video',
        regeneratedFrom: originalVideo._id
      }
    });

    await newVideoJob.save();

    // Deduct credits
    user.credits -= originalVideo.creditsUsed;
    await user.save();

    // Add to queue
    await queueService.addVideoGenerationJob({
      videoJobId: newVideoJob._id,
      userId: req.user._id,
      prompt: newVideoJob.prompt,
      referenceImage: newVideoJob.referenceImage,
      settings: newVideoJob.settings
    });

    res.status(201).json({
      message: 'Video regeneration started',
      job: {
        id: newVideoJob._id,
        prompt: newVideoJob.prompt,
        settings: newVideoJob.settings,
        status: newVideoJob.status,
        creditsUsed: newVideoJob.creditsUsed,
        createdAt: newVideoJob.createdAt
      },
      remainingCredits: user.credits
    });
  } catch (error) {
    console.error('Regenerate video error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;