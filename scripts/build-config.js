// Runs on Vercel at build time: copies the public tracking IDs from
// environment variables into config.js, so they are never hard-coded.
const fs = require('fs');
const path = require('path');

const config = {
  gaId: process.env.NEXT_PUBLIC_GA_ID || '',
  metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID || ''
};

fs.writeFileSync(
  path.join(__dirname, '..', 'config.js'),
  '/* generated at build time by scripts/build-config.js */\nwindow.DIBS_CONFIG = ' + JSON.stringify(config) + ';\n'
);
console.log('config.js written (GA: ' + (config.gaId ? 'set' : 'missing') + ', Pixel: ' + (config.metaPixelId ? 'set' : 'missing') + ')');
