import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import os from 'os';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Directories (Updated for clean templates sync)
const UPLOAD_ROOT = path.join(__dirname, '../../');
export const UPLOADS_DIR = path.join(UPLOAD_ROOT, 'uploads');
export const RESULTS_DIR = path.join(UPLOAD_ROOT, 'results');
export const TEMPLATES_DIR = path.join(UPLOAD_ROOT, 'templates');

// Ensure directories exist
[UPLOADS_DIR, RESULTS_DIR, TEMPLATES_DIR].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Auto-copy templates from frontend assets to backend templates directory on startup
const copyFrontendTemplates = () => {
  const frontendAssetsPath = path.join(__dirname, '../../../frontend/src/assets');
  if (fs.existsSync(frontendAssetsPath)) {
    try {
      const files = fs.readdirSync(frontendAssetsPath);
      let copied = 0;
      files.forEach((file) => {
        if (/\.(jpg|jpeg|png|webp)$/i.test(file)) {
          const srcPath = path.join(frontendAssetsPath, file);
          const destPath = path.join(TEMPLATES_DIR, file);
          // Always copy and overwrite to ensure backend is in sync with latest frontend assets
          fs.copyFileSync(srcPath, destPath);
          copied++;
        }
      });
      if (copied > 0) {
        console.log(`✅ Copied ${copied} template assets from frontend to backend templates folder`);
      }
    } catch (err) {
      console.warn('⚠️ Non-blocking template pre-copy warning:', err.message);
    }
  }
};
copyFrontendTemplates();

// Queue structures
const jobQueue = [];
const jobStore = new Map();
const MAX_CONCURRENT_JOBS = 1;
let activeJobs = 0;

/**
 * Pushes a new swap job to the queue and processes it.
 */
export const queueSwapJob = (jobId, sourceImage, targetTemplate) => {
  return new Promise((resolve, reject) => {
    const job = {
      jobId,
      sourceImage,
      targetTemplate,
      resolve,
      reject,
    };
    jobStore.set(jobId, { status: 'queued', progress: 0 });
    jobQueue.push(job);
    processNextJob();
  });
};

const processNextJob = () => {
  if (activeJobs >= MAX_CONCURRENT_JOBS || jobQueue.length === 0) {
    return;
  }
  const job = jobQueue.shift();
  if (job) {
    activeJobs++;
    executeSwapJob(job);
  }
};

const executeSwapJob = async (job) => {
  const { jobId, sourceImage, targetTemplate, resolve, reject } = job;
  jobStore.set(jobId, { status: 'processing' });
  console.log(`⚙️ [FaceSwap] Starting Job ${jobId} (Queue size: ${jobQueue.length})`);

  try {
    const scriptPath = path.join(__dirname, '../utility/face_swap.py');
    const sourcePath = path.join(UPLOADS_DIR, sourceImage);
    const targetPath = path.join(TEMPLATES_DIR, targetTemplate);
    const outputPath = path.join(RESULTS_DIR, `swapped_${jobId}.jpg`);

    // Verify paths exist
    if (!fs.existsSync(sourcePath)) {
      throw new Error(`Source image not found: ${sourcePath}`);
    }
    if (!fs.existsSync(targetPath)) {
      // Try searching inside templates dynamically for fuzzy name matches
      const templates = fs.readdirSync(TEMPLATES_DIR);
      const match = templates.find(t => t.toLowerCase().includes(targetTemplate.toLowerCase()));
      if (match) {
        targetPath = path.join(TEMPLATES_DIR, match);
      } else {
        throw new Error(`Target template not found: ${targetPath}`);
      }
    }

    const IS_WINDOWS = os.platform() === 'win32';
    const cmd = IS_WINDOWS ? 'py' : 'python3';
    const cmdArgs = IS_WINDOWS ? ['-3.10', '-u', scriptPath] : ['-u', scriptPath];

    cmdArgs.push(
      '--source', sourcePath,
      '--target', targetPath,
      '--output', outputPath,
      '--cpu'
    );

    console.log(`🚀 [FaceSwap] Spawning Python process...`);
    const pythonProcess = spawn(cmd, cmdArgs, {
      cwd: path.join(__dirname, '../'),
      env: process.env,
      windowsHide: true,
    });

    let pythonOut = '';
    let pythonErr = '';

    pythonProcess.stdout.on('data', (data) => {
      pythonOut += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      pythonErr += data.toString();
    });

    pythonProcess.on('close', (code) => {
      activeJobs--;
      if (code === 0 && fs.existsSync(outputPath)) {
        console.log(`✅ [FaceSwap] Job ${jobId} completed successfully!`);
        
        let detectedGender = 'unknown';
        if (pythonOut.includes('[GENDER_DETECTED] MALE')) {
          detectedGender = 'male';
        } else if (pythonOut.includes('[GENDER_DETECTED] FEMALE')) {
          detectedGender = 'female';
        }

        let actualTemplate = targetTemplate;
        const templateMatch = pythonOut.match(/\[TEMPLATE_AUTO_SWITCH\] Switched target template to:\s*(\S+)/);
        if (templateMatch) {
          actualTemplate = templateMatch[1];
        }

        // Rename output file to encode gender in filename for frontend parsing
        const genderedFilename = `swapped_${detectedGender}_${jobId}.jpg`;
        const genderedPath = path.join(RESULTS_DIR, genderedFilename);
        try {
          fs.renameSync(outputPath, genderedPath);
        } catch (renameErr) {
          console.warn('⚠️ Could not rename swapped file, using original:', renameErr.message);
        }
        const finalPath = fs.existsSync(genderedPath) ? `/results/${genderedFilename}` : `/results/swapped_${jobId}.jpg`;

        jobStore.set(jobId, { status: 'completed', result: finalPath, detectedGender, actualTemplate });
        resolve({
          swappedImageUrl: finalPath,
          detectedGender,
          actualTemplate
        });
      } else {
        console.error(`❌ [FaceSwap] Job ${jobId} failed with code ${code}. Error:`, pythonErr);
        jobStore.set(jobId, { status: 'failed', error: pythonErr || 'Python process exited with non-zero code' });
        reject(new Error(pythonErr || `Python execution failed with code ${code}`));
      }
      // Process next in queue
      processNextJob();
    });
  } catch (err) {
    activeJobs--;
    console.error(`❌ [FaceSwap] Error executing Job ${jobId}:`, err.message);
    jobStore.set(jobId, { status: 'failed', error: err.message });
    reject(err);
    processNextJob();
  }
};

/**
 * Controller: Handle Face Swap request
 */
export const handleFaceSwap = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No selfie image uploaded' });
    }
    const { targetTemplate } = req.body;
    if (!targetTemplate) {
      // Cleanup uploaded file
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: 'targetTemplate is required' });
    }

    const originalPath = req.file.path;
    const filename = req.file.filename;

    // Optimize upload image to max 1024x1024 to speed up face detection
    const compressedPath = path.join(UPLOADS_DIR, `opt_${filename}`);
    try {
      await sharp(originalPath)
        .resize(1024, 1024, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 95 })
        .toFile(compressedPath);
      
      fs.unlinkSync(originalPath);
      fs.renameSync(compressedPath, originalPath);
    } catch (compressErr) {
      console.warn('⚠️ Upload auto-compression skipped:', compressErr.message);
    }

    const jobId = `${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    console.log(`[FaceSwap] Queuing job ${jobId} with template: ${targetTemplate}`);

    const swapResult = await queueSwapJob(jobId, filename, targetTemplate);
    
    // Auto cleanup source upload after swap to save space
    try {
      if (fs.existsSync(originalPath)) {
        fs.unlinkSync(originalPath);
      }
    } catch (e) {
      console.warn('⚠️ Non-blocking selfie cleanup warning:', e.message);
    }

    res.json({
      success: true,
      jobId,
      swappedImageUrl: swapResult.swappedImageUrl,
      detectedGender: swapResult.detectedGender,
      actualTemplate: swapResult.actualTemplate
    });
  } catch (error) {
    next(error);
  }
};
