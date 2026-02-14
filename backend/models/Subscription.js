const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
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
  plan: {
    type: String,
    enum: ['free', 'pro', 'business', 'enterprise'],
    default: 'free',
  },
  // Stripe data
  stripe: {
    customerId: String,
    subscriptionId: String,
    priceId: String,
    paymentMethodId: String,
  },
  status: {
    type: String,
    enum: ['incomplete', 'incomplete_expired', 'trialing', 'active', 'past_due', 'canceled', 'unpaid', 'paused'],
    default: 'incomplete',
  },
  // Billing cycle
  currentPeriodStart: Date,
  currentPeriodEnd: Date,
  cancelAtPeriodEnd: {
    type: Boolean,
    default: false,
  },
  canceledAt: Date,
  // Plan features
  features: {
    maxVideosPerMonth: Number,
    maxVideoLength: Number, // in seconds
    maxResolution: String,
    maxStorage: Number, // in GB
    teamSeats: Number,
    apiAccess: Boolean,
    whiteLabel: Boolean,
    prioritySupport: Boolean,
    advancedAnalytics: Boolean,
  },
  // Usage tracking
  usage: {
    videosThisMonth: { type: Number, default: 0 },
    storageUsed: { type: Number, default: 0 }, // in GB
    apiCalls: { type: Number, default: 0 },
    lastReset: { type: Date, default: Date.now },
  },
  // Credit package purchases
  creditPurchases: [{
    amount: Number,
    cost: Number,
    currency: { type: String, default: 'USD' },
    stripePaymentIntentId: String,
    purchasedAt: { type: Date, default: Date.now },
  }],
  // Invoices
  invoices: [{
    stripeInvoiceId: String,
    amount: Number,
    currency: String,
    status: String,
    invoiceUrl: String,
    createdAt: Date,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

subscriptionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Plan configurations
subscriptionSchema.statics.PLANS = {
  free: {
    name: 'Free',
    price: 0,
    features: {
      maxVideosPerMonth: 5,
      maxVideoLength: 15,
      maxResolution: '720p',
      maxStorage: 1,
      teamSeats: 1,
      apiAccess: false,
      whiteLabel: false,
      prioritySupport: false,
      advancedAnalytics: false,
    },
  },
  pro: {
    name: 'Pro',
    price: 29,
    features: {
      maxVideosPerMonth: 50,
      maxVideoLength: 60,
      maxResolution: '1080p',
      maxStorage: 10,
      teamSeats: 3,
      apiAccess: true,
      whiteLabel: false,
      prioritySupport: true,
      advancedAnalytics: false,
    },
  },
  business: {
    name: 'Business',
    price: 99,
    features: {
      maxVideosPerMonth: 200,
      maxVideoLength: 120,
      maxResolution: '4k',
      maxStorage: 50,
      teamSeats: 10,
      apiAccess: true,
      whiteLabel: true,
      prioritySupport: true,
      advancedAnalytics: true,
    },
  },
  enterprise: {
    name: 'Enterprise',
    price: null, // Custom pricing
    features: {
      maxVideosPerMonth: -1, // Unlimited
      maxVideoLength: 300,
      maxResolution: '4k',
      maxStorage: -1, // Unlimited
      teamSeats: -1, // Unlimited
      apiAccess: true,
      whiteLabel: true,
      prioritySupport: true,
      advancedAnalytics: true,
    },
  },
};

// Credit package configurations
subscriptionSchema.statics.CREDIT_PACKAGES = [
  { amount: 100, price: 10 },
  { amount: 500, price: 45 },
  { amount: 1000, price: 80 },
  { amount: 5000, price: 350 },
];

module.exports = mongoose.model('Subscription', subscriptionSchema);