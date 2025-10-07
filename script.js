class HackathonStatusDisplay {
    constructor() {
        this.config = null;
        this.currentRound = null;
        this.nextRound = null;
        this.timer = null;
        this.audioContext = null;
        this.isAudioEnabled = true;
        this.isPlayingAudio = false;
        this.lastAnnouncedRound = null;
        this.audioUnlocked = false; // Track if user has interacted with the page
        this.hasTriggeredStartAudio = {}; // Track which rounds have triggered start audio
        this.hasTriggeredEndAudio = {}; // Track which rounds have triggered end audio
        this.audioQueue = []; // Queue for audio playback
        
        this.init();
    }

    async init() {
        await this.loadConfig();
        this.createParticles();
        this.updateDisplay();
        this.startTimer();
        this.setupAudio();
    }

    async loadConfig() {
        try {
            const response = await fetch('hackathon-config.json');
            this.config = await response.json();
            console.log('Configuration loaded successfully');
        } catch (error) {
            console.error('Error loading configuration:', error);
            // Fallback configuration
            this.config = {
                hackathon: {
                    name: "Manipal Hackathon 2025",
                    theme: "Code for Coexistence",
                    institute: "Manipal Institute of Technology"
                },
                rounds: []
            };
        }
    }

    createParticles() {
        const particlesContainer = document.getElementById('particles');
        const particleCount = 50;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Random size between 2px and 6px
            const size = Math.random() * 4 + 2;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            
            // Random position
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            
            // Random animation delay
            particle.style.animationDelay = `${Math.random() * 6}s`;
            particle.style.animationDuration = `${Math.random() * 3 + 4}s`;
            
            particlesContainer.appendChild(particle);
        }
    }

    updateDisplay() {
        const now = new Date();
        const rounds = this.config.rounds;
        
        // Find current and next rounds
        this.currentRound = this.findCurrentRound(rounds, now);
        this.nextRound = this.findNextRound(rounds, now);
        
        this.updateCurrentRound();
        this.updateNextRound();
        this.updateProgress();
    }

    findCurrentRound(rounds, now) {
        for (let i = 0; i < rounds.length; i++) {
            const round = rounds[i];
            const startTime = new Date(round.startTime);
            const endTime = new Date(round.endTime);
            
            if (now >= startTime && now <= endTime) {
                return round;
            }
        }
        return null;
    }

    findNextRound(rounds, now) {
        for (let i = 0; i < rounds.length; i++) {
            const round = rounds[i];
            const startTime = new Date(round.startTime);
            
            if (startTime > now) {
                return round;
            }
        }
        return null;
    }

    updateCurrentRound() {
        const roundNameEl = document.getElementById('roundName');
        const roundStatusEl = document.getElementById('roundStatus');
        const startTimeEl = document.getElementById('startTime');
        const endTimeEl = document.getElementById('endTime');
        const statusIndicatorEl = document.getElementById('statusIndicator');
        
        if (this.currentRound) {
            roundNameEl.textContent = this.currentRound.name;
            roundStatusEl.textContent = 'Live Now';
            startTimeEl.textContent = this.formatTime(new Date(this.currentRound.startTime));
            endTimeEl.textContent = this.formatTime(new Date(this.currentRound.endTime));
            statusIndicatorEl.className = 'status-indicator status-live';
            
            // Add pulse animation for live rounds
            document.getElementById('currentRound').classList.add('pulse');
        } else {
            roundNameEl.textContent = 'Hackathon Not Started';
            roundStatusEl.textContent = 'Upcoming';
            startTimeEl.textContent = '--:--';
            endTimeEl.textContent = '--:--';
            statusIndicatorEl.className = 'status-indicator status-upcoming';
            document.getElementById('currentRound').classList.remove('pulse');
        }
    }

    updateNextRound() {
        const nextRoundNameEl = document.getElementById('nextRoundName');
        const nextRoundTimeEl = document.getElementById('nextRoundTime');
        
        if (this.nextRound) {
            nextRoundNameEl.textContent = this.nextRound.name;
            nextRoundTimeEl.textContent = this.formatTime(new Date(this.nextRound.startTime));
        } else {
            nextRoundNameEl.textContent = 'Hackathon Ended';
            nextRoundTimeEl.textContent = '--:--';
        }
    }

    updateProgress() {
        if (!this.currentRound) {
            document.getElementById('progressFill').style.width = '0%';
            document.getElementById('progressText').textContent = '0% Complete';
            return;
        }

        const now = new Date();
        const startTime = new Date(this.currentRound.startTime);
        const endTime = new Date(this.currentRound.endTime);
        
        const totalDuration = endTime - startTime;
        const elapsed = now - startTime;
        const progress = Math.min(Math.max((elapsed / totalDuration) * 100, 0), 100);
        
        document.getElementById('progressFill').style.width = `${progress}%`;
        document.getElementById('progressText').textContent = `${Math.round(progress)}% Complete`;
    }

    startTimer() {
        this.timer = setInterval(() => {
            this.updateDisplay();
            this.updateTimer();
            this.checkForRoundTransitions();
        }, 1000);
    }

    updateTimer() {
        const now = new Date();
        let targetTime;

        if (this.currentRound) {
            // Show countdown to end of current round
            targetTime = new Date(this.currentRound.endTime);
        } else if (this.nextRound) {
            // Show countdown to start of next round (first round)
            targetTime = new Date(this.nextRound.startTime);
        } else {
            // No rounds available
            document.getElementById('hours').textContent = '00';
            document.getElementById('minutes').textContent = '00';
            document.getElementById('seconds').textContent = '00';
            return;
        }

        const timeLeft = targetTime - now;

        if (timeLeft <= 0) {
            document.getElementById('hours').textContent = '00';
            document.getElementById('minutes').textContent = '00';
            document.getElementById('seconds').textContent = '00';
            return;
        }

        const hours = Math.floor(timeLeft / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
    }

    checkForRoundTransitions() {
        const now = new Date();
        const rounds = this.config.rounds;
        
        for (let i = 0; i < rounds.length; i++) {
            const round = rounds[i];
            const startTime = new Date(round.startTime);
            const endTime = new Date(round.endTime);
            
            // Check if a round is about to start (10 seconds before start)
            if (now >= new Date(startTime.getTime() - 10000) && now <= new Date(startTime.getTime() + 5000)) {
                // Only trigger once per round
                if (!this.hasTriggeredStartAudio[round.id]) {
                    this.hasTriggeredStartAudio[round.id] = true;
                    this.queueRoundStartAudio(round, 1000); // 1 second delay
                }
            }
            
            // Check if a round is about to end (10 seconds before end)
            if (now >= new Date(endTime.getTime() - 10000) && now <= new Date(endTime.getTime() + 5000)) {
                // Only trigger once per round
                if (!this.hasTriggeredEndAudio[round.id]) {
                    this.hasTriggeredEndAudio[round.id] = true;
                    this.playRoundEndAudio(round);
                }
            }
        }
    }

    setupAudio() {
        // Initialize audio system
        this.isAudioEnabled = true;
        this.audioUnlocked = false; // Track if user has interacted
        console.log('Audio system initialized (requires user interaction)');
        
        // Initialize Web Audio API
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            console.log('Web Audio API available:', this.audioContext.state);
        } catch (error) {
            console.log('Web Audio API not available');
        }
        
        // Add user interaction handlers to unlock audio
        const unlockAudio = () => {
            if (!this.audioUnlocked) {
                console.log('🔓 Unlocking audio with user interaction...');
                this.audioUnlocked = true;
                
                // Update UI
                this.updateAudioStatus();
                
                // Resume audio context if suspended
                if (this.audioContext && this.audioContext.state === 'suspended') {
                    this.audioContext.resume().then(() => {
                        console.log('✅ Audio context resumed');
                    });
                }
                
                // Test audio playback
                this.testAudioPlayback();
            }
        };
        
        // Unlock audio on first user interaction
        document.addEventListener('click', unlockAudio, { once: true });
        document.addEventListener('keydown', unlockAudio, { once: true });
        document.addEventListener('touchstart', unlockAudio, { once: true });
    }
    
    async testAudioPlayback() {
        console.log('🧪 Testing audio playback...');
        try {
            const audio = new Audio('audio/round-start.wav');
            audio.volume = 0.1; // Very quiet test
            await audio.play();
            console.log('✅ Audio playback test successful');
            audio.pause();
        } catch (error) {
            console.log('❌ Audio playback test failed:', error.message);
        }
    }
    
    updateAudioStatus() {
        const indicator = document.getElementById('audioIndicator');
        const text = document.getElementById('audioText');
        const status = document.getElementById('audioStatus');
        
        if (this.audioUnlocked) {
            indicator.textContent = '🔊';
            text.textContent = 'Audio enabled';
            status.classList.add('unlocked');
        } else {
            indicator.textContent = '🔇';
            text.textContent = 'Click anywhere to enable audio';
            status.classList.remove('unlocked');
        }
    }

    async playRoundStartAudio(round) {
        console.log('🎵 Attempting to play round start audio for:', round.name);
        console.log('Audio enabled:', this.isAudioEnabled, 'Audio unlocked:', this.audioUnlocked, 'Playing audio:', this.isPlayingAudio);
        
        if (!this.isAudioEnabled) {
            console.log('❌ Audio disabled');
            return;
        }
        
        if (!this.audioUnlocked) {
            console.log('❌ Audio not unlocked yet, using text-to-speech fallback');
            this.speakText(`${round.name} is starting now!`);
            return;
        }
        
        // Prevent duplicate announcements
        if (this.lastAnnouncedRound === round.id) {
            console.log('❌ Duplicate announcement prevented');
            return;
        }
        
        // Add to queue instead of playing immediately
        this.audioQueue.push({
            type: 'start',
            round: round,
            timestamp: Date.now()
        });
        
        this.processAudioQueue();
    }

    async playRoundEndAudio(round) {
        console.log('🎵 Attempting to play round end audio for:', round.name);
        console.log('Audio enabled:', this.isAudioEnabled, 'Audio unlocked:', this.audioUnlocked, 'Playing audio:', this.isPlayingAudio);
        
        if (!this.isAudioEnabled) {
            console.log('❌ Audio disabled');
            return;
        }
        
        if (!this.audioUnlocked) {
            console.log('❌ Audio not unlocked yet, using text-to-speech fallback');
            this.speakText(`${round.name} is over!`);
            return;
        }
        
        // Add to queue instead of playing immediately
        this.audioQueue.push({
            type: 'end',
            round: round,
            timestamp: Date.now()
        });
        
        this.processAudioQueue();
    }

    async playAudioFile(filename) {
        console.log('🎵 Attempting to play audio file:', filename);
        
        // Use HTML5 Audio as primary method (works without user interaction)
        return this.playAudioFileFallback(filename);
    }

    // Play audio file and return its duration
    async playAudioFileWithDuration(filename) {
        console.log('🎵 Playing audio file with duration tracking:', filename);
        
        return new Promise((resolve, reject) => {
            const audio = new Audio(filename);
            audio.volume = 0.8;
            audio.preload = 'auto';
            
            let resolved = false;
            const resolveOnce = (duration) => {
                if (!resolved) {
                    resolved = true;
                    console.log('🔄 Audio promise resolved for:', filename, 'duration:', duration);
                    resolve(duration || 0);
                }
            };
            
            audio.onloadedmetadata = () => {
                console.log('📦 Audio metadata loaded:', filename, 'duration:', audio.duration);
            };
            
            audio.oncanplaythrough = () => {
                console.log('▶️ Starting audio playback:', filename);
                audio.play().then(() => {
                    console.log('✅ Audio started successfully');
                }).catch(error => {
                    console.log('❌ Audio play failed:', error);
                    resolveOnce(0);
                });
            };
            
            audio.onended = () => {
                console.log('✅ Audio playback completed:', filename);
                resolveOnce(audio.duration || 0);
            };
            
            audio.onerror = (error) => {
                console.log('❌ Audio error:', error);
                resolveOnce(0);
            };
            
            // Timeout fallback
            setTimeout(() => {
                if (!resolved) {
                    console.log('⏰ Audio timeout, resolving with estimated duration');
                    resolveOnce(2000); // Default 2 second estimate
                }
            }, 5000);
            
            audio.load();
        });
    }

    speakText(text) {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.8;
            utterance.pitch = 1.2;
            utterance.volume = 0.8;
            speechSynthesis.speak(utterance);
        }
    }

    // Primary audio method using HTML5 Audio (no user interaction required)
    playAudioFileFallback(filename) {
        return new Promise((resolve, reject) => {
            console.log('🎵 Using HTML5 Audio for:', filename);
            const audio = new Audio(filename);
            
            // Set audio properties
            audio.volume = 0.8;
            audio.preload = 'auto';
            
            // Track if audio has been resolved to prevent multiple resolutions
            let resolved = false;
            
            const resolveOnce = () => {
                if (!resolved) {
                    resolved = true;
                    console.log('🔄 Audio promise resolved for:', filename);
                    resolve();
                }
            };
            
            audio.onloadeddata = () => {
                console.log('📦 Audio file loaded:', filename);
            };
            
            audio.oncanplaythrough = () => {
                console.log('▶️ Starting HTML5 audio playback:', filename);
                audio.play().then(() => {
                    console.log('✅ HTML5 audio started successfully');
                }).catch(error => {
                    console.log('❌ HTML5 audio play failed:', error);
                    // Try to use text-to-speech as final fallback
                    console.log('🔄 Falling back to text-to-speech...');
                    this.speakText('Audio playback failed, using text to speech');
                    resolveOnce(); // Don't reject, just resolve to continue
                });
            };
            
            audio.onended = () => {
                console.log('✅ HTML5 audio playback completed:', filename);
                resolveOnce();
            };
            
            audio.onerror = (error) => {
                console.log('❌ HTML5 audio error:', error);
                // Try to use text-to-speech as final fallback
                console.log('🔄 Falling back to text-to-speech...');
                this.speakText('Audio file not found, using text to speech');
                resolveOnce(); // Don't reject, just resolve to continue
            };
            
            // Set a shorter timeout to prevent hanging
            setTimeout(() => {
                if (!resolved) {
                    console.log('⏰ Audio timeout, resolving...');
                    resolveOnce();
                }
            }, 3000); // 3 second timeout
            
            // Load the audio file
            audio.load();
        });
    }

    formatTime(date) {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Method to manually trigger round transitions (for testing)
    triggerRoundTransition(roundId, type) {
        const round = this.config.rounds.find(r => r.id === roundId);
        if (!round) return;
        
        // Reset the announcement flag for testing
        this.lastAnnouncedRound = null;
        
        if (type === 'start') {
            this.playRoundStartAudio(round);
        } else if (type === 'end') {
            this.playRoundEndAudio(round);
        }
    }
    
    // Method to reset audio state (for debugging)
    resetAudioState() {
        console.log('🔄 Resetting audio state...');
        this.isPlayingAudio = false;
        this.lastAnnouncedRound = null;
        this.hasTriggeredStartAudio = {};
        this.hasTriggeredEndAudio = {};
        this.audioQueue = [];
        console.log('✅ Audio state reset');
    }
    
    // Method to force unlock audio (for debugging)
    forceUnlockAudio() {
        console.log('🔓 Force unlocking audio...');
        this.audioUnlocked = true;
        this.updateAudioStatus();
        console.log('✅ Audio force unlocked');
    }
    
    // Method to queue round start audio after a delay
    async queueRoundStartAudio(round, delayMs = 2000) {
        console.log(`⏰ Queuing round start audio for ${round.name} in ${delayMs}ms`);
        setTimeout(async () => {
            console.log(`⏰ Executing queued round start audio for ${round.name}`);
            await this.playRoundStartAudio(round);
        }, delayMs);
    }

    // Process audio queue with proper sequencing
    async processAudioQueue() {
        if (this.isPlayingAudio || this.audioQueue.length === 0) {
            return;
        }

        this.isPlayingAudio = true;
        
        while (this.audioQueue.length > 0) {
            const audioItem = this.audioQueue.shift();
            console.log(`🎵 Processing audio queue item: ${audioItem.type} for ${audioItem.round.name}`);
            
            try {
                if (audioItem.type === 'end') {
                    await this.playEndAudioSequence(audioItem.round);
                } else if (audioItem.type === 'start') {
                    await this.playStartAudioSequence(audioItem.round);
                }
            } catch (error) {
                console.warn('❌ Error processing audio queue item:', error);
            }
        }
        
        this.isPlayingAudio = false;
        console.log('🔄 Audio queue processing completed');
    }

    // Play end audio sequence
    async playEndAudioSequence(round) {
        console.log('🔊 Playing end audio sequence for:', round.name);
        
        // Play generic end audio
        console.log('🔊 Playing generic end audio:', this.config.audio?.roundEnd);
        const endDuration = await this.playAudioFileWithDuration(`audio/${this.config.audio?.roundEnd}`);
        console.log('✅ Round end audio completed, duration:', endDuration);
        
        // Add extra delay after end audio
        console.log('⏳ Waiting 2 seconds after end audio...');
        await this.delay(2000);
    }

    // Play start audio sequence
    async playStartAudioSequence(round) {
        console.log('🔊 Playing start audio sequence for:', round.name);
        
        // Play specific round audio first
        const roundAudioFile = this.config.audio?.rounds?.[round.id];
        if (roundAudioFile) {
            console.log('🔊 Playing round-specific audio:', roundAudioFile);
            const roundDuration = await this.playAudioFileWithDuration(`audio/${roundAudioFile}`);
            console.log('✅ Round-specific audio completed, duration:', roundDuration);
            
            // Dynamic delay based on audio length (minimum 500ms, maximum 2 seconds)
            const dynamicDelay = Math.min(Math.max(roundDuration * 0.2, 500), 2000);
            console.log(`⏳ Waiting ${dynamicDelay}ms between audio files...`);
            await this.delay(dynamicDelay);
        }
        
        // Then play generic start audio
        console.log('🔊 Playing generic start audio:', this.config.audio?.roundStart);
        const startDuration = await this.playAudioFileWithDuration(`audio/${this.config.audio?.roundStart}`);
        console.log('✅ Round start audio completed, duration:', startDuration);
    }
}

// Initialize the display when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.hackathonDisplay = new HackathonStatusDisplay();
    
    // Initialize audio status display
    window.hackathonDisplay.updateAudioStatus();
    
    // Add keyboard shortcuts for testing
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            // Trigger a test round start
            if (window.hackathonDisplay) {
                const rounds = window.hackathonDisplay.config?.rounds || [];
                if (rounds.length > 0) {
                    window.hackathonDisplay.triggerRoundTransition(rounds[0].id, 'start');
                }
            }
        }
        if (e.ctrlKey && e.key === 'e') {
            e.preventDefault();
            // Trigger a test round end
            if (window.hackathonDisplay) {
                const rounds = window.hackathonDisplay.config?.rounds || [];
                if (rounds.length > 0) {
                    window.hackathonDisplay.triggerRoundTransition(rounds[0].id, 'end');
                }
            }
        }
        if (e.ctrlKey && e.key === 'r') {
            e.preventDefault();
            // Reset audio state
            if (window.hackathonDisplay) {
                window.hackathonDisplay.resetAudioState();
            }
        }
        if (e.ctrlKey && e.key === 'u') {
            e.preventDefault();
            // Force unlock audio
            if (window.hackathonDisplay) {
                window.hackathonDisplay.forceUnlockAudio();
            }
        }
    });
    
    console.log('Hackathon Status Display initialized');
    console.log('Press Ctrl+S to test round start audio, Ctrl+E to test round end audio, Ctrl+R to reset audio state, Ctrl+U to force unlock audio');
});

// Handle page visibility changes to pause/resume audio
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Page is hidden, pause audio
        if (window.speechSynthesis) {
            speechSynthesis.pause();
        }
    } else {
        // Page is visible, resume audio
        if (window.speechSynthesis) {
            speechSynthesis.resume();
        }
    }
});

