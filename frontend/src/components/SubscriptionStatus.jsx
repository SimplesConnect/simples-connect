// src/components/SubscriptionStatus.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Crown, 
  Clock, 
  Zap, 
  AlertTriangle, 
  CheckCircle, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

const SubscriptionStatus = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionStatus();
  }, [user]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  if (!subscriptionStatus) return null;

  const { 
    tier, 
    effectiveTier, 
    trialEnded, 
    trialEndsAt, 
    isFoundingMember, 
    expiry, 
    dailySwipesUsed, 
    limits 
  } = subscriptionStatus;

  // Calculate days remaining in trial
  const daysUntilTrialEnd = trialEndsAt ? 
    Math.max(0, Math.ceil((new Date(trialEndsAt) - new Date()) / (1000 * 60 * 60 * 24))) : 0;

  // Determine status type and styling
  let statusConfig = {};

  if (trialEnded && tier === 'free') {
    // Trial ended, no subscription
    statusConfig = {
      type: 'expired',
      icon: AlertTriangle,
      title: 'Trial Expired',
      message: 'Your free trial has ended. Subscribe to continue using premium features.',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-800',
      iconColor: 'text-red-600',
      ctaText: 'Subscribe Now',
      ctaStyle: 'bg-red-600 hover:bg-red-700 text-white'
    };
  } else if (!trialEnded && tier === 'free') {
    // Active trial
    const urgency = daysUntilTrialEnd <= 3 ? 'urgent' : 'normal';
    statusConfig = {
      type: 'trial',
      icon: Clock,
      title: isFoundingMember ? 'Founding Member Trial' : 'Free Trial Active',
      message: `${daysUntilTrialEnd} day${daysUntilTrialEnd !== 1 ? 's' : ''} remaining in your trial.`,
      bgColor: urgency === 'urgent' ? 'bg-orange-50' : 'bg-blue-50',
      borderColor: urgency === 'urgent' ? 'border-orange-200' : 'border-blue-200',
      textColor: urgency === 'urgent' ? 'text-orange-800' : 'text-blue-800',
      iconColor: urgency === 'urgent' ? 'text-orange-600' : 'text-blue-600',
      ctaText: urgency === 'urgent' ? 'Subscribe Before Trial Ends' : 'View Plans',
      ctaStyle: urgency === 'urgent' ? 
        'bg-orange-600 hover:bg-orange-700 text-white' : 
        'bg-blue-600 hover:bg-blue-700 text-white'
    };
  } else {
    // Active subscription
    statusConfig = {
      type: 'active',
      icon: Crown,
      title: `${tier.charAt(0).toUpperCase() + tier.slice(1)} Member`,
      message: expiry ? 
        `Renews on ${new Date(expiry).toLocaleDateString()}` : 
        'Active subscription',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-800',
      iconColor: 'text-green-600',
      ctaText: 'Manage Subscription',
      ctaStyle: 'bg-green-600 hover:bg-green-700 text-white'
    };
  }

  const handleCTAClick = async () => {
    if (statusConfig.type === 'active') {
      // Open Stripe billing portal
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
    } else {
      // Navigate to subscription page
      navigate('/subscription');
    }
  };

  return (
    <div className={`${statusConfig.bgColor} ${statusConfig.borderColor} border rounded-2xl p-6 shadow-lg`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 ${statusConfig.bgColor} rounded-full flex items-center justify-center border-2 ${statusConfig.borderColor}`}>
            <statusConfig.icon className={`w-6 h-6 ${statusConfig.iconColor}`} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className={`font-bold text-lg ${statusConfig.textColor}`}>
                {statusConfig.title}
              </h3>
              {isFoundingMember && (
                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                  Founding Member
                </span>
              )}
            </div>
            <p className={`${statusConfig.textColor} mb-4`}>
              {statusConfig.message}
            </p>

            {/* Usage Stats for Community Tier */}
            {effectiveTier === 'community' && limits.dailySwipes > 0 && (
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className={statusConfig.textColor}>Daily Swipes</span>
                  <span className={statusConfig.textColor}>
                    {dailySwipesUsed}/{limits.dailySwipes}
                  </span>
                </div>
                <div className="w-full bg-white rounded-full h-2">
                  <div 
                    className="bg-simples-ocean h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(dailySwipesUsed / limits.dailySwipes) * 100}%` }}
                  ></div>
                </div>
                {dailySwipesUsed >= limits.dailySwipes && (
                  <p className="text-sm text-orange-600 mt-1">
                    Daily limit reached. Upgrade for unlimited swipes!
                  </p>
                )}
              </div>
            )}

            {/* Premium Features Preview */}
            {(tier === 'free' || tier === 'community') && (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Unlock with Premium:</p>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                  <div className="flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    Unlimited swipes
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Read receipts
                  </div>
                  <div className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Priority placement
                  </div>
                  <div className="flex items-center gap-1">
                    <Crown className="w-3 h-3" />
                    Advanced filters
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <button
        onClick={handleCTAClick}
        className={`w-full ${statusConfig.ctaStyle} py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2`}
      >
        {statusConfig.ctaText}
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default SubscriptionStatus; 