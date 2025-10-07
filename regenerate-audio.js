#!/usr/bin/env node

/**
 * Audio Regeneration Script for Manipal Hackathon 2025
 * 
 * This script regenerates all audio files using Windows PowerShell TTS.
 * Run this if you need to update audio files or if they're missing.
 * 
 * Usage: node regenerate-audio.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🎵 Regenerating audio files for Manipal Hackathon 2025...\n');

// Ensure audio directory exists
if (!fs.existsSync('audio')) {
    fs.mkdirSync('audio');
    console.log('📁 Created audio directory');
}

try {
    // Load configuration
    const config = JSON.parse(fs.readFileSync('hackathon-config.json', 'utf8'));
    console.log('📋 Loaded hackathon configuration\n');

    // Generate round-start.wav
    console.log('🔊 Generating round-start.wav...');
    execSync('powershell -Command "Add-Type -AssemblyName System.Speech; (New-Object System.Speech.Synthesis.SpeechSynthesizer).Speak(\'Starting now\') | Out-File -FilePath audio/round-start.wav -Encoding Unicode"');
    console.log('✅ Generated round-start.wav');

    // Generate round-end.wav
    console.log('🔊 Generating round-end.wav...');
    execSync('powershell -Command "Add-Type -AssemblyName System.Speech; (New-Object System.Speech.Synthesis.SpeechSynthesizer).Speak(\'Round over\') | Out-File -FilePath audio/round-end.wav -Encoding Unicode"');
    console.log('✅ Generated round-end.wav');

    // Generate round-specific audio files
    if (config.audio && config.audio.rounds) {
        console.log('\n🔊 Generating round-specific audio files...');
        
        Object.keys(config.audio.rounds).forEach(roundId => {
            const round = config.rounds.find(r => r.id === roundId);
            if (round) {
                const audioFile = config.audio.rounds[roundId];
                console.log(`   Generating ${audioFile} for "${round.name}"...`);
                
                try {
                    execSync(`powershell -Command "Add-Type -AssemblyName System.Speech; (New-Object System.Speech.Synthesis.SpeechSynthesizer).Speak('${round.name}') | Out-File -FilePath audio/${audioFile} -Encoding Unicode"`);
                    console.log(`   ✅ Generated ${audioFile}`);
                } catch (error) {
                    console.log(`   ❌ Failed to generate ${audioFile}: ${error.message}`);
                }
            }
        });
    }

    console.log('\n🎉 Audio regeneration complete!');
    console.log('📁 All audio files are now in the audio/ directory');
    console.log('🚀 Run "npm start" to test the application');

} catch (error) {
    console.error('❌ Error regenerating audio files:', error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('   - Ensure you\'re running on Windows with PowerShell');
    console.log('   - Check that hackathon-config.json exists and is valid');
    console.log('   - Make sure you have write permissions in the project directory');
    process.exit(1);
}
