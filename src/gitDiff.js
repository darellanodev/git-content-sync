import { sh } from './shell.js';

export function ensureGitRepo(root) {
  try {
    sh(`git -C "${root}" rev-parse --is-inside-work-tree`);
  } catch {
    throw new Error(`"${root}" no es un repositorio Git válido`);
  }
}

export function getCommitMessage(origin, commit) {
  const output = sh(`git -C "${origin}" show -s --format=%B ${commit}`);
  return output.trim();
}

export function getParentCommit(origin, commit) {
  return sh(`git -C "${origin}" rev-parse ${commit}^`).trim();
}

export function getSummaryDiff(origin, parent, commit) {
  const output = sh(`git -C "${origin}" diff --summary --find-renames --find-copies ${parent} ${commit}`);
  return output.split('\n').filter(line => line.trim());
}

export function getNameStatusDiff(origin, parent, commit) {
  const output = sh(`git -C "${origin}" diff --name-status --find-renames ${parent} ${commit}`);
  return output.split('\n').filter(line => line.trim());
}

export function getFileContentAt(origin, commit, relPath) {
  return sh(`git -C "${origin}" show ${commit}:"${relPath}"`);
}
