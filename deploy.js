#!/usr/bin/env node

/**
 * Bitcoin Agent Deployment Script
 * 
 * This script handles deployment of the Bitcoin agent to bitte.ai
 * It sets the correct deployment URL and manages the AI plugin configuration
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const DEPLOYMENT_URL = 'https://bitcoin-agent.bitte.ai';

// Paths to plugin configuration files
const aiPluginPath = path.join(__dirname, 'public', '.well-known', 'ai-plugin.json');
const openApiPath = path.join(__dirname, 'public', 'api', 'openapi.json');

console.log('📦 Bitcoin Agent Deployment');
console.log('---------------------------');

try {
  console.log('🔄 Preparing plugin configuration...');
  
  // Ensure directories exist
  const wellKnownDir = path.join(__dirname, 'public', '.well-known');
  const apiDir = path.join(__dirname, 'public', 'api');
  
  if (!fs.existsSync(wellKnownDir)) {
    fs.mkdirSync(wellKnownDir, { recursive: true });
    console.log('✅ Created .well-known directory');
  }
  
  if (!fs.existsSync(apiDir)) {
    fs.mkdirSync(apiDir, { recursive: true });
    console.log('✅ Created api directory');
  }
  
  // Update AI Plugin configuration
  if (fs.existsSync(aiPluginPath)) {
    const aiPluginConfig = JSON.parse(fs.readFileSync(aiPluginPath, 'utf8'));
    
    aiPluginConfig.api.url = `${DEPLOYMENT_URL}/api/openapi.json`;
    aiPluginConfig.logo_url = `${DEPLOYMENT_URL}/logo.png`;
    aiPluginConfig.legal_info_url = `${DEPLOYMENT_URL}/legal`;
    
    fs.writeFileSync(aiPluginPath, JSON.stringify(aiPluginConfig, null, 2));
    console.log('✅ Updated AI Plugin configuration');
  } else {
    console.warn('⚠️ AI Plugin configuration not found at', aiPluginPath);
  }
  
  // Update OpenAPI configuration
  if (fs.existsSync(openApiPath)) {
    const openApiConfig = JSON.parse(fs.readFileSync(openApiPath, 'utf8'));
    
    if (openApiConfig.servers && openApiConfig.servers.length > 0) {
      openApiConfig.servers[0].url = DEPLOYMENT_URL;
    } else {
      openApiConfig.servers = [{ url: DEPLOYMENT_URL }];
    }
    
    fs.writeFileSync(openApiPath, JSON.stringify(openApiConfig, null, 2));
    console.log('✅ Updated OpenAPI configuration');
  } else {
    console.warn('⚠️ OpenAPI configuration not found at', openApiPath);
  }
  
  // Build the application
  console.log('🔄 Building application...');
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build complete');
  
  // Deploy to bitte.ai
  console.log('🔄 Deploying to bitte.ai...');
  execSync(`npx make-agent deploy -u ${DEPLOYMENT_URL}`, { stdio: 'inherit' });
  console.log('✅ Deployment complete');
  
  console.log('---------------------------');
  console.log(`🚀 Bitcoin Agent deployed to ${DEPLOYMENT_URL}`);
  
} catch (error) {
  console.error('❌ Deployment failed:', error.message);
  process.exit(1);
} 