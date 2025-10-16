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
    
    // Emotion categories matching VoiceShield
    this.emotions = [
      { name: 'Neutral', value: 0, color: 'gray', icon: 'fa-meh' },
      { name: 'Happy', value: 0, color: 'yellow', icon: 'fa-smile' },
      { name: 'Sad', value: 0, color: 'blue', icon: 'fa-frown' },
      { name: 'Angry', value: 0, color: 'red', icon: 'fa-angry' },
      { name: 'Fearful', value: 0, color: 'purple', icon: 'fa-grimace' },
      { name: 'Disgusted', value: 0, color: 'green', icon: 'fa-tired' },
      { name: 'Surprised', value: 0, color: 'pink', icon: 'fa-surprise' }
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
      <div class="emotion-item">
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center space-x-2">
            <i class="fas ${emotion.icon} text-${emotion.color}-400"></i>
            <span class="font-semibold">${emotion.name}</span>
          </div>
          <span class="text-sm font-bold text-${emotion.color}-400" id="${emotion.name.toLowerCase()}-value">0%</span>
        </div>
        <div class="h-3 bg-gray-700 rounded-full overflow-hidden">
          <div id="${emotion.name.toLowerCase()}-bar" class="h-full bg-gradient-to-r from-${emotion.color}-400 to-${emotion.color}-600 emotion-bar transition-all duration-500" style="width: 0%"></div>
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
    
    // Update audio bars
    const bars = 5;
    for (let i = 1; i <= bars; i++) {
      const bar = document.getElementById(`audioBar${i}`);
      if (i * 20 < normalizedVolume) {
        bar.classList.remove('bg-gray-600');
        bar.classList.add('bg-green-400');
      } else {
        bar.classList.remove('bg-green-400');
        bar.classList.add('bg-gray-600');
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
    alertDiv.className = 'fixed top-20 right-4 bg-red-500 text-white px-6 py-4 rounded-lg shadow-2xl z-50 animate-bounce';
    alertDiv.innerHTML = `
      <div class="flex items-center space-x-3">
        <i class="fas fa-exclamation-triangle text-3xl"></i>
        <div>
          <div class="font-bold text-lg">⚠️ Anger Alert!</div>
          <div class="text-sm">Anger Level: ${Math.round(angerLevel * 100)}%</div>
        </div>
      </div>
    `;
    
    document.body.appendChild(alertDiv);
    
    // Auto-remove after 10 seconds
    setTimeout(() => {
      alertDiv.remove();
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
        bar.classList.remove('bg-green-400');
        bar.classList.add('bg-gray-600');
      }
    }
  }
  
  updateStatus(status, text) {
    const statusDot = document.getElementById('statusDot');
    const statusText = document.getElementById('statusText');
    const statusBadge = document.getElementById('statusBadge');
    
    statusText.textContent = text;
    
    switch (status) {
      case 'connected':
        statusDot.classList.remove('bg-gray-500', 'bg-yellow-500', 'bg-red-500');
        statusDot.classList.add('bg-green-500');
        statusBadge.classList.remove('bg-gray-800/80', 'bg-yellow-800/80', 'bg-red-800/80');
        statusBadge.classList.add('bg-green-800/80');
        break;
      case 'connecting':
        statusDot.classList.remove('bg-gray-500', 'bg-green-500', 'bg-red-500');
        statusDot.classList.add('bg-yellow-500');
        statusBadge.classList.remove('bg-gray-800/80', 'bg-green-800/80', 'bg-red-800/80');
        statusBadge.classList.add('bg-yellow-800/80');
        break;
      case 'error':
        statusDot.classList.remove('bg-gray-500', 'bg-green-500', 'bg-yellow-500');
        statusDot.classList.add('bg-red-500');
        statusBadge.classList.remove('bg-gray-800/80', 'bg-green-800/80', 'bg-yellow-800/80');
        statusBadge.classList.add('bg-red-800/80');
        break;
      default:
        statusDot.classList.remove('bg-green-500', 'bg-yellow-500', 'bg-red-500');
        statusDot.classList.add('bg-gray-500');
        statusBadge.classList.remove('bg-green-800/80', 'bg-yellow-800/80', 'bg-red-800/80');
        statusBadge.classList.add('bg-gray-800/80');
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
