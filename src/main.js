import { ensureGitRepo } from './gitDiff.js';
import { applyCommitChanges, commitDestiny } from './applyCommit.js';
import { confirmCommit } from './confirm.js';
import { sh } from './shell.js';

export async function main({ origin, destiny, commit }) {
  ensureGitRepo(origin);
  ensureGitRepo(destiny);

  const { commitMsg } = await applyCommitChanges({ origin, destiny, commit });

  const statusOutput = sh(`git -C "${destiny}" status --porcelain`);
  if (!statusOutput.trim()) {
    console.log('No hay cambios que aplicar en destiny.');
    return;
  }

  const confirmed = await confirmCommit(destiny, commitMsg);
  if (confirmed) {
    commitDestiny({ destiny, commitMsg });
  }
}
