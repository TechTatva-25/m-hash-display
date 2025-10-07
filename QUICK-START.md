# 🚀 Quick Start Guide - Manipal Hackathon 2025 Display

## For Committee Members

### ⚡ Super Quick Setup (5 minutes)

1. **Download/Clone the project**
2. **Open terminal/command prompt in project folder**
3. **Run these commands:**
   ```bash
   npm install
   npm start
   ```
4. **Open browser:** `http://localhost:3000`
5. **Done!** 🎉

### 🎯 What You'll See

- **Before hackathon:** Countdown to first round (Registration)
- **During hackathon:** Current round with countdown to end
- **Audio:** Big Boss style announcements at transitions
- **Logos:** Manipal Institute (left) + MHASH (right)

### ⚙️ Changing Round Times

1. **Open:** `hackathon-config.json`
2. **Edit times:** Change `startTime` and `endTime` for any round
3. **Format:** `2025-10-08T14:30:00` (24-hour format)
4. **Save:** Changes apply immediately (refresh browser)

### 🔊 Audio Issues?

**If audio doesn't work:**
```bash
npm run regenerate-audio
```

**Test audio:**
- Press `Ctrl+S` - Test round start
- Press `Ctrl+E` - Test round end

### 🖥️ For Projection

1. **Full screen:** Press `F11`
2. **Resolution:** Use 1920x1080 or higher
3. **Browser:** Chrome recommended

### 🆘 Need Help?

- **Audio not playing?** Run `npm run regenerate-audio`
- **Timer wrong?** Check system time and JSON format
- **Logos missing?** Check `public/` folder has both logo files
- **Display issues?** Try different browser or refresh

### 📱 Mobile/Tablet View

Works on all devices, but optimized for large screens. For mobile, use landscape mode.

---

**That's it! Your hackathon display is ready! 🎊**
