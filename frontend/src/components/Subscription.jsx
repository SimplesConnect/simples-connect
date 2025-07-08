// src/components/Subscription.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Heart, 
  Users, 
  MessageCircle, 
  Star, 
  Crown, 
  Shield, 
  Zap, 
  Eye, 
  Calendar,
  Check,
  X,
  ArrowRight,
  Sparkles,
  Award,
  HeadphonesIcon,
  TrendingUp
} from 'lucide-react';

const Subscription = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedTier, setSelectedTier] = useState('premium');
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [loading, setLoading] = useState(false);
  const [selectedPromoCode, setSelectedPromoCode] = useState('');
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);

  const tiers = {
    community: {
      name: 'Community',
      price: { monthly: 10, yearly: 100 },
      description: 'Perfect for students, young professionals, and casual daters',
      color: 'from-simples-ocean to-simples-sky',
      icon: Users,
      popular: false,
      features: [
        'Basic profile creation and browsing',
        '20 daily swipes',
        'Standard messaging',
        'Community forum access',
        'Event notifications',
        'Basic matching algorithm'
      ],
      limitations: [
        'Limited daily swipes',
        'No priority placement',
        'Standard support'
      ]
    },
    premium: {
      name: 'Premium',
      price: { monthly: 25, yearly: 250 },
      description: 'Perfect for working professionals serious about dating',
      color: 'from-simples-rose to-simples-lavender',
      icon: Star,
      popular: true,
      features: [
        'Unlimited swipes and messaging',
        'Enhanced profile features',
        'Video profile intros',
        'Priority placement in discovery',
        'Advanced filters (education, profession, location)',
        'Early access to events and features',
        'Read receipts and online status',
        'Detailed compatibility scoring',
        'Profile analytics'
      ],
      limitations: []
    },
    vip: {
      name: 'VIP',
      price: { monthly: 50, yearly: 500 },
      description: 'Perfect for executives, entrepreneurs, and high-income individuals',
      color: 'from-yellow-400 to-orange-500',
      icon: Crown,
      popular: false,
      features: [
        'All Premium features included',
        'Verified profile badge',
        'Personal dating coach consultations',
        'Exclusive VIP events and meetups',
        'Priority customer support',
        'Profile boost features',
        'Advanced compatibility scoring',
        'Concierge matching service',
        'Private networking events'
      ],
      limitations: []
    }
  };

  const handleSubscribe = async (tierKey) => {
    setLoading(true);
    
    try {
      const response = await fetch('/api/subscription/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.access_token}`
        },
        body: JSON.stringify({
          tier: tierKey,
          billingCycle: billingCycle,
          promoCode: selectedPromoCode
        })
      });

      const data = await response.json();
      
      if (data.success) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Failed to create checkout session');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      alert('There was an error processing your subscription. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getDiscountPercentage = (tier) => {
    const monthly = tier.price.monthly * 12;
    const yearly = tier.price.yearly;
    return Math.round(((monthly - yearly) / monthly) * 100);
  };

  // Fetch subscription status on component mount
  React.useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      if (!user) return;
      
      try {
        const response = await fetch('/api/subscription/status', {
          headers: {
            'Authorization': `Bearer ${user.access_token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setSubscriptionStatus(data.subscription);
        }
      } catch (error) {
        console.error('Error fetching subscription status:', error);
      }
    };

    fetchSubscriptionStatus();
  }, [user]);

  const applyPromoCode = () => {
    if (promoCodeInput.trim()) {
      setSelectedPromoCode(promoCodeInput.trim().toUpperCase());
      setPromoCodeInput('');
    }
  };

  const removePromoCode = () => {
    setSelectedPromoCode('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-simples-cloud via-simples-silver to-simples-light">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="w-8 h-8 text-simples-rose" />
            <h1 className="text-4xl font-bold text-simples-midnight">
              Find Your Perfect Match
            </h1>
          </div>
          <p className="text-xl text-simples-storm mb-2">
            Join Uganda's premier dating community
          </p>
          <p className="text-simples-storm">
            Choose the plan that fits your dating goals
          </p>
        </div>

        {/* Current Subscription Status */}
        {subscriptionStatus && subscriptionStatus.tier !== 'free' && (
          <div className="mb-8 max-w-2xl mx-auto">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-blue-800">Current Subscription</h3>
              </div>
              <p className="text-blue-700">
                You're currently on the <strong>{subscriptionStatus.tier}</strong> plan.
                {subscriptionStatus.expiry && (
                  <span> Renews on {new Date(subscriptionStatus.expiry).toLocaleDateString()}</span>
                )}
              </p>
              {subscriptionStatus.hasStripeCustomer && (
                <button
                  onClick={async () => {
                    try {
                      const response = await fetch('/api/subscription/create-portal-session', {
                        method: 'POST',
                        headers: {
                          'Authorization': `Bearer ${user.access_token}`
                        }
                      });
                      const data = await response.json();
                      if (data.success) {
                        window.location.href = data.url;
                      }
                    } catch (error) {
                      console.error('Error opening billing portal:', error);
                    }
                  }}
                  className="mt-2 text-blue-600 hover:text-blue-800 font-medium text-sm"
                >
                  Manage Subscription →
                </button>
              )}
            </div>
          </div>
        )}

        {/* Trial Status */}
        {subscriptionStatus && subscriptionStatus.trialEndsAt && !subscriptionStatus.trialEnded && (
          <div className="mb-8 max-w-2xl mx-auto">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold text-green-800">Free Trial Active</h3>
              </div>
              <p className="text-green-700">
                Your free trial ends on {new Date(subscriptionStatus.trialEndsAt).toLocaleDateString()}.
                {subscriptionStatus.isFoundingMember && (
                  <span className="ml-2 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                    Founding Member - Extended Trial
                  </span>
                )}
              </p>
            </div>
          </div>
        )}

        {/* Promo Code Section */}
        <div className="mb-8 max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="font-semibold text-simples-midnight mb-3">Have a promo code?</h3>
            {selectedPromoCode ? (
              <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-green-800">{selectedPromoCode}</span>
                </div>
                <button
                  onClick={removePromoCode}
                  className="text-green-600 hover:text-green-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter promo code"
                  value={promoCodeInput}
                  onChange={(e) => setPromoCodeInput(e.target.value.toUpperCase())}
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-simples-ocean focus:border-transparent"
                />
                <button
                  onClick={applyPromoCode}
                  disabled={!promoCodeInput.trim()}
                  className="px-4 py-2 bg-simples-ocean text-white rounded-lg hover:bg-simples-sky disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Apply
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-lg">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                billingCycle === 'monthly'
                  ? 'bg-simples-ocean text-white'
                  : 'text-simples-storm hover:text-simples-midnight'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2 rounded-md font-medium transition-colors relative ${
                billingCycle === 'yearly'
                  ? 'bg-simples-ocean text-white'
                  : 'text-simples-storm hover:text-simples-midnight'
              }`}
            >
              Yearly
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                Save 17%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {Object.entries(tiers).map(([key, tier]) => (
            <div
              key={key}
              className={`relative bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl ${
                tier.popular ? 'ring-4 ring-simples-rose ring-opacity-50 scale-105' : ''
              }`}
            >
              {/* Popular Badge */}
              {tier.popular && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-simples-rose to-simples-lavender text-white text-center py-2 font-semibold">
                  🔥 Most Popular
                </div>
              )}

              <div className={`p-6 ${tier.popular ? 'pt-14' : ''}`}>
                {/* Tier Header */}
                <div className="text-center mb-6">
                  <div className={`w-16 h-16 bg-gradient-to-r ${tier.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <tier.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-simples-midnight mb-2">
                    {tier.name}
                  </h3>
                  <p className="text-simples-storm text-sm">
                    {tier.description}
                  </p>
                </div>

                {/* Pricing */}
                <div className="text-center mb-6">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-simples-midnight">
                      ${tier.price[billingCycle]}
                    </span>
                    <span className="text-simples-storm">
                      /{billingCycle === 'monthly' ? 'month' : 'year'}
                    </span>
                  </div>
                  {billingCycle === 'yearly' && (
                    <p className="text-green-600 text-sm font-medium mt-1">
                      Save {getDiscountPercentage(tier)}% with yearly billing
                    </p>
                  )}
                </div>

                {/* Features */}
                <div className="space-y-3 mb-6">
                  {tier.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-simples-midnight text-sm">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Limitations */}
                {tier.limitations.length > 0 && (
                  <div className="space-y-2 mb-6 p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600 font-medium">Limitations:</p>
                    {tier.limitations.map((limitation, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <X className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600 text-xs">
                          {limitation}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* CTA Button */}
                <button
                  onClick={() => handleSubscribe(key)}
                  disabled={loading}
                  className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                    tier.popular
                      ? 'bg-gradient-to-r from-simples-rose to-simples-lavender text-white hover:shadow-lg'
                      : `bg-gradient-to-r ${tier.color} text-white hover:shadow-lg`
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      Get Started
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Benefits */}
        <div className="mt-16 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-simples-midnight text-center mb-8">
            Why Choose Simples Connect?
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-simples-ocean/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-simples-ocean" />
              </div>
              <h3 className="font-semibold text-simples-midnight mb-2">Verified Profiles</h3>
              <p className="text-sm text-simples-storm">All profiles are verified for authenticity and safety</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-simples-tropical/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-simples-tropical" />
              </div>
              <h3 className="font-semibold text-simples-midnight mb-2">Quality Matches</h3>
              <p className="text-sm text-simples-storm">Advanced algorithm for meaningful connections</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-simples-rose/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-6 h-6 text-simples-rose" />
              </div>
              <h3 className="font-semibold text-simples-midnight mb-2">Ugandan Community</h3>
              <p className="text-sm text-simples-storm">Connect with fellow Ugandans worldwide</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-simples-lavender/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-6 h-6 text-simples-lavender" />
              </div>
              <h3 className="font-semibold text-simples-midnight mb-2">Premium Experience</h3>
              <p className="text-sm text-simples-storm">Luxury dating experience with personal touch</p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-simples-midnight text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="font-semibold text-simples-midnight mb-2">Can I cancel anytime?</h3>
              <p className="text-simples-storm">Yes, you can cancel your subscription at any time. Your access will continue until the end of your billing period.</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="font-semibold text-simples-midnight mb-2">Is my data secure?</h3>
              <p className="text-simples-storm">Absolutely. We use bank-level encryption and never share your personal information with third parties.</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="font-semibold text-simples-midnight mb-2">What payment methods do you accept?</h3>
              <p className="text-simples-storm">We accept all major credit cards, PayPal, and mobile money payments for your convenience.</p>
            </div>
          </div>
        </div>

        {/* Back to Dashboard */}
        <div className="text-center mt-12">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-simples-ocean hover:text-simples-midnight font-medium"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default Subscription; 