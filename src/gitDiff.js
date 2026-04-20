import { sh } from './shell.js';

export function ensureGitRepo(root) {
  try {
    sh(`git -C "${root}" rev-parse --is-inside-work-tree`);
  } catch {
    throw new Error(`"${root}" no es un repositorio Git válido`);
  }
}

export function getHeadCommit(repo) {
  return sh(`git -C "${repo}" rev-parse HEAD`).trim();
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

export function getFirstCommitAfter(origin, destiny) {
  const destinyMsg = sh(`git -C "${destiny}" log -1 --format=%B`).trim();
  
  const originCommits = sh(`git -C "${origin}" log --oneline --reverse`).trim().split('\n').map(c => c.split(' ')[0]);
  
  for (let i = 0; i < originCommits.length; i++) {
    const msg = sh(`git -C "${origin}" log -1 --format=%B ${originCommits[i]}`).trim();
    if (msg === destinyMsg) {
      if (i >= originCommits.length - 1) return null;
      return originCommits[i + 1];
    }
  }
  return originCommits[0];
}

export function getNextCommit(origin, currentCommit) {
  const originCommits = sh(`git -C "${origin}" log --oneline --reverse`).trim().split('\n').map(c => c.split(' ')[0]);
  const currentIndex = originCommits.indexOf(currentCommit);
  if (currentIndex === -1 || currentIndex >= originCommits.length - 1) return null;
  return originCommits[currentIndex + 1];
}

export function getAllCommits(origin) {
  const output = sh(`git -C "${origin}" log --oneline --reverse`).trim();
  return output.split('\n').map(line => line.split(' ')[0]);
}
