import readline from 'readline';
import { ensureGitRepo, getNextCommit, getAllCommits } from './gitDiff.js';
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

export async function main({ origin, destiny, commit }) {
  ensureGitRepo(origin);
  ensureGitRepo(destiny);

  const allCommits = getAllCommits(origin);
  let currentCommit = commit;

  while (currentCommit) {
    console.log(`\n--- Procesando commit: ${currentCommit} ---`);

    const { commitMsg } = await applyCommitChanges({ origin, destiny, commit: currentCommit });

    const statusOutput = sh(`git -C "${destiny}" status --porcelain`);
    if (!statusOutput.trim()) {
      console.log('No hay cambios que aplicar en destiny.');
    } else {
      const confirmed = await confirmCommit(destiny, commitMsg);
      if (confirmed) {
        commitDestiny({ destiny, commitMsg });
      } else {
        console.log('Usuario canceló. Terminando.');
        return;
      }
    }

    const nextCommit = getNextCommit(origin, currentCommit);
    if (!nextCommit) {
      console.log('\nNo hay más commits. Has llegado al HEAD.');
      return;
    }

    const answer = await askQuestion(`\n¿Continuar con el siguiente commit ${nextCommit}? (s/N) `);
    if (!answer.toLowerCase().startsWith('s')) {
      console.log('Terminando.');
      return;
    }

    currentCommit = nextCommit;
  }
}
