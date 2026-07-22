# Auros Resource Layer IoT Bridge

The bridge subscribes to MQTT production messages, verifies the device's
EIP-191 signature and authorization, then reports the mint to ResourceOracle.
Mock mode returns a simulated transaction hash without a live chain.

## Local demo

```bash
docker compose up -d
cp .env.example .env
npm install
npm run simulator
```

The simulator's first run prints a newly generated private key and its public
address. Put the private key in `SIMULATOR_PRIVATE_KEY`, add the printed
`deviceId: address` pair to `DEVICE_ALLOWLIST_JSON`, then run these in separate
terminals:

```bash
npm run dev
npm run simulator
```

The subscribed topic is `energy/+/production`; simulators publish to
`energy/{deviceId}/production` with:

```json
{
  "deviceId": "demo-meter-001",
  "amountWh": 250,
  "timestamp": "2026-01-01T12:00:00.000Z",
  "signature": "0x..."
}
```

The signed text is
`auros:iot:<deviceId>:<amountWh>:<timestamp>`. Messages older than five minutes,
topic/payload mismatches, invalid signatures, and unregistered signers are
rejected. For chain mode, set `MOCK_MODE=false`, RPC/oracle signer/oracle
address, and either configure the local allowlist or a DeviceRegistry address
implementing `isDeviceRegistered(bytes32,address)`.

The bundled Mosquitto configuration allows anonymous localhost access for
development only. Use broker authentication and TLS outside local development.

Run `npm test`, `npm run typecheck`, or `npm run build` to verify the package.
