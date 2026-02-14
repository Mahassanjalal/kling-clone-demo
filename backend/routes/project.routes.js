const express = require('express');
const { body, validationResult } = require('express-validator');
const Project = require('../models/Project');
const VideoJob = require('../models/VideoJob');
const Team = require('../models/Team');
const { authMiddleware, requireSubscription } = require('../middleware/auth');

const router = express.Router();

// Get all projects
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { folderId, teamId, status } = req.query;
    
    const query = {
      userId: req.user._id,
      isArchived: false,
    };

    if (folderId) query.folderId = folderId;
    if (status) query.status = status;

    // If team context, show team projects too
    if (teamId) {
      const team = await Team.findOne({
        _id: teamId,
        $or: [
          { ownerId: req.user._id },
          { 'members.userId': req.user._id }
        ]
      });

      if (team) {
        query.$or = [
          { userId: req.user._id },
          { teamId: team._id }
        ];
      }
    }

    const projects = await Project.find(query)
      .sort({ updatedAt: -1 })
      .populate('scenes.videoJobId', 'status progress thumbnailUrl')
      .limit(50);

    res.json({ projects });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single project
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      $or: [
        { userId: req.user._id },
        { teamId: { $exists: true } }
      ]
    }).populate('scenes.videoJobId');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json({ project });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create project
router.post('/', authMiddleware, [
  body('name').trim().notEmpty().withMessage('Project name is required'),
  body('type').optional().isIn(['single-video', 'multi-scene', 'ab-test', 'template-based']),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const projectData = {
      userId: req.user._id,
      name: req.body.name,
      description: req.body.description,
      type: req.body.type || 'single-video',
      folderId: req.body.folderId,
      templateId: req.body.templateId,
      brandKitId: req.body.brandKitId,
      teamId: req.body.teamId,
    };

    // If team project, verify membership
    if (req.body.teamId) {
      const team = await Team.findOne({
        _id: req.body.teamId,
        $or: [
          { ownerId: req.user._id },
          { 'members.userId': req.user._id }
        ]
      });

      if (!team) {
        return res.status(403).json({ message: 'Not a team member' });
      }

      projectData.teamId = team._id;
      projectData.collaborators = [{
        userId: req.user._id,
        role: 'owner',
        lastActive: new Date(),
      }];
    }

    // Initialize scenes if multi-scene
    if (req.body.type === 'multi-scene' && req.body.scenes) {
      projectData.scenes = req.body.scenes.map((scene, index) => ({
        order: index + 1,
        name: scene.name || `Scene ${index + 1}`,
        duration: scene.duration || 5,
        prompt: scene.prompt,
        voiceover: scene.voiceover,
        settings: scene.settings,
      }));
    }

    const project = new Project(projectData);
    await project.save();

    res.status(201).json({
      message: 'Project created successfully',
      project,
    });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update project
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      $or: [
        { userId: req.user._id },
        { 'collaborators.userId': req.user._id }
      ]
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Update allowed fields
    const allowedFields = ['name', 'description', 'status', 'scenes', 'variants', 'templateData', 'tags'];
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        project[field] = req.body[field];
      }
    });

    await project.save();

    res.json({
      message: 'Project updated successfully',
      project,
    });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Generate video for scene
router.post('/:id/scenes/:sceneId/generate', authMiddleware, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const scene = project.scenes.id(req.params.sceneId);
    if (!scene) {
      return res.status(404).json({ message: 'Scene not found' });
    }

    // Check credits
    const user = await User.findById(req.user._id);
    const creditCost = 20; // Simplified cost calculation

    if (user.credits < creditCost) {
      return res.status(400).json({
        message: 'Insufficient credits',
        required: creditCost,
        available: user.credits,
      });
    }

    // Create video job for this scene
    const videoJob = new VideoJob({
      userId: req.user._id,
      prompt: scene.prompt,
      settings: {
        duration: scene.duration,
        resolution: '720p',
        aspectRatio: '16:9',
        style: 'realistic',
      },
      creditsUsed: creditCost,
      status: 'pending',
      metadata: {
        type: 'text-to-video',
        projectId: project._id,
        sceneId: scene._id,
      }
    });

    await videoJob.save();

    // Update scene with video job reference
    scene.videoJobId = videoJob._id;
    scene.status = 'generating';
    await project.save();

    // Deduct credits
    user.credits -= creditCost;
    await user.save();

    // Add to queue
    const queueService = require('../services/queue.service');
    await queueService.addVideoGenerationJob({
      videoJobId: videoJob._id,
      userId: req.user._id,
      prompt: scene.prompt,
      settings: videoJob.settings,
    });

    res.json({
      message: 'Scene generation started',
      videoJobId: videoJob._id,
      remainingCredits: user.credits,
    });
  } catch (error) {
    console.error('Generate scene error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Compile multi-scene project
router.post('/:id/compile', authMiddleware, requireSubscription(['pro', 'business', 'enterprise']), async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('scenes.videoJobId');
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if all scenes are completed
    const allCompleted = project.scenes.every(
      scene => scene.videoJobId && scene.videoJobId.status === 'completed'
    );

    if (!allCompleted) {
      return res.status(400).json({
        message: 'All scenes must be completed before compiling',
        incompleteScenes: project.scenes
          .filter(s => !s.videoJobId || s.videoJobId.status !== 'completed')
          .map(s => s.name)
      });
    }

    // TODO: Implement video stitching service
    // This would combine all scene videos into one final video

    res.json({
      message: 'Project compilation started',
      projectId: project._id,
    });
  } catch (error) {
    console.error('Compile project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create A/B test variant
router.post('/:id/variants', authMiddleware, requireSubscription(['business', 'enterprise']), [
  body('name').trim().notEmpty(),
], async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    project.variants.push({
      name: req.body.name,
      scenes: req.body.scenes || project.scenes,
    });

    await project.save();

    res.json({
      message: 'Variant created successfully',
      project,
    });
  } catch (error) {
    console.error('Create variant error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete project
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;