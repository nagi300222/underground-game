# Run this from the repository root in PowerShell.
New-Item -ItemType Directory -Force docs/changelog,docs/audit,docs/fable5,docs/planning,docs/archive,tools/audit | Out-Null
Get-ChildItem CHANGELOG_*.md -ErrorAction SilentlyContinue | Move-Item -Destination docs/changelog -Force
Get-ChildItem FABLE5_*.md -ErrorAction SilentlyContinue | Move-Item -Destination docs/fable5 -Force
Get-ChildItem ROADMAP_*.md,SIMULATION_*.md,BALANCE_*.md -ErrorAction SilentlyContinue | Move-Item -Destination docs/planning -Force
Get-ChildItem AUDIT*.md,CHATGPT_AUDIT*.md,MOBILE_SMOKE*.md -ErrorAction SilentlyContinue | Move-Item -Destination docs/audit -Force
Get-ChildItem audit*.js -ErrorAction SilentlyContinue | Move-Item -Destination tools/audit -Force
Get-ChildItem *.zip -ErrorAction SilentlyContinue | Move-Item -Destination docs/archive -Force
New-Item -ItemType File -Force .nojekyll | Out-Null
Write-Host "Cleanup layout complete. Review with: git status"
