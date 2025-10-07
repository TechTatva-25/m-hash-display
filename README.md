# Manipal Hackathon 2025 - Status Display

A stunning real-time status display for the Manipal Hackathon 2025, designed to be projected onto large screens during the event. Features a grand full-width layout with real logos, countdown timers, and Big Boss style audio announcements with intelligent sequencing.

## 🎯 Features

- **Real-time Updates**: Live countdown timers and round status
- **Stunning UI**: Beautiful gradient design with animations and particles
- **Audio Announcements**: Big Boss style voice announcements with intelligent sequencing
- **Full-width Grand Layout**: Optimized for large screen projection
- **Real Logo Integration**: Manipal Institute and M# logos
- **Smart Countdown**: Shows time until hackathon starts, then time until current round ends
- **Responsive Design**: Works on all screen sizes
- **Easy Configuration**: JSON-based round management
- **Audio Queuing System**: Prevents overlapping audio with proper sequencing
- **User Interaction Audio**: Handles modern browser autoplay restrictions

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher) - [Download here](https://nodejs.org/)
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation & Setup

1. **Clone or download the project**
   ```bash
   git clone https://github.com/TechTatva-25/m-hash-display.git
   cd m-hash-display
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

5. **Enable audio** - Click anywhere on the page to unlock audio

### Alternative: Python Server
If you don't have Node.js, you can use Python:
```bash
# Python 3
python -m http.server 3000

# Python 2
python -m SimpleHTTPServer 3000
```

## 🧪 Demo Mode (Quick Testing)

For quick demonstrations of all features:

1. **Switch to test mode** (all events start at 11:15 AM today, 1 minute each):
   ```bash
   npm run test-mode
   ```

2. **Start the server**:
   ```bash
   npm start
   ```

3. **Open browser**: `http://localhost:3000`

4. **Click anywhere** to enable audio

5. **Watch automatic transitions** every minute with audio announcements

6. **Switch back to production**:
   ```bash
   npm run prod-mode
   ```

## 📁 Project Structure

```
m-hash-display/
├── index.html                    # Main HTML file with UI
├── script.js                     # JavaScript logic and timer
├── server.js                     # Node.js server
├── hackathon-config.json         # Production round configuration
├── hackathon-config-test.json    # Test configuration (1-minute rounds)
├── switch-config.js              # Script to switch between configs
├── regenerate-audio.js           # Audio regeneration script
├── package.json                  # Dependencies and scripts
├── README.md                     # This documentation
├── QUICK-START.md               # Quick setup guide
├── public/                      # Static assets
│   ├── manipal-logo.png         # Left logo (Manipal Institute)
│   ├── mhash-logo.png           # Right logo (Hackathon logo)
│   └── favicon.ico              # Browser icon
└── audio/                       # Audio files (30 WAV files)
    ├── round-start.wav          # "Starting now" announcement
    ├── round-end.wav            # "Round over" announcement
    └── [round-id].wav           # Specific round announcements
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
- **Timezone**: All times are in IST (Indian Standard Time)

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

### Audio Playback Logic (Intelligent Sequencing)
1. **Round ends**: Plays "Round over" announcement immediately
2. **3-second delay**: Queued round start audio waits
3. **Round starts**: Plays round-specific audio → 500ms delay → "Starting now"
4. **Sequential playback**: Prevents overlapping audio with proper queuing
5. **Fallback**: Uses browser TTS if audio files missing

### Audio State Management
- **User interaction required**: Click anywhere to unlock audio
- **Audio queuing**: Start audio waits for end audio to finish
- **Timeout protection**: 5-second max wait for audio completion
- **State reset**: Flags reset after each audio sequence

### Testing Audio
- **Ctrl+S**: Test round start audio
- **Ctrl+E**: Test round end audio
- **Ctrl+N**: Test next round transition
- **Ctrl+R**: Reset audio state (debugging)
- **Ctrl+U**: Force unlock audio (debugging)

### Regenerating Audio Files
If you need to regenerate audio files:

```bash
npm run regenerate-audio
```

This will regenerate all 30 audio files using Windows PowerShell TTS.

## 🎨 Customization

### Logo Setup
1. **Replace logos** in `public/` folder:
   - `manipal-logo.png` - Left side (Manipal Institute)
   - `mhash-logo.png` - Right side (Hackathon logo)
2. **Recommended size**: 200x200px or larger
3. **Format**: PNG with transparent background
4. **Padding**: 12px padding between image and border

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
- **Title size**: 4.5rem (`.hackathon-title`)
- **Timer size**: 4rem (`.timer-value`)
- **Card spacing**: 1.5rem gap (`.main-content`)
- **Logo size**: 120x120px with 12px padding
- **Full-width design**: Optimized for large screens

## 🖥️ Full-Screen Mode

For projection displays:
- **Chrome/Edge**: Press `F11` or `Ctrl+Shift+F`
- **Firefox**: Press `F11`
- **Safari**: Press `Cmd+Ctrl+F`

### Display Settings
- **Resolution**: 1920x1080 or higher recommended
- **Aspect ratio**: 16:9 for best results
- **Browser zoom**: 100% (no zoom)
- **Full-screen**: Essential for projection

## 🎪 Usage During Event

### Before Hackathon
- Display shows "Hackathon Not Started"
- Countdown shows time until first round (Registration)
- Next round shows first scheduled round
- Audio indicator shows "Click anywhere to enable audio"

### During Hackathon
- Current round displayed prominently in large card
- Countdown shows time until current round ends
- Next round shows upcoming round below
- Audio plays at transitions with proper sequencing
- Progress bar shows overall hackathon progress

### After Hackathon
- Shows final round or "Hackathon Ended"
- Timer shows 00:00:00
- No further transitions

## 🔧 Troubleshooting

### Common Issues

**Audio not playing:**
- Click anywhere on the page to unlock audio
- Check if audio files exist in `audio/` folder
- Ensure browser allows autoplay
- Check browser console for errors
- Try `Ctrl+U` to force unlock audio

**Only hearing end audio, not start audio:**
- This was a known issue that has been fixed
- Audio now uses intelligent queuing system
- Start audio waits 3 seconds after end audio
- Use `Ctrl+R` to reset audio state if needed

**Timer not updating:**
- Verify system time is correct
- Check `hackathon-config.json` format
- Ensure JavaScript is enabled
- Look for console errors

**Logos not showing:**
- Verify files exist in `public/` folder
- Check file names match exactly (`manipal-logo.png`, `mhash-logo.png`)
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
- Audio playback status and queuing
- Timer updates
- Error messages
- Audio unlock status

### Audio Debugging
- **Audio indicator**: Shows speaker icon and status
- **Console logs**: Detailed audio playback information
- **Keyboard shortcuts**: Ctrl+R (reset), Ctrl+U (unlock)
- **Test buttons**: Ctrl+S (start), Ctrl+E (end)

## 📱 Browser Compatibility

- ✅ **Chrome 60+** (Recommended)
- ✅ **Firefox 55+**
- ✅ **Safari 12+**
- ✅ **Edge 79+**

**Note**: Chrome is recommended for best audio support and full-screen projection.

## 🎪 Demo Guide

### Quick Demo Setup (2 minutes)

1. **Switch to test mode**:
   ```bash
   npm run test-mode
   ```

2. **Start the server**:
   ```bash
   npm start
   ```

3. **Open browser**: `http://localhost:3000`

4. **Click anywhere** to enable audio

### What You'll See

**Before 11:15 AM:**
- Status: "Hackathon Not Started"
- Countdown: Time until 11:15 AM (first event)
- Next Round: "Registration and Welcome Address"

**At 11:15 AM:**
- Status: "Live Now"
- Current Round: "Registration and Welcome Address"
- Countdown: 1 minute until round ends
- Audio: Round-specific announcement + "Starting now"

**Every Minute (11:16, 11:17, etc.):**
- Automatic transitions between all 30 rounds
- Audio announcements for each transition
- Real-time countdown updates
- Next round updates automatically

### Demo Timeline
| Time | Event | Duration | Type |
|------|-------|----------|------|
| 11:15 AM | Registration | 1 min | Setup |
| 11:16 AM | Rules | 1 min | Setup |
| 11:17 AM | Inauguration | 1 min | Ceremony |
| 11:18 AM | Coding Slot 0 | 1 min | Coding |
| 11:19 AM | Lunch | 1 min | Break |
| ... | ... | ... | ... |
| 11:42 AM | Valedictory | 1 min | Ceremony |
| 11:43 AM | Hackathon Ended | - | - |

### Visual Features to Show
- **Layout**: Full-width grand design with real logos
- **Animations**: Particle effects, pulse animation, smooth transitions
- **Responsive Design**: Resize browser to show mobile/tablet view
- **Full-screen Mode**: F11 for projection demo

## 🔄 Maintenance

### Daily Checks
- Verify system time accuracy
- Test audio playback (Ctrl+S, Ctrl+E)
- Check display visibility
- Ensure server is running

### Between Events
- Update `hackathon-config.json` with new dates
- Regenerate audio files if needed (`npm run regenerate-audio`)
- Test on different browsers
- Update logos if required

### Audio Maintenance
- Test audio before each event
- Regenerate audio files if corrupted
- Check audio file permissions
- Verify user interaction unlock works

## 📞 Support

For technical issues:
1. Check browser console (F12)
2. Verify all files are present
3. Test with different browsers
4. Use debug shortcuts (Ctrl+R, Ctrl+U)
5. Contact development team

## 🎯 Committee Member Quick Reference

### Essential Commands
```bash
# Start the display
npm start

# Quick demo mode
npm run test-mode
npm start

# Back to production
npm run prod-mode

# Regenerate audio
npm run regenerate-audio
```

### Key Files
- `hackathon-config.json` - Edit round times
- `public/manipal-logo.png` - Left logo
- `public/mhash-logo.png` - Right logo
- `audio/` - All audio files

### Keyboard Shortcuts
- **Ctrl+S** - Test round start audio
- **Ctrl+E** - Test round end audio
- **Ctrl+N** - Test next round transition
- **Ctrl+R** - Reset audio state
- **Ctrl+U** - Force unlock audio

## 📄 License

MIT License - Feel free to modify and use for your hackathon!

---

**Made with ❤️ for Manipal Hackathon 2025 - Code for Coexistence**

*Manipal Institute of Technology*

**TechTatva-25 Organization**