import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";

export const registerEchoResource = (server: McpServer): void => {
  server.resource(
    "echo",
    new ResourceTemplate("echo://{message}", { list: undefined }),
    async (uri, { message }) => ({
      contents: [
        {
          uri: uri.href,
          text: `Resource echo: ${message}`,
        },
      ],
    })
  );
}; 