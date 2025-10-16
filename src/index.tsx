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
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <script>
          tailwind.config = {
            theme: {
              extend: {
                colors: {
                  passion: {
                    50: '#fef2f2',
                    100: '#fee2e2',
                    200: '#fecaca',
                    300: '#fca5a5',
                    400: '#f87171',
                    500: '#ef4444',
                    600: '#dc2626',
                    700: '#b91c1c',
                    800: '#991b1b',
                    900: '#7f1d1d',
                  }
                }
              }
            }
          }
        </script>
        <style>
          @keyframes pulse-glow {
            0%, 100% { box-shadow: 0 0 20px rgba(239, 68, 68, 0.5); }
            50% { box-shadow: 0 0 40px rgba(239, 68, 68, 0.8); }
          }
          .recording { animation: pulse-glow 2s infinite; }
          .emotion-bar {
            transition: width 0.5s ease-out;
          }
          .glassmorphism {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
          }
        </style>
    </head>
    <body class="bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 min-h-screen text-white">
        <nav class="glassmorphism sticky top-0 z-50">
            <div class="container mx-auto px-6 py-4">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                        <i class="fas fa-robot text-passion-500 text-3xl"></i>
                        <span class="text-2xl font-bold bg-gradient-to-r from-passion-400 to-purple-400 bg-clip-text text-transparent">PassionBots</span>
                    </div>
                    <a href="#about" class="text-sm hover:text-passion-400 transition">
                        <i class="fas fa-info-circle mr-1"></i> About
                    </a>
                </div>
            </div>
        </nav>

        <div class="container mx-auto px-4 py-8">
            <!-- Header -->
            <div class="text-center mb-12">
                <h1 class="text-5xl font-bold mb-4 bg-gradient-to-r from-passion-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                    AI-Powered Emotion Detection
                </h1>
                <p class="text-xl text-gray-300 mb-6">
                    Advanced real-time emotion analysis using facial expressions and voice patterns
                </p>
                <div id="permissionAlert" class="hidden bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4 max-w-2xl mx-auto mb-6">
                    <i class="fas fa-exclamation-triangle text-yellow-400 mr-2"></i>
                    <span class="text-yellow-200">Please grant camera and microphone access to begin emotion detection</span>
                </div>
            </div>

            <!-- Main Content Grid -->
            <div class="grid lg:grid-cols-3 gap-6">
                <!-- Left Column: Video Feed -->
                <div class="lg:col-span-2 space-y-6">
                    <!-- Video Container -->
                    <div class="glassmorphism rounded-2xl p-6 shadow-2xl">
                        <div class="relative">
                            <video id="videoElement" autoplay playsinline muted class="w-full rounded-xl bg-gray-800 shadow-inner" style="max-height: 500px;"></video>
                            <canvas id="canvas" class="hidden"></canvas>
                            <div id="videoPlaceholder" class="w-full h-96 bg-gray-800 rounded-xl flex items-center justify-center">
                                <div class="text-center">
                                    <i class="fas fa-video-slash text-6xl text-gray-600 mb-4"></i>
                                    <p class="text-gray-400">Camera feed will appear here</p>
                                </div>
                            </div>
                            <!-- Status Badge -->
                            <div id="statusBadge" class="absolute top-4 right-4 px-4 py-2 rounded-full font-semibold text-sm flex items-center space-x-2 bg-gray-800/80 backdrop-blur">
                                <div id="statusDot" class="w-3 h-3 rounded-full bg-gray-500"></div>
                                <span id="statusText">Disconnected</span>
                            </div>
                            <!-- Face Count Badge -->
                            <div class="absolute top-4 left-4 px-4 py-2 rounded-full font-semibold text-sm bg-blue-500/80 backdrop-blur">
                                <i class="fas fa-user-friends mr-2"></i>
                                <span id="faceCount">0</span> Faces
                            </div>
                        </div>
                        
                        <!-- Controls -->
                        <div class="mt-6 flex justify-center space-x-4">
                            <button id="startBtn" class="px-8 py-3 bg-gradient-to-r from-passion-500 to-pink-500 rounded-full font-semibold hover:from-passion-600 hover:to-pink-600 transition transform hover:scale-105 shadow-lg">
                                <i class="fas fa-play mr-2"></i> Start Detection
                            </button>
                            <button id="stopBtn" class="hidden px-8 py-3 bg-gray-700 rounded-full font-semibold hover:bg-gray-600 transition transform hover:scale-105 shadow-lg">
                                <i class="fas fa-stop mr-2"></i> Stop
                            </button>
                        </div>
                    </div>

                    <!-- Emotion Probabilities -->
                    <div class="glassmorphism rounded-2xl p-6 shadow-2xl">
                        <h3 class="text-2xl font-bold mb-4 flex items-center">
                            <i class="fas fa-chart-bar text-passion-400 mr-3"></i>
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
                    <div class="glassmorphism rounded-2xl p-6 shadow-2xl text-center">
                        <div class="mb-4">
                            <i class="fas fa-brain text-5xl text-purple-400 mb-3"></i>
                        </div>
                        <h3 class="text-lg font-semibold text-gray-300 mb-2">Combined Score</h3>
                        <div class="text-6xl font-bold bg-gradient-to-r from-passion-400 to-purple-400 bg-clip-text text-transparent mb-2">
                            <span id="combinedScore">0</span>%
                        </div>
                        <p class="text-sm text-gray-400">Overall Emotion Intensity</p>
                    </div>

                    <!-- Facial Score -->
                    <div class="glassmorphism rounded-2xl p-6 shadow-2xl">
                        <div class="flex items-center justify-between mb-3">
                            <div class="flex items-center">
                                <i class="fas fa-smile text-2xl text-blue-400 mr-3"></i>
                                <h3 class="text-lg font-semibold">Facial Score</h3>
                            </div>
                            <span id="facialScore" class="text-3xl font-bold text-blue-400">0%</span>
                        </div>
                        <div class="h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div id="facialScoreBar" class="h-full bg-gradient-to-r from-blue-400 to-blue-600 emotion-bar" style="width: 0%"></div>
                        </div>
                    </div>

                    <!-- Voice Score -->
                    <div class="glassmorphism rounded-2xl p-6 shadow-2xl">
                        <div class="flex items-center justify-between mb-3">
                            <div class="flex items-center">
                                <i class="fas fa-microphone text-2xl text-green-400 mr-3"></i>
                                <h3 class="text-lg font-semibold">Voice Score</h3>
                            </div>
                            <span id="voiceScore" class="text-3xl font-bold text-green-400">0%</span>
                        </div>
                        <div class="h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div id="voiceScoreBar" class="h-full bg-gradient-to-r from-green-400 to-green-600 emotion-bar" style="width: 0%"></div>
                        </div>
                        <div class="mt-3 flex items-center justify-between text-sm text-gray-400">
                            <span>Audio Level</span>
                            <div class="flex space-x-1">
                                <div id="audioBar1" class="w-1 h-4 bg-gray-600 rounded"></div>
                                <div id="audioBar2" class="w-1 h-4 bg-gray-600 rounded"></div>
                                <div id="audioBar3" class="w-1 h-4 bg-gray-600 rounded"></div>
                                <div id="audioBar4" class="w-1 h-4 bg-gray-600 rounded"></div>
                                <div id="audioBar5" class="w-1 h-4 bg-gray-600 rounded"></div>
                            </div>
                        </div>
                    </div>

                    <!-- System Status -->
                    <div class="glassmorphism rounded-2xl p-6 shadow-2xl">
                        <h3 class="text-lg font-semibold mb-4 flex items-center">
                            <i class="fas fa-cog text-gray-400 mr-2"></i>
                            System Status
                        </h3>
                        <div class="space-y-2 text-sm">
                            <div class="flex justify-between">
                                <span class="text-gray-400">Camera:</span>
                                <span id="cameraStatus" class="text-gray-300">Inactive</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-400">Microphone:</span>
                                <span id="micStatus" class="text-gray-300">Inactive</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-400">Model:</span>
                                <span id="modelStatus" class="text-gray-300">Not Loaded</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- About Section -->
            <div id="about" class="mt-16 glassmorphism rounded-2xl p-8 shadow-2xl">
                <h2 class="text-3xl font-bold mb-6 text-center">
                    <i class="fas fa-info-circle text-passion-400 mr-2"></i>
                    About PassionBots
                </h2>
                <div class="grid md:grid-cols-3 gap-6 text-center">
                    <div>
                        <i class="fas fa-shield-alt text-4xl text-passion-400 mb-3"></i>
                        <h3 class="text-xl font-semibold mb-2">Privacy First</h3>
                        <p class="text-gray-400">All processing happens locally in your browser. No data is stored or transmitted.</p>
                    </div>
                    <div>
                        <i class="fas fa-bolt text-4xl text-yellow-400 mb-3"></i>
                        <h3 class="text-xl font-semibold mb-2">Real-Time Analysis</h3>
                        <p class="text-gray-400">Instant emotion detection with advanced AI models for facial and voice analysis.</p>
                    </div>
                    <div>
                        <i class="fas fa-brain text-4xl text-purple-400 mb-3"></i>
                        <h3 class="text-xl font-semibold mb-2">Multi-Modal AI</h3>
                        <p class="text-gray-400">Combines facial expression and voice tone analysis for accurate emotion detection.</p>
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
