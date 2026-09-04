const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function generate() {
  const svgPath = path.join(__dirname, '..', 'public', 'icon.svg');
  const svgBuffer = fs.readFileSync(svgPath);

  const targets = [
    { file: 'public/favicon-48x48.png', size: 48 },
    { file: 'public/favicon-96x96.png', size: 96 },
    { file: 'public/favicon-192x192.png', size: 192 },
    { file: 'public/favicon-512x512.png', size: 512 },
    { file: 'public/icon.png', size: 512 },
    { file: 'public/apple-touch-icon.png', size: 180 },
    { file: 'app/apple-icon.png', size: 180 },
    { file: 'app/icon.png', size: 48 },
  ];

  for (const t of targets) {
    const dest = path.join(__dirname, '..', t.file);
    await sharp(svgBuffer)
      .resize(t.size, t.size)
      .png()
      .toFile(dest);
    console.log(`Generated ${t.file} (${t.size}x${t.size})`);
  }

  // Generate 48x48 PNG buffer to copy as favicon.ico or multi-size ico
  // Modern browsers and Googlebot-Image accept PNG-encoded favicon.ico or 48x48 PNG
  const png48Buffer = await sharp(svgBuffer).resize(48, 48).png().toBuffer();
  fs.writeFileSync(path.join(__dirname, '..', 'public', 'favicon.ico'), png48Buffer);
  fs.writeFileSync(path.join(__dirname, '..', 'app', 'favicon.ico'), png48Buffer);
  console.log('Updated public/favicon.ico and app/favicon.ico (48x48)');
}

generate().catch(err => {
  console.error(err);
  process.exit(1);
});
