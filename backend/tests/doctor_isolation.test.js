const http = require('http');

function makeRequest(options, postData) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        let parsed = null;
        try {
          parsed = JSON.parse(data);
        } catch (e) {
          parsed = data;
        }
        resolve({ statusCode: res.statusCode, headers: res.headers, body: parsed });
      });
    });
    req.on('error', reject);
    if (postData) {
      req.write(typeof postData === 'string' ? postData : JSON.stringify(postData));
    }
    req.end();
  });
}

async function runTests() {
  console.log('================================================================');
  console.log('   MEDISUTRA END-TO-END DOCTOR-PATIENT ISOLATION TEST SUITE    ');
  console.log('================================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  [PASS] ${message}`);
      passed++;
    } else {
      console.error(`  [FAIL] ${message}`);
      failed++;
    }
  }

  try {
    // -------------------------------------------------------------
    // STEP 1: Authenticate Dr. Priya Nair (Apollo Hospitals)
    // -------------------------------------------------------------
    console.log('[STAGE 1] Authenticating Doctor 1: Dr. Priya Nair (Apollo Hospitals)...');
    const doc1LoginRes = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/v1/hospitals/doctor/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      hospitalId: 'hosp-apollo-01',
      licenseNumber: 'MCI-2012-44120',
      password: 'doctorSecure2026!'
    });

    assert(doc1LoginRes.statusCode === 200, `Doctor 1 Login Status 200 (Got ${doc1LoginRes.statusCode})`);
    const doc1Token = doc1LoginRes.body?.data?.token;
    assert(!!doc1Token, `Doctor 1 JWT Token Issued: ${doc1Token ? doc1Token.substring(0, 20) + '...' : 'none'}`);

    // -------------------------------------------------------------
    // STEP 2: Authenticate Dr. Sunita Rao (Fortis Hospital)
    // -------------------------------------------------------------
    console.log('\n[STAGE 2] Authenticating Doctor 2: Dr. Sunita Rao (Fortis Hospital)...');
    const doc2LoginRes = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/v1/hospitals/doctor/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      hospitalId: 'hosp-fortis-02',
      licenseNumber: 'MCI-2010-88421',
      password: 'doctorSecure2026!'
    });

    assert(doc2LoginRes.statusCode === 200, `Doctor 2 Login Status 200 (Got ${doc2LoginRes.statusCode})`);
    const doc2Token = doc2LoginRes.body?.data?.token;
    assert(!!doc2Token, `Doctor 2 JWT Token Issued: ${doc2Token ? doc2Token.substring(0, 20) + '...' : 'none'}`);

    // -------------------------------------------------------------
    // STEP 3: Doctor Roster Filtering Test (GET /api/v1/doctor/patients)
    // -------------------------------------------------------------
    console.log('\n[STAGE 3] Verifying Roster Isolation for Dr. Priya Nair...');
    const doc1RosterRes = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/v1/doctor/patients',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${doc1Token}` }
    });

    assert(doc1RosterRes.statusCode === 200, `Dr. Priya Nair Roster Status 200`);
    const doc1Patients = doc1RosterRes.body?.data || [];
    const doc1PatientIds = doc1Patients.map(p => p.id);
    console.log(`  -> Dr. Priya Nair Roster contains ${doc1Patients.length} patients:`, doc1PatientIds);

    assert(doc1PatientIds.includes('pat-demo-001'), `Dr. Priya Nair sees assigned Patient 1 (Rahul Sharma)`);
    assert(doc1PatientIds.includes('pat-demo-002'), `Dr. Priya Nair sees assigned Patient 2 (Priya Patel)`);
    assert(!doc1PatientIds.includes('pat-demo-003'), `Dr. Priya Nair CANNOT see unassigned Patient 3 (Amit Verma - belongs to Dr. Sunita Rao)`);
    assert(!doc1PatientIds.includes('pat-demo-004'), `Dr. Priya Nair CANNOT see unassigned Patient 4 (Sunita Roy - belongs to Prof. Verma)`);

    console.log('\n[STAGE 4] Verifying Roster Isolation for Dr. Sunita Rao...');
    const doc2RosterRes = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/v1/doctor/patients',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${doc2Token}` }
    });

    assert(doc2RosterRes.statusCode === 200, `Dr. Sunita Rao Roster Status 200`);
    const doc2Patients = doc2RosterRes.body?.data || [];
    const doc2PatientIds = doc2Patients.map(p => p.id);
    console.log(`  -> Dr. Sunita Rao Roster contains ${doc2Patients.length} patients:`, doc2PatientIds);

    assert(doc2PatientIds.includes('pat-demo-003'), `Dr. Sunita Rao sees assigned Patient 3 (Amit Verma)`);
    assert(!doc2PatientIds.includes('pat-demo-001'), `Dr. Sunita Rao CANNOT see Patient 1 (Rahul Sharma)`);
    assert(!doc2PatientIds.includes('pat-demo-002'), `Dr. Sunita Rao CANNOT see Patient 2 (Priya Patel)`);

    // -------------------------------------------------------------
    // STEP 4: Deep Clinical Access Control Tests (Dossier, FHIR, Notes)
    // -------------------------------------------------------------
    console.log('\n[STAGE 5] Testing Direct Endpoint Isolation & Cross-Doctor Boundary Defense...');

    // 4A: Dr. Priya Nair accesses assigned Patient 1 -> ALLOW (200)
    const doc1Pat1Dossier = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/v1/doctor/patients/pat-demo-001/dossier',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${doc1Token}` }
    });
    assert(doc1Pat1Dossier.statusCode === 200, `Dr. Priya Nair ALLOWED to read assigned Patient 1 dossier (Status 200)`);

    // 4B: Dr. Priya Nair attempts to read unassigned Patient 3 -> DENY (403)
    const doc1Pat3Dossier = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/v1/doctor/patients/pat-demo-003/dossier',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${doc1Token}` }
    });
    assert(doc1Pat3Dossier.statusCode === 403, `Dr. Priya Nair DENIED unassigned Patient 3 dossier (Got 403 Forbidden)`);
    assert(doc1Pat3Dossier.body?.error?.code === 'FORBIDDEN_DOCTOR_PATIENT_ACCESS', `Error code correctly set to FORBIDDEN_DOCTOR_PATIENT_ACCESS`);

    // 4C: Dr. Priya Nair attempts to export FHIR bundle for Patient 3 -> DENY (403)
    const doc1Pat3Fhir = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/v1/doctor/patients/pat-demo-003/fhir-export',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${doc1Token}` }
    });
    assert(doc1Pat3Fhir.statusCode === 403, `Dr. Priya Nair DENIED unassigned Patient 3 FHIR export (Status 403)`);

    // 4D: Dr. Priya Nair attempts to write clinical consultation note to Patient 3 -> DENY (403)
    const doc1Pat3Note = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/v1/doctor/patients/pat-demo-003/notes',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${doc1Token}`,
        'Content-Type': 'application/json'
      }
    }, {
      content: 'Unauthorized consultation note attempt by unassigned doctor.',
      assessmentType: 'ROUTINE_REVIEW'
    });
    assert(doc1Pat3Note.statusCode === 403, `Dr. Priya Nair DENIED writing notes to unassigned Patient 3 (Status 403)`);

    // 4E: Dr. Sunita Rao accesses assigned Patient 3 -> ALLOW (200)
    const doc2Pat3Dossier = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/v1/doctor/patients/pat-demo-003/dossier',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${doc2Token}` }
    });
    assert(doc2Pat3Dossier.statusCode === 200, `Dr. Sunita Rao ALLOWED to read assigned Patient 3 dossier (Status 200)`);

    // 4F: Dr. Sunita Rao attempts to access Patient 1 -> DENY (403)
    const doc2Pat1Dossier = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/v1/doctor/patients/pat-demo-001/dossier',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${doc2Token}` }
    });
    assert(doc2Pat1Dossier.statusCode === 403, `Dr. Sunita Rao DENIED access to Patient 1 dossier (Status 403)`);

    // -------------------------------------------------------------
    // STEP 5: Dynamic Patient Onboarding and Assignment Propagation
    // -------------------------------------------------------------
    console.log('\n[STAGE 6] Testing Dynamic Patient Assignment via Onboarding...');
    // Hospital onboards Vikram Malhotra (MED-00010005) specifically to Dr. Sunita Rao
    const onboardRes = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/v1/hospitals/onboard-patient-to-doctor',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${doc2Token}`,
        'Content-Type': 'application/json'
      }
    }, {
      healthId: 'MED-00010005',
      hospitalId: 'hosp-fortis-02',
      doctorName: 'Dr. Sunita Rao',
      department: 'Cardiology',
      chiefComplaint: 'Post-CABG Follow up Consultation',
      priority: 'Urgent'
    });

    assert(onboardRes.statusCode === 200, `Patient MED-00010005 successfully onboarded to Dr. Sunita Rao`);
    assert(onboardRes.body?.data?.assignedDoctor === 'Dr. Sunita Rao', `Assigned doctor matches Dr. Sunita Rao`);

    // Check Dr. Sunita Rao's updated roster
    const doc2UpdatedRoster = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/v1/doctor/patients',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${doc2Token}` }
    });
    const doc2UpdatedIds = (doc2UpdatedRoster.body?.data || []).map(p => p.id);
    assert(doc2UpdatedIds.includes('pat-demo-005'), `Dr. Sunita Rao now sees freshly assigned Patient 5 (Vikram Malhotra)`);

    // Check that Dr. Priya Nair CANNOT access this newly onboarded Patient 5
    const doc1Pat5Access = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/v1/doctor/patients/pat-demo-005/dossier',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${doc1Token}` }
    });
    assert(doc1Pat5Access.statusCode === 403, `Dr. Priya Nair DENIED access to Dr. Sunita Rao's newly onboarded patient (Status 403)`);

    // -------------------------------------------------------------
    // SUMMARY
    // -------------------------------------------------------------
    console.log('\n================================================================');
    console.log(`TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
    console.log('================================================================\n');

    if (failed === 0) {
      console.log('SUCCESS: All Doctor-Patient isolation and boundary checks PASSED with 100% compliance.');
      process.exit(0);
    } else {
      console.error('FAILURE: Some tests failed.');
      process.exit(1);
    }
  } catch (err) {
    console.error('Fatal execution error during tests:', err);
    process.exit(1);
  }
}

runTests();
