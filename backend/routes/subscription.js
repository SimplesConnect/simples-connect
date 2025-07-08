// backend/routes/subscription.js
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const supabase = require('../supabaseClient');
const requireAuth = require('../middleware/auth');
const router = express.Router();

// Stripe Price IDs (these will be set after running the create products script)
const PRICES = {
  community: {
    monthly: process.env.STRIPE_COMMUNITY_MONTHLY_PRICE,
    yearly: process.env.STRIPE_COMMUNITY_YEARLY_PRICE
  },
  premium: {
    monthly: process.env.STRIPE_PREMIUM_MONTHLY_PRICE,
    yearly: process.env.STRIPE_PREMIUM_YEARLY_PRICE
  },
  vip: {
    monthly: process.env.STRIPE_VIP_MONTHLY_PRICE,
    yearly: process.env.STRIPE_VIP_YEARLY_PRICE
  }
};

const TRIAL_DAYS = 30;
const FOUNDING_MEMBER_TRIAL_DAYS = 60;

// Get user's subscription status
router.get('/status', requireAuth, async (req, res) => {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select(`
        subscription_tier,
        subscription_expiry,
        is_founding_member,
        trial_ends_at,
        daily_swipes_used,
        last_swipe_reset,
        stripe_customer_id,
        stripe_subscription_id
      `)
      .eq('id', req.user.id)
      .single();

    if (error) throw error;

    // Check if trial has expired
    const now = new Date();
    const trialEnded = profile.trial_ends_at && new Date(profile.trial_ends_at) < now;
    const subscriptionExpired = profile.subscription_expiry && new Date(profile.subscription_expiry) < now;

    // Reset daily swipes if needed
    const today = new Date().toISOString().split('T')[0];
    if (profile.last_swipe_reset !== today) {
      await supabase
        .from('profiles')
        .update({
          daily_swipes_used: 0,
          last_swipe_reset: today
        })
        .eq('id', req.user.id);
      
      profile.daily_swipes_used = 0;
    }

    // Determine current effective tier
    let effectiveTier = 'free';
    if (!trialEnded || (profile.subscription_tier !== 'free' && !subscriptionExpired)) {
      effectiveTier = profile.subscription_tier === 'free' ? 'premium' : profile.subscription_tier; // Trial users get premium features
    }

    // Get tier limits
    const tierLimits = getTierLimits(effectiveTier);

    res.json({
      success: true,
      subscription: {
        tier: profile.subscription_tier,
        effectiveTier,
        expiry: profile.subscription_expiry,
        trialEndsAt: profile.trial_ends_at,
        isFoundingMember: profile.is_founding_member,
        trialEnded,
        subscriptionExpired,
        dailySwipesUsed: profile.daily_swipes_used,
        limits: tierLimits,
        hasStripeCustomer: !!profile.stripe_customer_id
      }
    });
  } catch (error) {
    console.error('Error fetching subscription status:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch subscription status' });
  }
});

// Create Stripe checkout session
router.post('/create-checkout-session', requireAuth, async (req, res) => {
  try {
    const { tier, billingCycle = 'monthly', promoCode } = req.body;
    const user = req.user;

    if (!PRICES[tier] || !PRICES[tier][billingCycle]) {
      return res.status(400).json({ error: 'Invalid tier or billing cycle' });
    }

    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_founding_member, stripe_customer_id')
      .eq('id', user.id)
      .single();

    const trialDays = profile?.is_founding_member ? FOUNDING_MEMBER_TRIAL_DAYS : TRIAL_DAYS;
    
    // Create or get Stripe customer
    let customerId = profile?.stripe_customer_id;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { user_id: user.id }
      });
      customerId = customer.id;
      
      // Save customer ID to profile
      await supabase
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', user.id);
    }

    const sessionConfig = {
      customer: customerId,
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: PRICES[tier][billingCycle],
          quantity: 1,
        },
      ],
      subscription_data: {
        trial_period_days: trialDays,
        metadata: { 
          user_id: user.id, 
          tier,
          billing_cycle: billingCycle
        },
      },
      success_url: `${process.env.DOMAIN}/dashboard?subscription=success&tier=${tier}`,
      cancel_url: `${process.env.DOMAIN}/subscription?cancelled=true`,
      allow_promotion_codes: true
    };

    // Add promo code if provided
    if (promoCode) {
      sessionConfig.discounts = [{ coupon: promoCode }];
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);
    
    res.json({ 
      success: true, 
      url: session.url,
      sessionId: session.id 
    });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to create checkout session' 
    });
  }
});

// Create customer portal session for subscription management
router.post('/create-portal-session', requireAuth, async (req, res) => {
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', req.user.id)
      .single();

    if (!profile?.stripe_customer_id) {
      return res.status(400).json({ error: 'No Stripe customer found' });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: `${process.env.DOMAIN}/dashboard`,
    });

    res.json({ success: true, url: session.url });
  } catch (error) {
    console.error('Portal session error:', error);
    res.status(500).json({ success: false, error: 'Failed to create portal session' });
  }
});

// Check if user can perform action (swipe, message, etc.)
router.post('/check-limit', requireAuth, async (req, res) => {
  try {
    const { action } = req.body; // 'swipe', 'message', 'super_like', etc.
    
    const { data: profile } = await supabase
      .from('profiles')
      .select(`
        subscription_tier,
        subscription_expiry,
        trial_ends_at,
        daily_swipes_used,
        last_swipe_reset
      `)
      .eq('id', req.user.id)
      .single();

    const now = new Date();
    const trialEnded = profile.trial_ends_at && new Date(profile.trial_ends_at) < now;
    const subscriptionExpired = profile.subscription_expiry && new Date(profile.subscription_expiry) < now;

    let effectiveTier = 'free';
    if (!trialEnded || (profile.subscription_tier !== 'free' && !subscriptionExpired)) {
      effectiveTier = profile.subscription_tier === 'free' ? 'premium' : profile.subscription_tier;
    }

    const limits = getTierLimits(effectiveTier);
    let canPerform = true;
    let reason = '';

    if (action === 'swipe') {
      if (effectiveTier === 'community' && profile.daily_swipes_used >= limits.dailySwipes) {
        canPerform = false;
        reason = 'Daily swipe limit reached. Upgrade to Premium for unlimited swipes!';
      } else if (effectiveTier === 'free') {
        canPerform = false;
        reason = 'Free trial ended. Subscribe to continue swiping!';
      }
    }

    res.json({
      success: true,
      canPerform,
      reason,
      currentUsage: {
        dailySwipes: profile.daily_swipes_used
      },
      limits
    });
  } catch (error) {
    console.error('Error checking limits:', error);
    res.status(500).json({ success: false, error: 'Failed to check limits' });
  }
});

// Record usage (increment swipe count, etc.)
router.post('/record-usage', requireAuth, async (req, res) => {
  try {
    const { action } = req.body;
    
    if (action === 'swipe') {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          daily_swipes_used: supabase.raw('daily_swipes_used + 1')
        })
        .eq('id', req.user.id);
      
      if (error) throw error;
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error recording usage:', error);
    res.status(500).json({ success: false, error: 'Failed to record usage' });
  }
});

// Stripe webhook endpoint
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    await handleStripeEvent(event);
    res.json({ received: true });
  } catch (error) {
    console.error('Error handling webhook:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
});

// Helper function to handle Stripe events
async function handleStripeEvent(event) {
  console.log(`Processing Stripe event: ${event.type}`);

  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
      await handleSubscriptionUpdate(event.data.object);
      break;
    
    case 'customer.subscription.deleted':
      await handleSubscriptionCancellation(event.data.object);
      break;
    
    case 'invoice.payment_failed':
      await handlePaymentFailure(event.data.object);
      break;
    
    case 'invoice.payment_succeeded':
      await handlePaymentSuccess(event.data.object);
      break;
    
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }
}

async function handleSubscriptionUpdate(subscription) {
  const userId = subscription.metadata.user_id;
  const tier = subscription.metadata.tier;
  const expiry = new Date(subscription.current_period_end * 1000).toISOString();

  await supabase
    .from('profiles')
    .update({
      subscription_tier: tier,
      subscription_expiry: expiry,
      stripe_subscription_id: subscription.id
    })
    .eq('id', userId);

  // Log the event
  await supabase
    .from('subscription_logs')
    .insert({
      user_id: userId,
      event_type: 'subscribed',
      to_tier: tier,
      stripe_event_id: subscription.id,
      metadata: { subscription_status: subscription.status }
    });

  console.log(`Updated subscription for user ${userId} to ${tier}`);
}

async function handleSubscriptionCancellation(subscription) {
  const userId = subscription.metadata.user_id;

  await supabase
    .from('profiles')
    .update({
      subscription_tier: 'free',
      subscription_expiry: null,
      stripe_subscription_id: null
    })
    .eq('id', userId);

  // Log the event
  await supabase
    .from('subscription_logs')
    .insert({
      user_id: userId,
      event_type: 'cancelled',
      to_tier: 'free',
      stripe_event_id: subscription.id
    });

  console.log(`Cancelled subscription for user ${userId}`);
}

async function handlePaymentFailure(invoice) {
  const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
  const userId = subscription.metadata.user_id;

  // Log the payment failure
  await supabase
    .from('subscription_logs')
    .insert({
      user_id: userId,
      event_type: 'payment_failed',
      stripe_event_id: invoice.id,
      metadata: { amount: invoice.amount_due, attempt_count: invoice.attempt_count }
    });

  console.log(`Payment failed for user ${userId}`);
}

async function handlePaymentSuccess(invoice) {
  const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
  const userId = subscription.metadata.user_id;

  // Log successful payment
  await supabase
    .from('subscription_logs')
    .insert({
      user_id: userId,
      event_type: 'payment_succeeded',
      stripe_event_id: invoice.id,
      metadata: { amount: invoice.amount_paid }
    });

  console.log(`Payment succeeded for user ${userId}`);
}

// Helper function to get tier limits
function getTierLimits(tier) {
  const limits = {
    free: {
      dailySwipes: 0,
      canMessage: false,
      canSuperLike: false,
      canUseAdvancedFilters: false,
      canSeeWhoLikedYou: false,
      priorityPlacement: false
    },
    community: {
      dailySwipes: 20,
      canMessage: true,
      canSuperLike: false,
      canUseAdvancedFilters: false,
      canSeeWhoLikedYou: false,
      priorityPlacement: false
    },
    premium: {
      dailySwipes: -1, // unlimited
      canMessage: true,
      canSuperLike: true,
      canUseAdvancedFilters: true,
      canSeeWhoLikedYou: true,
      priorityPlacement: true
    },
    vip: {
      dailySwipes: -1, // unlimited
      canMessage: true,
      canSuperLike: true,
      canUseAdvancedFilters: true,
      canSeeWhoLikedYou: true,
      priorityPlacement: true,
      verifiedBadge: true,
      personalCoach: true,
      exclusiveEvents: true
    }
  };

  return limits[tier] || limits.free;
}

module.exports = router; 