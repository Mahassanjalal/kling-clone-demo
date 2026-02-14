const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    // Try to get token from cookie first, then Authorization header
    let token = req.cookies?.token;
    
    if (!token && req.headers.authorization) {
      token = req.headers.authorization.replace('Bearer ', '');
    }
    
    if (!token) {
      return res.status(401).json({ message: 'No authentication token, access denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ message: 'Token is valid but user not found' });
    }

    // Check if account is suspended
    if (user.status === 'suspended') {
      return res.status(403).json({ message: 'Account has been suspended' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const adminMiddleware = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Check subscription tier middleware
const requireSubscription = (plans) => {
  return async (req, res, next) => {
    try {
      const Subscription = require('../models/Subscription');
      const subscription = await Subscription.findOne({ userId: req.user._id });
      
      if (!subscription) {
        return res.status(403).json({ message: 'Subscription required' });
      }
      
      if (!plans.includes(subscription.plan)) {
        return res.status(403).json({ 
          message: 'This feature requires a higher subscription tier',
          required: plans,
          current: subscription.plan
        });
      }
      
      req.subscription = subscription;
      next();
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };
};

// API Key authentication for developer access
const apiKeyMiddleware = async (req, res, next) => {
  try {
    const apiKey = req.headers['x-api-key'];
    
    if (!apiKey) {
      return res.status(401).json({ message: 'API key required' });
    }
    
    const user = await User.findOne({ 'apiKey.key': apiKey });
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid API key' });
    }
    
    // Check rate limit
    const now = new Date();
    const oneHourAgo = new Date(now - 60 * 60 * 1000);
    
    if (!user.apiKey.rateLimit.resetAt || user.apiKey.rateLimit.resetAt < oneHourAgo) {
      user.apiKey.rateLimit.requests = 0;
      user.apiKey.rateLimit.resetAt = now;
    }
    
    // Free: 100 requests/hour, Pro: 1000, Business: 10000
    const limits = { free: 100, pro: 1000, business: 10000, enterprise: 100000 };
    const limit = limits[user.subscription?.plan] || 100;
    
    if (user.apiKey.rateLimit.requests >= limit) {
      return res.status(429).json({ message: 'Rate limit exceeded' });
    }
    
    user.apiKey.rateLimit.requests += 1;
    user.apiKey.lastUsedAt = now;
    await user.save();
    
    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { authMiddleware, adminMiddleware, requireSubscription, apiKeyMiddleware };