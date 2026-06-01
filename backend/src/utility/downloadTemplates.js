import { BlobServiceClient } from '@azure/storage-blob';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECT_PREFIX = 'munchit-campaign';

async function downloadBlobToFile(blockBlobClient, destPath) {
  const dir = path.dirname(destPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  // Use Azure SDK's native downloadToFile for low-memory chunked streaming of large files
  await blockBlobClient.downloadToFile(destPath);
}

/**
 * Dynamic Synchronizer called during Server Startup
 */
export async function downloadTemplates() {
  const TEMPLATES_DIR = path.join(process.cwd(), 'templates');
  const UTILITY_DIR = path.join(__dirname);
  const CONTAINER = process.env.AZURE_STORAGE_CONTAINER || 'tgkmdaccontainer';
  const CONN = process.env.AZURE_STORAGE_CONNECTION_STRING;

  if (!CONN) {
    console.warn('⚠️ AZURE_STORAGE_CONNECTION_STRING missing. Skipping Azure dynamic sync.');
    return false;
  }

  try {
    const blobServiceClient = BlobServiceClient.fromConnectionString(CONN);
    const containerClient = blobServiceClient.getContainerClient(CONTAINER);

    // 1. Sync Campaign Templates
    const templatesPrefix = `${PROJECT_PREFIX}/templates/`;
    console.log(`🔄 Syncing campaign templates from Azure Blob ("${templatesPrefix}")...`);
    if (!fs.existsSync(TEMPLATES_DIR)) {
      fs.mkdirSync(TEMPLATES_DIR, { recursive: true });
    }
    
    let templateCount = 0;
    for await (const blob of containerClient.listBlobsFlat({ prefix: templatesPrefix })) {
      if (!/\.(jpg|jpeg|png|webp)$/i.test(blob.name)) continue;
      const fileName = path.basename(blob.name);
      const localPath = path.join(TEMPLATES_DIR, fileName);

      if (fs.existsSync(localPath) && fs.statSync(localPath).size > 0) {
        continue; // Cache hit
      }

      console.log(`  ⬇️  Downloading template: ${fileName}`);
      const blockBlobClient = containerClient.getBlockBlobClient(blob.name);
      await downloadBlobToFile(blockBlobClient, localPath);
      templateCount++;
    }
    console.log(`✅ Templates sync complete! (${templateCount} new files downloaded)`);

    // 2. Sync ML Models (If global cache is missing)
    const GLOBAL_CACHE_DIR = 'C:\\Users\\akash.k\\Backend';
    let usesGlobalCache = false;
    
    // Check if the global directory is valid and has critical models
    if (fs.existsSync(GLOBAL_CACHE_DIR)) {
      const inswapperPath = path.join(GLOBAL_CACHE_DIR, 'models', 'inswapper_128.onnx');
      const buffaloPath = path.join(GLOBAL_CACHE_DIR, 'models', 'buffalo_l', '1k3d68.onnx');
      if (fs.existsSync(inswapperPath) && fs.existsSync(buffaloPath)) {
        usesGlobalCache = true;
      }
    }

    if (usesGlobalCache) {
      console.log('✅ Global ML Model cache found at C:\\Users\\akash.k\\Backend. Skipping model download.');
    } else {
      console.log('🔄 Local models missing. Syncing Face-Swap ML models from Azure Blob...');
      const modelsPrefix = 'models/';
      let modelCount = 0;

      for await (const blob of containerClient.listBlobsFlat({ prefix: modelsPrefix })) {
        // Map blob prefix "models/" directly to "backend/src/utility/models/"
        const relativePath = blob.name.substring(modelsPrefix.length);
        const localPath = path.join(UTILITY_DIR, 'models', relativePath);

        if (fs.existsSync(localPath) && fs.statSync(localPath).size > 1000) {
          continue; // Already downloaded
        }

        console.log(`  ⬇️  Downloading ML Model: ${blob.name} (${(blob.properties.contentLength / 1024 / 1024).toFixed(2)} MB)...`);
        const blockBlobClient = containerClient.getBlockBlobClient(blob.name);
        await downloadBlobToFile(blockBlobClient, localPath);
        modelCount++;
      }
      if (modelCount > 0) {
        console.log(`✅ ML Models sync complete! (${modelCount} new models downloaded)`);
      } else {
        console.log('✅ All face-swap ML models are fully present in utility/models directory.');
      }
    }
    return true;
  } catch (err) {
    console.error('❌ Failed syncing templates/models from Azure Blob Storage:', err.message);
    return false;
  }
}
