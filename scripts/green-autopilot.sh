#!/usr/bin/env bash
# AUROS Green — autopilot local (sans GitHub)
# Usage:
#   ./scripts/green-autopilot.sh              # deploy + seed + health
#   ./scripts/green-autopilot.sh --health-only
#   ./scripts/green-autopilot.sh --sync-only
#   ./scripts/green-autopilot.sh --skip-deploy

set -euo pipefail
cd "$(dirname "$0")/.."

health_only=false
sync_only=false
skip_deploy=false

for arg in "$@"; do
  case "$arg" in
    --health-only) health_only=true ;;
    --sync-only) sync_only=true ;;
    --skip-deploy) skip_deploy=true ;;
    -h|--help)
      echo "Usage: $0 [--health-only|--sync-only|--skip-deploy]"
      exit 0
      ;;
  esac
done

if "$health_only"; then
  npm run green:health
  exit $?
fi

if "$sync_only"; then
  npm run green:sync
  exit $?
fi

if ! "$skip_deploy"; then
  npm run green:deploy
else
  npm run green:sync
fi

npm run green:health
