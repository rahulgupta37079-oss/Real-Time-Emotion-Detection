// Multi-language translations
const translations = {
  en: {
    // Navigation
    nav_features: "Features",
    nav_about: "About",
    nav_history: "History",
    nav_settings: "Settings",
    
    // Hero
    hero_badge: "AI-Powered Technology",
    hero_title: "Real-Time Emotion Detection",
    hero_subtitle: "Advanced multi-modal AI system analyzing facial expressions and voice patterns with state-of-the-art machine learning models",
    
    // Buttons
    btn_start: "Start Detection",
    btn_stop: "Stop",
    btn_configure: "Configure Alerts",
    btn_export: "Export Data",
    btn_clear_history: "Clear History",
    
    // Emotions
    emotion_neutral: "Neutral",
    emotion_happy: "Happy",
    emotion_sad: "Sad",
    emotion_angry: "Angry",
    emotion_fearful: "Fearful",
    emotion_disgusted: "Disgusted",
    emotion_surprised: "Surprised",
    
    // Scores
    score_combined: "Combined Score",
    score_facial: "Facial Score",
    score_voice: "Voice Score",
    score_intensity: "Overall Emotion Intensity",
    
    // System Status
    status_title: "System Status",
    status_camera: "Camera",
    status_microphone: "Microphone",
    status_model: "AI Model",
    status_active: "Active",
    status_inactive: "Inactive",
    status_loaded: "Loaded",
    status_not_loaded: "Not Loaded",
    
    // Alert Configuration
    alert_config_title: "Alert Configuration",
    alert_threshold: "Anger Threshold",
    alert_cooldown: "Cooldown Period",
    alert_enable: "Enable Alerts",
    alert_sound: "Sound Notifications",
    alert_save: "Save Configuration",
    
    // History
    history_title: "Session History",
    history_empty: "No sessions recorded yet",
    history_session: "Session",
    history_duration: "Duration",
    history_emotions: "Dominant Emotions",
    history_alerts: "Alerts Triggered",
    
    // Features
    feature_privacy_title: "Privacy First",
    feature_privacy_desc: "All processing happens locally in your browser. Zero data transmission or storage.",
    feature_fast_title: "Lightning Fast",
    feature_fast_desc: "Real-time emotion detection at 10 FPS. Powered by TensorFlow.js for instant results.",
    feature_ai_title: "Multi-Modal AI",
    feature_ai_desc: "Advanced fusion of facial expression and voice analysis for comprehensive detection.",
    
    // About
    about_title: "About PassionBots Emotion Detection",
    about_desc: "PassionBots is a cutting-edge emotion detection platform that combines state-of-the-art machine learning with intuitive design.",
    
    // Permissions
    permission_required: "Permission Required",
    permission_camera_mic: "Please grant camera and microphone access to begin emotion detection",
    
    // Alerts
    alert_anger: "Anger Detected!",
    alert_level: "Anger Level",
    
    // Settings
    settings_title: "Settings",
    settings_language: "Language",
    settings_theme: "Theme",
    settings_notifications: "Notifications",
    settings_data: "Data Management"
  },
  
  es: {
    // Navigation
    nav_features: "Características",
    nav_about: "Acerca de",
    nav_history: "Historial",
    nav_settings: "Configuración",
    
    // Hero
    hero_badge: "Tecnología con IA",
    hero_title: "Detección de Emociones en Tiempo Real",
    hero_subtitle: "Sistema avanzado de IA multimodal que analiza expresiones faciales y patrones de voz con modelos de aprendizaje automático",
    
    // Buttons
    btn_start: "Iniciar Detección",
    btn_stop: "Detener",
    btn_configure: "Configurar Alertas",
    btn_export: "Exportar Datos",
    btn_clear_history: "Borrar Historial",
    
    // Emotions
    emotion_neutral: "Neutral",
    emotion_happy: "Feliz",
    emotion_sad: "Triste",
    emotion_angry: "Enojado",
    emotion_fearful: "Temeroso",
    emotion_disgusted: "Disgustado",
    emotion_surprised: "Sorprendido",
    
    // Scores
    score_combined: "Puntuación Combinada",
    score_facial: "Puntuación Facial",
    score_voice: "Puntuación de Voz",
    score_intensity: "Intensidad Emocional General",
    
    // System Status
    status_title: "Estado del Sistema",
    status_camera: "Cámara",
    status_microphone: "Micrófono",
    status_model: "Modelo IA",
    status_active: "Activo",
    status_inactive: "Inactivo",
    status_loaded: "Cargado",
    status_not_loaded: "No Cargado",
    
    // Alert Configuration
    alert_config_title: "Configuración de Alertas",
    alert_threshold: "Umbral de Ira",
    alert_cooldown: "Período de Espera",
    alert_enable: "Habilitar Alertas",
    alert_sound: "Notificaciones de Sonido",
    alert_save: "Guardar Configuración",
    
    // History
    history_title: "Historial de Sesiones",
    history_empty: "Aún no hay sesiones registradas",
    history_session: "Sesión",
    history_duration: "Duración",
    history_emotions: "Emociones Dominantes",
    history_alerts: "Alertas Activadas"
  },
  
  hi: {
    // Navigation
    nav_features: "विशेषताएं",
    nav_about: "के बारे में",
    nav_history: "इतिहास",
    nav_settings: "सेटिंग्स",
    
    // Hero
    hero_badge: "एआई-संचालित प्रौद्योगिकी",
    hero_title: "रीयल-टाइम भावना पहचान",
    hero_subtitle: "उन्नत बहु-मोडल एआई प्रणाली जो अत्याधुनिक मशीन लर्निंग मॉडल के साथ चेहरे के भाव और आवाज़ पैटर्न का विश्लेषण करती है",
    
    // Buttons
    btn_start: "पहचान शुरू करें",
    btn_stop: "रोकें",
    btn_configure: "अलर्ट कॉन्फ़िगर करें",
    btn_export: "डेटा निर्यात करें",
    btn_clear_history: "इतिहास साफ़ करें",
    
    // Emotions
    emotion_neutral: "तटस्थ",
    emotion_happy: "खुश",
    emotion_sad: "उदास",
    emotion_angry: "क्रोधित",
    emotion_fearful: "भयभीत",
    emotion_disgusted: "घृणित",
    emotion_surprised: "आश्चर्यचकित",
    
    // Scores
    score_combined: "संयुक्त स्कोर",
    score_facial: "चेहरे का स्कोर",
    score_voice: "आवाज़ स्कोर",
    score_intensity: "समग्र भावना तीव्रता"
  },
  
  zh: {
    // Navigation
    nav_features: "特征",
    nav_about: "关于",
    nav_history: "历史",
    nav_settings: "设置",
    
    // Hero
    hero_badge: "人工智能技术",
    hero_title: "实时情绪检测",
    hero_subtitle: "使用最先进的机器学习模型分析面部表情和语音模式的先进多模态AI系统",
    
    // Buttons
    btn_start: "开始检测",
    btn_stop: "停止",
    btn_configure: "配置警报",
    btn_export: "导出数据",
    btn_clear_history: "清除历史",
    
    // Emotions
    emotion_neutral: "中性",
    emotion_happy: "快乐",
    emotion_sad: "悲伤",
    emotion_angry: "生气",
    emotion_fearful: "恐惧",
    emotion_disgusted: "厌恶",
    emotion_surprised: "惊讶",
    
    // Scores
    score_combined: "综合得分",
    score_facial: "面部得分",
    score_voice: "语音得分",
    score_intensity: "整体情绪强度"
  }
};

// Get translation
function t(key, lang = 'en') {
  return translations[lang]?.[key] || translations.en[key] || key;
}

// Get current language from localStorage or browser
function getCurrentLanguage() {
  return localStorage.getItem('app_language') || navigator.language.split('-')[0] || 'en';
}

// Set language
function setLanguage(lang) {
  localStorage.setItem('app_language', lang);
  updateUILanguage(lang);
}

// Update UI with current language
function updateUILanguage(lang) {
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    element.textContent = t(key, lang);
  });
}
