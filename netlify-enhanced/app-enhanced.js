// PassionBots Enhanced - Complete Emotion Detection System
// Includes: Voice Classification, Session History, Analytics, Multi-language, Alert Config

// Session History Manager
class SessionHistoryManager {
  constructor() {
    this.sessions = this.loadSessions();
    this.currentSession = null;
  }
  
  loadSessions() {
    try {
      return JSON.parse(localStorage.getItem('emotion_sessions') || '[]');
    } catch {
      return [];
    }
  }
  
  saveSessions() {
    localStorage.setItem('emotion_sessions', JSON.stringify(this.sessions));
  }
  
  startSession() {
    this.currentSession = {
      id: Date.now(),
      startTime: new Date().toISOString(),
      endTime: null,
      duration: 0,
      emotionData: [],
      alerts: [],
      dominantEmotion: null
    };
  }
  
  recordEmotion(emotions, scores) {
    if (!this.currentSession) return;
    
    this.currentSession.emotionData.push({
      timestamp: Date.now(),
      emotions: {...emotions},
      scores: {...scores}
    });
  }
  
  recordAlert(angerLevel) {
    if (!this.currentSession) return;
    
    this.currentSession.alerts.push({
      timestamp: Date.now(),
      angerLevel: angerLevel,
      time: new Date().toLocaleTimeString()
    });
  }
  
  endSession() {
    if (!this.currentSession) return;
    
    this.currentSession.endTime = new Date().toISOString();
    this.currentSession.duration = Date.now() - this.currentSession.id;
    
    // Calculate dominant emotion
    const emotionCounts = {};
    this.currentSession.emotionData.forEach(data => {
      const dominant = Object.entries(data.emotions)
        .sort(([,a], [,b]) => b - a)[0];
      if (dominant) {
        emotionCounts[dominant[0]] = (emotionCounts[dominant[0]] || 0) + 1;
      }
    });
    
    this.currentSession.dominantEmotion = Object.entries(emotionCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'Neutral';
    
    this.sessions.unshift(this.currentSession);
    if (this.sessions.length > 20) this.sessions.pop(); // Keep last 20 sessions
    
    this.saveSessions();
    this.currentSession = null;
  }
  
  getSessions() {
    return this.sessions;
  }
  
  clearSessions() {
    this.sessions = [];
    this.saveSessions();
  }
  
  exportSessions() {
    const dataStr = JSON.stringify(this.sessions, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `emotion-sessions-${Date.now()}.json`;
    link.click();
  }
}

// Voice Emotion Classifier
class VoiceEmotionClassifier {
  constructor() {
    this.audioContext = null;
    this.analyser = null;
    this.dataArray = null;
  }
  
  setup(stream) {
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.analyser = this.audioContext.createAnalyser();
    const source = this.audioContext.createMediaStreamSource(stream);
    source.connect(this.analyser);
    this.analyser.fftSize = 2048;
    this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
  }
  
  getAudioFeatures() {
    if (!this.analyser) return null;
    
    this.analyser.getByteFrequencyData(this.dataArray);
    
    // Calculate audio features
    const rmsEnergy = this.calculateRMS();
    const spectralCentroid = this.calculateSpectralCentroid();
    const zeroCrossingRate = this.calculateZeroCrossingRate();
    const pitchVariation = this.calculatePitchVariation();
    
    return {
      rmsEnergy,
      spectralCentroid,
      zeroCrossingRate,
      pitchVariation
    };
  }
  
  calculateRMS() {
    let sum = 0;
    for (let i = 0; i < this.dataArray.length; i++) {
      sum += this.dataArray[i] * this.dataArray[i];
    }
    return Math.sqrt(sum / this.dataArray.length);
  }
  
  calculateSpectralCentroid() {
    let numerator = 0;
    let denominator = 0;
    for (let i = 0; i < this.dataArray.length; i++) {
      numerator += i * this.dataArray[i];
      denominator += this.dataArray[i];
    }
    return denominator > 0 ? numerator / denominator : 0;
  }
  
  calculateZeroCrossingRate() {
    let crossings = 0;
    for (let i = 1; i < this.dataArray.length; i++) {
      if ((this.dataArray[i] >= 128 && this.dataArray[i-1] < 128) ||
          (this.dataArray[i] < 128 && this.dataArray[i-1] >= 128)) {
        crossings++;
      }
    }
    return crossings / this.dataArray.length;
  }
  
  calculatePitchVariation() {
    let variation = 0;
    for (let i = 1; i < this.dataArray.length; i++) {
      variation += Math.abs(this.dataArray[i] - this.dataArray[i-1]);
    }
    return variation / this.dataArray.length;
  }
  
  classifyEmotion(features) {
    if (!features) return { emotion: 'Neutral', confidence: 0 };
    
    const { rmsEnergy, spectralCentroid, zeroCrossingRate, pitchVariation } = features;
    
    // Simple rule-based classification (can be replaced with ML model)
    if (rmsEnergy > 30 && spectralCentroid < 50) {
      return { emotion: 'Angry', confidence: Math.min(rmsEnergy / 50, 1) };
    } else if (rmsEnergy > 25 && pitchVariation > 20) {
      return { emotion: 'Happy', confidence: Math.min(rmsEnergy / 40, 1) };
    } else if (rmsEnergy < 15 && spectralCentroid < 40) {
      return { emotion: 'Sad', confidence: Math.min((50 - spectralCentroid) / 50, 1) };
    } else if (zeroCrossingRate > 0.3 && pitchVariation > 25) {
      return { emotion: 'Surprised', confidence: Math.min(zeroCrossingRate, 1) };
    } else if (rmsEnergy > 20 && zeroCrossingRate > 0.25) {
      return { emotion: 'Fearful', confidence: Math.min(zeroCrossingRate, 1) };
    } else {
      return { emotion: 'Neutral', confidence: Math.min(1 - rmsEnergy / 50, 1) };
    }
  }
  
  cleanup() {
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}

// Enhanced Emotion Detector with all features
class EnhancedEmotionDetector {
  constructor() {
    this.isRunning = false;
    this.videoStream = null;
    this.modelsLoaded = false;
    this.detectionInterval = null;
    this.currentLanguage = getCurrentLanguage();
    
    // Managers
    this.historyManager = new SessionHistoryManager();
    this.voiceClassifier = new VoiceEmotionClassifier();
    
    // Alert configuration
    this.alertConfig = this.loadAlertConfig();
    
    // Emotions
    this.emotions = [
      { name: 'Neutral', value: 0, color: '#9CA3AF', barColor: 'from-gray-400 to-gray-500', icon: 'fa-meh' },
      { name: 'Happy', value: 0, color: '#FDB813', barColor: 'from-yellow-400 to-yellow-500', icon: 'fa-smile' },
      { name: 'Sad', value: 0, color: '#60A5FA', barColor: 'from-blue-400 to-blue-500', icon: 'fa-frown' },
      { name: 'Angry', value: 0, color: '#EF4444', barColor: 'from-red-500 to-red-600', icon: 'fa-angry' },
      { name: 'Fearful', value: 0, color: '#A78BFA', barColor: 'from-purple-400 to-purple-500', icon: 'fa-grimace' },
      { name: 'Disgusted', value: 0, color: '#34D399', barColor: 'from-green-400 to-green-500', icon: 'fa-tired' },
      { name: 'Surprised', value: 0, color: '#F472B6', barColor: 'from-pink-400 to-pink-500', icon: 'fa-surprise' }
    ];
    
    this.voiceEmotion = { emotion: 'Neutral', confidence: 0 };
    
    this.initializeUI();
    this.renderEmotionBars();
    this.renderHistory();
    this.loadModels();
  }
  
  loadAlertConfig() {
    const defaultConfig = {
      threshold: 0.6,
      cooldown: 30,
      enabled: true,
      soundEnabled: true,
      lastAlertTime: 0
    };
    
    try {
      const saved = localStorage.getItem('alert_config');
      return saved ? {...defaultConfig, ...JSON.parse(saved)} : defaultConfig;
    } catch {
      return defaultConfig;
    }
  }
  
  saveAlertConfig() {
    localStorage.setItem('alert_config', JSON.stringify(this.alertConfig));
  }
  
  initializeUI() {
    document.getElementById('startBtn').addEventListener('click', () => this.start());
    document.getElementById('stopBtn').addEventListener('click', () => this.stop());
    document.getElementById('configBtn')?.addEventListener('click', () => this.showConfigModal());
    document.getElementById('exportBtn')?.addEventListener('click', () => this.exportData());
    document.getElementById('clearHistoryBtn')?.addEventListener('click', () => this.clearHistory());
    
    // Language selector
    const langSelect = document.getElementById('languageSelect');
    if (langSelect) {
      langSelect.value = this.currentLanguage;
      langSelect.addEventListener('change', (e) => {
        this.currentLanguage = e.target.value;
        setLanguage(this.currentLanguage);
      });
    }
    
    // Initialize alert config UI
    this.initAlertConfigUI();
  }
  
  initAlertConfigUI() {
    const thresholdSlider = document.getElementById('thresholdSlider');
    const cooldownSlider = document.getElementById('cooldownSlider');
    const enableAlerts = document.getElementById('enableAlerts');
    const soundEnabled = document.getElementById('soundEnabled');
    
    if (thresholdSlider) {
      thresholdSlider.value = this.alertConfig.threshold * 100;
      document.getElementById('thresholdValue').textContent = Math.round(this.alertConfig.threshold * 100) + '%';
      thresholdSlider.addEventListener('input', (e) => {
        document.getElementById('thresholdValue').textContent = e.target.value + '%';
      });
    }
    
    if (cooldownSlider) {
      cooldownSlider.value = this.alertConfig.cooldown;
      document.getElementById('cooldownValue').textContent = this.alertConfig.cooldown + 's';
      cooldownSlider.addEventListener('input', (e) => {
        document.getElementById('cooldownValue').textContent = e.target.value + 's';
      });
    }
    
    if (enableAlerts) enableAlerts.checked = this.alertConfig.enabled;
    if (soundEnabled) soundEnabled.checked = this.alertConfig.soundEnabled;
  }
  
  saveConfig() {
    const thresholdSlider = document.getElementById('thresholdSlider');
    const cooldownSlider = document.getElementById('cooldownSlider');
    const enableAlerts = document.getElementById('enableAlerts');
    const soundEnabled = document.getElementById('soundEnabled');
    
    this.alertConfig.threshold = (thresholdSlider?.value || 60) / 100;
    this.alertConfig.cooldown = parseInt(cooldownSlider?.value || 30);
    this.alertConfig.enabled = enableAlerts?.checked ?? true;
    this.alertConfig.soundEnabled = soundEnabled?.checked ?? true;
    
    this.saveAlertConfig();
    this.hideConfigModal();
    
    // Show success message
    this.showToast(t('alert_save', this.currentLanguage) + ' ✅');
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
            <span class="font-bold text-white" data-i18n="emotion_${emotion.name.toLowerCase()}">${emotion.name}</span>
          </div>
          <span class="text-xl font-display font-black" style="color: ${emotion.color}" id="${emotion.name.toLowerCase()}-value">0%</span>
        </div>
        <div class="h-2 bg-black rounded-full overflow-hidden">
          <div id="${emotion.name.toLowerCase()}-bar" class="h-full bg-gradient-to-r ${emotion.barColor} emotion-bar transition-all duration-500" style="width: 0%"></div>
        </div>
      </div>
    `).join('');
  }
  
  renderHistory() {
    const container = document.getElementById('historyContainer');
    if (!container) return;
    
    const sessions = this.historyManager.getSessions();
    
    if (sessions.length === 0) {
      container.innerHTML = `
        <div class="text-center py-8 text-gray-400">
          <i class="fas fa-history text-4xl mb-3"></i>
          <p data-i18n="history_empty">${t('history_empty', this.currentLanguage)}</p>
        </div>
      `;
      return;
    }
    
    container.innerHTML = sessions.map((session, index) => {
      const duration = Math.round(session.duration / 1000);
      const date = new Date(session.startTime).toLocaleString();
      
      return `
        <div class="card-professional rounded-xl p-4 mb-3 hover:border-passion-yellow transition-all">
          <div class="flex justify-between items-start mb-2">
            <div>
              <h4 class="font-bold text-white">${t('history_session', this.currentLanguage)} ${index + 1}</h4>
              <p class="text-sm text-gray-400">${date}</p>
            </div>
            <span class="px-3 py-1 bg-passion-yellow text-passion-black rounded-full text-xs font-bold">
              ${duration}s
            </span>
          </div>
          <div class="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span class="text-gray-400">${t('history_emotions', this.currentLanguage)}:</span>
              <span class="text-white font-bold ml-1">${session.dominantEmotion}</span>
            </div>
            <div>
              <span class="text-gray-400">${t('history_alerts', this.currentLanguage)}:</span>
              <span class="text-passion-yellow font-bold ml-1">${session.alerts.length}</span>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }
  
  async loadModels() {
    try {
      this.updateStatus('connecting', t('status_model', this.currentLanguage) + ': Loading...');
      document.getElementById('modelStatus').textContent = 'Loading...';
      
      const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.12/model';
      
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL)
      ]);
      
      this.modelsLoaded = true;
      this.updateStatus('disconnected', 'Models Loaded - Ready');
      document.getElementById('modelStatus').textContent = t('status_loaded', this.currentLanguage);
      
      console.log('✅ Face-api.js models loaded successfully');
    } catch (error) {
      console.error('Error loading models:', error);
      this.updateStatus('error', 'Model Loading Failed');
      document.getElementById('modelStatus').textContent = 'Failed';
    }
  }
  
  async start() {
    if (!this.modelsLoaded) {
      alert('Please wait for models to load first');
      return;
    }
    
    try {
      this.updateStatus('connecting', 'Requesting permissions...');
      document.getElementById('permissionAlert').classList.remove('hidden');
      
      this.videoStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: true
      });
      
      const videoElement = document.getElementById('videoElement');
      const videoPlaceholder = document.getElementById('videoPlaceholder');
      videoElement.srcObject = this.videoStream;
      
      await new Promise((resolve) => {
        videoElement.onloadedmetadata = () => {
          videoElement.play();
          resolve();
        };
      });
      
      videoElement.classList.remove('hidden');
      videoPlaceholder.classList.add('hidden');
      
      // Setup voice classifier
      this.voiceClassifier.setup(this.videoStream);
      
      this.isRunning = true;
      this.updateStatus('connected', 'Detection Active');
      document.getElementById('permissionAlert').classList.add('hidden');
      document.getElementById('startBtn').classList.add('hidden');
      document.getElementById('stopBtn').classList.remove('hidden');
      document.getElementById('cameraStatus').textContent = t('status_active', this.currentLanguage);
      document.getElementById('micStatus').textContent = t('status_active', this.currentLanguage);
      
      videoElement.classList.add('recording');
      
      // Start session
      this.historyManager.startSession();
      
      this.startRealTimeDetection();
      this.animateAudioBars();
      
    } catch (error) {
      console.error('Error accessing media devices:', error);
      this.updateStatus('error', 'Permission Denied');
    }
  }
  
  stop() {
    this.isRunning = false;
    
    if (this.detectionInterval) {
      clearInterval(this.detectionInterval);
      this.detectionInterval = null;
    }
    
    if (this.videoStream) {
      this.videoStream.getTracks().forEach(track => track.stop());
      this.videoStream = null;
    }
    
    this.voiceClassifier.cleanup();
    
    const videoElement = document.getElementById('videoElement');
    const videoPlaceholder = document.getElementById('videoPlaceholder');
    videoElement.srcObject = null;
    videoElement.classList.add('hidden');
    videoElement.classList.remove('recording');
    videoPlaceholder.classList.remove('hidden');
    
    document.getElementById('startBtn').classList.remove('hidden');
    document.getElementById('stopBtn').classList.add('hidden');
    this.updateStatus('disconnected', 'Disconnected');
    document.getElementById('cameraStatus').textContent = t('status_inactive', this.currentLanguage);
    document.getElementById('micStatus').textContent = t('status_inactive', this.currentLanguage);
    
    // End session
    this.historyManager.endSession();
    this.renderHistory();
    
    this.resetScores();
  }
  
  animateAudioBars() {
    if (!this.isRunning) return;
    
    const features = this.voiceClassifier.getAudioFeatures();
    if (features) {
      const normalizedVolume = Math.min(100, (features.rmsEnergy / 50) * 100);
      
      for (let i = 1; i <= 5; i++) {
        const bar = document.getElementById(`audioBar${i}`);
        if (bar) {
          bar.style.backgroundColor = i * 20 < normalizedVolume ? '#FDB813' : '#3A3A3A';
        }
      }
      
      // Update voice emotion
      this.voiceEmotion = this.voiceClassifier.classifyEmotion(features);
      const voiceScore = Math.round(this.voiceEmotion.confidence * 100);
      this.updateScore('voiceScore', voiceScore);
    }
    
    requestAnimationFrame(() => this.animateAudioBars());
  }
  
  async startRealTimeDetection() {
    const videoElement = document.getElementById('videoElement');
    
    this.detectionInterval = setInterval(async () => {
      if (!this.isRunning) return;
      
      try {
        const detections = await faceapi
          .detectAllFaces(videoElement, new faceapi.TinyFaceDetectorOptions())
          .withFaceExpressions();
        
        if (detections && detections.length > 0) {
          document.getElementById('faceCount').textContent = detections.length;
          
          const expressions = detections[0].expressions;
          let facialScoreSum = 0;
          
          this.emotions.forEach(emotion => {
            const apiKey = emotion.name.toLowerCase();
            let value = expressions[apiKey] ? expressions[apiKey] * 100 : 0;
            
            const currentValue = emotion.value;
            emotion.value = currentValue * 0.7 + value * 0.3;
            facialScoreSum += emotion.value;
            
            const bar = document.getElementById(`${apiKey}-bar`);
            const valueSpan = document.getElementById(`${apiKey}-value`);
            if (bar && valueSpan) {
              bar.style.width = `${emotion.value}%`;
              valueSpan.textContent = `${Math.round(emotion.value)}%`;
            }
          });
          
          const facialScore = Math.min(100, Math.round(facialScoreSum / 2));
          const voiceScore = Math.round(this.voiceEmotion.confidence * 100);
          const combinedScore = Math.round((facialScore + voiceScore) / 2);
          
          this.updateScore('facialScore', facialScore);
          this.updateScore('combinedScore', combinedScore);
          
          // Record to history
          const emotionValues = {};
          this.emotions.forEach(e => {
            emotionValues[e.name] = Math.round(e.value);
          });
          
          this.historyManager.recordEmotion(emotionValues, {
            facial: facialScore,
            voice: voiceScore,
            combined: combinedScore
          });
          
          // Check anger alerts
          const angerEmotion = this.emotions.find(e => e.name === 'Angry');
          if (angerEmotion && this.alertConfig.enabled) {
            this.checkAngerAlert(angerEmotion.value / 100);
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
    const timeSinceLastAlert = (now - this.alertConfig.lastAlertTime) / 1000;
    
    if (angerLevel >= this.alertConfig.threshold && timeSinceLastAlert >= this.alertConfig.cooldown) {
      this.showAngerAlert(angerLevel);
      this.alertConfig.lastAlertTime = now;
      this.historyManager.recordAlert(angerLevel);
      
      if (this.alertConfig.soundEnabled) {
        this.playAlertSound();
      }
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
          <div class="font-display font-black text-lg text-white mb-1">⚠️ ${t('alert_anger', this.currentLanguage)}</div>
          <div class="text-sm text-gray-400">${t('alert_level', this.currentLanguage)}: <span class="text-passion-yellow font-bold">${Math.round(angerLevel * 100)}%</span></div>
        </div>
      </div>
    `;
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
      alertDiv.style.opacity = '0';
      alertDiv.style.transform = 'translateX(100%)';
      alertDiv.style.transition = 'all 0.5s ease';
      setTimeout(() => alertDiv.remove(), 500);
    }, 10000);
  }
  
  playAlertSound() {
    // Create a simple beep sound
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  }
  
  updateScore(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
      element.textContent = value + (elementId === 'combinedScore' ? '' : '%');
    }
    
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
    
    for (let i = 1; i <= 5; i++) {
      const bar = document.getElementById(`audioBar${i}`);
      if (bar) bar.style.backgroundColor = '#3A3A3A';
    }
  }
  
  updateStatus(status, text) {
    const statusDot = document.getElementById('statusDot');
    const statusText = document.getElementById('statusText');
    
    statusText.textContent = text;
    
    switch (status) {
      case 'connected':
        statusDot.style.backgroundColor = '#10B981';
        break;
      case 'connecting':
        statusDot.style.backgroundColor = '#FDB813';
        break;
      case 'error':
        statusDot.style.backgroundColor = '#EF4444';
        break;
      default:
        statusDot.style.backgroundColor = '#6B7280';
    }
  }
  
  showConfigModal() {
    const modal = document.getElementById('configModal');
    if (modal) modal.classList.remove('hidden');
  }
  
  hideConfigModal() {
    const modal = document.getElementById('configModal');
    if (modal) modal.classList.add('hidden');
  }
  
  exportData() {
    this.historyManager.exportSessions();
    this.showToast('Data exported successfully! 📊');
  }
  
  clearHistory() {
    if (confirm('Are you sure you want to clear all session history?')) {
      this.historyManager.clearSessions();
      this.renderHistory();
      this.showToast('History cleared! 🗑️');
    }
  }
  
  showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-4 right-4 px-6 py-3 bg-passion-yellow text-passion-black rounded-lg shadow-xl font-bold z-50';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
}

// Initialize app
let detectorInstance = null;

function initApp() {
  if (typeof faceapi !== 'undefined') {
    console.log('✅ face-api.js loaded');
    detectorInstance = new EnhancedEmotionDetector();
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
