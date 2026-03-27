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
  const output = sh(`git -C "${origin}" rev-list --parents -n 1 ${commit}`).trim();
  const parts = output.split(/\s+/);
  if (parts.length === 1) {
    return null;
  }
  return parts[1];
}

export function getFilesAtCommit(origin, commit) {
  const output = sh(`git -C "${origin}" ls-tree -r --name-only ${commit}`);
  return output.split('\n').filter(line => line.trim());
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

export function getNextCommit(origin, commit) {
  const output = sh(`git -C "${origin}" log --oneline --ancestry-path ${commit}..HEAD`).trim();
  if (!output) return null;
  const commits = output.split('\n');
  return commits[commits.length - 1].split(' ')[0];
}

export function getAllCommits(origin) {
  const output = sh(`git -C "${origin}" log --oneline --reverse`).trim();
  return output.split('\n').map(line => line.split(' ')[0]);
}
