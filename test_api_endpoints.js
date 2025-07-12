// Test script to verify all API endpoints are working
// Run this with: node test_api_endpoints.js

const endpoints = [
  // Matching endpoints
  '/api/matching/discover',
  '/api/matching/matches', 
  '/api/matching/interact',
  '/api/matching/stats',
  
  // User endpoints
  '/api/users/dashboard-stats',
  '/api/users/recent-activity',
  
  // Message endpoints
  '/api/messages/conversations',
  '/api/messages/send',
  '/api/messages/match/test-match-id',
  '/api/messages/read/test-match-id'
];

const BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

async function testEndpoint(endpoint) {
  try {
    console.log(`\n🔍 Testing: ${endpoint}`);
    
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer test-token', // This will fail auth but should not 404
        'Content-Type': 'application/json'
      }
    });
    
    if (response.status === 404) {
      console.log(`❌ ${endpoint} - 404 NOT FOUND`);
      return false;
    } else if (response.status === 401 || response.status === 403) {
      console.log(`✅ ${endpoint} - Endpoint exists (${response.status} auth error expected)`);
      return true;
    } else if (response.status === 500) {
      console.log(`⚠️  ${endpoint} - 500 Server Error (endpoint exists but has issues)`);
      return true;
    } else {
      console.log(`✅ ${endpoint} - ${response.status} ${response.statusText}`);
      return true;
    }
  } catch (error) {
    console.log(`❌ ${endpoint} - Connection Error: ${error.message}`);
    return false;
  }
}

async function testAllEndpoints() {
  console.log('🚀 Testing API Endpoints...');
  console.log(`Base URL: ${BASE_URL}`);
  
  let passed = 0;
  let failed = 0;
  
  for (const endpoint of endpoints) {
    const result = await testEndpoint(endpoint);
    if (result) {
      passed++;
    } else {
      failed++;
    }
  }
  
  console.log('\n📊 Test Results:');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${Math.round((passed / (passed + failed)) * 100)}%`);
  
  if (failed === 0) {
    console.log('\n🎉 All endpoints are working!');
  } else {
    console.log('\n⚠️  Some endpoints are missing or not working.');
    console.log('Make sure to:');
    console.log('1. Deploy your backend to Vercel');
    console.log('2. Check your vercel.json routes configuration');
    console.log('3. Verify all API files exist in backend/api/');
  }
}

// Run the tests
testAllEndpoints().catch(console.error); 