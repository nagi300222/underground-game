#!/usr/bin/env bash
set -euo pipefail

# Run this from the repository root after committing/stashing any work.
# It moves documentation out of the GitHub Pages root and keeps only the game files at root.

mkdir -p docs/changelog docs/audit docs/fable5 docs/planning docs/archive tools/audit

shopt -s nullglob
for f in CHANGELOG_*.md; do git mv "$f" docs/changelog/ 2>/dev/null || mv "$f" docs/changelog/; done
for f in FABLE5_*.md; do git mv "$f" docs/fable5/ 2>/dev/null || mv "$f" docs/fable5/; done
for f in ROADMAP_*.md SIMULATION_*.md BALANCE_*.md; do git mv "$f" docs/planning/ 2>/dev/null || mv "$f" docs/planning/; done
for f in AUDIT*.md CHATGPT_AUDIT*.md MOBILE_SMOKE*.md; do git mv "$f" docs/audit/ 2>/dev/null || mv "$f" docs/audit/; done
for f in audit*.js; do git mv "$f" tools/audit/ 2>/dev/null || mv "$f" tools/audit/; done

# Archive bulky zip files if any were accidentally committed.
for f in *.zip; do git mv "$f" docs/archive/ 2>/dev/null || mv "$f" docs/archive/; done

# Ensure GitHub Pages skips Jekyll.
touch .nojekyll

echo "Cleanup layout complete. Review with: git status"
