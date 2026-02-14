const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    default: null,
  },
  folderId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: String,
  type: {
    type: String,
    enum: ['single-video', 'multi-scene', 'ab-test', 'template-based'],
    default: 'single-video',
  },
  status: {
    type: String,
    enum: ['draft', 'in-progress', 'review', 'approved', 'published'],
    default: 'draft',
  },
  // Multi-scene structure
  scenes: [{
    order: Number,
    name: String,
    duration: Number,
    prompt: String,
    referenceImage: String,
    voiceover: {
      text: String,
      audioUrl: String,
      voiceId: String,
    },
    settings: {
      transition: String,
      effects: [String],
    },
    videoJobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'VideoJob',
    },
    status: {
      type: String,
      enum: ['pending', 'generating', 'completed', 'failed'],
      default: 'pending',
    },
  }],
  // For A/B testing
  variants: [{
    name: String,
    scenes: [mongoose.Schema.Types.Mixed], // Scene configurations
    videoJobIds: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'VideoJob',
    }],
    metrics: {
      views: Number,
      clicks: Number,
      conversions: Number,
      ctr: Number,
    },
  }],
  // Template-based project
  templateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AdTemplate',
  },
  templateData: mongoose.Schema.Types.Mixed, // Filled template data
  // Brand kit
  brandKitId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BrandKit',
  },
  // Generated output
  finalVideo: {
    url: String,
    thumbnailUrl: String,
    duration: Number,
    resolution: String,
  },
  // Publishing
  publishedAt: Date,
  publishedPlatforms: [{
    platform: String,
    url: String,
    status: String,
    publishedAt: Date,
  }],
  // Analytics
  analytics: {
    totalViews: { type: Number, default: 0 },
    totalClicks: { type: Number, default: 0 },
    totalConversions: { type: Number, default: 0 },
    avgWatchTime: { type: Number, default: 0 },
    engagementRate: { type: Number, default: 0 },
  },
  collaborators: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    role: String,
    lastActive: Date,
  }],
  tags: [String],
  isArchived: {
    type: Boolean,
    default: false,
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

projectSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

projectSchema.index({ userId: 1, teamId: 1, createdAt: -1 });
projectSchema.index({ folderId: 1 });

module.exports = mongoose.model('Project', projectSchema);