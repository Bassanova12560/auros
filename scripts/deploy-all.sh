#!/usr/bin/env bash
# Deploy ARL contracts (localhost) and start Docker services.
# Usage: ./scripts/deploy-all.sh
# Prereqs: Node 20+, Docker, npm in protocol/ and agent-api/

set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

echo "==> Compile protocol"
(cd "$ROOT/protocol" && npm install && npm run compile)

echo "==> Start Hardhat node in background (if not already on :8545)"
if ! curl -sf http://127.0.0.1:8545 >/dev/null 2>&1; then
  (cd "$ROOT/protocol" && npx hardhat node --hostname 127.0.0.1) &
  HARDHAT_PID=$!
  trap 'kill $HARDHAT_PID 2>/dev/null || true' EXIT
  sleep 3
fi

echo "==> Deploy to localhost"
(cd "$ROOT/protocol" && npm run deploy:localhost)

echo "==> Docker Compose (mosquitto, iot-bridge stub, agent-api)"
(cd "$ROOT" && docker compose up --build -d)

echo "==> Next.js (manual): cd $ROOT && npm run dev"
echo "Done. Agent API: http://localhost:4100 — chain: http://127.0.0.1:8545"
