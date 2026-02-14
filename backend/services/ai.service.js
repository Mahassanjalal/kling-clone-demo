const Replicate = require('replicate');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

class AIService {
  constructor() {
    this.replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });
    
    this.openai = null;
    if (process.env.OPENAI_API_KEY) {
      const OpenAI = require('openai');
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
    }
  }

  /**
   * Generate video from image using Stable Video Diffusion
   * @param {Object} params - Generation parameters
   * @param {string} params.imageUrl - URL of input image
   * @param {Object} params.settings - Video settings
   * @returns {Promise<string>} - Prediction ID
   */
  async generateVideoFromImage(params) {
    const { imageUrl, settings } = params;
    
    try {
      const prediction = await this.replicate.predictions.create({
        version: process.env.REPLICATE_MODEL_VERSION || 
          "3f0457e4619daac51203dedb472816fd4af51f3149fa7a9e0b5ffcf1b8172438",
        input: {
          image: imageUrl,
          frames_per_second: settings.fps || 6,
          motion_bucket_id: this.getMotionBucket(settings.cameraMovement),
          cond_aug: 0.02,
          decoding_t: 7,
          seed: settings.seed || Math.floor(Math.random() * 1000000),
        },
      });

      return prediction.id;
    } catch (error) {
      console.error('Replicate video generation error:', error);
      throw new Error(`Video generation failed: ${error.message}`);
    }
  }

  /**
   * Generate video from text using text-to-image then image-to-video
   * @param {Object} params - Generation parameters
   * @param {string} params.prompt - Text prompt
   * @param {Object} params.settings - Video settings
   * @returns {Promise<string>} - Prediction ID
   */
  async generateVideoFromText(params) {
    const { prompt, settings } = params;
    
    try {
      // First generate an image from text
      const imagePrediction = await this.replicate.predictions.create({
        version: "39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
        input: {
          prompt: prompt,
          negative_prompt: "blur, haze, deformed, distorted",
          width: this.getResolutionWidth(settings.resolution),
          height: this.getResolutionHeight(settings.resolution, settings.aspectRatio),
          num_outputs: 1,
          scheduler: "K_EULER",
          num_inference_steps: 50,
          guidance_scale: 7.5,
        },
      });

      return {
        type: 'text-to-video',
        stage: 'image-generation',
        imagePredictionId: imagePrediction.id,
      };
    } catch (error) {
      console.error('Text-to-video generation error:', error);
      throw new Error(`Text-to-video generation failed: ${error.message}`);
    }
  }

  /**
   * Check prediction status
   * @param {string} predictionId - Replicate prediction ID
   * @returns {Promise<Object>} - Prediction status and output
   */
  async checkPredictionStatus(predictionId) {
    try {
      const prediction = await this.replicate.predictions.get(predictionId);
      
      return {
        status: prediction.status,
        output: prediction.output,
        error: prediction.error,
        logs: prediction.logs,
        metrics: prediction.metrics,
      };
    } catch (error) {
      console.error('Check prediction error:', error);
      throw error;
    }
  }

  /**
   * Generate script with AI
   * @param {Object} params - Script parameters
   * @param {string} params.product - Product name
   * @param {string} params.audience - Target audience
   * @param {string} params.style - Script style
   * @param {number} params.duration - Video duration
   * @returns {Promise<Object>} - Generated script
   */
  async generateScript(params) {
    if (!this.openai) {
      throw new Error('OpenAI not configured');
    }

    const { product, audience, style, duration } = params;
    
    const prompt = `Create a compelling ${duration}-second video ad script for "${product}" targeting ${audience}. 
    Style: ${style}
    
    Format the response as JSON with:
    - title: catchy ad title
    - hook: opening hook (3-5 seconds)
    - scenes: array of scenes with timestamp, visual description, and voiceover text
    - cta: call to action
    - musicSuggestion: music mood/style suggestion`;

    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an expert video ad copywriter specializing in short-form content."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
      });

      return JSON.parse(completion.choices[0].message.content);
    } catch (error) {
      console.error('Script generation error:', error);
      throw new Error(`Script generation failed: ${error.message}`);
    }
  }

  /**
   * Generate voiceover text variations for A/B testing
   * @param {Object} params - Voiceover parameters
   * @param {string} params.baseScript - Base script text
   * @param {number} params.variants - Number of variants
   * @returns {Promise<Array>} - Array of variations
   */
  async generateVoiceoverVariants(params) {
    if (!this.openai) {
      throw new Error('OpenAI not configured');
    }

    const { baseScript, variants = 3 } = params;
    
    const prompt = `Create ${variants} variations of this voiceover script for A/B testing:
    
    Original: "${baseScript}"
    
    Create variations with different:
    - Tone (enthusiastic, calm, urgent, storytelling)
    - Opening hooks
    - Call-to-action phrasing
    
    Return as JSON array with tone and script for each variation.`;

    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      });

      return JSON.parse(completion.choices[0].message.content).variants;
    } catch (error) {
      console.error('Voiceover variant error:', error);
      throw error;
    }
  }

  /**
   * Get motion bucket ID based on camera movement
   * @param {string} movement - Camera movement type
   * @returns {number} - Motion bucket ID
   */
  getMotionBucket(movement) {
    const buckets = {
      'static': 40,
      'zoom-in': 80,
      'zoom-out': 60,
      'pan-left': 100,
      'pan-right': 100,
      'tilt-up': 90,
      'tilt-down': 90,
    };
    return buckets[movement] || 40;
  }

  /**
   * Get resolution width
   * @param {string} resolution - Resolution string
   * @returns {number} - Width in pixels
   */
  getResolutionWidth(resolution) {
    const widths = {
      '480p': 854,
      '720p': 1280,
      '1080p': 1920,
    };
    return widths[resolution] || 1280;
  }

  /**
   * Get resolution height based on aspect ratio
   * @param {string} resolution - Resolution string
   * @param {string} aspectRatio - Aspect ratio
   * @returns {number} - Height in pixels
   */
  getResolutionHeight(resolution, aspectRatio) {
    const width = this.getResolutionWidth(resolution);
    const ratios = {
      '16:9': 9/16,
      '9:16': 16/9,
      '1:1': 1,
      '4:3': 3/4,
    };
    return Math.round(width * (ratios[aspectRatio] || 9/16));
  }

  /**
   * Upload file to temporary hosting for Replicate
   * @param {string} filePath - Local file path
   * @returns {Promise<string>} - Public URL
   */
  async uploadToReplicate(filePath) {
    try {
      // For production, use S3 or Cloudinary
      // This is a placeholder implementation
      const cloudinary = require('cloudinary').v2;
      
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });

      const result = await cloudinary.uploader.upload(filePath, {
        resource_type: 'image',
        folder: 'kling-clone/temp',
      });

      return result.secure_url;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  }
}

module.exports = new AIService();