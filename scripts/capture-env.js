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
  console.log('Current working directory:', process.cwd());
  console.log('Total env vars available:', Object.keys(process.env).length);
  
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

  // Generate .env.production file that Next.js will automatically load
  const envLines = Object.entries(envVars).map(([key, value]) => {
    // Escape special characters in values
    const escapedValue = value.replace(/"/g, '\\"').replace(/\n/g, '\\n');
    return `${key}="${escapedValue}"`;
  });
  
  const envContent = `# Runtime environment variables
# Auto-generated during build by scripts/capture-env.js
# DO NOT EDIT MANUALLY

${envLines.join('\n')}\n`;

  // Write to .env.production file
  const outputPath = path.join(process.cwd(), '.env.production');
  fs.writeFileSync(outputPath, envContent, 'utf-8');
  
  console.log(`\n✅ Generated .env.production with ${capturedCount} variables`);
  console.log(`📄 Location: ${outputPath}`);
  console.log(`📄 File size: ${fs.statSync(outputPath).size} bytes`);
  
  if (missingVars.length > 0) {
    console.warn(`⚠️  Warning: ${missingVars.length} variables were missing: ${missingVars.join(', ')}`);
  }
  
  // Log first few lines of generated file for verification
  const fileContent = fs.readFileSync(outputPath, 'utf-8');
  const lines = fileContent.split('\n').slice(0, 15);
  console.log('\n📝 Generated file preview:');
  lines.forEach(line => console.log('  ' + line));
  
  // Verify file was created
  if (!fs.existsSync(outputPath)) {
    console.error('❌ Failed to create .env.production file!');
    process.exit(1);
  }
}

try {
  captureEnvironmentVariables();
} catch (error) {
  console.error('❌ Error capturing environment variables:', error);
  process.exit(1);
}
