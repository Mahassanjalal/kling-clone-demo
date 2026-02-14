const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { body, validationResult } = require('express-validator');
const { authMiddleware, requireSubscription } = require('../middleware/auth');
const Subscription = require('../models/Subscription');
const User = require('../models/User');

const router = express.Router();

// Price IDs mapping (should be stored in environment variables)
const PRICE_IDS = {
  pro: {
    monthly: process.env.STRIPE_PRO_MONTHLY_PRICE_ID,
    yearly: process.env.STRIPE_PRO_YEARLY_PRICE_ID,
  },
  business: {
    monthly: process.env.STRIPE_BUSINESS_MONTHLY_PRICE_ID,
    yearly: process.env.STRIPE_BUSINESS_YEARLY_PRICE_ID,
  },
};

// Get available plans
router.get('/plans', (req, res) => {
  res.json({
    plans: Subscription.PLANS,
    creditPackages: Subscription.CREDIT_PACKAGES,
  });
});

// Get current subscription
router.get('/subscription', authMiddleware, async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ userId: req.user._id });
    
    if (!subscription) {
      return res.json({
        plan: 'free',
        status: 'active',
        features: Subscription.PLANS.free.features,
      });
    }
    
    res.json(subscription);
  } catch (error) {
    console.error('Get subscription error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create checkout session for subscription
router.post('/create-checkout-session', authMiddleware, [
  body('plan').isIn(['pro', 'business', 'enterprise']),
  body('billingCycle').isIn(['monthly', 'yearly']).optional(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { plan, billingCycle = 'monthly' } = req.body;
    
    if (plan === 'enterprise') {
      return res.status(400).json({ 
        message: 'Enterprise plan requires contacting sales',
        contactUrl: '/contact-sales'
      });
    }

    const priceId = PRICE_IDS[plan]?.[billingCycle];
    if (!priceId) {
      return res.status(400).json({ message: 'Invalid plan or billing cycle' });
    }

    // Get or create Stripe customer
    let subscription = await Subscription.findOne({ userId: req.user._id });
    let customerId = subscription?.stripe?.customerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: req.user.email,
        name: req.user.name,
        metadata: {
          userId: req.user._id.toString(),
        },
      });
      customerId = customer.id;
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/pricing`,
      metadata: {
        userId: req.user._id.toString(),
        plan: plan,
      },
    });

    res.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Create checkout session error:', error);
    res.status(500).json({ message: 'Failed to create checkout session' });
  }
});

// Create checkout session for credit purchase
router.post('/purchase-credits', authMiddleware, [
  body('packageIndex').isInt({ min: 0, max: 3 }),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { packageIndex } = req.body;
    const creditPackage = Subscription.CREDIT_PACKAGES[packageIndex];

    if (!creditPackage) {
      return res.status(400).json({ message: 'Invalid credit package' });
    }

    // Get or create Stripe customer
    let subscription = await Subscription.findOne({ userId: req.user._id });
    let customerId = subscription?.stripe?.customerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: req.user.email,
        name: req.user.name,
        metadata: {
          userId: req.user._id.toString(),
        },
      });
      customerId = customer.id;
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${creditPackage.amount} Credits`,
              description: 'Kling AI Video Generation Credits',
            },
            unit_amount: creditPackage.price * 100, // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/credits/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/credits`,
      metadata: {
        userId: req.user._id.toString(),
        type: 'credit_purchase',
        credits: creditPackage.amount.toString(),
      },
    });

    res.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Purchase credits error:', error);
    res.status(500).json({ message: 'Failed to create checkout session' });
  }
});

// Get billing portal session
router.post('/billing-portal', authMiddleware, async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ userId: req.user._id });
    
    if (!subscription?.stripe?.customerId) {
      return res.status(400).json({ message: 'No subscription found' });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: subscription.stripe.customerId,
      return_url: `${process.env.FRONTEND_URL}/settings/billing`,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Billing portal error:', error);
    res.status(500).json({ message: 'Failed to create billing portal session' });
  }
});

// Get invoices
router.get('/invoices', authMiddleware, async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ userId: req.user._id });
    
    if (!subscription?.stripe?.customerId) {
      return res.json({ invoices: [] });
    }

    const invoices = await stripe.invoices.list({
      customer: subscription.stripe.customerId,
      limit: 24,
    });

    res.json({
      invoices: invoices.data.map(inv => ({
        id: inv.id,
        amount: inv.amount_due / 100,
        currency: inv.currency,
        status: inv.status,
        date: new Date(inv.created * 1000),
        url: inv.hosted_invoice_url,
        pdf: inv.invoice_pdf,
      })),
    });
  } catch (error) {
    console.error('Get invoices error:', error);
    res.status(500).json({ message: 'Failed to retrieve invoices' });
  }
});

// Cancel subscription
router.post('/cancel-subscription', authMiddleware, async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ userId: req.user._id });
    
    if (!subscription?.stripe?.subscriptionId) {
      return res.status(400).json({ message: 'No active subscription' });
    }

    await stripe.subscriptions.update(subscription.stripe.subscriptionId, {
      cancel_at_period_end: true,
    });

    subscription.cancelAtPeriodEnd = true;
    await subscription.save();

    res.json({ message: 'Subscription will be canceled at the end of the billing period' });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({ message: 'Failed to cancel subscription' });
  }
});

// Reactivate subscription
router.post('/reactivate-subscription', authMiddleware, async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ userId: req.user._id });
    
    if (!subscription?.stripe?.subscriptionId) {
      return res.status(400).json({ message: 'No active subscription' });
    }

    await stripe.subscriptions.update(subscription.stripe.subscriptionId, {
      cancel_at_period_end: false,
    });

    subscription.cancelAtPeriodEnd = false;
    await subscription.save();

    res.json({ message: 'Subscription reactivated' });
  } catch (error) {
    console.error('Reactivate subscription error:', error);
    res.status(500).json({ message: 'Failed to reactivate subscription' });
  }
});

// Stripe webhook
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        
        if (session.mode === 'subscription') {
          // Subscription payment
          await handleSubscriptionCreated(session);
        } else if (session.metadata?.type === 'credit_purchase') {
          // Credit purchase
          await handleCreditPurchase(session);
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object;
        await handleInvoicePaymentSucceeded(invoice);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        await handleInvoicePaymentFailed(invoice);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        await handleSubscriptionCanceled(subscription);
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        await handleSubscriptionUpdated(subscription);
        break;
      }
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// Webhook handlers
async function handleSubscriptionCreated(session) {
  const userId = session.metadata.userId;
  const plan = session.metadata.plan;

  const subscription = await Subscription.findOne({ userId });
  
  if (subscription) {
    subscription.plan = plan;
    subscription.status = 'active';
    subscription.stripe.customerId = session.customer;
    subscription.stripe.subscriptionId = session.subscription;
    subscription.features = Subscription.PLANS[plan].features;
    await subscription.save();
  }
}

async function handleCreditPurchase(session) {
  const userId = session.metadata.userId;
  const credits = parseInt(session.metadata.credits);

  const user = await User.findById(userId);
  if (user) {
    user.credits += credits;
    await user.save();
  }

  const subscription = await Subscription.findOne({ userId });
  if (subscription) {
    subscription.creditPurchases.push({
      amount: credits,
      cost: session.amount_total / 100,
      currency: session.currency,
      stripePaymentIntentId: session.payment_intent,
    });
    await subscription.save();
  }
}

async function handleInvoicePaymentSucceeded(invoice) {
  const subscription = await Subscription.findOne({
    'stripe.customerId': invoice.customer,
  });

  if (subscription) {
    subscription.invoices.push({
      stripeInvoiceId: invoice.id,
      amount: invoice.amount_paid / 100,
      currency: invoice.currency,
      status: invoice.status,
      invoiceUrl: invoice.hosted_invoice_url,
      createdAt: new Date(invoice.created * 1000),
    });

    subscription.currentPeriodStart = new Date(invoice.period_start * 1000);
    subscription.currentPeriodEnd = new Date(invoice.period_end * 1000);

    await subscription.save();
  }
}

async function handleInvoicePaymentFailed(invoice) {
  const subscription = await Subscription.findOne({
    'stripe.customerId': invoice.customer,
  });

  if (subscription) {
    subscription.status = 'past_due';
    await subscription.save();
  }
}

async function handleSubscriptionCanceled(stripeSubscription) {
  const subscription = await Subscription.findOne({
    'stripe.subscriptionId': stripeSubscription.id,
  });

  if (subscription) {
    subscription.plan = 'free';
    subscription.status = 'canceled';
    subscription.features = Subscription.PLANS.free.features;
    subscription.stripe.subscriptionId = null;
    await subscription.save();
  }
}

async function handleSubscriptionUpdated(stripeSubscription) {
  const subscription = await Subscription.findOne({
    'stripe.subscriptionId': stripeSubscription.id,
  });

  if (subscription) {
    subscription.status = stripeSubscription.status;
    subscription.currentPeriodStart = new Date(stripeSubscription.current_period_start * 1000);
    subscription.currentPeriodEnd = new Date(stripeSubscription.current_period_end * 1000);
    subscription.cancelAtPeriodEnd = stripeSubscription.cancel_at_period_end;
    await subscription.save();
  }
}

module.exports = router;