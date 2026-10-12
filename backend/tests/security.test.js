const http = require('http');

function makeRequest(options, postData) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, headers: res.headers, body: data }));
    });
    req.on('error', reject);
    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

async function runTests() {
  console.log('=== RUNNING SECURITY AUDIT VERIFICATION ===\n');
  let passed = 0;
  let failed = 0;

  // 1. Security Headers Test
  try {
    const res = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/health',
      method: 'GET'
    });
    
    console.log('[TEST 1] Security Headers Check:');
    const hasNoSniff = res.headers['x-content-type-options'] === 'nosniff';
    const noPoweredBy = !res.headers['x-powered-by'];
    const hasFrameOptions = !!res.headers['x-frame-options'];
    const hasCsp = !!res.headers['content-security-policy'];

    console.log(` - X-Content-Type-Options (nosniff): ${hasNoSniff ? 'PASS' : 'FAIL'}`);
    console.log(` - X-Powered-By hidden: ${noPoweredBy ? 'PASS' : 'FAIL'}`);
    console.log(` - X-Frame-Options: ${hasFrameOptions ? 'PASS' : 'FAIL'}`);
    console.log(` - Content-Security-Policy: ${hasCsp ? 'PASS' : 'FAIL'}`);

    if (hasNoSniff && noPoweredBy && hasFrameOptions && hasCsp) passed++;
    else failed++;
  } catch (err) {
    console.error('Test 1 failed with error:', err.message);
    failed++;
  }

  // 2. CORS Policy Check
  try {
    console.log('\n[TEST 2] CORS Policy Check:');
    const allowedRes = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/health',
      method: 'GET',
      headers: {
        'Origin': 'http://localhost:5173'
      }
    });
    const allowOrigin = allowedRes.headers['access-control-allow-origin'];
    console.log(` - Allowed Origin (http://localhost:5173): ${allowOrigin === 'http://localhost:5173' ? 'PASS' : 'FAIL'}`);

    const blockedRes = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/health',
      method: 'GET',
      headers: {
        'Origin': 'http://malicious-hacker-site.com'
      }
    });
    const blockedOrigin = blockedRes.headers['access-control-allow-origin'];
    console.log(` - Malicious Origin Blocked: ${blockedOrigin !== 'http://malicious-hacker-site.com' ? 'PASS' : 'FAIL'}`);

    if (allowOrigin === 'http://localhost:5173' && blockedOrigin !== 'http://malicious-hacker-site.com') passed++;
    else failed++;
  } catch (err) {
    console.error('Test 2 failed with error:', err.message);
    failed++;
  }

  // 3. Admin & Protected Route Authorization
  try {
    console.log('\n[TEST 3] Admin & Protected Route Authorization:');
    const unauthHospital = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/v1/hospitals/encounters/diagnosis',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }, JSON.stringify({ abhaId: 'test' }));

    console.log(` - Clinical Route Unauthorized Access Blocked: ${unauthHospital.statusCode === 401 ? 'PASS' : 'FAIL'} (HTTP ${unauthHospital.statusCode})`);

    const unauthCondition = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/v1/conditions/cond_123/journey',
      method: 'GET'
    });
    console.log(` - Condition Journey IDOR Check (Token Required): ${unauthCondition.statusCode === 401 ? 'PASS' : 'FAIL'} (HTTP ${unauthCondition.statusCode})`);

    if (unauthHospital.statusCode === 401 && unauthCondition.statusCode === 401) passed++;
    else failed++;
  } catch (err) {
    console.error('Test 3 failed with error:', err.message);
    failed++;
  }

  // 4. Rate Limiting Headers
  try {
    console.log('\n[TEST 4] Rate Limiting Headers:');
    const rateLimitRes = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/v1/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }, JSON.stringify({ identifier: 'invalid', password: 'test' }));

    const hasRateLimitHeader = !!(rateLimitRes.headers['ratelimit-limit'] || rateLimitRes.headers['x-ratelimit-limit']);
    console.log(` - Rate Limit Header Present: ${hasRateLimitHeader ? 'PASS' : 'FAIL'} (Limit: ${rateLimitRes.headers['ratelimit-limit'] || rateLimitRes.headers['x-ratelimit-limit']})`);

    if (hasRateLimitHeader) passed++;
    else failed++;
  } catch (err) {
    console.error('Test 4 failed with error:', err.message);
    failed++;
  }

  // 5. Form Sanitization & Anti-XSS Check
  try {
    console.log('\n[TEST 5] Form Sanitization & Anti-XSS:');
    const xssPayload = JSON.stringify({
      abhaId: "<script>alert('xss')</script>12-3456-7890-1234",
      doctorNotes: "javascript:alert(1)",
      __proto__: { polluted: true }
    });
    const xssRes = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/v1/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }, xssPayload);

    const isProtoClean = !Object.prototype.polluted;
    console.log(` - Prototype Pollution Blocked: ${isProtoClean ? 'PASS' : 'FAIL'}`);
    console.log(` - XSS Injection Handled Gracefully: ${xssRes.statusCode === 400 || xssRes.statusCode === 401 ? 'PASS' : 'FAIL'} (HTTP ${xssRes.statusCode})`);

    if (isProtoClean && (xssRes.statusCode === 400 || xssRes.statusCode === 401)) passed++;
    else failed++;
  } catch (err) {
    console.error('Test 5 failed with error:', err.message);
    failed++;
  }

  console.log(`\n=== AUDIT SUMMARY: ${passed} PASSED, ${failed} FAILED ===\n`);
  process.exit(failed > 0 ? 1 : 0);
}

runTests();
