const express = require('express');
const VideoJob = require('../models/VideoJob');
const Project = require('../models/Project');
const Subscription = require('../models/Subscription');
const { authMiddleware, requireSubscription } = require('../middleware/auth');

const router = express.Router();

// Get user analytics dashboard
router.get('/dashboard', authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    // Get video statistics
    const [totalStats, monthlyStats, recentVideos] = await Promise.all([
      // All-time stats
      VideoJob.aggregate([
        { $match: { userId: userId } },
        {
          $group: {
            _id: null,
            totalVideos: { $sum: 1 },
            completedVideos: {
              $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
            },
            totalCredits: { $sum: '$creditsUsed' },
          }
        }
      ]),
      
      // Monthly stats
      VideoJob.aggregate([
        { 
          $match: { 
            userId: userId,
            createdAt: { $gte: thirtyDaysAgo }
          }
        },
        {
          $group: {
            _id: null,
            videosThisMonth: { $sum: 1 },
            creditsThisMonth: { $sum: '$creditsUsed' },
          }
        }
      ]),
      
      // Recent videos
      VideoJob.find({ userId })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('prompt status progress thumbnailUrl createdAt creditsUsed'),
    ]);

    // Get usage by day (last 30 days)
    const usageByDay = await VideoJob.aggregate([
      {
        $match: {
          userId: userId,
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 },
          credits: { $sum: '$creditsUsed' },
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Get project stats
    const projectStats = await Project.aggregate([
      { $match: { userId: userId } },
      {
        $group: {
          _id: null,
          totalProjects: { $sum: 1 },
          avgScenes: { $avg: { $size: '$scenes' } },
        }
      }
    ]);

    // Get subscription info
    const subscription = await Subscription.findOne({ userId });

    res.json({
      overview: {
        totalVideos: totalStats[0]?.totalVideos || 0,
        completedVideos: totalStats[0]?.completedVideos || 0,
        totalCreditsUsed: totalStats[0]?.totalCredits || 0,
        videosThisMonth: monthlyStats[0]?.videosThisMonth || 0,
        creditsThisMonth: monthlyStats[0]?.creditsThisMonth || 0,
        totalProjects: projectStats[0]?.totalProjects || 0,
        avgScenesPerProject: Math.round(projectStats[0]?.avgScenes || 0),
      },
      usageByDay,
      recentVideos,
      credits: {
        remaining: req.user.credits,
        totalUsed: totalStats[0]?.totalCredits || 0,
      },
      subscription: subscription ? {
        plan: subscription.plan,
        status: subscription.status,
        videosThisMonth: subscription.usage.videosThisMonth,
        monthlyLimit: subscription.features.maxVideosPerMonth,
      } : null,
    });
  } catch (error) {
    console.error('Get dashboard analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get video performance analytics
router.get('/videos/:videoId', authMiddleware, async (req, res) => {
  try {
    const video = await VideoJob.findOne({
      _id: req.params.videoId,
      userId: req.user._id,
    });

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Mock analytics data (would integrate with analytics platform in production)
    const analytics = {
      views: Math.floor(Math.random() * 10000),
      uniqueViews: Math.floor(Math.random() * 8000),
      avgWatchTime: Math.floor(Math.random() * video.settings.duration * 0.7),
      completionRate: Math.random() * 0.8,
      engagement: {
        likes: Math.floor(Math.random() * 500),
        shares: Math.floor(Math.random() * 100),
        comments: Math.floor(Math.random() * 50),
      },
      trafficSources: [
        { source: 'Direct', percentage: 35 },
        { source: 'Social Media', percentage: 40 },
        { source: 'Organic Search', percentage: 15 },
        { source: 'Referral', percentage: 10 },
      ],
      demographics: {
        ageGroups: [
          { range: '18-24', percentage: 25 },
          { range: '25-34', percentage: 35 },
          { range: '35-44', percentage: 20 },
          { range: '45-54', percentage: 15 },
          { range: '55+', percentage: 5 },
        ],
        gender: [
          { type: 'Male', percentage: 48 },
          { type: 'Female', percentage: 50 },
          { type: 'Other', percentage: 2 },
        ],
      },
      geographic: [
        { country: 'United States', percentage: 45 },
        { country: 'United Kingdom', percentage: 15 },
        { country: 'Canada', percentage: 10 },
        { country: 'Germany', percentage: 8 },
        { country: 'Others', percentage: 22 },
      ],
    };

    res.json({
      video: {
        id: video._id,
        prompt: video.prompt,
        status: video.status,
        createdAt: video.createdAt,
        completedAt: video.completedAt,
        creditsUsed: video.creditsUsed,
      },
      analytics,
    });
  } catch (error) {
    console.error('Get video analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get A/B test results
router.get('/ab-test/:projectId', authMiddleware, requireSubscription(['business', 'enterprise']), async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.projectId,
      userId: req.user._id,
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (!project.variants || project.variants.length === 0) {
      return res.status(400).json({ message: 'No A/B test variants found' });
    }

    // Mock A/B test results
    const results = project.variants.map((variant, index) => ({
      name: variant.name,
      views: Math.floor(Math.random() * 5000) + 1000,
      clicks: Math.floor(Math.random() * 500),
      conversions: Math.floor(Math.random() * 50),
      ctr: (Math.random() * 0.15).toFixed(3),
      conversionRate: (Math.random() * 0.05).toFixed(3),
      confidence: index === 0 ? 'Winner' : (Math.random() > 0.7 ? 'Significant' : 'Inconclusive'),
    }));

    res.json({
      projectId: project._id,
      projectName: project.name,
      totalViews: results.reduce((sum, r) => sum + r.views, 0),
      totalConversions: results.reduce((sum, r) => sum + r.conversions, 0),
      variants: results,
      recommendation: results[0].ctr > results[1]?.ctr ? results[0].name : results[1]?.name,
    });
  } catch (error) {
    console.error('Get AB test analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Export analytics report
router.get('/export', authMiddleware, requireSubscription(['business', 'enterprise']), async (req, res) => {
  try {
    const { startDate, endDate, format = 'csv' } = req.query;
    
    const query = { userId: req.user._id };
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const videos = await VideoJob.find(query)
      .select('prompt status creditsUsed createdAt completedAt outputUrl')
      .sort({ createdAt: -1 });

    if (format === 'csv') {
      // Generate CSV
      const csv = [
        'Date,Prompt,Status,Credits,Video URL',
        ...videos.map(v => 
          `"${v.createdAt.toISOString()}","${v.prompt.replace(/"/g, '""')}",${v.status},${v.creditsUsed},"${v.outputUrl || ''}"`
        )
      ].join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=analytics.csv');
      res.send(csv);
    } else {
      res.json({ videos });
    }
  } catch (error) {
    console.error('Export analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;