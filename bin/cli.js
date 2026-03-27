#!/usr/bin/env node

import { main } from '../src/main.js';

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    origin: null,
    destiny: null,
    commit: null
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--origin' && i + 1 < args.length) {
      options.origin = args[++i];
    } else if (arg === '--destiny' && i + 1 < args.length) {
      options.destiny = args[++i];
    } else if (arg === '--commit' && i + 1 < args.length) {
      options.commit = args[++i];
    }
  }

  return options;
}

function showUsage() {
  console.error('Uso: git-content-sync --origin <ruta> --destiny <ruta> --commit <hash>');
  process.exit(1);
}

const { origin, destiny, commit } = parseArgs();

if (!origin || !destiny || !commit) {
  showUsage();
}

(async () => {
  try {
    await main({ origin, destiny, commit });
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
})();
