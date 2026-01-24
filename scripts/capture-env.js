#!/usr/bin/env node

/**
 * This script captures environment variables during build time
 * and generates a JavaScript module that injects them at runtime.
 * 
 * Run this during the build phase in amplify.yml BEFORE building Next.js
 */

const fs = require('fs');
const path = require('path');

const ENV_VARS_TO_CAPTURE = [
  'DATABASE_URL',
  'NEXTAUTH_URL',
  'NEXTAUTH_SECRET',
  'AUTH_SECRET',
  'AUTH_TRUST_HOST',
  'R2_ENDPOINT',
  'R2_ACCESS_KEY_ID',
  'R2_SECRET_ACCESS_KEY',
  'R2_BUCKET_NAME',
  'R2_PUBLIC_URL',
  'NODE_ENV',
];

function captureEnvironmentVariables() {
  const envVars = {};
  let capturedCount = 0;
  let missingVars = [];

  console.log('🔍 Capturing environment variables for runtime injection...');
  
  ENV_VARS_TO_CAPTURE.forEach((varName) => {
    const value = process.env[varName];
    if (value) {
      envVars[varName] = value;
      capturedCount++;
      console.log(`✓ Captured: ${varName}`);
    } else {
      missingVars.push(varName);
      console.warn(`⚠ Missing: ${varName}`);
    }
  });

  // Generate JavaScript module that sets environment variables
  const jsContent = `/**
 * Runtime environment variables
 * Auto-generated during build by scripts/capture-env.js
 * DO NOT EDIT MANUALLY
 */

// Inject environment variables into process.env at runtime
const runtimeEnv = ${JSON.stringify(envVars, null, 2)};

Object.keys(runtimeEnv).forEach((key) => {
  if (!process.env[key]) {
    process.env[key] = runtimeEnv[key];
  }
});

console.log('✅ Runtime environment variables loaded:', Object.keys(runtimeEnv).length);

module.exports = runtimeEnv;
`;

  // Write to env-runtime.js file
  const outputPath = path.join(process.cwd(), 'env-runtime.js');
  fs.writeFileSync(outputPath, jsContent, 'utf-8');
  
  console.log(`\n✅ Generated runtime env module with ${capturedCount} variables`);
  console.log(`📄 Location: ${outputPath}`);
  
  if (missingVars.length > 0) {
    console.warn(`⚠️  Warning: ${missingVars.length} variables were missing: ${missingVars.join(', ')}`);
  }
  
  // Verify file was created
  if (!fs.existsSync(outputPath)) {
    console.error('❌ Failed to create env-runtime.js file!');
    process.exit(1);
  }
}

try {
  captureEnvironmentVariables();
} catch (error) {
  console.error('❌ Error capturing environment variables:', error);
  process.exit(1);
}
