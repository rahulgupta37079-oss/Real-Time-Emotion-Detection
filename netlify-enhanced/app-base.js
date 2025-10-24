// PassionBots - Real Emotion Detection with face-api.js
// This uses actual ML models for facial emotion recognition

class EmotionDetector {
  constructor() {
    this.isRunning = false;
    this.videoStream = null;
    this.audioContext = null;
    this.analyser = null;
    this.modelsLoaded = false;
    this.detectionInterval = null;
    
    // Anger alert configuration
    this.angerConfig = {
      threshold: 0.6,
      cooldown: 30,
      enabled: true,
      lastAlertTime: 0
    };
    
    // Emotion categories with professional black/yellow/white theme
    this.emotions = [
      { name: 'Neutral', value: 0, color: '#9CA3AF', barColor: 'from-gray-400 to-gray-500', icon: 'fa-meh' },
      { name: 'Happy', value: 0, color: '#FDB813', barColor: 'from-yellow-400 to-yellow-500', icon: 'fa-smile' },
      { name: 'Sad', value: 0, color: '#60A5FA', barColor: 'from-blue-400 to-blue-500', icon: 'fa-frown' },
      { name: 'Angry', value: 0, color: '#EF4444', barColor: 'from-red-500 to-red-600', icon: 'fa-angry' },
      { name: 'Fearful', value: 0, color: '#A78BFA', barColor: 'from-purple-400 to-purple-500', icon: 'fa-grimace' },
      { name: 'Disgusted', value: 0, color: '#34D399', barColor: 'from-green-400 to-green-500', icon: 'fa-tired' },
      { name: 'Surprised', value: 0, color: '#F472B6', barColor: 'from-pink-400 to-pink-500', icon: 'fa-surprise' }
    ];
    
    this.initializeUI();
    this.renderEmotionBars();
    this.loadModels();
  }
  
  initializeUI() {
    // Button handlers
    document.getElementById('startBtn').addEventListener('click', () => this.start());
    document.getElementById('stopBtn').addEventListener('click', () => this.stop());
  }
  
  renderEmotionBars() {
    const container = document.getElementById('emotionBars');
    container.innerHTML = this.emotions.map(emotion => `
      <div class="emotion-item p-3 bg-black/30 rounded-lg hover:bg-black/50 transition-all">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 rounded-lg flex items-center justify-center" style="background-color: ${emotion.color}20">
              <i class="fas ${emotion.icon}" style="color: ${emotion.color}"></i>
            </div>
            <span class="font-bold text-white">${emotion.name}</span>
          </div>
          <span class="text-xl font-display font-black" style="color: ${emotion.color}" id="${emotion.name.toLowerCase()}-value">0%</span>
        </div>
        <div class="h-2 bg-black rounded-full overflow-hidden">
          <div id="${emotion.name.toLowerCase()}-bar" class="h-full bg-gradient-to-r ${emotion.barColor} emotion-bar transition-all duration-500" style="width: 0%"></div>
        </div>
      </div>
    `).join('');
  }
  
  async loadModels() {
    try {
      this.updateStatus('connecting', 'Loading AI Models...');
      document.getElementById('modelStatus').textContent = 'Loading...';
      
      const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.12/model';
      
      // Load face-api.js models
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL)
      ]);
      
      this.modelsLoaded = true;
      this.updateStatus('disconnected', 'Models Loaded - Ready');
      document.getElementById('modelStatus').textContent = 'Loaded';
      
      console.log('✅ Face-api.js models loaded successfully');
    } catch (error) {
      console.error('Error loading models:', error);
      this.updateStatus('error', 'Model Loading Failed');
      document.getElementById('modelStatus').textContent = 'Failed';
      document.getElementById('permissionAlert').innerHTML = `
        <i class="fas fa-exclamation-triangle text-red-400 mr-2"></i>
        <span class="text-red-200">Error loading AI models: ${error.message}</span>
      `;
      document.getElementById('permissionAlert').classList.remove('hidden');
    }
  }
  
  async start() {
    if (!this.modelsLoaded) {
      alert('Please wait for models to load first');
      return;
    }
    
    try {
      // Update UI
      this.updateStatus('connecting', 'Requesting permissions...');
      document.getElementById('permissionAlert').classList.remove('hidden');
      
      // Request camera and microphone access
      this.videoStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: true
      });
      
      // Setup video element
      const videoElement = document.getElementById('videoElement');
      const videoPlaceholder = document.getElementById('videoPlaceholder');
      videoElement.srcObject = this.videoStream;
      
      // Wait for video to be ready
      await new Promise((resolve) => {
        videoElement.onloadedmetadata = () => {
          videoElement.play();
          resolve();
        };
      });
      
      videoElement.classList.remove('hidden');
      videoPlaceholder.classList.add('hidden');
      
      // Setup audio analysis
      this.setupAudioAnalysis(this.videoStream);
      
      // Update status
      this.isRunning = true;
      this.updateStatus('connected', 'Detection Active');
      document.getElementById('permissionAlert').classList.add('hidden');
      document.getElementById('startBtn').classList.add('hidden');
      document.getElementById('stopBtn').classList.remove('hidden');
      document.getElementById('cameraStatus').textContent = 'Active';
      document.getElementById('micStatus').textContent = 'Active';
      
      // Add recording indicator
      videoElement.classList.add('recording');
      
      // Start real-time detection
      this.startRealTimeDetection();
      
    } catch (error) {
      console.error('Error accessing media devices:', error);
      this.updateStatus('error', 'Permission Denied');
      document.getElementById('permissionAlert').innerHTML = `
        <i class="fas fa-exclamation-triangle text-red-400 mr-2"></i>
        <span class="text-red-200">Error: ${error.message}. Please ensure camera and microphone permissions are granted.</span>
      `;
      document.getElementById('permissionAlert').classList.remove('hidden');
    }
  }
  
  stop() {
    this.isRunning = false;
    
    // Stop detection interval
    if (this.detectionInterval) {
      clearInterval(this.detectionInterval);
      this.detectionInterval = null;
    }
    
    // Stop video stream
    if (this.videoStream) {
      this.videoStream.getTracks().forEach(track => track.stop());
      this.videoStream = null;
    }
    
    // Stop audio context
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    
    // Reset UI
    const videoElement = document.getElementById('videoElement');
    const videoPlaceholder = document.getElementById('videoPlaceholder');
    videoElement.srcObject = null;
    videoElement.classList.add('hidden');
    videoElement.classList.remove('recording');
    videoPlaceholder.classList.remove('hidden');
    
    document.getElementById('startBtn').classList.remove('hidden');
    document.getElementById('stopBtn').classList.add('hidden');
    this.updateStatus('disconnected', 'Disconnected');
    document.getElementById('cameraStatus').textContent = 'Inactive';
    document.getElementById('micStatus').textContent = 'Inactive';
    
    // Reset scores
    this.resetScores();
  }
  
  setupAudioAnalysis(stream) {
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.analyser = this.audioContext.createAnalyser();
    const source = this.audioContext.createMediaStreamSource(stream);
    source.connect(this.analyser);
    this.analyser.fftSize = 256;
    
    this.animateAudioBars();
  }
  
  animateAudioBars() {
    if (!this.isRunning || !this.analyser) return;
    
    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(dataArray);
    
    // Calculate average volume
    const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
    const normalizedVolume = Math.min(100, (average / 255) * 100);
    
    // Update audio bars with yellow theme
    const bars = 5;
    for (let i = 1; i <= bars; i++) {
      const bar = document.getElementById(`audioBar${i}`);
      if (bar) {
        if (i * 20 < normalizedVolume) {
          bar.style.backgroundColor = '#FDB813';
        } else {
          bar.style.backgroundColor = '#3A3A3A';
        }
      }
    }
    
    requestAnimationFrame(() => this.animateAudioBars());
  }
  
  async startRealTimeDetection() {
    const videoElement = document.getElementById('videoElement');
    const canvas = document.getElementById('canvas');
    
    // Run detection every 100ms (10 FPS for smooth performance)
    this.detectionInterval = setInterval(async () => {
      if (!this.isRunning) return;
      
      try {
        // Detect faces with expressions
        const detections = await faceapi
          .detectAllFaces(videoElement, new faceapi.TinyFaceDetectorOptions())
          .withFaceExpressions();
        
        if (detections && detections.length > 0) {
          // Update face count
          document.getElementById('faceCount').textContent = detections.length;
          
          // Use the first face for emotion analysis
          const expressions = detections[0].expressions;
          
          // Map face-api.js expressions to our emotion format
          const emotionMap = {
            'neutral': 'Neutral',
            'happy': 'Happy',
            'sad': 'Sad',
            'angry': 'Angry',
            'fearful': 'Fearful',
            'disgusted': 'Disgusted',
            'surprised': 'Surprised'
          };
          
          let facialScoreSum = 0;
          
          // Update emotion values
          this.emotions.forEach(emotion => {
            const apiKey = emotion.name.toLowerCase();
            let value = 0;
            
            if (expressions[apiKey]) {
              value = expressions[apiKey] * 100;
            }
            
            // Smooth transition
            const currentValue = emotion.value;
            emotion.value = currentValue * 0.7 + value * 0.3;
            facialScoreSum += emotion.value;
            
            // Update UI
            const bar = document.getElementById(`${emotion.name.toLowerCase()}-bar`);
            const valueSpan = document.getElementById(`${emotion.name.toLowerCase()}-value`);
            if (bar && valueSpan) {
              bar.style.width = `${emotion.value}%`;
              valueSpan.textContent = `${Math.round(emotion.value)}%`;
            }
          });
          
          // Calculate scores
          const facialScore = Math.min(100, Math.round(facialScoreSum / 2));
          const voiceScore = Math.round(30 + Math.random() * 40); // Simulated voice score
          const combinedScore = Math.round((facialScore + voiceScore) / 2);
          
          // Update score displays
          this.updateScore('facialScore', facialScore);
          this.updateScore('voiceScore', voiceScore);
          this.updateScore('combinedScore', combinedScore);
          
          // Check for anger alerts
          const angerEmotion = this.emotions.find(e => e.name === 'Angry');
          if (angerEmotion && this.angerConfig.enabled) {
            const angerLevel = angerEmotion.value / 100;
            this.checkAngerAlert(angerLevel);
          }
          
        } else {
          document.getElementById('faceCount').textContent = '0';
        }
        
      } catch (error) {
        console.error('Detection error:', error);
      }
    }, 100);
  }
  
  checkAngerAlert(angerLevel) {
    const now = Date.now();
    const timeSinceLastAlert = (now - this.angerConfig.lastAlertTime) / 1000;
    
    if (angerLevel >= this.angerConfig.threshold && timeSinceLastAlert >= this.angerConfig.cooldown) {
      this.showAngerAlert(angerLevel);
      this.angerConfig.lastAlertTime = now;
    }
  }
  
  showAngerAlert(angerLevel) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'fixed top-20 right-4 px-6 py-4 rounded-xl shadow-2xl z-50 animate-bounce border-l-4';
    alertDiv.style.cssText = 'background: linear-gradient(135deg, #1A1A1A 0%, #2A2A2A 100%); border-left-color: #FDB813; border-width: 4px;';
    alertDiv.innerHTML = `
      <div class="flex items-center space-x-4">
        <div class="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center flex-shrink-0">
          <i class="fas fa-exclamation-triangle text-white text-xl"></i>
        </div>
        <div>
          <div class="font-display font-black text-lg text-white mb-1">⚠️ Anger Detected!</div>
          <div class="text-sm text-gray-400">Anger Level: <span class="text-passion-yellow font-bold">${Math.round(angerLevel * 100)}%</span></div>
        </div>
      </div>
    `;
    
    document.body.appendChild(alertDiv);
    
    // Auto-remove after 10 seconds
    setTimeout(() => {
      alertDiv.style.opacity = '0';
      alertDiv.style.transform = 'translateX(100%)';
      alertDiv.style.transition = 'all 0.5s ease';
      setTimeout(() => alertDiv.remove(), 500);
    }, 10000);
    
    // Log alert
    console.log(`🚨 ANGER ALERT: ${Math.round(angerLevel * 100)}% at ${new Date().toLocaleTimeString()}`);
  }
  
  updateScore(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
      element.textContent = value + (elementId === 'combinedScore' ? '' : '%');
    }
    
    // Update progress bar
    const bar = document.getElementById(`${elementId}Bar`);
    if (bar) {
      bar.style.width = `${value}%`;
    }
  }
  
  resetScores() {
    this.emotions.forEach(emotion => {
      emotion.value = 0;
      const bar = document.getElementById(`${emotion.name.toLowerCase()}-bar`);
      const valueSpan = document.getElementById(`${emotion.name.toLowerCase()}-value`);
      if (bar) bar.style.width = '0%';
      if (valueSpan) valueSpan.textContent = '0%';
    });
    
    document.getElementById('facialScore').textContent = '0%';
    document.getElementById('voiceScore').textContent = '0%';
    document.getElementById('combinedScore').textContent = '0';
    document.getElementById('facialScoreBar').style.width = '0%';
    document.getElementById('voiceScoreBar').style.width = '0%';
    document.getElementById('faceCount').textContent = '0';
    
    // Reset audio bars
    for (let i = 1; i <= 5; i++) {
      const bar = document.getElementById(`audioBar${i}`);
      if (bar) {
        bar.style.backgroundColor = '#3A3A3A';
      }
    }
  }
  
  updateStatus(status, text) {
    const statusDot = document.getElementById('statusDot');
    const statusText = document.getElementById('statusText');
    
    statusText.textContent = text;
    
    // Use inline styles for better control
    switch (status) {
      case 'connected':
        statusDot.style.backgroundColor = '#10B981'; // green
        break;
      case 'connecting':
        statusDot.style.backgroundColor = '#FDB813'; // passion yellow
        break;
      case 'error':
        statusDot.style.backgroundColor = '#EF4444'; // red
        break;
      default:
        statusDot.style.backgroundColor = '#6B7280'; // gray
    }
  }
}

// Initialize the app when DOM and face-api.js are ready
let detectorInstance = null;

function initApp() {
  if (typeof faceapi !== 'undefined') {
    console.log('✅ face-api.js loaded');
    detectorInstance = new EmotionDetector();
  } else {
    console.log('⏳ Waiting for face-api.js...');
    setTimeout(initApp, 100);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
