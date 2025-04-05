import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
// to support multiple simultaneous connections we have a lookup object from
// sessionId to transport
export const transports = {};
export const setupSSE = async (server, _, res) => {
    console.log("Setting up SSE transport");
    const transport = new SSEServerTransport("/messages", res);
    transports[transport.sessionId] = transport;
    res.on("close", () => {
        delete transports[transport.sessionId];
    });
    await server.connect(transport);
};
export const handlePostMessage = async (req, res) => {
    console.log("Handling POST message");
    const sessionId = req.query.sessionId;
    const transport = transports[sessionId];
    if (transport) {
        await transport.handlePostMessage(req, res);
    }
    else {
        res.status(400).send("No transport found for sessionId");
    }
};
