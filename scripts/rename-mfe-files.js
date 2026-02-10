const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '..', 'dist', 'optimized', 'browser');

function safeRename(oldName, newName) {
  const oldPath = path.join(distDir, oldName);
  const newPath = path.join(distDir, newName);

  if (!fs.existsSync(oldPath)) {
    console.warn(`[plans-mfe] Skip rename: ${oldName} not found in ${distDir}`);
    return;
  }

  if (fs.existsSync(newPath)) {
    fs.unlinkSync(newPath);
  }

  fs.renameSync(oldPath, newPath);
  console.log(`[plans-mfe] Renamed ${oldName} -> ${newName}`);
}

try {
  if (!fs.existsSync(distDir)) {
    console.warn(`[plans-mfe] Dist directory not found: ${distDir}`);
    process.exit(0);
  }

  safeRename('main.js', 'plans-main.js');
  safeRename('styles.css', 'plans-styles.css');
} catch (err) {
  console.error('[plans-mfe] Error renaming build files:', err);
  process.exit(1);
}


