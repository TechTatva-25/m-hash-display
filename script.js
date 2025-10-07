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
        this.audioUnlocked = true; // Always unlocked for TTS
        this.hasTriggeredStartAudio = {}; // Track which rounds have triggered start audio
        this.hasTriggeredEndAudio = {}; // Track which rounds have triggered end audio
        this.audioQueue = []; // Queue for audio playback
        this.selectedVoice = null; // Store selected voice
        this.voices = []; // Available voices
        
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
        } else if (this.nextRound) {
            // Hackathon not started yet
            roundNameEl.textContent = 'Hackathon Not Started';
            roundStatusEl.textContent = 'Upcoming';
            startTimeEl.textContent = '--:--';
            endTimeEl.textContent = '--:--';
            statusIndicatorEl.className = 'status-indicator status-upcoming';
            document.getElementById('currentRound').classList.remove('pulse');
        } else {
            // Hackathon has ended
            roundNameEl.textContent = 'Thank You for Participating!';
            roundStatusEl.textContent = 'Hackathon Concluded';
            startTimeEl.textContent = '--:--';
            endTimeEl.textContent = '--:--';
            statusIndicatorEl.className = 'status-indicator status-ended';
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
            
            // Check if a round is starting (trigger 5 seconds before start until 5 seconds after)
            const startTriggerTime = startTime.getTime() - 5000;  // 5 seconds before
            const startEndTime = startTime.getTime() + 5000;     // 5 seconds after
            
            if (now >= new Date(startTriggerTime) && now <= new Date(startEndTime)) {
                if (!this.hasTriggeredStartAudio[round.id]) {
                    this.hasTriggeredStartAudio[round.id] = true;
                    console.log(`🔔 Round starting soon: ${round.name}`);
                    this.queueRoundStartAudio(round, 1000); // 1 second delay
                }
            }
            
            // Check if a round is ending (trigger 10 seconds before end until end time)
            const endTriggerTime = endTime.getTime() - 10000;    // 10 seconds before
            const endEndTime = endTime.getTime();                // At end time
            
            if (now >= new Date(endTriggerTime) && now <= new Date(endEndTime)) {
                if (!this.hasTriggeredEndAudio[round.id]) {
                    this.hasTriggeredEndAudio[round.id] = true;
                    console.log(`⏰ Round ending soon: ${round.name}`);
                    this.playRoundEndAudio(round);
                }
            }
        }
    }

    setupAudio() {
        // Initialize TTS system
        this.isAudioEnabled = true;
        this.audioUnlocked = true; // TTS doesn't need user interaction
        console.log('🎙️ Text-to-Speech system initialized');
        
        // Load available voices
        this.loadVoices();
        
        // Listen for voices changed event
        if (speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = () => {
                this.loadVoices();
            };
        }
        
        // Update UI
        this.updateAudioStatus();
        
        // Test TTS
        this.testTTSPlayback();
    }
    
    loadVoices() {
        this.voices = speechSynthesis.getVoices();
        console.log('🎤 Available voices:', this.voices.length);
        
        // Populate voice selector
        this.populateVoiceSelector();
        
        // Try to select a good female voice first
        const preferredVoices = [
            'Google US English Female',
            'Microsoft Zira - English (United States)',
            'Samantha',
            'Karen',
            'Moira',
            'Tessa',
            'Google UK English Female'
        ];
        
        // Look for preferred voices
        for (const voiceName of preferredVoices) {
            const voice = this.voices.find(v => v.name.includes(voiceName) || v.name === voiceName);
            if (voice) {
                this.selectedVoice = voice;
                console.log('✅ Selected preferred voice:', voice.name);
                break;
            }
        }
        
        // If no preferred voice found, select first female voice
        if (!this.selectedVoice) {
            const femaleVoice = this.voices.find(v => 
                v.name.toLowerCase().includes('female') || 
                v.name.toLowerCase().includes('woman') ||
                v.name.includes('Zira') ||
                v.name.includes('Hazel') ||
                v.name.includes('Karen') ||
                v.name.includes('Susan') ||
                v.name.includes('Victoria')
            );
            
            if (femaleVoice) {
                this.selectedVoice = femaleVoice;
                console.log('✅ Selected female voice:', femaleVoice.name);
            } else {
                // Fallback to first available voice
                this.selectedVoice = this.voices[0] || null;
                console.log('✅ Selected fallback voice:', this.selectedVoice?.name || 'Default');
            }
        }
        
        // Update voice selector to show selected voice
        this.updateVoiceSelector();
    }

    populateVoiceSelector() {
        const voiceSelector = document.getElementById('voiceSelector');
        if (!voiceSelector) return;
        
        // Clear existing options
        voiceSelector.innerHTML = '';
        
        // Add default option
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'System Default';
        voiceSelector.appendChild(defaultOption);
        
        // Group voices by language and gender
        const englishVoices = this.voices.filter(voice => 
            voice.lang.startsWith('en') && voice.name
        );
        
        // Sort voices: female voices first, then male, then others
        englishVoices.sort((a, b) => {
            const aIsFemale = this.isLikelyFemaleVoice(a);
            const bIsFemale = this.isLikelyFemaleVoice(b);
            
            if (aIsFemale && !bIsFemale) return -1;
            if (!aIsFemale && bIsFemale) return 1;
            return a.name.localeCompare(b.name);
        });
        
        // Add voice options
        englishVoices.forEach(voice => {
            const option = document.createElement('option');
            option.value = voice.name;
            const gender = this.isLikelyFemaleVoice(voice) ? '♀️' : '♂️';
            option.textContent = `${gender} ${voice.name}`;
            voiceSelector.appendChild(option);
        });
        
        // Add event listener for voice change
        voiceSelector.addEventListener('change', (e) => {
            this.changeVoice(e.target.value);
        });
    }

    isLikelyFemaleVoice(voice) {
        const femaleIndicators = [
            'female', 'woman', 'zira', 'hazel', 'karen', 'susan', 'victoria', 
            'samantha', 'tessa', 'moira', 'alex', 'allison', 'ava', 'serena'
        ];
        return femaleIndicators.some(indicator => 
            voice.name.toLowerCase().includes(indicator)
        );
    }

    updateVoiceSelector() {
        const voiceSelector = document.getElementById('voiceSelector');
        if (!voiceSelector || !this.selectedVoice) return;
        
        voiceSelector.value = this.selectedVoice.name;
    }

    changeVoice(voiceName) {
        if (!voiceName) {
            this.selectedVoice = null;
            console.log('🎤 Changed to system default voice');
        } else {
            const voice = this.voices.find(v => v.name === voiceName);
            if (voice) {
                this.selectedVoice = voice;
                console.log('🎤 Changed voice to:', voice.name);
                
                // Test the new voice
                this.speakText('Voice changed successfully!', 0.5);
            }
        }
        
        this.updateAudioStatus();
    }

    async testTTSPlayback() {
        console.log('🧪 Testing TTS playback...');
        try {
            this.speakText('Text to speech system ready!', 0.3); // Quiet test
            console.log('✅ TTS test successful');
        } catch (error) {
            console.log('❌ TTS test failed:', error.message);
        }
    }
    
    updateAudioStatus() {
        const indicator = document.getElementById('audioIndicator');
        const text = document.getElementById('audioText');
        const status = document.getElementById('audioStatus');
        
        if (this.isAudioEnabled) {
            indicator.textContent = '🎙️';
            text.textContent = `TTS Voice: ${this.selectedVoice?.name || 'Default'}`;
            status.classList.add('unlocked');
        } else {
            indicator.textContent = '🔇';
            text.textContent = 'Audio disabled';
            status.classList.remove('unlocked');
        }
    }

    async playRoundStartAudio(round) {
        console.log('🎵 Playing TTS for round start:', round.name);
        
        if (!this.isAudioEnabled) {
            console.log('❌ Audio disabled');
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
        console.log('🎵 Playing TTS for round end:', round.name);
        
        if (!this.isAudioEnabled) {
            console.log('❌ Audio disabled');
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

    speakText(text, volume = 0.9) {
        if ('speechSynthesis' in window) {
            console.log('🗣️ Speaking:', text);
            
            // Cancel any ongoing speech
            speechSynthesis.cancel();
            
            const utterance = new SpeechSynthesisUtterance(text);
            
            // Use selected voice if available
            if (this.selectedVoice) {
                utterance.voice = this.selectedVoice;
            }
            
            // Enhanced voice settings for better quality
            utterance.rate = 0.85;        // Slightly slower for clarity
            utterance.pitch = 1.1;       // Slightly higher pitch for pleasantness
            utterance.volume = volume;    // Adjustable volume
            
            // Add events for debugging
            utterance.onstart = () => {
                console.log('🎤 TTS started:', text);
                this.isPlayingAudio = true;
            };
            
            utterance.onend = () => {
                console.log('✅ TTS completed:', text);
                this.isPlayingAudio = false;
            };
            
            utterance.onerror = (error) => {
                console.log('❌ TTS error:', error);
                this.isPlayingAudio = false;
            };
            
            speechSynthesis.speak(utterance);
        } else {
            console.log('❌ Speech synthesis not supported');
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

    // Play end audio sequence using TTS
    async playEndAudioSequence(round) {
        console.log('🔊 Playing TTS end sequence for:', round.name);
        
        // Create ending message
        const endMessage = this.createEndMessage(round);
        await this.speakTextAsync(endMessage);
        
        // Add short delay after end audio
        console.log('⏳ Waiting 1 second after end announcement...');
        await this.delay(1000);
    }

    // Play start audio sequence using TTS
    async playStartAudioSequence(round) {
        console.log('🔊 Playing TTS start sequence for:', round.name);
        
        // Create start message
        const startMessage = this.createStartMessage(round);
        await this.speakTextAsync(startMessage);
        
        // Add short delay after start audio
        console.log('⏳ Waiting 1 second after start announcement...');
        await this.delay(1000);
    }

    // Create personalized start messages
    createStartMessage(round) {
        const messages = {
            'registration': 'Welcome to Manipal Hackathon 2025! Registration and welcome address is now starting. Please gather at the main venue.',
            'rules': 'Attention participants! The hackathon rules and guidelines session is beginning. Please pay close attention to the important information.',
            'inauguration': 'The inauguration ceremony is now commencing. Let the coding adventure begin!',
            'coding-slot-0': 'Attention hackers! Coding session is now starting. Get your keyboards ready and let\'s build something amazing!',
            'coding-slot-1': 'Coding session with mentoring support is beginning. Mentors are available to help you with your projects.',
            'coding-slot-2': 'Evening coding session is starting. Keep up the great work, hackers!',
            'coding-slot-3': 'The overnight coding marathon begins now! This is your chance to make significant progress. Stay energized!',
            'coding-slot-4': 'Post-judging coding session is starting. Time to implement the feedback from judges.',
            'coding-slot-5': 'Afternoon coding session is beginning. You\'re doing great, keep pushing forward!',
            'coding-slot-6': 'Final evening coding session is starting. The finish line is approaching!',
            'coding-slot-7': 'Final coding session with bug fixing is beginning. Polish your projects to perfection!',
            'lunch-1': 'Lunch break is starting! Time to refuel and recharge for more coding.',
            'lunch-2': 'Lunch time again! Enjoy your meal and network with fellow participants.',
            'lunch-3': 'Final lunch break is starting. Almost there, participants!',
            'dinner-1': 'Dinner break is beginning. Enjoy your meal and prepare for the evening sessions.',
            'dinner-2': 'Dinner time! Take this opportunity to relax and strategize.',
            'breakfast-1': 'Good morning, hackers! Breakfast is served. Fuel up for an exciting day ahead.',
            'breakfast-2': 'Final breakfast is starting. The last stretch of the hackathon begins!',
            'snack-1': 'Snack break is starting. Grab some refreshments and keep the energy high!',
            'snack-2': 'Another snack break begins. You\'re doing amazing, participants!',
            'judging-1': 'First judging round is starting. Present your progress confidently to the judges.',
            'judging-2': 'Second judging round begins. Show off your improvements and innovations.',
            'judging-3': 'Final judging round is starting. This is your moment to shine!',
            'bug-bounty': 'Bug bounty round is beginning! Time to hunt and fix those bugs. Good luck, hunters!',
            'judge-deliberation': 'Judges are now deliberating to shortlist the top teams. Great work, everyone!',
            'judge-deliberation-final': 'Final judge deliberation is beginning. The winners will be announced soon!',
            'final-presentation': 'Final presentations by top teams are starting. Best of luck to our finalists!',
            'valedictory': 'The valedictory ceremony begins now. Thank you all for an amazing hackathon!'
        };
        
        return messages[round.id] || `${round.name} is starting now. Good luck, participants!`;
    }

    // Create personalized end messages
    createEndMessage(round) {
        const messages = {
            'registration': 'Registration and welcome address has concluded. Get ready for the rules briefing!',
            'rules': 'Rules session is over. Now you know what it takes to win. Good luck!',
            'inauguration': 'Inauguration ceremony has ended. Let the coding begin!',
            'coding-slot-0': 'First coding session is complete. Great start, everyone!',
            'coding-slot-1': 'Coding session with mentoring has ended. Time for a well-deserved break!',
            'coding-slot-2': 'Evening coding session is complete. Excellent progress, hackers!',
            'coding-slot-3': 'The overnight coding marathon has ended. You survived the night! Amazing dedication!',
            'coding-slot-4': 'Post-judging coding session is over. Your implementations look fantastic!',
            'coding-slot-5': 'Afternoon coding session is complete. You\'re in the final stretch!',
            'coding-slot-6': 'Evening coding session has ended. Almost at the finish line!',
            'coding-slot-7': 'Final coding session is complete. Congratulations on completing the hackathon coding phase!',
            'lunch-1': 'Lunch break is over. Ready for more coding? Let\'s go!',
            'lunch-2': 'Lunch time has ended. Back to building amazing projects!',
            'lunch-3': 'Final lunch break is over. Time for the last phase of the hackathon!',
            'dinner-1': 'Dinner break has ended. Ready for the evening coding session?',
            'dinner-2': 'Dinner is over. Let\'s continue building something great!',
            'breakfast-1': 'Breakfast is over. Time to code with renewed energy!',
            'breakfast-2': 'Final breakfast has ended. Let\'s make the most of the remaining time!',
            'snack-1': 'Snack break is over. Back to coding with fresh energy!',
            'snack-2': 'Snack time has ended. Keep up the excellent work!',
            'judging-1': 'First judging round is complete. Incorporate the feedback and keep improving!',
            'judging-2': 'Second judging round has ended. You\'re getting closer to the finish line!',
            'judging-3': 'Final judging round is complete. You\'ve done an amazing job!',
            'bug-bounty': 'Bug bounty round is over. Hope you caught some good bugs!',
            'judge-deliberation': 'Judge deliberation is complete. The top teams have been selected!',
            'judge-deliberation-final': 'Final judge deliberation has ended. Results will be announced shortly!',
            'final-presentation': 'Final presentations are complete. Outstanding work from all teams!',
            'valedictory': 'The valedictory ceremony has concluded. Thank you for an incredible hackathon!'
        };
        
        return messages[round.id] || `${round.name} has ended. Well done, participants!`;
    }

    // Promise-based speak text method
    speakTextAsync(text, volume = 0.9) {
        return new Promise((resolve) => {
            if ('speechSynthesis' in window) {
                console.log('�️ Speaking async:', text);
                
                // Cancel any ongoing speech
                speechSynthesis.cancel();
                
                const utterance = new SpeechSynthesisUtterance(text);
                
                // Use selected voice if available
                if (this.selectedVoice) {
                    utterance.voice = this.selectedVoice;
                }
                
                utterance.rate = 0.85;
                utterance.pitch = 1.1;
                utterance.volume = volume;
                
                utterance.onend = () => {
                    console.log('✅ TTS completed async:', text);
                    this.isPlayingAudio = false;
                    resolve();
                };
                
                utterance.onerror = (error) => {
                    console.log('❌ TTS error async:', error);
                    this.isPlayingAudio = false;
                    resolve(); // Resolve anyway to continue
                };
                
                utterance.onstart = () => {
                    this.isPlayingAudio = true;
                };
                
                speechSynthesis.speak(utterance);
            } else {
                console.log('❌ Speech synthesis not supported');
                resolve();
            }
        });
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
                    console.log('🧪 Testing round START audio...');
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
                    console.log('🧪 Testing round END audio...');
                    window.hackathonDisplay.triggerRoundTransition(rounds[0].id, 'end');
                }
            }
        }
        if (e.ctrlKey && e.key === 't') {
            e.preventDefault();
            // Test TTS system
            if (window.hackathonDisplay) {
                console.log('🧪 Testing TTS system...');
                window.hackathonDisplay.speakText('This is a test of the text to speech system. The voice sounds great!');
            }
        }
        if (e.ctrlKey && e.key === 'v') {
            e.preventDefault();
            // List available voices
            if (window.hackathonDisplay) {
                console.log('🎤 Available voices:', window.hackathonDisplay.voices.length);
                window.hackathonDisplay.voices.forEach((voice, index) => {
                    const gender = window.hackathonDisplay.isLikelyFemaleVoice(voice) ? '♀️' : '♂️';
                    console.log(`${index + 1}. ${gender} ${voice.name} (${voice.lang})`);
                });
            }
        }
        if (e.ctrlKey && e.key === 'r') {
            e.preventDefault();
            // Reset audio state
            if (window.hackathonDisplay) {
                console.log('🔄 Resetting audio state...');
                window.hackathonDisplay.resetAudioState();
            }
        }
        if (e.ctrlKey && e.key === 'n') {
            e.preventDefault();
            // Simulate upcoming round transition
            if (window.hackathonDisplay) {
                console.log('🧪 Simulating round transition in 3 seconds...');
                setTimeout(() => {
                    const rounds = window.hackathonDisplay.config?.rounds || [];
                    if (rounds.length > 1) {
                        window.hackathonDisplay.triggerRoundTransition(rounds[1].id, 'start');
                    }
                }, 3000);
            }
        }
    });
    
    console.log('🎉 Hackathon Status Display initialized with TTS system');
    console.log('🎮 Keyboard Shortcuts:');
    console.log('  Ctrl+S: Test round START audio');
    console.log('  Ctrl+E: Test round END audio'); 
    console.log('  Ctrl+T: Test TTS system');
    console.log('  Ctrl+V: List available voices');
    console.log('  Ctrl+N: Simulate upcoming round transition');
    console.log('  Ctrl+R: Reset audio state');
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

