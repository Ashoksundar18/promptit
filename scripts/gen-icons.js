const fs = require('fs');
const { createCanvas } = (() => {
  // Create SVG-based icons since we can't use canvas easily
  // We'll create simple PNG files using raw data approach
  return { createCanvas: null };
})();

// Generate a simple SVG icon and save it
function createSvgIcon(size, path) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="#3b82f6"/>
  <g transform="translate(${size * 0.25}, ${size * 0.2})">
    <path d="M${size*0.25} ${size*0.05} L${size*0.35} ${size*0.25} L${size*0.15} ${size*0.25} L${size*0.25} ${size*0.05}Z M${size*0.25} ${size*0.55} L${size*0.35} ${size*0.35} L${size*0.15} ${size*0.35} L${size*0.25} ${size*0.55}Z M${size*0.05} ${size*0.3} L${size*0.45} ${size*0.3} L${size*0.45} ${size*0.32} L${size*0.05} ${size*0.32}Z" fill="white"/>
  </g>
  <text x="${size/2}" y="${size*0.82}" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="bold" font-size="${size*0.13}" fill="white">⚡</text>
</svg>`;
  fs.writeFileSync(path, svg);
}

createSvgIcon(192, 'public/icons/icon-192.svg');
createSvgIcon(512, 'public/icons/icon-512.svg');
console.log('SVG icons created');
