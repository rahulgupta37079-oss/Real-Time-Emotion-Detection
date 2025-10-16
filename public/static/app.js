// PassionBots - Emotion Detection App
// This simulates emotion detection with smooth animations and realistic behavior

class EmotionDetector {
  constructor() {
    this.isRunning = false;
    this.videoStream = null;
    this.audioContext = null;
    this.analyser = null;
    
    // Emotion categories
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
  
  async start() {
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
      videoElement.src = '';
      videoElement.srcObject = this.videoStream;
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
      document.getElementById('modelStatus').textContent = 'Loaded';
      
      // Add recording indicator
      videoElement.classList.add('recording');
      
      // Start detection simulation
      this.startDetectionLoop();
      
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
    document.getElementById('modelStatus').textContent = 'Not Loaded';
    
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
    const threshold = normalizedVolume / bars;
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
  
  startDetectionLoop() {
    if (!this.isRunning) return;
    
    // Simulate emotion detection with realistic variations
    this.simulateEmotionDetection();
    
    // Update face count (random 0-3)
    const faceCount = Math.floor(Math.random() * 2) + 1;
    document.getElementById('faceCount').textContent = faceCount;
    
    // Continue loop
    setTimeout(() => this.startDetectionLoop(), 1000);
  }
  
  simulateEmotionDetection() {
    // Generate realistic emotion probabilities
    // One or two emotions should be dominant, others lower
    const dominantEmotion = Math.floor(Math.random() * this.emotions.length);
    const secondaryEmotion = (dominantEmotion + Math.floor(Math.random() * 3) + 1) % this.emotions.length;
    
    let facialScoreSum = 0;
    
    this.emotions.forEach((emotion, index) => {
      let value;
      if (index === dominantEmotion) {
        value = 40 + Math.random() * 35; // 40-75%
      } else if (index === secondaryEmotion) {
        value = 15 + Math.random() * 20; // 15-35%
      } else {
        value = Math.random() * 15; // 0-15%
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
    const voiceScore = Math.round(30 + Math.random() * 40); // 30-70%
    const combinedScore = Math.round((facialScore + voiceScore) / 2);
    
    // Update score displays
    this.updateScore('facialScore', facialScore);
    this.updateScore('voiceScore', voiceScore);
    this.updateScore('combinedScore', combinedScore);
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
      bar.classList.remove('bg-green-400');
      bar.classList.add('bg-gray-600');
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

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
  new EmotionDetector();
});
