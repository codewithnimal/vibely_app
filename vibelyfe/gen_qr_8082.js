const { toQR } = require('toqr');
const fs = require('fs');

const url = 'exp://ktgkq5s-anonymous-8082.exp.direct';
const bits = toQR(url);
const n = Math.sqrt(bits.length);
const quiet = 4;
const total = n + quiet * 2;
const scale = 12;
const svgSize = total * scale;

const rects = [];
for (let y = 0; y < n; y++) {
  for (let x = 0; x < n; x++) {
    if (bits[y * n + x]) {
      rects.push(`<rect x="${(x + quiet) * scale}" y="${(y + quiet) * scale}" width="${scale}" height="${scale}" fill="#000000"/>`);
    }
  }
}

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgSize} ${svgSize}" width="360" height="360">
  <rect width="100%" height="100%" fill="#ffffff"/>
  ${rects.join('\n  ')}
</svg>`;

fs.writeFileSync('expo_qr.svg', svg);
console.log('QR saved to expo_qr.svg');
console.log('Tunnel URL:', url);
