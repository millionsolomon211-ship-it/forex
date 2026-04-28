const fs = require('fs');
const path = require('path');

const dirsToClean = ['node_modules', '.next'];
const filesToClean = ['package-lock.json'];

dirsToClean.forEach(dir => {
  const fullPath = path.join(__dirname, dir);
  if (fs.existsSync(fullPath)) {
    console.log(`Deleting directory: ${fullPath}`);
    fs.rmSync(fullPath, { recursive: true, force: true });
  }
});

filesToClean.forEach(file => {
  const fullPath = path.join(__dirname, file);
  if (fs.existsSync(fullPath)) {
    console.log(`Deleting file: ${fullPath}`);
    fs.unlinkSync(fullPath);
  }
});

console.log('Cleanup complete.');
