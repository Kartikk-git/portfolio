const sharp = require('sharp');
const fs = require('fs');

async function redactSoLetter() {
  const width = 897;
  const height = 1274;

  const svgRedaction = Buffer.from(`
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <!-- Black box over S/O Mr. Sanjeev Kumar -->
      <rect x="428" y="312" width="232" height="30" fill="#000000" />
    </svg>
  `);

  await sharp('public/docs-redacted/raw_so_letter_p0_Image5.jpg')
    .composite([{ input: svgRedaction, top: 0, left: 0 }])
    .jpeg({ quality: 92 })
    .toFile('public/docs-redacted/so_internship_certificate_preview.jpg');

  console.log('Successfully generated so_internship_certificate_preview.jpg');
}

redactSoLetter();

