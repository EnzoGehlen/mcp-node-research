import express, { Request, Response } from "express";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { setupSSE, handlePostMessage } from "../transport/sse-transport.js";

export const setupExpressServer = (server: McpServer): void => {
  const app = express();

  app.get("/sse", async (req: Request, res: Response) => {
    await setupSSE(server, req, res);
  });

  app.post("/messages", async (req: Request, res: Response) => {
    await handlePostMessage(req, res);
  });

  app.listen(3001, () => {
    console.log("Server is running on port 3001");
  });
}; 