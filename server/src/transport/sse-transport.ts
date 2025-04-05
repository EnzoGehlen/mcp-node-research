import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { Request, Response } from "express";

// to support multiple simultaneous connections we have a lookup object from
// sessionId to transport
export const transports: { [sessionId: string]: SSEServerTransport } = {};

export const setupSSE = async (
  server: McpServer,
  _: Request,
  res: Response
): Promise<void> => {
  console.log("Setting up SSE transport");
  const transport = new SSEServerTransport("/messages", res);
  transports[transport.sessionId] = transport;
  res.on("close", () => {
    delete transports[transport.sessionId];
  });
  await server.connect(transport);
};

export const handlePostMessage = async (
  req: Request,
  res: Response
): Promise<void> => {
  console.log("Handling POST message");
  const sessionId = req.query.sessionId as string;
  const transport = transports[sessionId];
  if (transport) {
    await transport.handlePostMessage(req, res);
  } else {
    res.status(400).send("No transport found for sessionId");
  }
}; 