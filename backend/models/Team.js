const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
  },
  description: String,
  logo: String,
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  members: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    role: {
      type: String,
      enum: ['owner', 'admin', 'editor', 'viewer'],
      default: 'editor',
    },
    permissions: {
      canCreate: { type: Boolean, default: true },
      canEdit: { type: Boolean, default: true },
      canDelete: { type: Boolean, default: false },
      canManageTeam: { type: Boolean, default: false },
      canManageBilling: { type: Boolean, default: false },
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  }],
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'pro', 'business', 'enterprise'],
      default: 'free',
    },
    status: {
      type: String,
      enum: ['active', 'canceled', 'past_due', 'trialing'],
      default: 'active',
    },
    currentPeriodEnd: Date,
    seats: {
      type: Number,
      default: 1,
    },
  },
  credits: {
    balance: {
      type: Number,
      default: 0,
    },
    monthly: {
      type: Number,
      default: 0,
    },
    lastReset: {
      type: Date,
      default: Date.now,
    },
  },
  settings: {
    defaultBrandKit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BrandKit',
    },
    defaultTemplates: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AdTemplate',
    }],
    exportSettings: {
      watermark: {
        type: Boolean,
        default: true,
      },
      quality: {
        type: String,
        enum: ['low', 'medium', 'high', 'ultra'],
        default: 'high',
      },
    },
  },
  apiKeys: [{
    name: String,
    key: String,
    permissions: [String],
    lastUsed: Date,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
  projects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'VideoJob',
  }],
  folders: [{
    name: String,
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
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

teamSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Generate slug from name
teamSchema.pre('save', async function(next) {
  if (this.isNew || this.isModified('name')) {
    const slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    // Check for existing slug and append number if needed
    let uniqueSlug = slug;
    let counter = 1;
    
    while (await this.constructor.findOne({ slug: uniqueSlug })) {
      uniqueSlug = `${slug}-${counter}`;
      counter++;
    }
    
    this.slug = uniqueSlug;
  }
  next();
});

module.exports = mongoose.model('Team', teamSchema);