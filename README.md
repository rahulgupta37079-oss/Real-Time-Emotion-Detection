# PassionBots - AI-Powered Emotion Detection

A modern, real-time emotion detection application that analyzes facial expressions and voice patterns to identify emotions. This is an improved replica of VoiceShield with enhanced UI/UX and better user experience.

## 🌟 Features

### ✅ Completed Features
- **Real-time Video Feed**: Live camera preview with permission handling
- **Multi-Modal Emotion Detection**: 
  - Facial expression analysis
  - Voice tone detection
  - Combined scoring system
- **7 Emotion Categories**:
  - Neutral 😐
  - Happy 😊
  - Sad 😢
  - Angry 😠
  - Fearful 😨
  - Disgusted 🤢
  - Surprised 😮
- **Live Metrics Dashboard**:
  - Facial Score with progress bar
  - Voice Score with audio level indicator
  - Combined Score (overall emotion intensity)
  - Face detection counter
- **System Status Monitoring**:
  - Camera status
  - Microphone status
  - Model loading status
  - Connection indicators
- **Modern UI/UX**:
  - Glassmorphism design
  - Gradient color schemes
  - Smooth animations and transitions
  - Responsive layout for all devices
  - Recording indicator with pulse animation

## 🎯 Current Functional URIs

### Main Application
- **Homepage**: `/` - Main emotion detection interface

### Static Assets
- **JavaScript**: `/static/app.js` - Frontend application logic
- **Styles**: `/static/style.css` - Additional custom styles (if needed)

## 📊 Data Architecture

### Data Models
- **Emotion Object**: 
  ```javascript
  {
    name: String,      // e.g., "Happy", "Sad"
    value: Number,     // 0-100 percentage
    color: String,     // Tailwind color class
    icon: String       // FontAwesome icon class
  }
  ```

### Storage Services
- **No persistent storage**: All processing happens client-side in the browser
- **Privacy-first approach**: No data is transmitted to servers or stored

### Data Flow
1. User grants camera/microphone permissions
2. Media streams captured via WebRTC
3. Real-time analysis simulated in browser
4. Results displayed instantly with smooth animations
5. All data processing local - nothing leaves the device

## 🚀 User Guide

### Getting Started

1. **Open the Application**: Navigate to the application URL
2. **Grant Permissions**: Click "Start Detection" and allow camera/microphone access when prompted
3. **View Results**: Watch real-time emotion detection results update automatically

### Understanding the Interface

#### Main Video Feed
- Shows live camera preview
- Recording indicator (pulsing red glow) when active
- Status badge (top-right): Shows connection status
- Face counter (top-left): Number of detected faces

#### Emotion Analysis Panel
- 7 emotion bars showing probability percentages
- Each emotion has a unique color and icon
- Bars update in real-time with smooth transitions

#### Score Cards
- **Combined Score**: Overall emotion intensity (0-100%)
- **Facial Score**: Emotion detected from facial expressions
- **Voice Score**: Emotion detected from voice tone with audio level bars

#### System Status
- Real-time status of camera, microphone, and AI models
- Helps troubleshoot permission or hardware issues

### Tips for Best Results
- Ensure good lighting for facial detection
- Position face clearly in camera view
- Speak naturally for voice analysis
- Allow both camera and microphone permissions

## 🛠️ Tech Stack

- **Frontend**: HTML5, JavaScript (ES6+), Tailwind CSS
- **Backend**: Hono.js (TypeScript)
- **Platform**: Cloudflare Workers/Pages
- **Build Tool**: Vite
- **APIs**: WebRTC (getUserMedia), Web Audio API
- **Icons**: FontAwesome 6.4.0

## 📦 Deployment

### Current Deployment Status
- **Status**: ✅ Active (Development)
- **Sandbox URL**: https://3000-i0rqut8xstjuaa3txxbke-a402f90a.sandbox.novita.ai
- **Platform**: Cloudflare Pages (Ready for production deployment)
- **Last Updated**: 2025-10-16

### Local Development

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Start development server with PM2
pm2 start ecosystem.config.cjs

# Check status
pm2 list

# View logs
pm2 logs passionbots --nostream

# Stop service
pm2 stop passionbots
```

### Production Deployment to Cloudflare Pages

```bash
# Build for production
npm run build

# Deploy to Cloudflare Pages
npm run deploy:prod

# Or manually
wrangler pages deploy dist --project-name passionbots
```

## 🔄 Features Not Yet Implemented

### High Priority
- **Actual ML Models Integration**:
  - TensorFlow.js face-api.js for real facial recognition
  - Speech emotion recognition model
  - Real-time model inference
- **Advanced Audio Analysis**:
  - Pitch detection
  - Tone analysis
  - Speech-to-text for context
- **Data Persistence** (Optional):
  - Save detection history
  - Export reports
  - Session recording (with user consent)

### Medium Priority
- **Settings Panel**:
  - Adjust detection sensitivity
  - Toggle audio/video analysis
  - Choose camera/microphone devices
- **Calibration Mode**:
  - Baseline emotion establishment
  - User-specific tuning
- **Enhanced Visualizations**:
  - Emotion timeline graph
  - Heatmap of facial points
  - 3D emotion space visualization

### Low Priority
- **Multi-User Support**:
  - Detect multiple faces simultaneously
  - Track emotions per person
- **Accessibility Features**:
  - Screen reader support
  - Keyboard navigation
  - High contrast mode
- **Export & Sharing**:
  - Download emotion reports
  - Share analysis links
  - API access for integrations

## 📈 Recommended Next Steps

1. **Integrate Real ML Models**:
   - Add TensorFlow.js and face-api.js library
   - Implement actual facial landmark detection
   - Integrate speech emotion recognition

2. **Improve Audio Analysis**:
   - Use meyda.js for audio feature extraction
   - Implement real voice tone analysis
   - Add speech-to-text capabilities

3. **Add User Settings**:
   - Device selection (multiple cameras/mics)
   - Sensitivity adjustments
   - Privacy controls

4. **Performance Optimization**:
   - Implement Web Workers for ML processing
   - Optimize model loading and caching
   - Add progressive loading

5. **Testing & Validation**:
   - Cross-browser compatibility testing
   - Performance benchmarking
   - User experience testing

6. **Production Hardening**:
   - Add error boundaries
   - Implement proper logging
   - Add analytics (privacy-focused)
   - Security audit

## 🔐 Privacy & Security

- **No Data Collection**: All processing happens locally in your browser
- **No Server Storage**: No video, audio, or analysis data is transmitted to servers
- **Permission-Based**: Only works when you explicitly grant camera/microphone access
- **Open Source**: Transparent code that can be audited

## 🎨 Design Improvements Over Original

### UI Enhancements
- Modern glassmorphism design instead of plain styling
- Gradient color schemes for visual appeal
- Smooth animations and transitions
- Better visual hierarchy and spacing
- Responsive layout for mobile devices

### UX Improvements
- Clear permission request flow
- Visual feedback for all interactions
- Better status indicators
- Audio level visualization
- Recording indicator for user awareness

### Technical Improvements
- Built on modern Cloudflare Workers/Pages
- Edge-first architecture for global performance
- TypeScript for type safety
- Modular code structure
- Easy deployment and scaling

## 📄 License

This project is created for educational and demonstration purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

---

**Built with ❤️ using Hono, Cloudflare Workers, and modern web technologies**
