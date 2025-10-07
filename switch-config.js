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
    console.log('  test  - Switch to test mode (1-minute intervals starting at 12:10 PM today)');
    console.log('  prod  - Switch to production mode (real hackathon timeline)');
    process.exit(1);
}

try {
    // Backup current config
    if (fs.existsSync('hackathon-config.json')) {
        fs.copyFileSync('hackathon-config.json', 'hackathon-config-backup.json');
        console.log('📋 Backed up current configuration');
    }

    if (mode === 'test') {
        // Switch to test config
        fs.copyFileSync('hackathon-config-test.json', 'hackathon-config.json');
        console.log('🧪 Switched to TEST mode');
        console.log('   - All events start at 12:10 PM today');
        console.log('   - Each event lasts 1 minute');
        console.log('   - Perfect for demo and testing');
        console.log('');
        console.log('🚀 Run "npm start" to see the test display');
        console.log('⏰ Events will transition every minute starting at 12:10 PM');
    } else if (mode === 'prod') {
        // Switch to production config
        if (fs.existsSync('hackathon-config-backup.json')) {
            fs.copyFileSync('hackathon-config-backup.json', 'hackathon-config.json');
            console.log('🎪 Switched to PRODUCTION mode');
            console.log('   - Real hackathon timeline (Oct 8-10, 2025)');
            console.log('   - Actual event durations');
            console.log('');
            console.log('🚀 Run "npm start" to see the production display');
        } else {
            console.log('❌ No backup configuration found. Please restore manually.');
        }
    }

} catch (error) {
    console.error('❌ Error switching configuration:', error.message);
    process.exit(1);
}
