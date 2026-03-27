import { execSync } from 'child_process';

export function sh(cmd, options = {}) {
  const defaultOptions = {
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'pipe']
  };
  const mergedOptions = { ...defaultOptions, ...options };
  return execSync(cmd, mergedOptions).toString();
}
