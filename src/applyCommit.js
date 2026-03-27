import { sh } from './shell.js';
import {
  getCommitMessage,
  getParentCommit,
  getSummaryDiff,
  getNameStatusDiff,
  getFileContentAt,
  getFilesAtCommit
} from './gitDiff.js';
import {
  writeFile,
  deleteFile,
  renameFile
} from './fsOps.js';

export async function applyCommitChanges({ origin, destiny, commit }) {
  const commitMsg = getCommitMessage(origin, commit);
  const parent = getParentCommit(origin, commit);

  if (!parent) {
    const files = getFilesAtCommit(origin, commit);
    for (const relPath of files) {
      const content = getFileContentAt(origin, commit, relPath);
      writeFile(destiny, relPath, content);
    }
    return { commitMsg };
  }

  const summaryLines = getSummaryDiff(origin, parent, commit);
  const nameStatusLines = getNameStatusDiff(origin, parent, commit);

  for (const line of summaryLines) {
    if (line.startsWith(' create mode')) {
      const match = line.match(/ create mode ([0-7]+) (.+)/);
      if (match) {
        const relPath = match[2];
        const content = getFileContentAt(origin, commit, relPath);
        writeFile(destiny, relPath, content);
      }
    } else if (line.startsWith(' delete mode')) {
      const match = line.match(/ delete mode ([0-7]+) (.+)/);
      if (match) {
        const relPath = match[2];
        deleteFile(destiny, relPath);
      }
    } else if (line.startsWith(' rename ')) {
      const match = line.match(/ rename ([^=]+) => ([^:]+):(.+)/);
      if (match) {
        const oldRel = match[1].trim();
        const newRel = match[2].trim();
        const moved = renameFile(destiny, oldRel, newRel);
        if (!moved) {
          const content = getFileContentAt(origin, commit, newRel);
          writeFile(destiny, newRel, content);
        }
      }
    }
  }

  for (const line of nameStatusLines) {
    const parts = line.split('\t');
    const status = parts[0];
    let relPath = parts[1];

    if (status.startsWith('R')) {
      relPath = parts[2];
    }

    if (status === 'M') {
      const content = getFileContentAt(origin, commit, relPath);
      writeFile(destiny, relPath, content);
    } else if (status === 'A') {
      const content = getFileContentAt(origin, commit, relPath);
      writeFile(destiny, relPath, content);
    } else if (status.startsWith('R')) {
      const content = getFileContentAt(origin, commit, relPath);
      writeFile(destiny, relPath, content);
    }
  }

  return { commitMsg };
}

export function commitDestiny({ destiny, commitMsg }) {
  const statusOutput = sh(`git -C "${destiny}" status --porcelain`);
  if (!statusOutput.trim()) {
    console.log('No changes in destiny.');
    return false;
  }
  sh(`git -C "${destiny}" add -A`);
  const escapedMsg = commitMsg.replace(/"/g, '\\"');
  sh(`git -C "${destiny}" commit -m "${escapedMsg}"`);
  console.log('Commit created in destiny.');
  return true;
}
