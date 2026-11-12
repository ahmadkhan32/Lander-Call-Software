import fs from 'node:fs';

if (fs.existsSync('dist')) {
  fs.rmSync('dist', { recursive: true, force: true });
}
if (fs.existsSync('frontend/dist')) {
  fs.cpSync('frontend/dist', 'dist', { recursive: true });
  console.log('Successfully synced frontend/dist to root dist/');
}
