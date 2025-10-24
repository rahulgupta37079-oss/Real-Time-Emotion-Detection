# PassionBots - Real-Time Emotion Detection

> **Professional AI-powered emotion detection system with a modern black, yellow, and white design**

[![Live Demo](https://img.shields.io/badge/🚀_Production-Live-yellow?style=for-the-badge&logo=cloudflare)](https://passionbots-emotion-detection.pages.dev)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge&logo=github)](https://github.com/rahulgupta37079-oss/Real-Time-Emotion-Detection)
[![TensorFlow.js](https://img.shields.io/badge/TensorFlow.js-AI-orange?style=for-the-badge&logo=tensorflow)](https://www.tensorflow.org/js)
[![Cloudflare Pages](https://img.shields.io/badge/Cloudflare-Pages-yellow?style=for-the-badge&logo=cloudflare)](https://passionbots-emotion-detection.pages.dev)

---

## 🎯 Overview

PassionBots is a cutting-edge, browser-based emotion detection system that analyzes facial expressions in real-time using advanced machine learning models. Built with a professional black, yellow, and white design inspired by the PassionBots brand, this application combines state-of-the-art AI technology with an intuitive, modern user interface.

### ✨ Key Features

- 🤖 **Real AI-Powered Detection**: Uses face-api.js (TensorFlow.js) for accurate facial emotion recognition
- 🎨 **Professional Design**: Modern black, yellow, white color scheme with custom typography
- ⚡ **Lightning Fast**: Real-time detection at 10 FPS with 60 FPS UI
- 🔒 **Privacy First**: 100% client-side processing - no data transmission
- 👥 **Multi-Face Support**: Detects and analyzes multiple faces simultaneously
- 🚨 **Anger Alert System**: Configurable alerts with cooldown protection
- 📊 **Live Metrics**: Real-time scoring and audio visualization
- 🎭 **7 Emotions**: Neutral, Happy, Sad, Angry, Fearful, Disgusted, Surprised

---

## 🎨 Design System

### Color Palette

```
Primary Colors:
- Passion Yellow: #FDB813
- Yellow Light:   #FFCE3E
- Yellow Dark:    #E5A000

Neutral Colors:
- Passion Black:  #0A0A0A
- Gray Dark:      #1A1A1A
- Gray Medium:    #2A2A2A
- Gray Light:     #3A3A3A
- White:          #FFFFFF
```

### Typography

- **Display Font**: Poppins (600-900) - For headings and titles
- **Body Font**: Inter (400-900) - For UI elements and text
- **Professional hierarchy** with consistent spacing

### Design Elements

- **Cards**: Gradient backgrounds with hover effects
- **Buttons**: Yellow gradient with smooth transitions
- **Animations**: Gradient text shine, pulse effects, smooth transitions
- **Icons**: Colored backgrounds matching brand colors

---

## 🌐 Live Production

**🚀 Official Deployment:** [https://passionbots-emotion-detection.pages.dev](https://passionbots-emotion-detection.pages.dev)

The application is deployed on **Cloudflare Pages** with global edge distribution for lightning-fast performance worldwide.

### Deployment Details
- **Platform**: Cloudflare Pages
- **Status**: ✅ Live & Active
- **URL**: https://passionbots-emotion-detection.pages.dev
- **Build**: Automatic from `main` branch
- **Edge Locations**: 310+ cities worldwide
- **SSL/TLS**: Automatic HTTPS
- **Performance**: Sub-second response times globally

---

## 🚀 Quick Start

### Prerequisites

- Modern web browser (Chrome, Edge, Firefox, Safari)
- Camera and microphone permissions
- Stable internet connection (for model loading)

### Installation

```bash
# Clone the repository
git clone https://github.com/rahulgupta37079-oss/Real-Time-Emotion-Detection.git
cd Real-Time-Emotion-Detection

# Install dependencies
npm install

# Build the project
npm run build

# Start development server (sandbox)
pm2 start ecosystem.config.cjs

# Or use npm scripts
npm run dev:sandbox
```

### Deployment

```bash
# Deploy to Cloudflare Pages
npm run deploy:prod

# Or manually
wrangler pages deploy dist --project-name passionbots
```

---

## 🧠 How It Works

### Architecture

```
Browser Client
├── face-api.js (TensorFlow.js)
│   ├── Tiny Face Detector (~190KB)
│   ├── Face Expression Net (~310KB)
│   └── Face Landmark 68 (~350KB)
├── WebRTC (Camera/Audio Access)
├── Web Audio API (Audio Visualization)
└── Hono Framework (Edge Backend)
```

### AI Models

**face-api.js Pre-trained Models:**
- **Tiny Face Detector**: Fast face detection optimized for real-time
- **Face Expression Net**: Neural network for emotion classification
- **Face Landmark 68**: 68-point facial landmark detection

**Model Loading:**
- Models loaded from CDN on startup (~850KB total)
- Cached by browser for subsequent visits
- Approximately 3-5 seconds initial load time

### Emotion Detection Flow

1. **Camera Access**: Request user permission via WebRTC
2. **Model Loading**: Load AI models from CDN (one-time)
3. **Face Detection**: Detect faces in video stream (10 FPS)
4. **Emotion Analysis**: Classify emotions using neural networks
5. **UI Updates**: Display results with smooth animations (60 FPS)
6. **Alert System**: Monitor anger levels and trigger alerts

---

## 📊 Features Breakdown

### Real-Time Emotion Detection

- **7 Emotion Categories**:
  - 😐 Neutral - Calm, baseline expressions
  - 😊 Happy - Smiles, positive expressions
  - 😢 Sad - Downturned expressions, frowns
  - 😠 Angry - Aggressive facial expressions
  - 😨 Fearful - Surprised, worried expressions
  - 🤢 Disgusted - Negative, repulsed expressions
  - 😮 Surprised - Wide eyes, raised eyebrows

### Anger Alert System

- **Configurable Threshold**: Default 60% anger confidence
- **Cooldown Protection**: Default 30 seconds between alerts
- **Visual Alerts**: Professional popup with anger level
- **Console Logging**: All alerts logged with timestamps

### Live Metrics Dashboard

- **Combined Score**: Overall emotion intensity (0-100%)
- **Facial Score**: Emotion confidence from facial analysis
- **Voice Score**: Audio level visualization
- **Face Counter**: Number of detected faces
- **System Status**: Camera, microphone, and model status

### Professional UI Components

- **Gradient Text Animations**: Animated shine effects
- **Hover Effects**: Interactive cards and buttons
- **Smooth Transitions**: All UI elements animate smoothly
- **Responsive Design**: Works on desktop, tablet, and mobile

---

## 🛠️ Tech Stack

### Frontend

- **HTML5, CSS3, JavaScript (ES6+)**
- **Tailwind CSS**: Utility-first CSS framework
- **face-api.js 0.22.2**: Browser-based facial recognition
- **TensorFlow.js**: Underlying ML framework
- **WebRTC**: Camera and microphone access
- **Web Audio API**: Audio level visualization
- **FontAwesome 6.4.0**: Professional icon library
- **Google Fonts**: Inter and Poppins typography

### Backend

- **Hono.js**: Lightweight TypeScript web framework
- **Cloudflare Workers/Pages**: Edge deployment platform
- **Vite**: Modern build tool and bundler

### Development Tools

- **TypeScript**: Type-safe code
- **PM2**: Process manager for development
- **Wrangler**: Cloudflare CLI tool
- **Git**: Version control

---

## 📦 Project Structure

```
Real-Time-Emotion-Detection/
├── src/
│   ├── index.tsx              # Main Hono application
│   └── renderer.tsx           # JSX renderer
├── public/
│   └── static/
│       ├── app.js             # Frontend emotion detection logic
│       └── style.css          # Additional styles
├── dist/                      # Build output (generated)
├── ecosystem.config.cjs       # PM2 configuration
├── wrangler.jsonc            # Cloudflare Pages config
├── vite.config.ts            # Vite build configuration
├── tsconfig.json             # TypeScript configuration
├── package.json              # Dependencies and scripts
├── .gitignore                # Git ignore rules
└── README.md                 # This file
```

---

## 🎯 Use Cases

### Personal & Home
- Family wellness monitoring with anger alerts
- Personal mood tracking and emotional awareness
- Mental health and mindfulness applications

### Professional & Educational
- Customer service training with emotion feedback
- Research in emotion recognition and psychology
- Classroom engagement monitoring
- Therapy and counseling assistance

### Development & Integration
- API integration for custom applications
- AI/ML research and development
- Building emotion-aware systems
- User experience testing

---

## 🔒 Privacy & Security

- ✅ **100% Local Processing**: All AI runs in your browser
- ✅ **No Server Storage**: No video, audio, or analysis data transmitted
- ✅ **No Cloud Dependencies**: Models loaded once from CDN
- ✅ **Permission-Based**: Only works when you grant camera/microphone access
- ✅ **Open Source**: Transparent, auditable code

---

## 🎨 Comparison with VoiceShield

### Architecture Comparison

| Feature | VoiceShield (Original) | PassionBots (Our Implementation) |
|---------|------------------------|----------------------------------|
| **Backend** | Python Flask + WebSocket | Hono.js (Edge) |
| **Facial Detection** | DeepFace (Python) | face-api.js (TensorFlow.js) |
| **Face Detection** | OpenCV (Python) | face-api.js (Browser) |
| **Voice Analysis** | PyAudio + ML Model | Web Audio API |
| **Deployment** | Server (Port 5001) | Cloudflare Edge Network |
| **Privacy** | Server processing | 100% Client-side |
| **Scalability** | Single server | Global CDN |

### Our Advantages

✅ **Browser-based**: No backend server required  
✅ **Edge Deployment**: Deploy to Cloudflare's global network  
✅ **Better Privacy**: No data leaves the browser  
✅ **Faster Load**: CDN-based model loading  
✅ **Professional UI**: Modern design with animations  
✅ **Easy Deployment**: One command to deploy  

---

## 📈 Performance

- **Initial Load**: 3-5 seconds (model loading)
- **Detection FPS**: 10 FPS (smooth real-time)
- **UI FPS**: 60 FPS (buttery smooth animations)
- **Bundle Size**: ~50 KB (compressed)
- **Model Size**: ~850 KB (one-time CDN load)
- **Memory Usage**: ~100-150 MB (browser)

---

## 🚧 Roadmap

### High Priority
- [ ] Voice emotion classification (audio feature extraction)
- [ ] Alert configuration UI (sliders, toggles)
- [ ] Local storage for settings and history
- [ ] Export emotion reports (CSV/JSON)

### Medium Priority
- [ ] Device selection (multiple cameras/mics)
- [ ] FPS adjustment based on device performance
- [ ] Enhanced visualizations (timeline, heatmap)
- [ ] Multiple emotion alerts (not just anger)

### Low Priority
- [ ] Multi-user face tracking
- [ ] Session recording (with consent)
- [ ] API for external integrations
- [ ] Mobile app (React Native/Flutter)

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

### Development Setup

```bash
# Fork and clone the repository
git clone https://github.com/YOUR_USERNAME/Real-Time-Emotion-Detection.git
cd Real-Time-Emotion-Detection

# Install dependencies
npm install

# Start development server
npm run build && pm2 start ecosystem.config.cjs

# Make your changes...

# Test your changes
npm run test

# Commit and push
git add .
git commit -m "Your descriptive commit message"
git push origin your-branch-name
```

---

## 📄 License

This project is created for educational and demonstration purposes.

---

## 🙏 Acknowledgments

### Inspired By
- **VoiceShield** by Hridaywho - Original Flask-based emotion detection system
- **PassionBots.in** - Professional design and branding inspiration

### Core Technologies
- **face-api.js** - Browser-based facial recognition by justadudewhohacks
- **TensorFlow.js** - ML framework for JavaScript by Google
- **DeepFace** - Inspiration for emotion detection methodology by serengil
- **Hono** - Lightweight web framework by yusukebe
- **Cloudflare** - Edge deployment platform

### Special Thanks
- OpenCV community for computer vision insights
- TensorFlow.js team for browser-based ML
- The open-source community for tools and inspiration

---

## 📞 Contact & Support

- **GitHub**: [rahulgupta37079-oss](https://github.com/rahulgupta37079-oss)
- **Repository**: [Real-Time-Emotion-Detection](https://github.com/rahulgupta37079-oss/Real-Time-Emotion-Detection)
- **🚀 Live Production**: [passionbots-emotion-detection.pages.dev](https://passionbots-emotion-detection.pages.dev)

---

## 🎉 Quick Summary

**PassionBots** is a professional, browser-based emotion detection system featuring:

✨ **Real AI** using face-api.js (TensorFlow.js)  
🎨 **Professional Design** with black/yellow/white theme  
⚡ **Lightning Fast** real-time detection  
🔒 **Privacy First** with 100% client-side processing  
🚀 **Easy Deployment** to Cloudflare Pages  
📊 **Comprehensive Metrics** and visualization  

**Built with ❤️ using face-api.js, Hono, Cloudflare Workers, and modern web technologies**

---

## 🚀 Get Started Now

```bash
git clone https://github.com/rahulgupta37079-oss/Real-Time-Emotion-Detection.git
cd Real-Time-Emotion-Detection
npm install
npm run build
pm2 start ecosystem.config.cjs
```

Visit `http://localhost:3000` and start detecting emotions! 🎭
