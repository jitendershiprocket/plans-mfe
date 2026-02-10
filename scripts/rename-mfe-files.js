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

function updateIndexHtml() {
  const indexPath = path.join(distDir, 'index.html');
  if (!fs.existsSync(indexPath)) {
    console.warn(`[plans-mfe] index.html not found in ${distDir}`);
    return;
  }

  let html = fs.readFileSync(indexPath, 'utf8');

  // Replace only if original names are present; otherwise leave as-is
  if (html.includes('href="styles.css"')) {
    html = html.replace(/href="styles\.css"/g, 'href="plans-styles.css"');
  }

  if (html.includes('src="main.js"')) {
    html = html.replace(/src="main\.js"/g, 'src="plans-main.js"');
  }

  fs.writeFileSync(indexPath, html, 'utf8');
  console.log('[plans-mfe] Updated index.html to use plans-styles.css and plans-main.js');
}

try {
  if (!fs.existsSync(distDir)) {
    console.warn(`[plans-mfe] Dist directory not found: ${distDir}`);
    process.exit(0);
  }

  safeRename('main.js', 'plans-main.js');
  safeRename('styles.css', 'plans-styles.css');
  updateIndexHtml();
} catch (err) {
  console.error('[plans-mfe] Error renaming build files:', err);
  process.exit(1);
}


