import express from "express";
import { setupSSE, handlePostMessage } from "../transport/sse-transport.js";
export const setupExpressServer = (server) => {
    const app = express();
    app.get("/sse", async (req, res) => {
        await setupSSE(server, req, res);
    });
    app.post("/messages", async (req, res) => {
        await handlePostMessage(req, res);
    });
    app.listen(3001, () => {
        console.log("Server is running on port 3001");
    });
};
