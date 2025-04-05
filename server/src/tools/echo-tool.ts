import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export const registerEchoTool = (server: McpServer): void => {
  server.tool("echo", { message: z.string() }, async ({ message }) => {
    console.log("echo", message);
    return {
      content: [{ type: "text", text: `Tool echo: ${message}` }],
    };
  });
}; 