import readline from 'readline';
import { sh } from './shell.js';

export function confirmCommit(destiny, commitMsg) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const statusOutput = sh(`git -C "${destiny}" status --short`);
    const diffStatOutput = sh(`git -C "${destiny}" diff --stat`);

    if (statusOutput.trim()) {
      console.log(statusOutput);
    }
    if (diffStatOutput.trim()) {
      console.log(diffStatOutput);
    }

    rl.question('\nCreate commit in destiny? (y/N) ', (answer) => {
      rl.close();
      resolve(answer.toLowerCase().startsWith('y'));
    });
  });
}
