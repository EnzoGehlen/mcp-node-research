import { z } from "zod";
export const registerEchoPrompt = (server) => {
    server.prompt("echo", { message: z.string() }, ({ message }) => ({
        messages: [
            {
                role: "user",
                content: {
                    type: "text",
                    text: `Please process this message: ${message}`,
                },
            },
        ],
    }));
};
