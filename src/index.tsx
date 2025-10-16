import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'

const app = new Hono()

// Enable CORS for API routes
app.use('/api/*', cors())

// Serve static files
app.use('/static/*', serveStatic({ root: './' }))

// Main page
app.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>PassionBots - AI Emotion Detection</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Poppins:wght@600;700;800;900&display=swap" rel="stylesheet">
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <script>
          tailwind.config = {
            theme: {
              extend: {
                colors: {
                  passion: {
                    yellow: '#FDB813',
                    'yellow-light': '#FFCE3E',
                    'yellow-dark': '#E5A000',
                    black: '#0A0A0A',
                    'gray-dark': '#1A1A1A',
                    'gray-medium': '#2A2A2A',
                    'gray-light': '#3A3A3A',
                  }
                },
                fontFamily: {
                  'sans': ['Inter', 'system-ui', 'sans-serif'],
                  'display': ['Poppins', 'Inter', 'sans-serif'],
                }
              }
            }
          }
        </script>
        <style>
          @keyframes pulse-glow-yellow {
            0%, 100% { box-shadow: 0 0 20px rgba(253, 184, 19, 0.4); }
            50% { box-shadow: 0 0 40px rgba(253, 184, 19, 0.7); }
          }
          @keyframes shine {
            0% { background-position: -200% center; }
            100% { background-position: 200% center; }
          }
          .recording { 
            animation: pulse-glow-yellow 2s infinite;
            border: 2px solid #FDB813 !important;
          }
          .emotion-bar {
            transition: width 0.5s ease-out;
          }
          .card-professional {
            background: linear-gradient(135deg, #1A1A1A 0%, #2A2A2A 100%);
            border: 1px solid #3A3A3A;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
          }
          .card-professional:hover {
            border-color: #FDB813;
            transform: translateY(-2px);
            transition: all 0.3s ease;
          }
          .gradient-text {
            background: linear-gradient(135deg, #FDB813 0%, #FFCE3E 50%, #FDB813 100%);
            background-size: 200% auto;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            animation: shine 3s linear infinite;
          }
          .btn-primary {
            background: linear-gradient(135deg, #FDB813 0%, #FFCE3E 100%);
            color: #0A0A0A;
            font-weight: 700;
            box-shadow: 0 4px 15px rgba(253, 184, 19, 0.4);
          }
          .btn-primary:hover {
            background: linear-gradient(135deg, #FFCE3E 0%, #FDB813 100%);
            box-shadow: 0 6px 25px rgba(253, 184, 19, 0.6);
            transform: translateY(-2px);
          }
          .accent-border {
            border-left: 4px solid #FDB813;
          }
        </style>
    </head>
    <body class="bg-passion-black min-h-screen text-white font-sans antialiased">
        <nav class="bg-passion-gray-dark border-b border-passion-gray-light sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
            <div class="container mx-auto px-6 py-4">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                        <div class="w-10 h-10 bg-gradient-to-br from-passion-yellow to-passion-yellow-light rounded-lg flex items-center justify-center">
                            <i class="fas fa-robot text-passion-black text-xl"></i>
                        </div>
                        <span class="text-2xl font-display font-bold gradient-text">PassionBots</span>
                    </div>
                    <div class="flex items-center space-x-6">
                        <a href="#features" class="text-sm font-medium hover:text-passion-yellow transition">
                            Features
                        </a>
                        <a href="#about" class="text-sm font-medium hover:text-passion-yellow transition">
                            About
                        </a>
                        <button class="px-4 py-2 bg-passion-yellow text-passion-black rounded-lg font-bold text-sm hover:bg-passion-yellow-light transition">
                            <i class="fas fa-rocket mr-2"></i>Get Started
                        </button>
                    </div>
                </div>
            </div>
        </nav>

        <div class="container mx-auto px-4 py-8">
            <!-- Header -->
            <div class="text-center mb-16">
                <div class="inline-block mb-4 px-4 py-2 bg-passion-gray-dark border border-passion-yellow/30 rounded-full">
                    <span class="text-passion-yellow font-bold text-sm">
                        <i class="fas fa-star mr-2"></i>AI-Powered Technology
                    </span>
                </div>
                <h1 class="text-6xl font-display font-black mb-6 gradient-text leading-tight">
                    Real-Time Emotion Detection
                </h1>
                <p class="text-xl text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed">
                    Advanced multi-modal AI system analyzing facial expressions and voice patterns with state-of-the-art machine learning models
                </p>
                <div id="permissionAlert" class="hidden bg-passion-gray-dark border-l-4 border-passion-yellow rounded-lg p-4 max-w-2xl mx-auto mb-6">
                    <div class="flex items-center">
                        <i class="fas fa-exclamation-circle text-passion-yellow text-2xl mr-4"></i>
                        <div class="text-left">
                            <p class="text-white font-semibold mb-1">Permission Required</p>
                            <p class="text-gray-400 text-sm">Please grant camera and microphone access to begin emotion detection</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Main Content Grid -->
            <div class="grid lg:grid-cols-3 gap-6">
                <!-- Left Column: Video Feed -->
                <div class="lg:col-span-2 space-y-6">
                    <!-- Video Container -->
                    <div class="card-professional rounded-2xl p-6">
                        <div class="relative">
                            <video id="videoElement" autoplay playsinline muted class="w-full rounded-xl bg-passion-black shadow-inner border-2 border-passion-gray-light" style="max-height: 500px;"></video>
                            <canvas id="canvas" class="hidden"></canvas>
                            <div id="videoPlaceholder" class="w-full h-96 bg-passion-black rounded-xl flex items-center justify-center border-2 border-dashed border-passion-gray-light">
                                <div class="text-center">
                                    <div class="w-20 h-20 bg-passion-gray-dark rounded-full flex items-center justify-center mx-auto mb-4">
                                        <i class="fas fa-video text-4xl text-passion-yellow"></i>
                                    </div>
                                    <p class="text-gray-400 font-medium">Camera feed will appear here</p>
                                    <p class="text-gray-500 text-sm mt-2">Click Start Detection to begin</p>
                                </div>
                            </div>
                            <!-- Status Badge -->
                            <div id="statusBadge" class="absolute top-4 right-4 px-4 py-2 rounded-lg font-bold text-sm flex items-center space-x-2 bg-passion-gray-dark/95 backdrop-blur border border-passion-gray-light">
                                <div id="statusDot" class="w-2 h-2 rounded-full bg-gray-500"></div>
                                <span id="statusText" class="uppercase tracking-wide text-xs">Disconnected</span>
                            </div>
                            <!-- Face Count Badge -->
                            <div class="absolute top-4 left-4 px-4 py-2 rounded-lg font-bold text-sm bg-passion-yellow text-passion-black">
                                <i class="fas fa-users mr-2"></i>
                                <span id="faceCount">0</span> Faces
                            </div>
                        </div>
                        
                        <!-- Controls -->
                        <div class="mt-6 flex justify-center space-x-4">
                            <button id="startBtn" class="btn-primary px-10 py-4 rounded-xl font-display text-lg transition transform hover:scale-105">
                                <i class="fas fa-play mr-3"></i> Start Detection
                            </button>
                            <button id="stopBtn" class="hidden px-10 py-4 bg-passion-gray-light rounded-xl font-bold hover:bg-passion-gray-medium transition transform hover:scale-105 border border-passion-gray-light">
                                <i class="fas fa-stop mr-3"></i> Stop
                            </button>
                        </div>
                    </div>

                    <!-- Emotion Probabilities -->
                    <div class="card-professional rounded-2xl p-6 accent-border">
                        <h3 class="text-2xl font-display font-bold mb-6 flex items-center text-white">
                            <div class="w-10 h-10 bg-passion-yellow rounded-lg flex items-center justify-center mr-3">
                                <i class="fas fa-chart-bar text-passion-black"></i>
                            </div>
                            Emotion Analysis
                        </h3>
                        <div id="emotionBars" class="space-y-4">
                            <!-- Emotion bars will be generated here -->
                        </div>
                    </div>
                </div>

                <!-- Right Column: Scores & Info -->
                <div class="space-y-6">
                    <!-- Combined Score -->
                    <div class="card-professional rounded-2xl p-8 text-center accent-border">
                        <div class="mb-4">
                            <div class="w-16 h-16 bg-passion-yellow rounded-2xl flex items-center justify-center mx-auto">
                                <i class="fas fa-brain text-3xl text-passion-black"></i>
                            </div>
                        </div>
                        <h3 class="text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">Combined Score</h3>
                        <div class="text-7xl font-display font-black gradient-text mb-3">
                            <span id="combinedScore">0</span><span class="text-5xl">%</span>
                        </div>
                        <p class="text-sm text-gray-500 font-medium">Overall Emotion Intensity</p>
                    </div>

                    <!-- Facial Score -->
                    <div class="card-professional rounded-2xl p-6">
                        <div class="flex items-center justify-between mb-4">
                            <div class="flex items-center">
                                <div class="w-10 h-10 bg-passion-gray-dark rounded-lg flex items-center justify-center mr-3">
                                    <i class="fas fa-smile text-passion-yellow"></i>
                                </div>
                                <h3 class="text-lg font-bold">Facial Score</h3>
                            </div>
                            <span id="facialScore" class="text-3xl font-display font-black text-passion-yellow">0%</span>
                        </div>
                        <div class="h-3 bg-passion-black rounded-full overflow-hidden">
                            <div id="facialScoreBar" class="h-full bg-gradient-to-r from-passion-yellow to-passion-yellow-light emotion-bar" style="width: 0%"></div>
                        </div>
                    </div>

                    <!-- Voice Score -->
                    <div class="card-professional rounded-2xl p-6">
                        <div class="flex items-center justify-between mb-4">
                            <div class="flex items-center">
                                <div class="w-10 h-10 bg-passion-gray-dark rounded-lg flex items-center justify-center mr-3">
                                    <i class="fas fa-microphone text-white"></i>
                                </div>
                                <h3 class="text-lg font-bold">Voice Score</h3>
                            </div>
                            <span id="voiceScore" class="text-3xl font-display font-black text-white">0%</span>
                        </div>
                        <div class="h-3 bg-passion-black rounded-full overflow-hidden">
                            <div id="voiceScoreBar" class="h-full bg-gradient-to-r from-gray-400 to-white emotion-bar" style="width: 0%"></div>
                        </div>
                        <div class="mt-4 flex items-center justify-between text-sm">
                            <span class="text-gray-400 font-medium">Audio Level</span>
                            <div class="flex space-x-1">
                                <div id="audioBar1" class="w-1.5 h-5 bg-passion-gray-light rounded-full"></div>
                                <div id="audioBar2" class="w-1.5 h-5 bg-passion-gray-light rounded-full"></div>
                                <div id="audioBar3" class="w-1.5 h-5 bg-passion-gray-light rounded-full"></div>
                                <div id="audioBar4" class="w-1.5 h-5 bg-passion-gray-light rounded-full"></div>
                                <div id="audioBar5" class="w-1.5 h-5 bg-passion-gray-light rounded-full"></div>
                            </div>
                        </div>
                    </div>

                    <!-- System Status -->
                    <div class="card-professional rounded-2xl p-6">
                        <h3 class="text-lg font-bold mb-4 flex items-center">
                            <div class="w-8 h-8 bg-passion-gray-dark rounded-lg flex items-center justify-center mr-3">
                                <i class="fas fa-cog text-gray-400"></i>
                            </div>
                            System Status
                        </h3>
                        <div class="space-y-3 text-sm">
                            <div class="flex justify-between items-center p-2 bg-passion-black rounded-lg">
                                <span class="text-gray-400 font-medium">Camera:</span>
                                <span id="cameraStatus" class="text-white font-bold">Inactive</span>
                            </div>
                            <div class="flex justify-between items-center p-2 bg-passion-black rounded-lg">
                                <span class="text-gray-400 font-medium">Microphone:</span>
                                <span id="micStatus" class="text-white font-bold">Inactive</span>
                            </div>
                            <div class="flex justify-between items-center p-2 bg-passion-black rounded-lg">
                                <span class="text-gray-400 font-medium">AI Model:</span>
                                <span id="modelStatus" class="text-white font-bold">Not Loaded</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Features Section -->
            <div id="features" class="mt-20 mb-12">
                <div class="text-center mb-12">
                    <h2 class="text-4xl font-display font-black mb-4 gradient-text">
                        Why Choose PassionBots?
                    </h2>
                    <p class="text-gray-400 text-lg">Professional-grade emotion detection powered by cutting-edge AI</p>
                </div>
                <div class="grid md:grid-cols-3 gap-6">
                    <div class="card-professional rounded-2xl p-8 text-center hover:border-passion-yellow transition-all">
                        <div class="w-16 h-16 bg-passion-yellow rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-shield-alt text-3xl text-passion-black"></i>
                        </div>
                        <h3 class="text-xl font-display font-bold mb-3 text-white">Privacy First</h3>
                        <p class="text-gray-400 leading-relaxed">All processing happens locally in your browser. Zero data transmission or storage. Your privacy is guaranteed.</p>
                    </div>
                    <div class="card-professional rounded-2xl p-8 text-center hover:border-passion-yellow transition-all accent-border">
                        <div class="w-16 h-16 bg-passion-yellow rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-bolt text-3xl text-passion-black"></i>
                        </div>
                        <h3 class="text-xl font-display font-bold mb-3 text-white">Lightning Fast</h3>
                        <p class="text-gray-400 leading-relaxed">Real-time emotion detection at 10 FPS. Powered by TensorFlow.js for instant, accurate results.</p>
                    </div>
                    <div class="card-professional rounded-2xl p-8 text-center hover:border-passion-yellow transition-all">
                        <div class="w-16 h-16 bg-passion-yellow rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-brain text-3xl text-passion-black"></i>
                        </div>
                        <h3 class="text-xl font-display font-bold mb-3 text-white">Multi-Modal AI</h3>
                        <p class="text-gray-400 leading-relaxed">Advanced fusion of facial expression and voice analysis for comprehensive emotion detection.</p>
                    </div>
                </div>
            </div>

            <!-- About Section -->
            <div id="about" class="mt-16 card-professional rounded-2xl p-12 accent-border">
                <div class="max-w-4xl mx-auto">
                    <h2 class="text-3xl font-display font-black mb-6 text-center gradient-text">
                        About PassionBots Emotion Detection
                    </h2>
                    <p class="text-gray-400 text-lg leading-relaxed mb-6 text-center">
                        PassionBots is a cutting-edge emotion detection platform that combines state-of-the-art machine learning with intuitive design. 
                        Built on TensorFlow.js and face-api.js, our system analyzes facial expressions in real-time to identify seven distinct emotions 
                        with professional-grade accuracy.
                    </p>
                    <div class="grid md:grid-cols-2 gap-6 mt-8">
                        <div class="bg-passion-black rounded-xl p-6">
                            <div class="flex items-start">
                                <div class="w-10 h-10 bg-passion-yellow rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                                    <i class="fas fa-robot text-passion-black"></i>
                                </div>
                                <div>
                                    <h4 class="font-bold text-white mb-2">AI-Powered Technology</h4>
                                    <p class="text-gray-400 text-sm">Uses pre-trained neural networks for accurate emotion classification</p>
                                </div>
                            </div>
                        </div>
                        <div class="bg-passion-black rounded-xl p-6">
                            <div class="flex items-start">
                                <div class="w-10 h-10 bg-passion-yellow rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                                    <i class="fas fa-chart-line text-passion-black"></i>
                                </div>
                                <div>
                                    <h4 class="font-bold text-white mb-2">Real-Time Insights</h4>
                                    <p class="text-gray-400 text-sm">Live emotion tracking with smooth, responsive visualizations</p>
                                </div>
                            </div>
                        </div>
                        <div class="bg-passion-black rounded-xl p-6">
                            <div class="flex items-start">
                                <div class="w-10 h-10 bg-passion-yellow rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                                    <i class="fas fa-users text-passion-black"></i>
                                </div>
                                <div>
                                    <h4 class="font-bold text-white mb-2">Multi-Face Detection</h4>
                                    <p class="text-gray-400 text-sm">Simultaneously detects and analyzes multiple faces</p>
                                </div>
                            </div>
                        </div>
                        <div class="bg-passion-black rounded-xl p-6">
                            <div class="flex items-start">
                                <div class="w-10 h-10 bg-passion-yellow rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                                    <i class="fas fa-bell text-passion-black"></i>
                                </div>
                                <div>
                                    <h4 class="font-bold text-white mb-2">Smart Alerts</h4>
                                    <p class="text-gray-400 text-sm">Configurable anger detection with cooldown protection</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Load face-api.js for real emotion detection -->
        <script defer src="https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/face-api.min.js"></script>
        <script src="/static/app.js"></script>
    </body>
    </html>
  `)
})

// API endpoint for anger alert configuration
app.get('/api/anger_alert/config', (c) => {
  return c.json({
    threshold: 0.6,
    cooldown: 30,
    enabled: true,
    popup_duration: 10
  })
})

app.post('/api/anger_alert/config', async (c) => {
  const body = await c.req.json()
  // In a real app, you'd save this to KV storage
  return c.json({ success: true, config: body })
})

app.get('/api/status', (c) => {
  return c.json({
    running: true,
    model_loaded: true,
    camera_active: false,
    audio_active: false
  })
})

export default app
