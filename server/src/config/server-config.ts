import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export const createServer = (): McpServer => {
  return new McpServer({
    name: "Echo",
    version: "1.0.0",
  });
}; 