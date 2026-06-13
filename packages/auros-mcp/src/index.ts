#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { AurosApiClient } from "./client.js";
import { registerAurosTools } from "./tools.js";

const server = new McpServer({
  name: "auros-protocol",
  version: "1.0.0",
});

const client = new AurosApiClient();
registerAurosTools(server, client);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error("AUROS MCP server failed:", err);
  process.exit(1);
});
