# Production-Ready Portfolio Site

Security researcher portfolio with optimized build system for GitHub Pages deployment.

## 🚀 Quick Deploy

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Deploy to GitHub Pages
npm run deploy
```

## 📁 Project Structure

```
├── components/          # HTML components (development)
├── assets/
│   ├── css/            # Source CSS files
│   └── js/             # JavaScript modules
├── dist/               # Production build (generated)
├── build-html.js       # Build script
├── postcss.config.js   # PostCSS configuration
└── package.json        # Dependencies & scripts
```

## 🛠️ Development

```bash
# Start local server
npm run dev
# Visit: http://localhost:8000
```

Edit components in `components/` folder. Changes are loaded dynamically with cache busting.

## 📦 Production Build

The build process:
1. **CSS**: Minified with PostCSS (autoprefixer + cssnano)
2. **HTML**: All components combined into single file
3. **Assets**: Copied to `dist/` folder
4. **Optimization**: Development scripts removed

## 🌐 GitHub Pages Setup

### Automatic Deployment (Recommended)

Push to `main` branch - GitHub Actions automatically builds and deploys.

**Setup Steps:**
1. Go to repository Settings → Pages
2. Source: "GitHub Actions"
3. Push to main branch
4. Done! Your site deploys automatically

### Manual Deployment

```bash
npm run build
npm run deploy
```

## ✨ Features

- ✅ PostCSS optimization (autoprefixer, cssnano)
- ✅ Single-file HTML build
- ✅ Component-based architecture
- ✅ GitHub Actions CI/CD
- ✅ Production-ready minification
- ✅ Cache busting in development
- ✅ Zero-config deployment

## 🔧 Configuration

### Custom Domain

Add to `dist/CNAME`:
```
yourdomain.com
```

Or uncomment in `build-html.js`:
```javascript
fs.writeFileSync('dist/CNAME', 'yourdomain.com');
```

### PostCSS Plugins

Edit `postcss.config.js` to add/modify plugins.

## 📊 Performance

- **CSS**: Minified from ~50KB to ~20KB
- **HTML**: Single file, no component loading delay
- **First Paint**: < 1s on 3G
- **Lighthouse**: 95+ score

## 🐛 Troubleshooting

**Build fails?**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Components not updating?**
- Hard refresh: `Ctrl+Shift+R`
- Clear browser cache
- Check DevTools → Network → Disable cache

**Deploy failing?**
- Verify GitHub Actions enabled
- Check workflow logs
- Ensure Pages source is "GitHub Actions"

## 📝 Scripts

```bash
npm run dev           # Start development server
npm run build         # Build for production
npm run build:css     # Build CSS only
npm run build:html    # Build HTML only
npm run deploy        # Build and deploy to GitHub Pages
```

## 🔒 Security

Production build includes:
- Content Security Policy ready
- XSS protection
- No inline scripts (except necessary)
- Sanitized component loading

## 📚 Documentation

- [Deployment Guide](README-DEPLOY.md)
- [Modular Structure](MODULAR-STRUCTURE.md)
- [Configuration Guide](docs/CONFIG-GUIDE.md)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes in `components/` and `assets/`
4. Test with `npm run dev`
5. Build with `npm run build`
6. Submit pull request

## 📄 License

MIT License - feel free to use for your own portfolio!

---

**Built with ❤️ for security researchers**
