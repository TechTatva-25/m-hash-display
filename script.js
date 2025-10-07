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
            
            // Check if a round just started (within last 5 seconds)
            if (now >= startTime && now <= new Date(startTime.getTime() + 5000)) {
                this.playRoundStartAudio(round);
            }
            
            // Check if a round just ended (within last 5 seconds)
            if (now >= endTime && now <= new Date(endTime.getTime() + 5000)) {
                this.playRoundEndAudio(round);
            }
        }
    }

    setupAudio() {
        // Initialize Web Audio API
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (error) {
            console.warn('Web Audio API not supported, audio disabled');
            this.isAudioEnabled = false;
        }
    }

    async playRoundStartAudio(round) {
        if (!this.isAudioEnabled || this.isPlayingAudio) return;
        
        // Prevent duplicate announcements
        if (this.lastAnnouncedRound === round.id) return;
        
        this.isPlayingAudio = true;
        this.lastAnnouncedRound = round.id;
        
        try {
            // Play specific round audio first, then wait for it to finish
            const roundAudioFile = this.config.audio?.rounds?.[round.id];
            if (roundAudioFile) {
                await this.playAudioFile(`audio/${roundAudioFile}`);
                // Wait a bit between audio files
                await this.delay(400);
            }
            
            // Then play generic start audio
            await this.playAudioFile(`audio/${this.config.audio?.roundStart}`);
        } catch (error) {
            console.warn('Could not play round start audio:', error);
            // Fallback to text-to-speech
            this.speakText(`${round.name} is starting now!`);
        } finally {
            this.isPlayingAudio = false;
        }
    }

    async playRoundEndAudio(round) {
        if (!this.isAudioEnabled || this.isPlayingAudio) return;
        
        this.isPlayingAudio = true;
        
        try {
            // Play generic end audio
            await this.playAudioFile(`audio/${this.config.audio?.roundEnd}`);
        } catch (error) {
            console.warn('Could not play round end audio:', error);
            // Fallback to text-to-speech
            this.speakText(`${round.name} is over!`);
        } finally {
            this.isPlayingAudio = false;
        }
    }

    async playAudioFile(filename) {
        if (!this.audioContext) return;
        
        return new Promise(async (resolve, reject) => {
            try {
                const response = await fetch(filename);
                const arrayBuffer = await response.arrayBuffer();
                const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
                
                const source = this.audioContext.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(this.audioContext.destination);
                
                // Wait for audio to finish playing
                source.onended = () => {
                    resolve();
                };
                
                source.start();
            } catch (error) {
                console.warn(`Could not play audio file ${filename}:`, error);
                reject(error);
            }
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
}

// Initialize the display when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.hackathonDisplay = new HackathonStatusDisplay();
    
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
    });
    
    console.log('Hackathon Status Display initialized');
    console.log('Press Ctrl+S to test round start audio, Ctrl+E to test round end audio');
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
