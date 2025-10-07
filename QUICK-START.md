# 🚀 Quick Start Guide - Manipal Hackathon 2025 Display

## For Committee Members

### ⚡ Super Quick Setup (5 minutes)

1. **Download/Clone the project**
   ```bash
   git clone https://github.com/TechTatva-25/m-hash-display.git
   cd m-hash-display
   ```

2. **Open terminal/command prompt in project folder**

3. **Run these commands:**
   ```bash
   npm install
   npm start
   ```

4. **Open browser:** `http://localhost:3000`

5. **Click anywhere** to enable audio

6. **Done!** 🎉

### 🎯 What You'll See

- **Before hackathon:** Countdown to first round (Registration)
- **During hackathon:** Current round with countdown to end
- **Audio:** Big Boss style announcements with intelligent sequencing
- **Logos:** Manipal Institute (left) + MHASH (right)
- **Full-width grand layout** optimized for projection

### 🧪 Quick Demo Mode (2 minutes)

Want to see all features quickly?

1. **Switch to test mode:**
   ```bash
   npm run test-mode
   ```

2. **Start server:**
   ```bash
   npm start
   ```

3. **Open browser:** `http://localhost:3000`

4. **Click anywhere** to enable audio

5. **Watch:** All 30 rounds transition every minute with audio!

6. **Switch back:**
   ```bash
   npm run prod-mode
   ```

### ⚙️ Changing Round Times

1. **Open:** `hackathon-config.json`
2. **Edit times:** Change `startTime` and `endTime` for any round
3. **Format:** `2025-10-08T14:30:00` (24-hour format, IST timezone)
4. **Save:** Changes apply immediately (refresh browser)

### 🔊 Audio System

**Audio now works perfectly with intelligent sequencing:**
- **Round ends** → "Round over" plays immediately
- **3-second delay** → Round start audio waits
- **Round starts** → Round name + "Starting now" plays
- **No overlapping** → Sequential playback guaranteed

**If audio doesn't work:**
```bash
npm run regenerate-audio
```

**Test audio:**
- Press `Ctrl+S` - Test round start
- Press `Ctrl+E` - Test round end
- Press `Ctrl+R` - Reset audio state
- Press `Ctrl+U` - Force unlock audio

### 🖥️ For Projection

1. **Full screen:** Press `F11`
2. **Resolution:** Use 1920x1080 or higher
3. **Browser:** Chrome recommended
4. **Click anywhere** to enable audio before projection

### 🎨 Visual Features

- **Full-width grand design** (not portrait mode)
- **Real logos** with proper padding
- **Large countdown timer** (4rem font size)
- **Progress bar** in center
- **Next round card** below main card
- **Particle effects** in background
- **Smooth animations** and transitions

### 🆘 Need Help?

**Audio not playing?**
- Click anywhere on the page first
- Run `npm run regenerate-audio`
- Try `Ctrl+U` to force unlock

**Timer wrong?**
- Check system time
- Verify JSON format (YYYY-MM-DDTHH:MM:SS)
- Refresh browser

**Logos missing?**
- Check `public/` folder has both logo files
- File names must be exact: `manipal-logo.png`, `mhash-logo.png`

**Display issues?**
- Try different browser (Chrome recommended)
- Check full-screen mode (F11)
- Refresh page

**Only hearing end audio?**
- This was fixed! Audio now uses intelligent queuing
- Start audio waits 3 seconds after end audio
- Use `Ctrl+R` to reset if needed

### 📱 Mobile/Tablet View

Works on all devices, but optimized for large screens. For mobile, use landscape mode.

### 🎪 Demo Tips

1. **Start demo at 11:14 AM** to show countdown
2. **Explain the layout** while waiting
3. **Show audio controls** (Ctrl+S, Ctrl+E)
4. **Demonstrate full-screen** (F11)
5. **Show mobile responsiveness**
6. **Explain configuration** (hackathon-config.json)

### 🔧 Essential Commands

```bash
# Start the display
npm start

# Quick demo mode (1-minute rounds)
npm run test-mode
npm start

# Back to production mode
npm run prod-mode

# Regenerate all audio files
npm run regenerate-audio
```

### 🎯 Key Files

- `hackathon-config.json` - Edit round times
- `hackathon-config-test.json` - Demo configuration
- `public/manipal-logo.png` - Left logo
- `public/mhash-logo.png` - Right logo
- `audio/` - All 30 audio files

### ⌨️ Keyboard Shortcuts

- **Ctrl+S** - Test round start audio
- **Ctrl+E** - Test round end audio
- **Ctrl+N** - Test next round transition
- **Ctrl+R** - Reset audio state (debugging)
- **Ctrl+U** - Force unlock audio (debugging)

---

**That's it! Your hackathon display is ready! 🎊**

**Perfect for showing all features in under 30 minutes!**