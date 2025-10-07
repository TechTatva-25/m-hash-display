# Manipal Hackathon 2025 - Status Display

A stunning real-time status display for the Manipal Hackathon 2025, designed to be projected onto large screens during the event. Features a grand full-width layout with real logos, countdown timers, and Big Boss style audio announcements.

## 🎯 Features

- **Real-time Updates**: Live countdown timers and round status
- **Stunning UI**: Beautiful gradient design with animations and particles
- **Audio Announcements**: Big Boss style voice announcements for round transitions
- **Full-width Grand Layout**: Optimized for large screen projection
- **Real Logo Integration**: Manipal Institute and M# logos
- **Smart Countdown**: Shows time until hackathon starts, then time until current round ends
- **Responsive Design**: Works on all screen sizes
- **Easy Configuration**: JSON-based round management

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher) - [Download here](https://nodejs.org/)
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation & Setup

1. **Clone or download the project**
   ```bash
   git clone <repository-url>
   cd mhash-display
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   npm start
   ```

4. **Open in browser**
   Navigate to `http://localhost:3000`

### Alternative: Python Server
If you don't have Node.js, you can use Python:
```bash
# Python 3
python -m http.server 3000

# Python 2
python -m SimpleHTTPServer 3000
```

## 📁 Project Structure

```
mhash-display/
├── index.html              # Main HTML file with UI
├── script.js               # JavaScript logic and timer
├── server.js               # Node.js server
├── hackathon-config.json   # Round configuration
├── package.json            # Dependencies
├── README.md              # This documentation
├── public/                # Static assets
│   ├── manipal-logo.png   # Left logo
│   ├── mhash-logo.png     # Right logo
│   └── favicon.ico        # Browser icon
└── audio/                 # Audio files
    ├── round-start.wav    # "Starting now" announcement
    ├── round-end.wav      # "Round over" announcement
    └── [round-id].wav     # Specific round announcements
```

## ⚙️ Configuration

### Modifying Rounds and Timings

Edit `hackathon-config.json` to update round details:

```json
{
  "rounds": [
    {
      "id": "registration",
      "name": "Registration and Welcome Address",
      "startTime": "2025-10-08T07:00:00",
      "endTime": "2025-10-08T08:00:00",
      "type": "registration",
      "description": "Welcome and registration"
    },
    {
      "id": "coding-slot-1",
      "name": "Coding Slot 1 / Mentoring Round",
      "startTime": "2025-10-08T14:30:00",
      "endTime": "2025-10-08T18:00:00",
      "type": "coding",
      "codingHours": 3.5,
      "description": "Coding with mentoring support"
    }
  ],
  "audio": {
    "roundStart": "round-start.wav",
    "roundEnd": "round-end.wav",
    "rounds": {
      "registration": "registration.wav",
      "coding-slot-1": "coding-slot-1.wav"
    }
  }
}
```

### Time Format
- Use ISO 8601 format: `YYYY-MM-DDTHH:MM:SS`
- Times are in 24-hour format
- Ensure system time is correct

### Round Types
- `registration` - Welcome and check-in
- `coding` - Active coding periods
- `judging` - Evaluation rounds
- `break` - Meal and rest periods
- `inauguration` - Opening ceremony
- `valedictory` - Closing ceremony

## 🔊 Audio System

### Current Audio Files
The system includes 30 pre-generated WAV files:
- **Generic announcements**: `round-start.wav`, `round-end.wav`
- **Round-specific**: Each round has its own audio file
- **Big Boss style**: Deep, authoritative voice

### Audio Playback Logic
1. **Round starts**: Plays round-specific audio → 500ms delay → "Starting now"
2. **Round ends**: Plays "Round over" announcement
3. **Sequential playback**: Prevents overlapping audio
4. **Fallback**: Uses browser TTS if audio files missing

### Testing Audio
- **Ctrl+S**: Test round start audio
- **Ctrl+E**: Test round end audio
- **Ctrl+N**: Test next round transition

### Regenerating Audio Files
If you need to regenerate audio files:

1. **Create a simple script** (`regenerate-audio.js`):
```javascript
const { execSync } = require('child_process');
const fs = require('fs');

const config = JSON.parse(fs.readFileSync('hackathon-config.json', 'utf8'));

// Generate round-start.wav
execSync('powershell -Command "Add-Type -AssemblyName System.Speech; (New-Object System.Speech.Synthesis.SpeechSynthesizer).Speak(\'Starting now\') | Out-File -FilePath audio/round-start.wav -Encoding Unicode"');

// Generate round-end.wav
execSync('powershell -Command "Add-Type -AssemblyName System.Speech; (New-Object System.Speech.Synthesis.SpeechSynthesizer).Speak(\'Round over\') | Out-File -FilePath audio/round-end.wav -Encoding Unicode"');

// Generate round-specific audio
Object.keys(config.audio.rounds).forEach(roundId => {
    const round = config.rounds.find(r => r.id === roundId);
    if (round) {
        execSync(`powershell -Command "Add-Type -AssemblyName System.Speech; (New-Object System.Speech.Synthesis.SpeechSynthesizer).Speak('${round.name}') | Out-File -FilePath audio/${config.audio.rounds[roundId]} -Encoding Unicode"`);
    }
});
```

2. **Run the script**:
```bash
node regenerate-audio.js
```

## 🎨 Customization

### Logo Setup
1. **Replace logos** in `public/` folder:
   - `manipal-logo.png` - Left side (Manipal Institute)
   - `mhash-logo.png` - Right side (Hackathon logo)
2. **Recommended size**: 200x200px or larger
3. **Format**: PNG with transparent background

### Colors and Branding
Edit CSS variables in `index.html`:
```css
:root {
  --primary-color: #0d4f3c;      /* Dark teal */
  --secondary-color: #1a6b5a;    /* Medium teal */
  --accent-color: #e8f5e8;       /* Light green */
  --text-color: #a8d8a8;         /* Muted green */
}
```

### Layout Adjustments
- **Title size**: Modify `.hackathon-title` font-size
- **Timer size**: Adjust `.timer-value` font-size
- **Card spacing**: Change `.main-content` gap
- **Logo size**: Update `.logo` width/height

## 🖥️ Full-Screen Mode

For projection displays:
- **Chrome/Edge**: Press `F11` or `Ctrl+Shift+F`
- **Firefox**: Press `F11`
- **Safari**: Press `Cmd+Ctrl+F`

### Display Settings
- **Resolution**: 1920x1080 or higher recommended
- **Aspect ratio**: 16:9 for best results
- **Browser zoom**: 100% (no zoom)

## 🔧 Troubleshooting

### Common Issues

**Audio not playing:**
- Check if audio files exist in `audio/` folder
- Ensure browser allows autoplay
- Check browser console for errors
- Try refreshing the page

**Timer not updating:**
- Verify system time is correct
- Check `hackathon-config.json` format
- Ensure JavaScript is enabled
- Look for console errors

**Logos not showing:**
- Verify files exist in `public/` folder
- Check file names match exactly
- Ensure server is running
- Try hard refresh (Ctrl+F5)

**Display issues:**
- Use modern browser (Chrome recommended)
- Check browser console for errors
- Ensure full-screen mode
- Verify screen resolution

### Debug Mode
Open browser console (F12) to see:
- Round transitions
- Audio playback status
- Timer updates
- Error messages

## 📱 Browser Compatibility

- ✅ **Chrome 60+** (Recommended)
- ✅ **Firefox 55+**
- ✅ **Safari 12+**
- ✅ **Edge 79+**

## 🎪 Usage During Event

### Before Hackathon
- Display shows "Hackathon Not Started"
- Countdown shows time until first round
- Next round shows first scheduled round

### During Hackathon
- Current round displayed prominently
- Countdown shows time until round ends
- Next round shows upcoming round
- Audio plays at transitions

### After Hackathon
- Shows final round or "Hackathon Ended"
- Timer shows 00:00:00
- No further transitions

## 🔄 Maintenance

### Daily Checks
- Verify system time accuracy
- Test audio playback
- Check display visibility
- Ensure server is running

### Between Events
- Update `hackathon-config.json` with new dates
- Regenerate audio files if needed
- Test on different browsers
- Update logos if required

## 📞 Support

For technical issues:
1. Check browser console (F12)
2. Verify all files are present
3. Test with different browsers
4. Contact development team

## 📄 License

MIT License - Feel free to modify and use for your hackathon!

---

**Made with ❤️ for Manipal Hackathon 2025 - Code for Coexistence**

*Manipal Institute of Technology*