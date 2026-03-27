import fs from 'fs';
import path from 'path';

export function ensureDirForFile(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export function writeFile(destRoot, relPath, content) {
  const fullPath = path.join(destRoot, relPath);
  ensureDirForFile(fullPath);
  fs.writeFileSync(fullPath, content, 'utf8');
}

export function deleteFile(destRoot, relPath) {
  const fullPath = path.join(destRoot, relPath);
  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
  }
}

export function renameFile(destRoot, oldRel, newRel) {
  const oldPath = path.join(destRoot, oldRel);
  const newPath = path.join(destRoot, newRel);
  
  if (fs.existsSync(oldPath)) {
    ensureDirForFile(newPath);
    fs.renameSync(oldPath, newPath);
    return true;
  }
  return false;
}
