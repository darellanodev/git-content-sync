# Git Content Sync

A CLI tool that copies commit contents from an origin repository to a destination repository, automatically detecting which commits are missing in the destination.

## THIS APPLICATION IS IN AN EARLY STAGE OF DEVELOPMENT

## Github repository

- <https://github.com/darellanodev/git-content-sync>

## Requirements

- Node.js

## Install

Run the command `npm install`

## Run the application

Execute the script `./run.sh`

Or use the npm script:

```bash
npm run sync -- --origin <path> --destiny <path> [--yes|-y]
```

## Usage

```bash
git-content-sync --origin <path> --destiny <path> [--yes|-y]
```

### Arguments

| Argument      | Description                            |
| ------------- | -------------------------------------- |
| `--origin`    | Path to the origin git repository      |
| `--destiny`   | Path to the destination git repository |
| `--yes`, `-y` | Auto-commit changes without prompting  |

### How it works

1. Validates that both origin and destiny are valid git repositories
2. Gets the HEAD commit of the destiny repository
3. Finds the first commit in the origin that comes after the destiny's HEAD
4. For each commit from that point to origin's HEAD:
   - Applies the changes from the origin to the destination
   - Prompts for confirmation (unless `--yes` is used)
   - Commits the changes to the destination with the original commit message
5. Repeats until all commits have been processed

## Example

```bash
git-content-sync --origin /path/to/origin-repo --destiny /path/to/destiny-repo
```

With auto-commit mode:

```bash
git-content-sync --origin /path/to/origin-repo --destiny /path/to/destiny-repo --yes
```
