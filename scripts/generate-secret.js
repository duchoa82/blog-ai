#!/usr/bin/env node

import crypto from 'crypto';

// Generate a strong random secret for session
const generateSecret = () => {
  return crypto.randomBytes(64).toString('hex');
};

// Generate multiple secrets for different environments
console.log('🔐 Generating strong session secrets...\n');

const productionSecret = generateSecret();
const developmentSecret = generateSecret();

console.log('📋 Production SESSION_SECRET:');
console.log(`SESSION_SECRET=${productionSecret}\n`);

console.log('📋 Development SESSION_SECRET:');
console.log(`SESSION_SECRET=${developmentSecret}\n`);

console.log('💡 Copy these to your .env files');
console.log('⚠️  Keep these secrets secure and never commit them to version control');
