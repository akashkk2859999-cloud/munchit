import { BlobServiceClient } from '@azure/storage-blob';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

const PROJECT_PREFIX = 'munchit-campaign';
const LOCAL_TEMPLATES_DIR = path.join(__dirname, '../../templates');

const CONN = process.env.AZURE_STORAGE_CONNECTION_STRING;
const CONTAINER = process.env.AZURE_STORAGE_CONTAINER || 'tgkmdaccontainer';

async function main() {
  if (!CONN) {
    console.error('❌ AZURE_STORAGE_CONNECTION_STRING is missing in .env');
    process.exit(1);
  }
  if (!fs.existsSync(LOCAL_TEMPLATES_DIR)) {
    console.error(`❌ Local templates folder not found at: ${LOCAL_TEMPLATES_DIR}`);
    process.exit(1);
  }
  const files = fs.readdirSync(LOCAL_TEMPLATES_DIR)
    .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file));
  if (files.length === 0) {
    console.log('⚠️ No images found in local templates folder.');
    return;
  }
  console.log(`🚀 Uploading ${files.length} templates for prefix: "${PROJECT_PREFIX}"...`);
  
  const blobServiceClient = BlobServiceClient.fromConnectionString(CONN);
  const containerClient = blobServiceClient.getContainerClient(CONTAINER);
  await containerClient.createIfNotExists({ access: 'blob' });
  
  for (const file of files) {
    const localPath = path.join(LOCAL_TEMPLATES_DIR, file);
    const blobName = `${PROJECT_PREFIX}/templates/${file}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    
    if (await blockBlobClient.exists()) {
      console.log(`  ⏭️  Skipped (Already in Azure): ${blobName}`);
      continue;
    }
    const stats = fs.statSync(localPath);
    console.log(`  ⬆️  Uploading: ${file} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
    
    await blockBlobClient.uploadFile(localPath, {
      blobHTTPHeaders: { blobContentType: file.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg' }
    });
    console.log(`  ✅ Success! URL: ${blockBlobClient.url}`);
  }
}

main().catch(err => console.error('Error:', err.message));
