// SubscriptionDebug.jsx - Debug component to test subscription API
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const SubscriptionDebug = () => {
  const { user } = useAuth();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const addResult = (test, result, success = true) => {
    setResults(prev => [...prev, { test, result, success, timestamp: new Date().toLocaleTimeString() }]);
  };

  const runTests = async () => {
    setLoading(true);
    setResults([]);

    // Test 1: Check if user is logged in
    addResult('User Authentication', user ? `✅ User logged in: ${user.email}` : '❌ No user found', !!user);

    // Test 2: Check user token
    if (user?.access_token) {
      addResult('User Token', `✅ Token exists: ${user.access_token.substring(0, 20)}...`, true);
    } else {
      addResult('User Token', '❌ No access token found', false);
    }

    // Test 3: Test subscription status endpoint
    try {
      const statusResponse = await fetch('http://localhost:5000/api/subscription/status', {
        headers: {
          'Authorization': `Bearer ${user.access_token}`
        }
      });
      
      const statusText = await statusResponse.text();
      addResult(
        'Subscription Status API', 
        `Status: ${statusResponse.status} - ${statusText.substring(0, 100)}${statusText.length > 100 ? '...' : ''}`,
        statusResponse.status === 200
      );
    } catch (error) {
      addResult('Subscription Status API', `❌ Error: ${error.message}`, false);
    }

    // Test 4: Test create checkout session (without auth first)
    try {
      const checkoutResponse = await fetch('http://localhost:5000/api/subscription/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          tier: 'premium',
          billingCycle: 'monthly'
        })
      });
      
      const checkoutText = await checkoutResponse.text();
      addResult(
        'Checkout API (No Auth)', 
        `Status: ${checkoutResponse.status} - ${checkoutText.substring(0, 100)}${checkoutText.length > 100 ? '...' : ''}`,
        checkoutResponse.status === 200
      );
    } catch (error) {
      addResult('Checkout API (No Auth)', `❌ Error: ${error.message}`, false);
    }

    // Test 5: Test create checkout session (with auth)
    if (user?.access_token) {
      try {
        const checkoutAuthResponse = await fetch('http://localhost:5000/api/subscription/create-checkout-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.access_token}`
          },
          body: JSON.stringify({
            tier: 'premium',
            billingCycle: 'monthly'
          })
        });
        
        const checkoutAuthText = await checkoutAuthResponse.text();
        addResult(
          'Checkout API (With Auth)', 
          `Status: ${checkoutAuthResponse.status} - ${checkoutAuthText.substring(0, 100)}${checkoutAuthText.length > 100 ? '...' : ''}`,
          checkoutAuthResponse.status === 200
        );
      } catch (error) {
        addResult('Checkout API (With Auth)', `❌ Error: ${error.message}`, false);
      }
    }

    // Test 6: Test backend health
    try {
      const healthResponse = await fetch('/api/users/dashboard-stats', {
        headers: user?.access_token ? {
          'Authorization': `Bearer ${user.access_token}`
        } : {}
      });
      
      addResult(
        'Backend Health', 
        `Status: ${healthResponse.status} - Backend is responding`,
        healthResponse.status < 500
      );
    } catch (error) {
      addResult('Backend Health', `❌ Backend error: ${error.message}`, false);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">🔍 Subscription Debug Tool</h2>
      
      <button
        onClick={runTests}
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Running Tests...' : 'Run Diagnostic Tests'}
      </button>

      {results.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">Test Results:</h3>
          <div className="space-y-3">
            {results.map((result, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-l-4 ${
                  result.success 
                    ? 'bg-green-50 border-green-500 text-green-800' 
                    : 'bg-red-50 border-red-500 text-red-800'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">{result.test}</h4>
                    <p className="mt-1 text-sm font-mono">{result.result}</p>
                  </div>
                  <span className="text-xs text-gray-500">{result.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {user && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">Current User Info:</h3>
          <pre className="text-xs bg-white p-2 rounded overflow-auto">
            {JSON.stringify({
              id: user.id,
              email: user.email,
              hasToken: !!user.access_token,
              tokenPreview: user.access_token ? user.access_token.substring(0, 20) + '...' : 'None'
            }, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default SubscriptionDebug; 