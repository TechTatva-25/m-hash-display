#!/usr/bin/env node

/**
 * Configuration Switcher for Manipal Hackathon 2025
 * 
 * This script switches between test and production configurations.
 * 
 * Usage:
 *   node switch-config.js test    - Switch to test mode (1-minute intervals)
 *   node switch-config.js prod    - Switch to production mode (real timeline)
 */

const fs = require('fs');
const path = require('path');

const mode = process.argv[2];

if (!mode || !['test', 'prod'].includes(mode)) {
    console.log('❌ Usage: node switch-config.js [test|prod]');
    console.log('');
    console.log('  test  - Switch to test mode (1-minute intervals starting at 1:50 AM today)');
    console.log('  prod  - Switch to production mode (real hackathon timeline)');
    process.exit(1);
}

try {
    if (mode === 'test') {
        // Switch to test config (never overwrites production backup)
        if (fs.existsSync('hackathon-config-test.json')) {
            fs.copyFileSync('hackathon-config-test.json', 'hackathon-config.json');
            console.log('🧪 Switched to TEST mode with TTS Audio');
            console.log('   - All events start at 1:50 AM today (Oct 8, 2025)');
            console.log('   - Each event lasts 1 minute');
            console.log('   - Text-to-Speech announcements enabled');
            console.log('   - Perfect for demo and testing audio transitions');
            console.log('');
            console.log('🚀 Run "npm start" to see the test display');
            console.log('⏰ Events will transition every minute starting at 1:50 AM');
            console.log('🎙️ Listen for TTS announcements at round transitions');
            console.log('⚠️  Production config is safely preserved in backup');
        } else {
            console.log('❌ Test configuration file not found: hackathon-config-test.json');
        }
    } else if (mode === 'prod') {
        // Switch to production config
        if (fs.existsSync('hackathon-config-backup.json')) {
            fs.copyFileSync('hackathon-config-backup.json', 'hackathon-config.json');
            console.log('🎪 Switched to PRODUCTION mode');
            console.log('   - Real hackathon timeline (Oct 8-10, 2025)');
            console.log('   - Official Manipal Hackathon 2025 schedule');
            console.log('   - Actual event durations and timings');
            console.log('');
            console.log('🚀 Run "npm start" to see the production display');
            console.log('📅 Hackathon runs Oct 8-10, 2025');
        } else {
            console.log('❌ Production backup not found. Creating from current config...');
            // Create backup from current config if it doesn't exist
            if (fs.existsSync('hackathon-config.json')) {
                fs.copyFileSync('hackathon-config.json', 'hackathon-config-backup.json');
                console.log('📋 Created production backup from current config');
            } else {
                console.log('❌ No configuration files found. Please check your setup.');
            }
        }
    }

} catch (error) {
    console.error('❌ Error switching configuration:', error.message);
    process.exit(1);
}
