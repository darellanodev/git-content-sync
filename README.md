# Git Content Sync

A CLI tool that copies commit contents from an origin repository to a destination repository, starting from a specified commit hash up to the HEAD of the origin repository.

## THIS APPLICATION IS IN AN EARLY STAGE OF DEVELOPMENT

## Github repository

- <https://github.com/darellanodev/git-content-sync>

## Technologies

[![Node.js](https://img.shields.io/badge/node.js-%23433934.svg?style=flat&logo=node.js&logoColor=white)](https://nodejs.org)
[![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=flat&logo=javascript&logoColor=%23F7DF1E)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

## Requirements

- Node.js

## Install

Run the command `npm install`

## Run the application

Execute the script `./run.sh`

Or use the npm script:

```bash
npm run sync -- --origin <path> --destiny <path> --commit <hash> [--yes|-y]
```

## Usage

```bash
git-content-sync --origin <path> --destiny <path> --commit <hash> [--yes|-y]
```

### Arguments

| Argument      | Description                            |
| ------------- | -------------------------------------- |
| `--origin`    | Path to the origin git repository      |
| `--destiny`   | Path to the destination git repository |
| `--commit`    | Commit hash to start from              |
| `--yes`, `-y` | Auto-commit changes without prompting  |

### How it works

1. Validates that both origin and destiny are valid git repositories
2. Retrieves all commits from the origin repository starting from the specified hash up to HEAD
3. For each commit:
   - Applies the changes from the origin to the destination
   - Prompts for confirmation (unless `--yes` is used)
   - Commits the changes to the destination with the original commit message
4. Repeats until all commits have been processed

## Example

```bash
git-content-sync --origin /path/to/origin-repo --destiny /path/to/destiny-repo --commit abc1234
```

With auto-commit mode:

```bash
git-content-sync --origin /path/to/origin-repo --destiny /path/to/destiny-repo --commit abc1234 --yes
```
