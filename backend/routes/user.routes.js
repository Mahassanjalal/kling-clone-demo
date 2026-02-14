const express = require('express');
const User = require('../models/User');
const VideoJob = require('../models/VideoJob');
const Project = require('../models/Project');
const Subscription = require('../models/Subscription');
const Team = require('../models/Team');
const { authMiddleware, adminMiddleware, requireSubscription } = require('../middleware/auth');

const router = express.Router();

// Get user dashboard stats
router.get('/dashboard', authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;

    // Get video statistics
    const totalVideos = await VideoJob.countDocuments({ userId });
    const completedVideos = await VideoJob.countDocuments({ userId, status: 'completed' });
    const processingVideos = await VideoJob.countDocuments({ userId, status: 'processing' });
    const pendingVideos = await VideoJob.countDocuments({ userId, status: 'pending' });

    // Get recent videos
    const recentVideos = await VideoJob.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('prompt status progress thumbnailUrl createdAt');

    // Get project count
    const totalProjects = await Project.countDocuments({ userId });

    // Get total credits spent
    const creditsSpent = await VideoJob.aggregate([
      { $match: { userId: userId } },
      { $group: { _id: null, total: { $sum: '$creditsUsed' } } }
    ]);

    // Get subscription info
    const subscription = await Subscription.findOne({ userId });
    
    // Get team info
    const team = await Team.findOne({
      $or: [
        { ownerId: userId },
        { 'members.userId': userId }
      ]
    });

    res.json({
      stats: {
        totalVideos,
        completedVideos,
        processingVideos,
        pendingVideos,
        totalProjects,
        creditsRemaining: req.user.credits,
        creditsSpent: creditsSpent[0]?.total || 0
      },
      recentVideos,
      subscription: subscription ? {
        plan: subscription.plan,
        status: subscription.status,
        currentPeriodEnd: subscription.currentPeriodEnd,
        cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
        features: subscription.features,
        usage: subscription.usage,
      } : {
        plan: 'free',
        status: 'active',
        features: Subscription.PLANS.free.features,
      },
      team: team ? {
        id: team._id,
        name: team.name,
        role: team.ownerId.toString() === userId.toString() ? 'owner' : 
              team.members.find(m => m.userId.toString() === userId.toString())?.role,
      } : null,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        avatar: req.user.avatar,
        isEmailVerified: req.user.isEmailVerified,
        preferences: req.user.preferences,
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user credits
router.get('/credits', authMiddleware, async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ userId: req.user._id });
    
    res.json({
      credits: req.user.credits,
      subscription: subscription ? {
        plan: subscription.plan,
        videosThisMonth: subscription.usage.videosThisMonth,
        monthlyLimit: subscription.features.maxVideosPerMonth,
        storageUsed: subscription.usage.storageUsed,
        storageLimit: subscription.features.maxStorage,
      } : null
    });
  } catch (error) {
    console.error('Get credits error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get API key (Pro+ plans only)
router.get('/api-key', authMiddleware, requireSubscription(['pro', 'business', 'enterprise']), async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user.apiKey?.key) {
      return res.status(404).json({ message: 'No API key found. Generate one first.' });
    }

    res.json({
      apiKey: user.apiKey.key,
      createdAt: user.apiKey.createdAt,
      lastUsedAt: user.apiKey.lastUsedAt,
    });
  } catch (error) {
    console.error('Get API key error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Generate API key
router.post('/api-key', authMiddleware, requireSubscription(['pro', 'business', 'enterprise']), async (req, res) => {
  try {
    const crypto = require('crypto');
    const apiKey = `kling_${crypto.randomBytes(32).toString('hex')}`;
    
    await User.findByIdAndUpdate(req.user._id, {
      apiKey: {
        key: apiKey,
        createdAt: new Date(),
        lastUsedAt: null,
        rateLimit: {
          requests: 0,
          resetAt: new Date(),
        }
      }
    });

    res.json({
      message: 'API key generated successfully',
      apiKey: apiKey,
    });
  } catch (error) {
    console.error('Generate API key error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Revoke API key
router.delete('/api-key', authMiddleware, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, {
      $unset: { apiKey: 1 }
    });

    res.json({ message: 'API key revoked successfully' });
  } catch (error) {
    console.error('Revoke API key error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user preferences
router.put('/preferences', authMiddleware, async (req, res) => {
  try {
    const allowedPreferences = ['language', 'emailNotifications', 'marketingEmails', 'timezone'];
    const updates = {};
    
    allowedPreferences.forEach(pref => {
      if (req.body[pref] !== undefined) {
        updates[`preferences.${pref}`] = req.body[pref];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true }
    );

    res.json({
      message: 'Preferences updated',
      preferences: user.preferences,
    });
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Get all users
router.get('/admin/users', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select('-password -emailVerificationToken -passwordResetToken')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments();

    res.json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Update user credits
router.put('/admin/users/:id/credits', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { credits } = req.body;
    
    if (typeof credits !== 'number' || credits < 0) {
      return res.status(400).json({ message: 'Invalid credits amount' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { credits },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'Credits updated successfully',
      user
    });
  } catch (error) {
    console.error('Update credits error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;