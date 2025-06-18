const express = require('express');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');
const { execFile } = require('child_process');
const util = require('util');

const app = express();
const execFilePromise = util.promisify(execFile);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS per permettere richieste dall'app
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Configurazione directories
const UPLOAD_DIR = '/tmp/uploads';
const OUTPUT_DIR = '/tmp/outputs';

// Crea directories se non esistono
[UPLOAD_DIR, OUTPUT_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Servi file statici per download
app.use('/outputs', express.static(OUTPUT_DIR));

// Configurazione multer per upload
const storage = multer.diskStorage({
  destination: UPLOAD_DIR,
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('File must be a video'), false);
    }
  },
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB max
  }
});

// Routes
app.get('/ping', (req, res) => {
  console.log('✅ Ping ricevuto');
  res.json({ message: 'pong' });
});

app.get('/effects', (req, res) => {
  console.log('📝 Lista effetti richiesta');
  res.json({
    effects: [
      {
        id: "cinematic-zoom",
        name: "Cinematic Zoom",
        category: "video",
        description: "Zoom cinematografico"
      },
      {
        id: "glitch-transition", 
        name: "Glitch Transition",
        category: "video",
        description: "Transizione glitch"
      },
      {
        id: "vhs-effect",
        name: "VHS Effect", 
        category: "video",
        description: "Effetto VHS vintage"
      },
      {
        id: "noir-filter",
        name: "Noir Filter",
        category: "video", 
        description: "Filtro noir bianco e nero"
      }
    ]
  });
});

// Route per la root, evita il 404 su "/"
app.get('/', (req, res) => {
  res.json({ message: 'Benvenuto sulla Mocky API!' });
});

app.post('/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log('📁 File caricato:', req.file.filename);
    
    res.json({
      status: 'success',
      video_url: req.file.path,
      filename: req.file.filename
    });
  } catch (error) {
    console.error('❌ Upload error:', error);
    res.status(500).json({ error: `Upload failed: ${error.message}` });
  }
});

app.post('/effects/cinematic-zoom', async (req, res) => {
  try {
    const { video_url, strength = 1.0 } = req.body;
    
    console.log('🎬 Cinematic zoom richiesto:', { video_url, strength });
    
    // Verifica che il file esista
    if (!fs.existsSync(video_url)) {
      return res.status(404).json({ error: 'Video file not found' });
    }
    
    // Genera nome output
    const outputFilename = `zoom_${uuidv4()}.mp4`;
    const outputPath = path.join(OUTPUT_DIR, outputFilename);
    
    // Comando FFmpeg per zoom cinematografico
    const zoomFactor = 1 + strength;
    
    const ffmpegArgs = [
      '-i', video_url,
      '-vf', `scale=iw*${zoomFactor}:ih*${zoomFactor},zoompan=z='min(zoom+0.002,${zoomFactor})':d=1:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1280x720`,
      '-c:a', 'copy',
      '-y', // Sovrascrivi se esiste
      outputPath
    ];
    
    console.log('⚙️ Eseguendo FFmpeg:', ffmpegArgs.join(' '));
    
    // Esegui FFmpeg
    await execFilePromise('ffmpeg', ffmpegArgs);
    
    // Verifica che l'output esista
    if (!fs.existsSync(outputPath)) {
      throw new Error('Output file not created');
    }
    
    // URL per download
    const baseUrl = req.get('host') ? `https://${req.get('host')}` : 'http://localhost:8888';
    const downloadUrl = `${baseUrl}/outputs/${outputFilename}`;
    
    console.log('✅ Processing completato:', downloadUrl);
    
    res.json({
      status: 'success',
      processed_video_url: downloadUrl,
      original_url: video_url,
      strength: strength,
      processing_time: 'real'
    });
    
  } catch (error) {
    console.error('❌ Processing error:', error);
    res.status(500).json({ error: `Processing failed: ${error.message}` });
  }
});

app.get('/outputs/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(OUTPUT_DIR, filename);
  
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found' });
  }
  
  res.download(filePath);
});

// Error handling
app.use((error, req, res, next) => {
  console.error('❌ Server error:', error);
  res.status(500).json({ error: error.message });
});

// Start server
const PORT = process.env.PORT || 8888;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server Node.js attivo su porta ${PORT}`);
  const baseUrl = process.env.RAILWAY_PUBLIC_DOMAIN 
    ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}` 
    : `http://localhost:${PORT}`;
  console.log(`📡 Base URL: ${baseUrl}`);
});
