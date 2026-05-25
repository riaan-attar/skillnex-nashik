#!/usr/bin/env node

/**
 * Supabase Integration Verification Script
 * 
 * This script verifies that Supabase integration is correctly configured for Vercel deployment.
 * It checks:
 * 1. Supabase client can be initialized with VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY
 * 2. The client is accessible from client-side code
 * 3. Server-side code can access SUPABASE_SERVICE_ROLE_KEY for privileged operations
 * 4. vercel.json has all required environment variables
 * 
 * Requirements: 9.1, 9.2, 9.3, 9.4
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const RESET = '\x1b[0m';
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const BLUE = '\x1b[34m';

let passCount = 0;
let failCount = 0;

function log(message, color = RESET) {
  console.log(`${color}${message}${RESET}`);
}

function pass(message) {
  passCount++;
  log(`✓ ${message}`, GREEN);
}

function fail(message) {
  failCount++;
  log(`✗ ${message}`, RED);
}

function info(message) {
  log(`ℹ ${message}`, BLUE);
}

function section(title) {
  log(`\n${title}`, YELLOW);
  log('='.repeat(title.length), YELLOW);
}

// Test 1: Verify vercel.json configuration
section('Test 1: Verify vercel.json Configuration');

try {
  const vercelPath = path.join(__dirname, 'vercel.json');
  const vercelContent = fs.readFileSync(vercelPath, 'utf-8');
  const vercelConfig = JSON.parse(vercelContent);

  // Check buildCommand
  if (vercelConfig.buildCommand === 'npm run build') {
    pass('buildCommand is set to "npm run build"');
  } else {
    fail(`buildCommand is "${vercelConfig.buildCommand}", expected "npm run build"`);
  }

  // Check outputDirectory
  if (vercelConfig.outputDirectory === 'dist') {
    pass('outputDirectory is set to "dist"');
  } else {
    fail(`outputDirectory is "${vercelConfig.outputDirectory}", expected "dist"`);
  }

  // Check framework
  if (vercelConfig.framework === 'vite') {
    pass('framework is set to "vite"');
  } else {
    fail(`framework is "${vercelConfig.framework}", expected "vite"`);
  }

  // Check environment variables
  const requiredEnvVars = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_PUBLISHABLE_KEY',
    'SUPABASE_SERVICE_ROLE_KEY'
  ];

  const envSection = vercelConfig.env || {};
  for (const envVar of requiredEnvVars) {
    if (envSection[envVar]) {
      pass(`Environment variable "${envVar}" is configured in vercel.json`);
    } else {
      fail(`Environment variable "${envVar}" is missing from vercel.json`);
    }
  }

  // Check Vercel secret references
  if (envSection.VITE_SUPABASE_URL === '@vite_supabase_url') {
    pass('VITE_SUPABASE_URL uses correct Vercel secret reference');
  } else {
    fail(`VITE_SUPABASE_URL has incorrect reference: ${envSection.VITE_SUPABASE_URL}`);
  }

  if (envSection.VITE_SUPABASE_PUBLISHABLE_KEY === '@vite_supabase_publishable_key') {
    pass('VITE_SUPABASE_PUBLISHABLE_KEY uses correct Vercel secret reference');
  } else {
    fail(`VITE_SUPABASE_PUBLISHABLE_KEY has incorrect reference: ${envSection.VITE_SUPABASE_PUBLISHABLE_KEY}`);
  }

  if (envSection.SUPABASE_SERVICE_ROLE_KEY === '@supabase_service_role_key') {
    pass('SUPABASE_SERVICE_ROLE_KEY uses correct Vercel secret reference');
  } else {
    fail(`SUPABASE_SERVICE_ROLE_KEY has incorrect reference: ${envSection.SUPABASE_SERVICE_ROLE_KEY}`);
  }
} catch (error) {
  fail(`Failed to read or parse vercel.json: ${error.message}`);
}

// Test 2: Verify Supabase client files exist
section('Test 2: Verify Supabase Client Files');

const clientFiles = [
  'src/integrations/supabase/client.ts',
  'src/integrations/supabase/client.server.ts',
  'src/integrations/supabase/types.ts'
];

for (const file of clientFiles) {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    pass(`${file} exists`);
  } else {
    fail(`${file} does not exist`);
  }
}

// Test 3: Verify client.ts configuration
section('Test 3: Verify Client-Side Supabase Configuration');

try {
  const clientPath = path.join(__dirname, 'src/integrations/supabase/client.ts');
  const clientContent = fs.readFileSync(clientPath, 'utf-8');

  if (clientContent.includes('VITE_SUPABASE_URL')) {
    pass('client.ts uses VITE_SUPABASE_URL');
  } else {
    fail('client.ts does not reference VITE_SUPABASE_URL');
  }

  if (clientContent.includes('VITE_SUPABASE_PUBLISHABLE_KEY')) {
    pass('client.ts uses VITE_SUPABASE_PUBLISHABLE_KEY');
  } else {
    fail('client.ts does not reference VITE_SUPABASE_PUBLISHABLE_KEY');
  }

  if (clientContent.includes('import.meta.env')) {
    pass('client.ts uses import.meta.env for client-side variables');
  } else {
    fail('client.ts does not use import.meta.env');
  }

  if (clientContent.includes('createClient')) {
    pass('client.ts creates Supabase client');
  } else {
    fail('client.ts does not create Supabase client');
  }

  if (clientContent.includes('export const supabase')) {
    pass('client.ts exports supabase client');
  } else {
    fail('client.ts does not export supabase client');
  }
} catch (error) {
  fail(`Failed to verify client.ts: ${error.message}`);
}

// Test 4: Verify client.server.ts configuration
section('Test 4: Verify Server-Side Supabase Configuration');

try {
  const serverClientPath = path.join(__dirname, 'src/integrations/supabase/client.server.ts');
  const serverClientContent = fs.readFileSync(serverClientPath, 'utf-8');

  if (serverClientContent.includes('SUPABASE_SERVICE_ROLE_KEY')) {
    pass('client.server.ts uses SUPABASE_SERVICE_ROLE_KEY');
  } else {
    fail('client.server.ts does not reference SUPABASE_SERVICE_ROLE_KEY');
  }

  if (serverClientContent.includes('process.env')) {
    pass('client.server.ts uses process.env for server-side variables');
  } else {
    fail('client.server.ts does not use process.env');
  }

  if (serverClientContent.includes('createClient')) {
    pass('client.server.ts creates Supabase admin client');
  } else {
    fail('client.server.ts does not create Supabase admin client');
  }

  if (serverClientContent.includes('export const supabaseAdmin')) {
    pass('client.server.ts exports supabaseAdmin client');
  } else {
    fail('client.server.ts does not export supabaseAdmin client');
  }

  if (serverClientContent.includes('persistSession: false')) {
    pass('client.server.ts disables session persistence for server-side');
  } else {
    fail('client.server.ts does not disable session persistence');
  }
} catch (error) {
  fail(`Failed to verify client.server.ts: ${error.message}`);
}

// Test 5: Verify build output
section('Test 5: Verify Build Output Structure');

try {
  const distPath = path.join(__dirname, 'dist');
  if (fs.existsSync(distPath)) {
    pass('dist directory exists');
  } else {
    fail('dist directory does not exist');
  }

  const serverPath = path.join(distPath, 'server');
  if (fs.existsSync(serverPath)) {
    pass('dist/server directory exists');
  } else {
    fail('dist/server directory does not exist');
  }

  const serverJsPath = path.join(serverPath, 'server.js');
  if (fs.existsSync(serverJsPath)) {
    pass('dist/server/server.js exists');
    
    // Verify server.js exports default fetch handler
    const serverJsContent = fs.readFileSync(serverJsPath, 'utf-8');
    if (serverJsContent.includes('async fetch') && serverJsContent.includes('export')) {
      pass('dist/server/server.js exports fetch handler');
    } else {
      fail('dist/server/server.js does not export fetch handler');
    }
  } else {
    fail('dist/server/server.js does not exist');
  }

  const clientPath = path.join(distPath, 'client');
  if (fs.existsSync(clientPath)) {
    pass('dist/client directory exists');
  } else {
    fail('dist/client directory does not exist');
  }

  const assetsPath = path.join(clientPath, 'assets');
  if (fs.existsSync(assetsPath)) {
    pass('dist/client/assets directory exists');
  } else {
    fail('dist/client/assets directory does not exist');
  }
} catch (error) {
  fail(`Failed to verify build output: ${error.message}`);
}

// Test 6: Verify server entry point
section('Test 6: Verify Server Entry Point Compatibility');

try {
  const serverPath = path.join(__dirname, 'src/server.ts');
  const serverContent = fs.readFileSync(serverPath, 'utf-8');

  if (serverContent.includes('export default')) {
    pass('src/server.ts exports default');
  } else {
    fail('src/server.ts does not export default');
  }

  if (serverContent.includes('async fetch')) {
    pass('src/server.ts has async fetch method');
  } else {
    fail('src/server.ts does not have async fetch method');
  }

  if (serverContent.includes('(request: Request, env: unknown, ctx: unknown)')) {
    pass('src/server.ts fetch method has correct signature');
  } else {
    fail('src/server.ts fetch method has incorrect signature');
  }

  if (serverContent.includes('Promise<Response>')) {
    pass('src/server.ts fetch method returns Promise<Response>');
  } else {
    fail('src/server.ts fetch method does not return Promise<Response>');
  }

  if (serverContent.includes('try') && serverContent.includes('catch')) {
    pass('src/server.ts has error handling');
  } else {
    fail('src/server.ts does not have error handling');
  }
} catch (error) {
  fail(`Failed to verify server entry point: ${error.message}`);
}

// Test 7: Verify no Cloudflare references
section('Test 7: Verify No Cloudflare References');

const filesToCheck = [
  'package.json',
  'vite.config.ts',
  'vercel.json'
];

for (const file of filesToCheck) {
  try {
    const filePath = path.join(__dirname, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    
    const hasCloudflareRef = content.toLowerCase().includes('cloudflare') || 
                             content.toLowerCase().includes('wrangler');
    
    if (!hasCloudflareRef) {
      pass(`${file} has no Cloudflare references`);
    } else {
      fail(`${file} contains Cloudflare references`);
    }
  } catch (error) {
    fail(`Failed to check ${file}: ${error.message}`);
  }
}

// Summary
section('Summary');

const total = passCount + failCount;
const percentage = total > 0 ? Math.round((passCount / total) * 100) : 0;

log(`\nTests passed: ${passCount}/${total} (${percentage}%)`);

if (failCount === 0) {
  log('\n✓ All Supabase integration tests passed!', GREEN);
  log('The application is ready for Vercel deployment.', GREEN);
  process.exit(0);
} else {
  log(`\n✗ ${failCount} test(s) failed.`, RED);
  log('Please fix the issues above before deploying to Vercel.', RED);
  process.exit(1);
}
