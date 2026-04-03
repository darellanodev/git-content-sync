import readline from 'readline';
import { ensureGitRepo, getHeadCommit, getFirstCommitAfter, getNextCommit } from './gitDiff.js';
import { applyCommitChanges, commitDestiny } from './applyCommit.js';
import { confirmCommit } from './confirm.js';
import { sh } from './shell.js';

function askQuestion(question) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

export async function main({ origin, destiny, yes = false }) {
  ensureGitRepo(origin);
  ensureGitRepo(destiny);

  const destinyHead = getHeadCommit(destiny);
  console.log(`Destiny HEAD: ${destinyHead}`);

  const currentCommit = getFirstCommitAfter(origin, destinyHead);
  if (!currentCommit) {
    console.log('Origin is up to date with destiny. Nothing to sync.');
    return;
  }

  console.log(`Starting from commit: ${currentCommit}`);

  while (currentCommit) {
    console.log(`\n--- Processing commit: ${currentCommit} ---`);

    const { commitMsg } = await applyCommitChanges({ origin, destiny, commit: currentCommit });

    const statusOutput = sh(`git -C "${destiny}" status --porcelain`);
    if (!statusOutput.trim()) {
      console.log('No changes to apply in destiny.');
    } else {
      if (yes) {
        console.log('Auto-committing...');
        commitDestiny({ destiny, commitMsg });
      } else {
        const confirmed = await confirmCommit(destiny, commitMsg);
        if (confirmed) {
          commitDestiny({ destiny, commitMsg });
        } else {
          console.log('User cancelled. Exiting.');
          return;
        }
      }
    }

    const nextCommit = getNextCommit(origin, currentCommit);
    if (!nextCommit) {
      console.log('\nNo more commits. Reached HEAD.');
      return;
    }

    if (!yes) {
      const answer = await askQuestion(`\nContinue with next commit ${nextCommit}? (y/N) `);
      if (!answer.toLowerCase().startsWith('y')) {
        console.log('Exiting.');
        return;
      }
    }

    currentCommit = nextCommit;
  }
}
