import { z } from "zod";
export const registerEchoTool = (server) => {
    server.tool("echo", { message: z.string() }, async ({ message }) => {
        console.log("echo", message);
        return {
            content: [{ type: "text", text: `Tool echo: ${message}` }],
        };
    });
};
