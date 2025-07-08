// test_subscription.js - Quick test script for subscription endpoints
require('dotenv').config();

const BASE_URL = 'http://localhost:5000';

async function testSubscriptionEndpoints() {
  console.log('🧪 Testing Subscription Endpoints...\n');

  // Test 1: Check if subscription routes are accessible
  try {
    const response = await fetch(`${BASE_URL}/api/subscription/status`, {
      headers: {
        'Authorization': 'Bearer fake-token' // This will fail auth, but endpoint should exist
      }
    });
    
    if (response.status === 401) {
      console.log('✅ Subscription status endpoint exists (returns 401 as expected)');
    } else {
      console.log(`❌ Unexpected response: ${response.status}`);
    }
  } catch (error) {
    console.log('❌ Subscription endpoint not accessible:', error.message);
  }

  // Test 2: Check if Stripe is configured
  if (process.env.STRIPE_SECRET_KEY) {
    if (process.env.STRIPE_SECRET_KEY.startsWith('sk_test_')) {
      console.log('✅ Stripe test key is configured');
    } else if (process.env.STRIPE_SECRET_KEY.startsWith('sk_live_')) {
      console.log('✅ Stripe live key is configured');
    } else {
      console.log('❌ Invalid Stripe key format');
    }
  } else {
    console.log('❌ STRIPE_SECRET_KEY not found in environment');
  }

  // Test 3: Check if price IDs are configured
  const priceEnvs = [
    'STRIPE_COMMUNITY_MONTHLY_PRICE',
    'STRIPE_PREMIUM_MONTHLY_PRICE',
    'STRIPE_VIP_MONTHLY_PRICE'
  ];

  const missingPrices = priceEnvs.filter(env => !process.env[env]);
  if (missingPrices.length === 0) {
    console.log('✅ All Stripe price IDs are configured');
  } else {
    console.log('❌ Missing price IDs:', missingPrices.join(', '));
    console.log('   Run: node scripts/create_stripe_products.js');
  }

  console.log('\n📋 Next Steps:');
  console.log('1. Add your Stripe test secret key to .env');
  console.log('2. Run: node scripts/create_stripe_products.js');
  console.log('3. Copy the generated price IDs to your .env');
  console.log('4. Start your servers and test the subscription flow');
}

// Run the test if this script is executed directly
if (require.main === module) {
  testSubscriptionEndpoints();
}

module.exports = testSubscriptionEndpoints; 