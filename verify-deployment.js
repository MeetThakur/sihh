#!/usr/bin/env node

/**
 * KhetSetu Deployment Verification Script
 *
 * This script helps verify that your deployment is configured correctly
 * and identifies common issues like double slash URLs.
 */

const https = require('https');
const http = require('http');

// Configuration
const CONFIG = {
  // Update these URLs to match your deployment
  frontendUrl: process.env.FRONTEND_URL || 'https://your-app.vercel.app',
  backendUrl: process.env.BACKEND_URL || 'https://khetsetu-backend.onrender.com/api',

  // Test endpoints
  endpoints: [
    { path: '/health', method: 'GET', requiresAuth: false },
    { path: '/auth/login', method: 'POST', requiresAuth: false },
    { path: '/auth/register', method: 'POST', requiresAuth: false },
    { path: '/farms', method: 'GET', requiresAuth: true }
  ]
};

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http;
    const req = lib.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: data,
          url: url
        });
      });
    });

    req.on('error', reject);
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    if (options.method === 'POST' && options.data) {
      req.write(options.data);
    }

    req.end();
  });
}

function checkUrlConstruction() {
  log('\n📐 URL Construction Analysis', 'cyan');
  log('================================', 'cyan');

  const baseUrl = CONFIG.backendUrl;
  const testEndpoint = '/auth/login';

  // Test different URL construction methods
  const tests = [
    {
      name: 'Direct concatenation',
      url: baseUrl + testEndpoint,
      method: 'DANGEROUS - can cause double slashes'
    },
    {
      name: 'Proper construction (recommended)',
      url: baseUrl.replace(/\/+$/, '') + testEndpoint,
      method: 'SAFE - removes trailing slashes'
    },
    {
      name: 'With trailing slash',
      url: baseUrl + '/' + testEndpoint,
      method: 'DANGEROUS - will cause double slashes'
    }
  ];

  tests.forEach(test => {
    const hasDoubleSlash = test.url.includes('//') && !test.url.startsWith('http');
    const status = hasDoubleSlash ? '❌ FAIL' : '✅ PASS';
    const color = hasDoubleSlash ? 'red' : 'green';

    log(`\n${test.name}:`, 'white');
    log(`  URL: ${test.url}`, 'white');
    log(`  Method: ${test.method}`, 'white');
    log(`  Status: ${status}`, color);

    if (hasDoubleSlash) {
      log(`  ⚠️  Double slash detected in: ${test.url}`, 'yellow');
    }
  });
}

async function testEndpoint(endpoint) {
  const url = CONFIG.backendUrl.replace(/\/+$/, '') + endpoint.path;

  try {
    const options = {
      method: endpoint.method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'KhetSetu-Deployment-Verifier/1.0'
      }
    };

    // Add test data for POST requests
    if (endpoint.method === 'POST' && endpoint.path === '/auth/login') {
      options.data = JSON.stringify({
        email: 'test@example.com',
        password: 'testpass123'
      });
    }

    const response = await makeRequest(url, options);

    // Analyze response
    const isHealthy = response.status < 500;
    const status = isHealthy ? '✅' : '❌';
    const color = isHealthy ? 'green' : 'red';

    log(`  ${status} ${endpoint.method} ${endpoint.path} - ${response.status}`, color);

    // Check for CORS headers
    if (response.headers['access-control-allow-origin']) {
      log(`    CORS: ${response.headers['access-control-allow-origin']}`, 'blue');
    } else {
      log(`    ⚠️  No CORS headers found`, 'yellow');
    }

    return { success: isHealthy, status: response.status, url };

  } catch (error) {
    log(`  ❌ ${endpoint.method} ${endpoint.path} - ERROR: ${error.message}`, 'red');
    return { success: false, error: error.message, url };
  }
}

async function testBackendConnectivity() {
  log('\n🔌 Backend Connectivity Test', 'cyan');
  log('==============================', 'cyan');

  log(`Testing backend at: ${CONFIG.backendUrl}`, 'white');

  const results = [];

  for (const endpoint of CONFIG.endpoints) {
    const result = await testEndpoint(endpoint);
    results.push(result);
  }

  return results;
}

function checkEnvironmentVariables() {
  log('\n🌍 Environment Variables Check', 'cyan');
  log('===============================', 'cyan');

  const requiredVars = [
    'FRONTEND_URL',
    'BACKEND_URL'
  ];

  requiredVars.forEach(varName => {
    const value = process.env[varName];
    const status = value ? '✅ SET' : '⚠️  NOT SET';
    const color = value ? 'green' : 'yellow';

    log(`${varName}: ${status}`, color);
    if (value) {
      log(`  Value: ${value}`, 'white');

      // Check for common issues
      if (value.endsWith('/')) {
        log(`  ⚠️  Warning: URL ends with trailing slash`, 'yellow');
      }

      if (value.includes('//') && !value.startsWith('http')) {
        log(`  ❌ Error: URL contains double slashes`, 'red');
      }
    }
  });
}

function generateReport(testResults) {
  log('\n📊 Deployment Report', 'magenta');
  log('====================', 'magenta');

  const totalTests = testResults.length;
  const passedTests = testResults.filter(r => r.success).length;
  const failedTests = totalTests - passedTests;

  log(`\nTotal Tests: ${totalTests}`, 'white');
  log(`Passed: ${passedTests}`, 'green');
  log(`Failed: ${failedTests}`, failedTests > 0 ? 'red' : 'green');

  if (failedTests > 0) {
    log('\n❌ Issues Found:', 'red');
    testResults
      .filter(r => !r.success)
      .forEach(r => {
        log(`  - ${r.url}: ${r.error || `HTTP ${r.status}`}`, 'red');
      });
  }

  // Recommendations
  log('\n💡 Recommendations:', 'yellow');

  if (CONFIG.backendUrl.endsWith('/')) {
    log(`  - Remove trailing slash from BACKEND_URL: ${CONFIG.backendUrl}`, 'yellow');
  }

  if (failedTests > 0) {
    log(`  - Check backend deployment status`, 'yellow');
    log(`  - Verify CORS configuration`, 'yellow');
    log(`  - Check environment variables in deployment platform`, 'yellow');
  }

  log(`  - For Vercel: Set VITE_API_URL=${CONFIG.backendUrl.replace(/\/+$/, '')}`, 'yellow');
  log(`  - Ensure no trailing slashes in environment variables`, 'yellow');
}

async function main() {
  log('🌾 KhetSetu Deployment Verification', 'green');
  log('=====================================', 'green');
  log(`Timestamp: ${new Date().toISOString()}`, 'white');

  // Run all checks
  checkEnvironmentVariables();
  checkUrlConstruction();

  const testResults = await testBackendConnectivity();

  generateReport(testResults);

  log('\n🔍 Next Steps:', 'cyan');
  log('- Fix any issues shown above', 'white');
  log('- Update environment variables in your deployment platform', 'white');
  log('- Redeploy and run this script again', 'white');
  log('- Test your application manually', 'white');

  // Exit with appropriate code
  const hasFailures = testResults.some(r => !r.success);
  process.exit(hasFailures ? 1 : 0);
}

// Handle command line arguments
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  log('KhetSetu Deployment Verification Script', 'green');
  log('Usage: node verify-deployment.js [options]', 'white');
  log('', 'white');
  log('Environment Variables:', 'white');
  log('  FRONTEND_URL - Your frontend URL (e.g., https://your-app.vercel.app)', 'white');
  log('  BACKEND_URL  - Your backend URL (e.g., https://khetsetu-backend.onrender.com/api)', 'white');
  log('', 'white');
  log('Options:', 'white');
  log('  --help, -h   Show this help message', 'white');
  log('', 'white');
  log('Example:', 'white');
  log('  BACKEND_URL=https://khetsetu-backend.onrender.com/api node verify-deployment.js', 'white');
  process.exit(0);
}

// Run the verification
main().catch(error => {
  log(`\n💥 Script Error: ${error.message}`, 'red');
  process.exit(1);
});
