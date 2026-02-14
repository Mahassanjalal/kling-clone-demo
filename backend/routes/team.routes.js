const express = require('express');
const { body, validationResult } = require('express-validator');
const Team = require('../models/Team');
const User = require('../models/User');
const Subscription = require('../models/Subscription');
const { authMiddleware, requireSubscription } = require('../middleware/auth');
const emailService = require('../services/email.service');
const crypto = require('crypto');

const router = express.Router();

// Create team
router.post('/create', authMiddleware, [
  body('name').trim().notEmpty().withMessage('Team name is required'),
  body('description').optional().trim(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description } = req.body;
    const userId = req.user._id;

    // Check if user already owns a team
    const existingTeam = await Team.findOne({ ownerId: userId });
    if (existingTeam) {
      return res.status(400).json({ message: 'You already own a team' });
    }

    // Get user subscription for team limits
    const subscription = await Subscription.findOne({ userId });
    const maxSeats = subscription?.features?.teamSeats || 1;

    const team = new Team({
      name,
      description,
      ownerId: userId,
      members: [{
        userId,
        role: 'owner',
        permissions: {
          canCreate: true,
          canEdit: true,
          canDelete: true,
          canManageTeam: true,
          canManageBilling: true,
        }
      }],
      subscription: {
        seats: maxSeats,
      }
    });

    await team.save();

    // Update user's team reference
    await User.findByIdAndUpdate(userId, { teamId: team._id });

    res.status(201).json({
      message: 'Team created successfully',
      team: {
        id: team._id,
        name: team.name,
        slug: team.slug,
        members: team.members.length,
        maxSeats,
      }
    });
  } catch (error) {
    console.error('Create team error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get my team
router.get('/my-team', authMiddleware, async (req, res) => {
  try {
    const team = await Team.findOne({
      $or: [
        { ownerId: req.user._id },
        { 'members.userId': req.user._id }
      ]
    }).populate('members.userId', 'name email avatar');

    if (!team) {
      return res.json({ team: null });
    }

    // Get member's role in team
    const member = team.members.find(m => m.userId._id.toString() === req.user._id.toString());

    res.json({
      team: {
        id: team._id,
        name: team.name,
        slug: team.slug,
        description: team.description,
        logo: team.logo,
        ownerId: team.ownerId,
        members: team.members.map(m => ({
          id: m.userId._id,
          name: m.userId.name,
          email: m.userId.email,
          avatar: m.userId.avatar,
          role: m.role,
          joinedAt: m.joinedAt,
        })),
        subscription: team.subscription,
        credits: team.credits,
        settings: team.settings,
        myRole: member?.role,
        myPermissions: member?.permissions,
      }
    });
  } catch (error) {
    console.error('Get team error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Invite member to team
router.post('/invite', authMiddleware, [
  body('email').isEmail().normalizeEmail(),
  body('role').isIn(['admin', 'editor', 'viewer']),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, role } = req.body;
    const userId = req.user._id;

    const team = await Team.findOne({ ownerId: userId });
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Check if team has available seats
    if (team.members.length >= team.subscription.seats) {
      return res.status(403).json({ 
        message: 'Team has reached maximum member limit',
        upgradeRequired: true 
      });
    }

    // Check if user is already in team
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const isMember = team.members.some(m => m.userId.toString() === existingUser._id.toString());
      if (isMember) {
        return res.status(400).json({ message: 'User is already a team member' });
      }
    }

    // Generate invite token
    const inviteToken = crypto.randomBytes(32).toString('hex');
    const inviteUrl = `${process.env.FRONTEND_URL}/team/invite?token=${inviteToken}&team=${team._id}`;

    // Store invite (in production, use a separate collection)
    // For now, we'll just send the email

    await emailService.sendTeamInvitationEmail(
      email,
      req.user.name,
      team.name,
      inviteUrl
    );

    res.json({ message: 'Invitation sent successfully' });
  } catch (error) {
    console.error('Invite member error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Accept team invitation
router.post('/accept-invite', authMiddleware, [
  body('token').notEmpty(),
  body('teamId').notEmpty(),
], async (req, res) => {
  try {
    const { token, teamId } = req.body;

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Check if user is already a member
    const isMember = team.members.some(m => m.userId.toString() === req.user._id.toString());
    if (isMember) {
      return res.status(400).json({ message: 'Already a team member' });
    }

    // Add member to team
    team.members.push({
      userId: req.user._id,
      role: 'editor',
      permissions: {
        canCreate: true,
        canEdit: true,
        canDelete: false,
        canManageTeam: false,
        canManageBilling: false,
      }
    });

    await team.save();

    // Update user's team reference
    await User.findByIdAndUpdate(req.user._id, { teamId: team._id });

    res.json({ message: 'Successfully joined team' });
  } catch (error) {
    console.error('Accept invite error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove member from team
router.delete('/members/:memberId', authMiddleware, async (req, res) => {
  try {
    const team = await Team.findOne({ ownerId: req.user._id });
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    const memberIndex = team.members.findIndex(
      m => m.userId.toString() === req.params.memberId
    );

    if (memberIndex === -1) {
      return res.status(404).json({ message: 'Member not found' });
    }

    // Cannot remove owner
    if (team.members[memberIndex].role === 'owner') {
      return res.status(403).json({ message: 'Cannot remove team owner' });
    }

    team.members.splice(memberIndex, 1);
    await team.save();

    // Remove team reference from user
    await User.findByIdAndUpdate(req.params.memberId, { teamId: null });

    res.json({ message: 'Member removed successfully' });
  } catch (error) {
    console.error('Remove member error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update member role
router.put('/members/:memberId/role', authMiddleware, [
  body('role').isIn(['admin', 'editor', 'viewer']),
], async (req, res) => {
  try {
    const { role } = req.body;
    const team = await Team.findOne({ ownerId: req.user._id });
    
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    const member = team.members.find(
      m => m.userId.toString() === req.params.memberId
    );

    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    member.role = role;
    
    // Update permissions based on role
    const permissions = {
      admin: { canCreate: true, canEdit: true, canDelete: true, canManageTeam: true, canManageBilling: false },
      editor: { canCreate: true, canEdit: true, canDelete: false, canManageTeam: false, canManageBilling: false },
      viewer: { canCreate: false, canEdit: false, canDelete: false, canManageTeam: false, canManageBilling: false },
    };
    
    member.permissions = permissions[role];
    await team.save();

    res.json({ message: 'Role updated successfully' });
  } catch (error) {
    console.error('Update role error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Leave team
router.post('/leave', authMiddleware, async (req, res) => {
  try {
    const team = await Team.findOne({
      'members.userId': req.user._id,
      ownerId: { $ne: req.user._id }
    });

    if (!team) {
      return res.status(400).json({ message: 'You cannot leave a team you own' });
    }

    team.members = team.members.filter(
      m => m.userId.toString() !== req.user._id.toString()
    );
    await team.save();

    await User.findByIdAndUpdate(req.user._id, { teamId: null });

    res.json({ message: 'Successfully left team' });
  } catch (error) {
    console.error('Leave team error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Generate API key for team
router.post('/api-key', authMiddleware, requireSubscription(['pro', 'business', 'enterprise']), async (req, res) => {
  try {
    const { name } = req.body;
    const team = await Team.findOne({
      $or: [
        { ownerId: req.user._id },
        { 'members.userId': req.user._id, 'members.permissions.canManageTeam': true }
      ]
    });

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    const apiKey = crypto.randomBytes(32).toString('hex');
    
    team.apiKeys.push({
      name: name || 'API Key',
      key: apiKey,
      permissions: ['read', 'write'],
      createdAt: new Date(),
    });

    await team.save();

    res.json({
      message: 'API key generated',
      apiKey: apiKey,
    });
  } catch (error) {
    console.error('Generate API key error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;