# Hero Configuration - Quick Guide

## 🎯 Super Simple Setup

Edit **ONE** section in `config/hero-config.json` to control EVERYTHING:

```json
"theme": {
  "primary": "#000000",      // Main color (text, borders, icons)
  "secondary": "#ffffff",    // Background color  
  "accent": "#22c55e",       // Accent color (status dots)
  "invertColors": false      // Flip primary ↔ secondary
}
```

---

## 🎨 Quick Examples

### Default (Black on White)
```json
"theme": {
  "primary": "#000000",
  "secondary": "#ffffff",
  "accent": "#22c55e",
  "invertColors": false
}
```

### Inverted (White on Black)
```json
"theme": {
  "primary": "#000000",
  "secondary": "#ffffff",
  "accent": "#22c55e",
  "invertColors": true       // ← Just flip this!
}
```

### Navy & Cream
```json
"theme": {
  "primary": "#1e3a8a",
  "secondary": "#fef3c7",
  "accent": "#22c55e",
  "invertColors": false
}
```

### Purple & Dark
```json
"theme": {
  "primary": "#a855f7",
  "secondary": "#18181b",
  "accent": "#34d399",
  "invertColors": false
}
```

---

## 📹 Video Settings

```json
"video": {
  "enabled": true,                                      // Master on/off
  "desktop": "assets/video/backdrop-2.mp4",            // Desktop video
  "tablet": "assets/video/202587-918431513.mp4",       // Tablet video
  "mobile": {
    "enabled": false,                                   // Off for performance
    "path": "assets/video/65772-515379427.mp4"
  },
  "overlay": {
    "enabled": false,                                   // Video overlay
    "opacity": 0.7,                                     // 0.0 - 1.0
    "useSecondaryColor": true                           // Use secondary color
  }
}
```

---

## ✨ What Gets Styled

**With just primary/secondary/accent, this system styles:**

✅ Section background  
✅ All heading text (3 lines with auto opacity)  
✅ Subheading line & text  
✅ Description text  
✅ Status badge (background, border, text, hover)  
✅ Status dot (accent color)  
✅ All 4 stat cards (background, text, labels)  
✅ Stat card icons (SVG)  
✅ Stat card numbers  
✅ Primary CTA button (background, text, icon, hover)  
✅ Secondary CTA button (background, text, border, icon, hover)  

**Everything is covered!** 🎉

---

## 📝 Available Videos

- `backdrop-2.mp4` (7.5 MB) ✅ Recommended
- `202587-918431513.mp4` (15.5 MB) ✅ Good
- `65772-515379427.mp4` (22 MB) ⚠️ OK
- `14560-258207713.mp4` (41 MB) ⚠️ Slow
- `92561-636709928.mp4` (58 MB) ❌ Too large
- `26869-361107784.mp4` (101 MB) ❌ Too large
- `backdrop.mp4` (201 MB) ❌ Don't use
