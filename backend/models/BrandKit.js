const mongoose = require('mongoose');

const brandKitSchema = new mongoose.Schema({
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
  name: {
    type: String,
    required: true,
    trim: true,
  },
  logo: {
    primary: String,
    secondary: String,
    white: String,
    dark: String,
  },
  colors: {
    primary: {
      hex: String,
      rgb: { r: Number, g: Number, b: Number },
    },
    secondary: {
      hex: String,
      rgb: { r: Number, g: Number, b: Number },
    },
    accent: {
      hex: String,
      rgb: { r: Number, g: Number, b: Number },
    },
    background: {
      light: String,
      dark: String,
    },
  },
  fonts: {
    heading: {
      family: String,
      url: String,
      weights: [String],
    },
    body: {
      family: String,
      url: String,
      weights: [String],
    },
  },
  voice: {
    gender: {
      type: String,
      enum: ['male', 'female', 'neutral'],
    },
    tone: {
      type: String,
      enum: ['professional', 'casual', 'energetic', 'calm', 'authoritative'],
    },
    accent: String,
    sample: String,
  },
  music: {
    genres: [String],
    tempo: {
      type: String,
      enum: ['slow', 'medium', 'fast'],
    },
    mood: [String],
  },
  assets: [{
    name: String,
    type: {
      type: String,
      enum: ['image', 'video', 'audio', 'icon', 'pattern'],
    },
    url: String,
    tags: [String],
  }],
  isDefault: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
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

brandKitSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('BrandKit', brandKitSchema);