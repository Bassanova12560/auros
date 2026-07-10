# @adrien1212balitrand/auros-mcp

<p align="center">
  <a href="https://getauros.com/developers/docs/mcp-server">
    <img src="https://getauros.com/auros-logo.svg" alt="AUROS" width="120" />
  </a>
</p>

[MCP](https://modelcontextprotocol.io) server for the [AUROS Protocol](https://getauros.com/developers) — expose RWA intelligence tools to **Cursor**, **Claude Desktop**, and any MCP-compatible agent.

Thin wrapper over `https://getauros.com/api/v1/*` — no local scoring logic.

## Tools

| Tool | API | Auth |
|------|-----|------|
| `score` | `POST /api/v1/score` | Bearer |
| `score_batch` | `POST /api/v1/score/batch` | Bearer |
| `products` | `GET /api/v1/products` | Bearer |
| `jurisdictions` | `GET /api/v1/jurisdictions` | Bearer |
| `checklist` | `POST /api/v1/checklist` | Bearer |
| `compare` | `POST /api/v1/compare` | Bearer |
| `green_watt_score` | `GET /api/green/watt/{id}` | None |
| `green_carbon_quality` | `GET /api/green/carbon-quality/{id}` | None |
| `green_watt_batch` | `POST /api/v1/green/watt/batch` | Bearer |
| `green_carbon_quality_batch` | `POST /api/v1/green/carbon-quality/batch` | Bearer |
| `regulatory_feed` | `GET /api/v1/regulatory/feed` | Bearer (premium) |
| `status` | `GET /api/v1/status` | None |
| `green_score` | `GET /api/green/score/{id}` | Optional Bearer |
| `green_registry` | `GET /api/green/registry?serial=…` | Optional Bearer |
| `green_nature_index` | `GET /api/green/nature-index` | Optional Bearer |
| `green_api_status` | `GET /api/green/status` | None |

## Install

```bash
npm install -g @adrien1212balitrand/auros-mcp
```

Or run from the monorepo:

```bash
cd packages/auros-mcp && npm install && npm run build
node dist/index.js
```

## Environment

| Variable | Default | Description |
|----------|---------|-------------|
| `AUROS_API_KEY` | `auros_pk_test_demo` | Bearer API key ([free tier](https://getauros.com/developers) — 1000 req/mo) |
| `AUROS_BASE_URL` | `https://getauros.com` | API base URL |

Get your own key:

```bash
curl -X POST https://getauros.com/api/v1/keys \
  -H "Content-Type: application/json" \
  -d '{"email":"you@company.com"}'
```

## Cursor configuration

Add to `.cursor/mcp.json` (project) or global MCP settings:

```json
{
  "mcpServers": {
    "auros-protocol": {
      "command": "npx",
      "args": ["-y", "@adrien1212balitrand/auros-mcp"],
      "env": {
        "AUROS_API_KEY": "auros_pk_test_demo"
      }
    }
  }
}
```

Local development (monorepo):

```json
{
  "mcpServers": {
    "auros-protocol": {
      "command": "node",
      "args": ["C:/path/to/auros/packages/auros-mcp/dist/index.js"],
      "env": {
        "AUROS_API_KEY": "auros_pk_test_demo"
      }
    }
  }
}
```

## Claude Desktop configuration

Edit `%APPDATA%\Claude\claude_desktop_config.json` (Windows) or `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS):

```json
{
  "mcpServers": {
    "auros-protocol": {
      "command": "npx",
      "args": ["-y", "@adrien1212balitrand/auros-mcp"],
      "env": {
        "AUROS_API_KEY": "auros_pk_test_demo"
      }
    }
  }
}
```

Restart Cursor or Claude Desktop after saving.

## Example agent prompts

- *"Score this Luxembourg real-estate SPV for MiCA readiness: retail warehouse €2.5M, professional investors, whitepaper draft."*
- *"Compare maple-usdc, realt-portfolio, and backed-bib01 side by side."*
- *"What jurisdictions rank best for tokenized bonds with a 6-month timeline?"*

## Publishing (maintainers)

```bash
cd packages/auros-mcp
npm run build
npm login
npm publish --access public
```

## Disclaimer

Responses are **indicative intelligence only** — not legal, tax, or investment advice.

## Links

- [MCP server docs](https://getauros.com/developers/docs/mcp-server)
- [Developer portal](https://getauros.com/developers)
- [OpenAPI spec](https://getauros.com/auros-openapi.yaml)
