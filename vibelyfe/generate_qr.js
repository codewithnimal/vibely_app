const { toQR } = require('toqr');
const fs = require('fs');

const url = 'exp://ktgkq5s-anonymous-8081.exp.direct';
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
console.log('Successfully generated expo_qr.svg for tunnel: ' + url);

// Generate terminal ASCII
const matrix = [];
for (let y = 0; y < total; y++) {
  const row = [];
  for (let x = 0; x < total; x++) {
    if (x < quiet || x >= n + quiet || y < quiet || y >= n + quiet) {
      row.push(0);
    } else {
      row.push(bits[(y - quiet) * n + (x - quiet)]);
    }
  }
  matrix.push(row);
}

const lines = [];
for (let y = 0; y < total; y += 2) {
  let line = '';
  for (let x = 0; x < total; x++) {
    const top = matrix[y][x];
    const bot = (y + 1 < total) ? matrix[y + 1][x] : 0;
    if (!top && !bot) line += '█';
    else if (!top && bot) line += '▀';
    else if (top && !bot) line += '▄';
    else line += ' ';
  }
  lines.push(line);
}

console.log('\n--- SCAN WITH EXPO GO (Tunnel Mode) ---\n');
console.log(lines.join('\n'));
console.log('\nTunnel URL: ' + url + '\n');
