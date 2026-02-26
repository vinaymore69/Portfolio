const fs = require('fs').promises;
const path = require('path');

async function copyAssets() {
  const sourceDir = path.join(__dirname, '../node_modules/luckysheet/dist');
  const targetDir = path.join(__dirname, '../public/luckysheet');

  try {
    // Check if source exists
    await fs.access(sourceDir);
    
    // Create target directory if it doesn't exist
    await fs.mkdir(targetDir, { recursive: true });
    
    // Copy files recursively
    await copyRecursive(sourceDir, targetDir);
    
    console.log('✅ Luckysheet assets copied successfully!');
    console.log(`📁 Copied from: ${sourceDir}`);
    console.log(`📁 Copied to: ${targetDir}`);
  } catch (error) {
    console.error('❌ Error copying Luckysheet assets:', error.message);
    process.exit(1);
  }
}

async function copyRecursive(src, dest) {
  const entries = await fs.readdir(src, { withFileTypes: true });
  
  await fs.mkdir(dest, { recursive: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      await copyRecursive(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

// Run the script
copyAssets();