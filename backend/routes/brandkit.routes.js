const express = require('express');
const { body, validationResult } = require('express-validator');
const BrandKit = require('../models/BrandKit');
const Team = require('../models/Team');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Get all brand kits for user/team
router.get('/', authMiddleware, async (req, res) => {
  try {
    const team = await Team.findOne({
      $or: [
        { ownerId: req.user._id },
        { 'members.userId': req.user._id }
      ]
    });

    const query = {
      $or: [{ userId: req.user._id }],
      isActive: true,
    };

    if (team) {
      query.$or.push({ teamId: team._id });
    }

    const brandKits = await BrandKit.find(query).sort({ isDefault: -1, createdAt: -1 });

    res.json({ brandKits });
  } catch (error) {
    console.error('Get brand kits error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single brand kit
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const brandKit = await BrandKit.findOne({
      _id: req.params.id,
      $or: [
        { userId: req.user._id },
        { teamId: { $exists: true } }
      ]
    });

    if (!brandKit) {
      return res.status(404).json({ message: 'Brand kit not found' });
    }

    res.json({ brandKit });
  } catch (error) {
    console.error('Get brand kit error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create brand kit
router.post('/', authMiddleware, [
  body('name').trim().notEmpty().withMessage('Brand kit name is required'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const brandKitData = {
      userId: req.user._id,
      name: req.body.name,
      colors: req.body.colors || {},
      fonts: req.body.fonts || {},
      voice: req.body.voice || {},
      music: req.body.music || {},
    };

    // Check if team context
    if (req.body.teamId) {
      const team = await Team.findOne({
        _id: req.body.teamId,
        $or: [
          { ownerId: req.user._id },
          { 'members.userId': req.user._id, 'members.permissions.canManageTeam': true }
        ]
      });

      if (team) {
        brandKitData.teamId = team._id;
      }
    }

    const brandKit = new BrandKit(brandKitData);
    await brandKit.save();

    res.status(201).json({
      message: 'Brand kit created successfully',
      brandKit,
    });
  } catch (error) {
    console.error('Create brand kit error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update brand kit
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const brandKit = await BrandKit.findOne({
      _id: req.params.id,
      $or: [
        { userId: req.user._id },
        { teamId: { $exists: true } }
      ]
    });

    if (!brandKit) {
      return res.status(404).json({ message: 'Brand kit not found' });
    }

    // Update fields
    const allowedFields = ['name', 'logo', 'colors', 'fonts', 'voice', 'music', 'assets'];
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        brandKit[field] = req.body[field];
      }
    });

    await brandKit.save();

    res.json({
      message: 'Brand kit updated successfully',
      brandKit,
    });
  } catch (error) {
    console.error('Update brand kit error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Set as default brand kit
router.post('/:id/set-default', authMiddleware, async (req, res) => {
  try {
    const brandKit = await BrandKit.findOne({
      _id: req.params.id,
      $or: [
        { userId: req.user._id },
        { teamId: { $exists: true } }
      ]
    });

    if (!brandKit) {
      return res.status(404).json({ message: 'Brand kit not found' });
    }

    // Unset other defaults for this user/team
    await BrandKit.updateMany(
      {
        $or: [
          { userId: req.user._id },
          { teamId: brandKit.teamId }
        ],
        _id: { $ne: brandKit._id }
      },
      { isDefault: false }
    );

    brandKit.isDefault = true;
    await brandKit.save();

    res.json({ message: 'Default brand kit updated' });
  } catch (error) {
    console.error('Set default brand kit error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete brand kit
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const brandKit = await BrandKit.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!brandKit) {
      return res.status(404).json({ message: 'Brand kit not found' });
    }

    res.json({ message: 'Brand kit deleted successfully' });
  } catch (error) {
    console.error('Delete brand kit error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Upload logo
router.post('/:id/logo', authMiddleware, async (req, res) => {
  try {
    const brandKit = await BrandKit.findOne({
      _id: req.params.id,
      $or: [
        { userId: req.user._id },
        { teamId: { $exists: true } }
      ]
    });

    if (!brandKit) {
      return res.status(404).json({ message: 'Brand kit not found' });
    }

    // Handle logo upload (would use multer in production)
    // For now, assuming URL is provided
    const { logoType, url } = req.body;
    
    if (!brandKit.logo) brandKit.logo = {};
    brandKit.logo[logoType] = url;
    
    await brandKit.save();

    res.json({ message: 'Logo uploaded successfully', brandKit });
  } catch (error) {
    console.error('Upload logo error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add brand asset
router.post('/:id/assets', authMiddleware, [
  body('name').trim().notEmpty(),
  body('type').isIn(['image', 'video', 'audio', 'icon', 'pattern']),
  body('url').notEmpty(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const brandKit = await BrandKit.findOne({
      _id: req.params.id,
      $or: [
        { userId: req.user._id },
        { teamId: { $exists: true } }
      ]
    });

    if (!brandKit) {
      return res.status(404).json({ message: 'Brand kit not found' });
    }

    brandKit.assets.push({
      name: req.body.name,
      type: req.body.type,
      url: req.body.url,
      tags: req.body.tags || [],
    });

    await brandKit.save();

    res.json({ message: 'Asset added successfully', brandKit });
  } catch (error) {
    console.error('Add asset error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;