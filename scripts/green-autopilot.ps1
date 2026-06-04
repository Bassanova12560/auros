# AUROS Green — autopilot local (sans GitHub)
# Usage:
#   .\scripts\green-autopilot.ps1              # deploy + seed + health
#   .\scripts\green-autopilot.ps1 -HealthOnly  # smoke HTTP seulement
#   .\scripts\green-autopilot.ps1 -SyncOnly    # seed marché seulement

param(
  [switch]$HealthOnly,
  [switch]$SyncOnly,
  [switch]$SkipDeploy
)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $Root

if ($HealthOnly) {
  npm run green:health
  exit $LASTEXITCODE
}

if ($SyncOnly) {
  npm run green:sync
  exit $LASTEXITCODE
}

if (-not $SkipDeploy) {
  npm run green:deploy
  if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
} else {
  npm run green:sync
  if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
}

npm run green:health
exit $LASTEXITCODE
