# 🧪 Demo Guide - Manipal Hackathon 2025 Display

## Quick Demo Setup (2 minutes)

### 1. Switch to Test Mode
```bash
npm run test-mode
```

### 2. Start the Server
```bash
npm start
```

### 3. Open Browser
Navigate to `http://localhost:3000`

## 🎯 What You'll See

### **Before 11:15 AM:**
- **Status:** "Hackathon Not Started"
- **Countdown:** Time until 11:15 AM (first event)
- **Next Round:** "Registration and Welcome Address"

### **At 11:15 AM:**
- **Status:** "Live Now" 
- **Current Round:** "Registration and Welcome Address"
- **Countdown:** 1 minute until round ends
- **Audio:** Round-specific announcement + "Starting now"

### **Every Minute (11:16, 11:17, etc.):**
- **Automatic transitions** between all 30 rounds
- **Audio announcements** for each transition
- **Real-time countdown** updates
- **Next round** updates automatically

## 🎪 Demo Timeline

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

## 🔊 Audio Testing

### **Test Individual Audio:**
- **Ctrl+S** - Test round start audio
- **Ctrl+E** - Test round end audio
- **Ctrl+N** - Test next round transition

### **Live Audio (During Demo):**
- **Round starts:** Round name → "Starting now"
- **Round ends:** "Round over"
- **Sequential playback** (no overlapping)

## 🎨 Visual Features to Show

### **Layout:**
- **Full-width grand design**
- **Real logos** (Manipal + M#)
- **Large countdown timer**
- **Progress bar**
- **Next round card**

### **Animations:**
- **Particle effects** in background
- **Pulse animation** for live rounds
- **Smooth transitions** between rounds
- **Gradient text effects**

### **Responsive Design:**
- **Resize browser** to show mobile/tablet view
- **Full-screen mode** (F11) for projection demo

## 🔄 Switch Back to Production

```bash
npm run prod-mode
```

This restores the real hackathon timeline (Oct 8-10, 2025).

## 🎯 Demo Tips

1. **Start demo at 11:14 AM** to show countdown
2. **Explain the layout** while waiting
3. **Show audio controls** (Ctrl+S, Ctrl+E)
4. **Demonstrate full-screen** (F11)
5. **Show mobile responsiveness**
6. **Explain configuration** (hackathon-config.json)

## 🚨 Troubleshooting

**Audio not working?**
```bash
npm run regenerate-audio
```

**Timer not updating?**
- Check system time
- Refresh browser

**Display issues?**
- Try different browser
- Check console (F12)

---

**Perfect for showing all features in under 30 minutes! 🎊**
