import { exportImages } from 'pdf-export-images';
import path from 'path';
import fs from 'fs';

const pdfPath = path.resolve('../backend/SNACK PERSONALITIES.pdf');
const outputDir = path.resolve('./public/images/personalities');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

exportImages(pdfPath, outputDir)
  .then((images) => {
    console.log('Images exported successfully:', images.length);
    images.forEach(img => console.log(img.name));
  })
  .catch((error) => {
    console.error('Error exporting images:', error);
  });
