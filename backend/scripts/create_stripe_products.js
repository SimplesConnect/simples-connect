// scripts/create_stripe_products.js
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function createProducts() {
  console.log('Creating Stripe products and prices...\n');
  
  const products = [
    {
      name: 'Community',
      description: 'Perfect for students, young professionals, and casual daters',
      price: 1000, // $10.00 in cents
      features: [
        'Basic profile creation and browsing',
        '20 daily swipes',
        'Standard messaging',
        'Community forum access',
        'Event notifications',
        'Basic matching algorithm'
      ]
    },
    {
      name: 'Premium',
      description: 'Perfect for working professionals serious about dating',
      price: 2500, // $25.00 in cents
      features: [
        'Unlimited swipes and messaging',
        'Enhanced profile features',
        'Video profile intros',
        'Priority placement in discovery',
        'Advanced filters',
        'Read receipts and online status',
        'Early access to events'
      ]
    },
    {
      name: 'VIP',
      description: 'Perfect for executives, entrepreneurs, and high-income individuals',
      price: 5000, // $50.00 in cents
      features: [
        'All Premium features included',
        'Verified profile badge',
        'Personal dating coach consultations',
        'Exclusive VIP events and meetups',
        'Priority customer support',
        'Profile boost features',
        'Advanced compatibility scoring'
      ]
    },
  ];

  const createdProducts = {};

  for (const prod of products) {
    try {
      // Create product
      const product = await stripe.products.create({
        name: prod.name,
        description: prod.description,
        metadata: {
          tier: prod.name.toLowerCase(),
          features: JSON.stringify(prod.features)
        }
      });

      // Create monthly price
      const monthlyPrice = await stripe.prices.create({
        unit_amount: prod.price,
        currency: 'usd',
        recurring: { interval: 'month' },
        product: product.id,
        nickname: `${prod.name} Monthly`
      });

      // Create yearly price (with 17% discount)
      const yearlyAmount = Math.round(prod.price * 12 * 0.83); // 17% discount
      const yearlyPrice = await stripe.prices.create({
        unit_amount: yearlyAmount,
        currency: 'usd',
        recurring: { interval: 'year' },
        product: product.id,
        nickname: `${prod.name} Yearly`
      });

      createdProducts[prod.name.toLowerCase()] = {
        productId: product.id,
        monthlyPriceId: monthlyPrice.id,
        yearlyPriceId: yearlyPrice.id
      };

      console.log(`✅ ${prod.name} created successfully:`);
      console.log(`   Product ID: ${product.id}`);
      console.log(`   Monthly Price ID: ${monthlyPrice.id} ($${prod.price / 100}/month)`);
      console.log(`   Yearly Price ID: ${yearlyPrice.id} ($${yearlyAmount / 100}/year)`);
      console.log('');
    } catch (error) {
      console.error(`❌ Error creating ${prod.name}:`, error.message);
    }
  }

  // Create promo codes
  console.log('Creating promo codes...\n');
  
  try {
    // Create 50% off coupon for soft launch
    const coupon = await stripe.coupons.create({
      id: 'LUV50',
      percent_off: 50,
      duration: 'once',
      name: 'Soft Launch Special - 50% Off First Month',
      metadata: {
        campaign: 'soft_launch'
      }
    });

    console.log('✅ Promo code created:');
    console.log(`   Coupon ID: ${coupon.id}`);
    console.log(`   Discount: ${coupon.percent_off}% off`);
    console.log('');
  } catch (error) {
    console.error('❌ Error creating promo code:', error.message);
  }

  // Output configuration for backend
  console.log('🔧 Add these to your backend .env file:');
  console.log('');
  console.log('# Stripe Price IDs');
  Object.entries(createdProducts).forEach(([tier, data]) => {
    console.log(`STRIPE_${tier.toUpperCase()}_MONTHLY_PRICE=${data.monthlyPriceId}`);
    console.log(`STRIPE_${tier.toUpperCase()}_YEARLY_PRICE=${data.yearlyPriceId}`);
  });
  console.log('');
  console.log('# Promo Codes');
  console.log('STRIPE_LAUNCH_PROMO=LUV50');
  
  return createdProducts;
}

if (require.main === module) {
  createProducts()
    .then(() => {
      console.log('✅ All products created successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error:', error);
      process.exit(1);
    });
}

module.exports = createProducts; 