import { execSync } from 'child_process';

export function sh(cmd, options = {}) {
  const defaultOptions = {
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'pipe'],
    maxBuffer: 1024 * 1024 * 500 // 500 MB
  };
  const mergedOptions = { ...defaultOptions, ...options };
  return execSync(cmd, mergedOptions).toString();
}
