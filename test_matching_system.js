// Test script for the matching system
// Run this in Node.js to test the matching API endpoints

const fetch = require('node-fetch');

// Test configuration
const API_BASE_URL = 'http://localhost:3000/api';
const TEST_TOKEN = 'your-test-token-here'; // Replace with actual test token

// Test helper functions
async function testAPIEndpoint(endpoint, method = 'GET', body = null) {
  try {
    const options = {
      method,
      headers: {
        'Authorization': `Bearer ${TEST_TOKEN}`,
        'Content-Type': 'application/json'
      }
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    const data = await response.json();
    
    return {
      status: response.status,
      success: response.ok,
      data
    };
  } catch (error) {
    return {
      status: 500,
      success: false,
      error: error.message
    };
  }
}

// Test functions
async function testPotentialMatches() {
  console.log('\n🔍 Testing potential matches endpoint...');
  
  const result = await testAPIEndpoint('/matching/potential-matches');
  
  if (result.success) {
    console.log('✅ Potential matches endpoint working');
    console.log(`   Found ${result.data.count} potential matches`);
    
    if (result.data.matches && result.data.matches.length > 0) {
      const firstMatch = result.data.matches[0];
      console.log(`   Sample match: ${firstMatch.full_name} (${firstMatch.location})`);
    }
  } else {
    console.log('❌ Potential matches endpoint failed');
    console.log(`   Error: ${result.data.error}`);
  }
  
  return result;
}

async function testInteraction(targetUserId, interactionType) {
  console.log(`\n💝 Testing ${interactionType} interaction...`);
  
  const result = await testAPIEndpoint('/matching/interact', 'POST', {
    target_user_id: targetUserId,
    interaction_type: interactionType
  });
  
  if (result.success) {
    console.log(`✅ ${interactionType} interaction recorded successfully`);
    
    if (result.data.is_match) {
      console.log('🎉 MATCH DETECTED!');
      console.log(`   Match ID: ${result.data.match_data.id}`);
    } else {
      console.log('   No match yet');
    }
  } else {
    console.log(`❌ ${interactionType} interaction failed`);
    console.log(`   Error: ${result.data.error}`);
  }
  
  return result;
}

async function testMatches() {
  console.log('\n💕 Testing matches endpoint...');
  
  const result = await testAPIEndpoint('/matching/matches');
  
  if (result.success) {
    console.log('✅ Matches endpoint working');
    console.log(`   Found ${result.data.count} matches`);
    
    if (result.data.matches && result.data.matches.length > 0) {
      const firstMatch = result.data.matches[0];
      console.log(`   Sample match: ${firstMatch.other_user.full_name}`);
    }
  } else {
    console.log('❌ Matches endpoint failed');
    console.log(`   Error: ${result.data.error}`);
  }
  
  return result;
}

async function testStats() {
  console.log('\n📊 Testing stats endpoint...');
  
  const result = await testAPIEndpoint('/matching/stats');
  
  if (result.success) {
    console.log('✅ Stats endpoint working');
    const stats = result.data.stats;
    console.log(`   Likes given: ${stats.likes_given}`);
    console.log(`   Passes given: ${stats.passes_given}`);
    console.log(`   Matches: ${stats.matches}`);
    console.log(`   Likes received: ${stats.likes_received}`);
  } else {
    console.log('❌ Stats endpoint failed');
    console.log(`   Error: ${result.data.error}`);
  }
  
  return result;
}

// Main test function
async function runMatchingTests() {
  console.log('🧪 Starting Matching System Tests');
  console.log('=====================================');
  
  if (TEST_TOKEN === 'your-test-token-here') {
    console.log('❌ Please update TEST_TOKEN with a valid authentication token');
    return;
  }
  
  // Test 1: Get potential matches
  const potentialMatchesResult = await testPotentialMatches();
  
  // Test 2: Record a like interaction
  if (potentialMatchesResult.success && potentialMatchesResult.data.matches.length > 0) {
    const firstUser = potentialMatchesResult.data.matches[0];
    await testInteraction(firstUser.id, 'like');
  }
  
  // Test 3: Record a pass interaction  
  if (potentialMatchesResult.success && potentialMatchesResult.data.matches.length > 1) {
    const secondUser = potentialMatchesResult.data.matches[1];
    await testInteraction(secondUser.id, 'pass');
  }
  
  // Test 4: Get matches
  await testMatches();
  
  // Test 5: Get stats
  await testStats();
  
  console.log('\n✅ Matching system tests completed!');
}

// Run the tests
if (require.main === module) {
  runMatchingTests().catch(console.error);
}

module.exports = {
  testPotentialMatches,
  testInteraction,
  testMatches,
  testStats,
  runMatchingTests
}; 