const express = require('express');
const { body, query, validationResult } = require('express-validator');
const AdTemplate = require('../models/AdTemplate');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Get all templates with filtering
router.get('/', [
  query('category').optional().isString(),
  query('platform').optional().isString(),
  query('format').optional().isString(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { category, platform, format, search } = req.query;
    
    const filter = { isActive: true };
    
    if (category) filter.category = category;
    if (platform) filter.platform = platform;
    if (format) filter.format = format;
    
    let query_builder = AdTemplate.find(filter);
    
    if (search) {
      query_builder = query_builder.or([
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ]);
    }

    const templates = await query_builder
      .sort({ popularity: -1, createdAt: -1 })
      .limit(50);

    res.json({ templates });
  } catch (error) {
    console.error('Get templates error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single template
router.get('/:id', async (req, res) => {
  try {
    const template = await AdTemplate.findById(req.params.id);
    
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    res.json({ template });
  } catch (error) {
    console.error('Get template error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get categories and platforms
router.get('/filters/options', async (req, res) => {
  try {
    const categories = await AdTemplate.distinct('category', { isActive: true });
    const platforms = await AdTemplate.distinct('platform', { isActive: true });
    const formats = await AdTemplate.distinct('format', { isActive: true });

    res.json({
      categories,
      platforms,
      formats,
    });
  } catch (error) {
    console.error('Get filter options error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Generate script for template
router.post('/:id/generate-script', authMiddleware, [
  body('product').trim().notEmpty(),
  body('audience').optional().trim(),
  body('tone').optional().isIn(['professional', 'casual', 'energetic', 'calm']),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const template = await AdTemplate.findById(req.params.id);
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    const { product, audience, tone = 'professional' } = req.body;

    const aiService = require('../services/ai.service');
    const script = await aiService.generateScript({
      product,
      audience: audience || 'general consumers',
      style: tone,
      duration: template.duration?.recommended || 15,
    });

    res.json({ script });
  } catch (error) {
    console.error('Generate script error:', error);
    res.status(500).json({ message: 'Failed to generate script' });
  }
});

// Create custom template (for teams/enterprise)
router.post('/', authMiddleware, [
  body('name').trim().notEmpty(),
  body('category').isIn(['ecommerce', 'social-media', 'product-demo', 'testimonial', 'promotional', 'storytelling']),
  body('platform').isIn(['tiktok', 'instagram', 'facebook', 'youtube', 'linkedin', 'universal']),
  body('format').isIn(['feed', 'story', 'reel', 'short', 'square']),
  body('aspectRatio').isIn(['16:9', '9:16', '1:1', '4:3']),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const templateData = {
      ...req.body,
      createdBy: req.user._id,
    };

    const template = new AdTemplate(templateData);
    await template.save();

    res.status(201).json({
      message: 'Template created successfully',
      template,
    });
  } catch (error) {
    console.error('Create template error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Seed initial templates (admin only)
router.post('/seed', async (req, res) => {
  try {
    const defaultTemplates = [
      {
        name: 'Product Showcase',
        description: 'Clean product presentation with smooth transitions',
        category: 'ecommerce',
        platform: 'universal',
        format: 'feed',
        aspectRatio: '1:1',
        duration: { min: 10, max: 30, recommended: 15 },
        structure: {
          scenes: [
            { order: 1, duration: 3, template: 'product-hero', elements: [] },
            { order: 2, duration: 5, template: 'features-grid', elements: [] },
            { order: 3, duration: 4, template: 'cta-final', elements: [] },
          ]
        },
        placeholders: [
          { type: 'product-image', label: 'Product Photo', required: true },
          { type: 'headline', label: 'Headline Text', required: true },
          { type: 'price', label: 'Price', required: false },
          { type: 'cta-text', label: 'Call to Action', required: true },
        ],
        tags: ['product', 'ecommerce', 'clean'],
      },
      {
        name: 'TikTok Style Ad',
        description: 'Fast-paced, energetic format perfect for TikTok',
        category: 'social-media',
        platform: 'tiktok',
        format: 'reel',
        aspectRatio: '9:16',
        duration: { min: 5, max: 60, recommended: 15 },
        structure: {
          scenes: [
            { order: 1, duration: 2, template: 'hook-fast', elements: [] },
            { order: 2, duration: 8, template: 'product-demo', elements: [] },
            { order: 3, duration: 5, template: 'social-proof', elements: [] },
          ]
        },
        placeholders: [
          { type: 'product-image', label: 'Product', required: true },
          { type: 'headline', label: 'Hook Text', required: true },
          { type: 'subheadline', label: 'Description', required: false },
        ],
        tags: ['tiktok', 'social', 'trendy'],
      },
      {
        name: 'Instagram Story',
        description: 'Vertical format optimized for Instagram Stories',
        category: 'social-media',
        platform: 'instagram',
        format: 'story',
        aspectRatio: '9:16',
        duration: { min: 5, max: 15, recommended: 10 },
        structure: {
          scenes: [
            { order: 1, duration: 3, template: 'swipe-up-hook', elements: [] },
            { order: 2, duration: 4, template: 'product-showcase', elements: [] },
            { order: 3, duration: 3, template: 'story-cta', elements: [] },
          ]
        },
        placeholders: [
          { type: 'product-image', label: 'Product', required: true },
          { type: 'headline', label: 'Main Text', required: true },
        ],
        tags: ['instagram', 'stories', 'vertical'],
      },
      {
        name: 'YouTube Pre-Roll',
        description: 'Skippable ad format optimized for YouTube',
        category: 'social-media',
        platform: 'youtube',
        format: 'short',
        aspectRatio: '16:9',
        duration: { min: 5, max: 30, recommended: 15 },
        structure: {
          scenes: [
            { order: 1, duration: 3, template: 'attention-grabber', elements: [] },
            { order: 2, duration: 8, template: 'value-proposition', elements: [] },
            { order: 3, duration: 4, template: 'urgent-cta', elements: [] },
          ]
        },
        placeholders: [
          { type: 'product-image', label: 'Product', required: true },
          { type: 'headline', label: 'Attention Grabber', required: true },
          { type: 'subheadline', label: 'Value Prop', required: true },
        ],
        tags: ['youtube', 'preroll', 'landscape'],
      },
      {
        name: 'Customer Testimonial',
        description: 'Build trust with authentic customer stories',
        category: 'testimonial',
        platform: 'universal',
        format: 'feed',
        aspectRatio: '16:9',
        duration: { min: 15, max: 60, recommended: 30 },
        structure: {
          scenes: [
            { order: 1, duration: 5, template: 'customer-intro', elements: [] },
            { order: 2, duration: 15, template: 'testimonial-quote', elements: [] },
            { order: 3, duration: 5, template: 'results-showcase', elements: [] },
            { order: 4, duration: 5, template: 'trust-cta', elements: [] },
          ]
        },
        placeholders: [
          { type: 'product-image', label: 'Product', required: true },
          { type: 'headline', label: 'Customer Name', required: true },
          { type: 'subheadline', label: 'Testimonial Quote', required: true },
        ],
        tags: ['testimonial', 'trust', 'social-proof'],
      },
    ];

    await AdTemplate.deleteMany({}); // Clear existing
    await AdTemplate.insertMany(defaultTemplates);

    res.json({ message: 'Templates seeded successfully' });
  } catch (error) {
    console.error('Seed templates error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;