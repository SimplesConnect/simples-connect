import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { CheckCircle, XCircle, Clock, ArrowRight } from 'lucide-react';

const FlowTest = () => {
  const { user } = useAuth();
  const [tests, setTests] = useState([]);
  const [running, setRunning] = useState(false);

  const testSteps = [
    {
      id: 'auth',
      name: 'Authentication',
      description: 'Check if user is authenticated'
    },
    {
      id: 'potential-matches',
      name: 'Fetch Potential Matches',
      description: 'Load users to swipe on'
    },
    {
      id: 'like-interaction',
      name: 'Like Interaction',
      description: 'Test liking a user'
    },
    {
      id: 'user-matches',
      name: 'Fetch User Matches',
      description: 'Load user\'s existing matches'
    },
    {
      id: 'conversations',
      name: 'Load Conversations',
      description: 'Load messaging conversations'
    },
    {
      id: 'send-message',
      name: 'Send Message',
      description: 'Test sending a message'
    }
  ];

  const runTests = async () => {
    setRunning(true);
    const results = [];

    for (const step of testSteps) {
      try {
        results.push({ ...step, status: 'running' });
        setTests([...results]);

        let success = false;
        let error = null;

        try {
          switch (step.id) {
            case 'auth':
              success = await testAuth();
              break;
            case 'potential-matches':
              success = await testPotentialMatches();
              break;
            case 'like-interaction':
              success = await testLikeInteraction();
              break;
            case 'user-matches':
              success = await testUserMatches();
              break;
            case 'conversations':
              success = await testConversations();
              break;
            case 'send-message':
              success = await testSendMessage();
              break;
          }
        } catch (testError) {
          success = false;
          error = testError.message;
        }

        results[results.length - 1] = { 
          ...step, 
          status: success ? 'success' : 'error',
          error: error 
        };
        setTests([...results]);

        // Wait between tests
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (err) {
        results[results.length - 1] = { 
          ...step, 
          status: 'error', 
          error: err.message 
        };
        setTests([...results]);
      }
    }

    setRunning(false);
  };

  const testAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return !!session?.access_token;
  };

  const testPotentialMatches = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) {
      throw new Error('No authentication token available');
    }
    
    const response = await fetch('/api/matching/potential-matches', {
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error (${response.status}): ${errorText}`);
    }
    
    const data = await response.json();
    return data.success;
  };

  const testLikeInteraction = async () => {
    // First get a potential match
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) {
      throw new Error('No authentication token available');
    }
    
    const matchesResponse = await fetch('/api/matching/potential-matches', {
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!matchesResponse.ok) {
      const errorText = await matchesResponse.text();
      throw new Error(`Failed to fetch potential matches: ${errorText}`);
    }
    
    const matchesData = await matchesResponse.json();
    
    if (!matchesData.success || !matchesData.matches || matchesData.matches.length === 0) {
      throw new Error('No potential matches available for testing');
    }

    const targetUser = matchesData.matches[0];
    
    // Try to like the user
    const likeResponse = await fetch('/api/matching/interact', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        target_user_id: targetUser.id,
        interaction_type: 'like'
      })
    });
    
    if (!likeResponse.ok) {
      const errorText = await likeResponse.text();
      throw new Error(`Failed to like user: ${errorText}`);
    }
    
    const likeData = await likeResponse.json();
    return likeData.success;
  };

  const testUserMatches = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) {
      throw new Error('No authentication token available');
    }
    
    const response = await fetch('/api/matching/matches', {
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error (${response.status}): ${errorText}`);
    }
    
    const data = await response.json();
    return data.success;
  };

  const testConversations = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) {
      throw new Error('No authentication token available');
    }
    
    const response = await fetch('/api/messages/conversations', {
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error (${response.status}): ${errorText}`);
    }
    
    const data = await response.json();
    return Array.isArray(data.conversations);
  };

  const testSendMessage = async () => {
    // First get matches to find a match to send message to
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) {
      throw new Error('No authentication token available');
    }
    
    const matchesResponse = await fetch('/api/matching/matches', {
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!matchesResponse.ok) {
      const errorText = await matchesResponse.text();
      throw new Error(`Failed to fetch matches: ${errorText}`);
    }
    
    const matchesData = await matchesResponse.json();
    
    if (!matchesData.success || !matchesData.matches || matchesData.matches.length === 0) {
      throw new Error('No matches available to send message to');
    }

    const match = matchesData.matches[0];
    
    // Try to send a test message
    const messageResponse = await fetch('/api/messages/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        match_id: match.id,
        content: 'Test message from flow test',
        message_type: 'text'
      })
    });
    
    if (!messageResponse.ok) {
      const errorText = await messageResponse.text();
      throw new Error(`Failed to send message: ${errorText}`);
    }
    
    const messageData = await messageResponse.json();
    return !!messageData.message;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'running':
        return <Clock className="w-5 h-5 text-blue-500 animate-spin" />;
      default:
        return <div className="w-5 h-5 bg-gray-300 rounded-full" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Matching & Messaging Flow Test
        </h2>
        
        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            This test verifies that the complete user flow works properly:
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <span>Discover</span>
            <ArrowRight className="w-4 h-4" />
            <span>Like/Match</span>
            <ArrowRight className="w-4 h-4" />
            <span>View Matches</span>
            <ArrowRight className="w-4 h-4" />
            <span>Send Messages</span>
          </div>
        </div>

        <button
          onClick={runTests}
          disabled={running}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium mb-6 disabled:opacity-50"
        >
          {running ? 'Running Tests...' : 'Run Flow Test'}
        </button>

        <div className="space-y-4">
          {tests.map((test, index) => (
            <div
              key={test.id}
              className={`flex items-center gap-4 p-4 rounded-lg border ${
                test.status === 'success' ? 'bg-green-50 border-green-200' :
                test.status === 'error' ? 'bg-red-50 border-red-200' :
                test.status === 'running' ? 'bg-blue-50 border-blue-200' :
                'bg-gray-50 border-gray-200'
              }`}
            >
              {getStatusIcon(test.status)}
              <div className="flex-1">
                <h3 className="font-medium text-gray-800">{test.name}</h3>
                <p className="text-sm text-gray-600">{test.description}</p>
                {test.error && (
                  <p className="text-sm text-red-600 mt-1">Error: {test.error}</p>
                )}
              </div>
              <div className="text-sm text-gray-500">
                Step {index + 1} of {testSteps.length}
              </div>
            </div>
          ))}
        </div>

        {tests.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Click "Run Flow Test" to verify the matching and messaging system
          </div>
        )}
      </div>
    </div>
  );
};

export default FlowTest; 