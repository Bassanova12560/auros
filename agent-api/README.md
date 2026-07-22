# Auros Resource Layer Agent API

Express/TypeScript API for signed resource mints, markets, spot and forward
orders, forecasts, liquidity spreads, and automated hedging.

## Run locally

```bash
cp .env.example .env
npm install
npm run dev
```

Mock mode needs no RPC or contracts. Every request must include `X-Agent-ID`
unless `AGENT_ID_REQUIRED=false`.

Sign a mint with the exact EIP-191 message
`auros:mint:<checksummed-user-address>:<amount>`, then send `{ user, amount,
signature }` to `POST /mint-request`.

Routes: `GET /health`, `GET /markets`, `GET /spreads`,
`GET /predict/price?resourceType=kwh&horizonHours=24`, `POST /mint-request`,
`POST /order`, `POST /forward-order`, and API-key-protected
`POST /provide-liquidity`.

Set `MOCK_MODE=false` plus RPC, signer, oracle, router, settlement token, and
real resource-token addresses for chain mints and Uniswap V3
`exactInputSingle` swaps. The configured signer must hold input tokens and gas.
Market and forecast feeds remain local simulations.

Run `npm test`, `npm run typecheck`, or `npm run build` to verify the package.
