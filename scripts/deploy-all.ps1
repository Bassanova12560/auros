# Deploy ARL contracts (localhost) and start Docker services.
# Usage: .\scripts\deploy-all.ps1

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)

Write-Host "==> Compile protocol"
Push-Location (Join-Path $Root "protocol")
npm install
npm run compile
Pop-Location

Write-Host "==> Deploy to localhost (requires hardhat node on :8545)"
Write-Host "    Start in another terminal: cd protocol; npx hardhat node"
Push-Location (Join-Path $Root "protocol")
npm run deploy:localhost
Pop-Location

Write-Host "==> Docker Compose"
Push-Location $Root
docker compose up --build -d
Pop-Location

Write-Host "==> Next.js (manual): cd $Root; npm run dev"
Write-Host "Done. Agent API: http://localhost:4100"
