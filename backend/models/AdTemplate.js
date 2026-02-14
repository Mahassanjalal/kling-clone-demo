const mongoose = require('mongoose');

const adTemplateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: String,
  category: {
    type: String,
    required: true,
    enum: [
      'ecommerce',
      'social-media',
      'product-demo',
      'testimonial',
      'promotional',
      'storytelling',
      'educational',
      'app-promo',
      'event',
      'announcement',
    ],
  },
  platform: {
    type: String,
    required: true,
    enum: [
      'tiktok',
      'instagram',
      'facebook',
      'youtube',
      'linkedin',
      'twitter',
      'google-ads',
      'snapchat',
      'universal',
    ],
  },
  format: {
    type: String,
    required: true,
    enum: ['feed', 'story', 'reel', 'short', 'square', 'banner', 'carousel'],
  },
  aspectRatio: {
    type: String,
    enum: ['16:9', '9:16', '1:1', '4:3', '4:5'],
    required: true,
  },
  duration: {
    min: Number,
    max: Number,
    recommended: Number,
  },
  resolution: {
    type: String,
    enum: ['480p', '720p', '1080p', '4k'],
    default: '1080p',
  },
  structure: {
    scenes: [{
      order: Number,
      duration: Number,
      template: String,
      elements: [{
        type: {
          type: String,
          enum: ['text', 'image', 'video', 'logo', 'cta', 'product'],
        },
        position: {
          x: Number,
          y: Number,
        },
        style: mongoose.Schema.Types.Mixed,
        animation: String,
      }],
    }],
  },
  styles: {
    transitions: [String],
    textAnimations: [String],
    filters: [String],
    overlays: [String],
  },
  placeholders: [{
    type: {
      type: String,
      enum: ['product-image', 'logo', 'text', 'price', 'cta-text', 'headline', 'subheadline'],
    },
    label: String,
    description: String,
    required: Boolean,
  }],
  music: {
    genre: [String],
    tempo: String,
    mood: [String],
  },
  previewUrl: String,
  thumbnailUrl: String,
  popularity: {
    type: Number,
    default: 0,
  },
  isPremium: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  tags: [String],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

adTemplateSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

adTemplateSchema.index({ category: 1, platform: 1, format: 1 });

module.exports = mongoose.model('AdTemplate', adTemplateSchema);