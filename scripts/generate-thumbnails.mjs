import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const docsDir = 'public/docs';

async function generate() {
  console.log('Generating optimized webp thumbnails for credentials and education...');

  // 1. NPTEL Java certificate
  const javaSrc = path.join(docsDir, 'nptel-java-certificate.png');
  const javaOut = path.join(docsDir, 'cred-java-thumb.webp');
  if (fs.existsSync(javaSrc)) {
    await sharp(javaSrc)
      .resize({ width: 800, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(javaOut);
    console.log('Generated:', javaOut);
  }

  // 2. CodeChef Python assessment
  const codechefSrc = path.join(docsDir, 'codechef-python-test.png');
  const codechefOut = path.join(docsDir, 'cred-codechef-thumb.webp');
  if (fs.existsSync(codechefSrc)) {
    await sharp(codechefSrc)
      .resize({ width: 800, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(codechefOut);
    console.log('Generated:', codechefOut);
  }

  // 3. Google Cloud badges proof
  const gcloudSrc = path.join(docsDir, 'google-cloud-badge-proof-1.jpg');
  const gcloudOut = path.join(docsDir, 'cred-gcloud-thumb.webp');
  if (fs.existsSync(gcloudSrc)) {
    await sharp(gcloudSrc)
      .resize({ width: 800, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(gcloudOut);
    console.log('Generated:', gcloudOut);
  }

  // 4. Class XII Marksheet
  const xiiSrc = path.join(docsDir, '12th.jpeg');
  const xiiOut = path.join(docsDir, 'edu-12th-thumb.webp');
  if (fs.existsSync(xiiSrc)) {
    await sharp(xiiSrc)
      .resize({ width: 800, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(xiiOut);
    console.log('Generated:', xiiOut);
  }

  // 5. Class X Marksheet
  const xSrc = path.join(docsDir, '10th.jpeg');
  const xOut = path.join(docsDir, 'edu-10th-thumb.webp');
  if (fs.existsSync(xSrc)) {
    await sharp(xSrc)
      .resize({ width: 800, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(xOut);
    console.log('Generated:', xOut);
  }

  console.log('All thumbnails generated successfully!');
}

generate().catch(err => {
  console.error(err);
  process.exit(1);
});

