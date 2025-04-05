import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
export const setupStdioTransport = async (server) => {
    const transport = new StdioServerTransport();
    await server.connect(transport);
};
