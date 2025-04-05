import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
export const createServer = () => {
    return new McpServer({
        name: "Echo",
        version: "1.0.0",
    });
};
