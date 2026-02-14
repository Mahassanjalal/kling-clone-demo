const mongoose = require('mongoose');

const videoJobSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    default: null
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    default: null
  },
  prompt: {
    type: String,
    required: true
  },
  referenceImage: {
    type: String,
    default: null
  },
  settings: {
    duration: {
      type: Number,
      default: 5,
      min: 1,
      max: 300
    },
    resolution: {
      type: String,
      enum: ['480p', '720p', '1080p', '4k'],
      default: '720p'
    },
    aspectRatio: {
      type: String,
      enum: ['16:9', '9:16', '1:1', '4:3'],
      default: '16:9'
    },
    style: {
      type: String,
      enum: ['realistic', 'animated', 'cinematic', 'artistic'],
      default: 'realistic'
    },
    cameraMovement: {
      type: String,
      enum: ['static', 'zoom-in', 'zoom-out', 'pan-left', 'pan-right', 'tilt-up', 'tilt-down'],
      default: 'static'
    },
    fps: {
      type: Number,
      default: 6,
      min: 1,
      max: 60
    }
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'canceled'],
    default: 'pending'
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  outputUrl: {
    type: String,
    default: null
  },
  thumbnailUrl: {
    type: String,
    default: null
  },
  errorMessage: {
    type: String,
    default: null
  },
  creditsUsed: {
    type: Number,
    default: 10
  },
  metadata: {
    type: {
      type: String,
      enum: ['text-to-video', 'image-to-video'],
      default: 'text-to-video'
    },
    predictionId: String,
    queueJobId: String,
    modelVersion: String,
    logs: [String],
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      default: null
    },
    sceneId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null
    },
    regeneratedFrom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'VideoJob',
      default: null
    }
  },
  publishedTo: [{
    platform: String,
    url: String,
    publishedAt: Date,
    status: String
  }],
  analytics: {
    views: { type: Number, default: 0 },
    uniqueViews: { type: Number, default: 0 },
    avgWatchTime: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    comments: { type: Number, default: 0 }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date,
    default: null
  }
});

// Index for querying user's videos
videoJobSchema.index({ userId: 1, createdAt: -1 });
videoJobSchema.index({ userId: 1, teamId: 1, createdAt: -1 });
videoJobSchema.index({ status: 1 });
videoJobSchema.index({ 'metadata.predictionId': 1 });

module.exports = mongoose.model('VideoJob', videoJobSchema);