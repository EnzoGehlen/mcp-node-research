import { anthropic } from "@ai-sdk/anthropic";
import {
  CoreMessage,
  streamText,
  experimental_createMCPClient as createMCPClient,
} from "ai";
import dotenv from "dotenv";
import * as readline from "node:readline/promises";

dotenv.config();

const terminal = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const mcpClient = await createMCPClient({
  transport: {
    type: "sse",
    url: "http://localhost:3001/sse",

    // optional: configure HTTP headers, e.g. for authentication
    headers: {
      Authorization: "Bearer my-api-key",
    },
  },
});

const tools = mcpClient.tools();

const messages: CoreMessage[] = [];

async function main() {
  while (true) {
    const userInput = await terminal.question("You: ");

    messages.push({ role: "user", content: userInput });

    const result = streamText({
      system: "You are a helpful assistant.",
      model: anthropic("claude-3-5-sonnet-latest"),
      tools: await tools,
      maxSteps: 10,
      messages,
    });

    let fullResponse = "";
    process.stdout.write("\nAssistant: ");
    for await (const delta of result.textStream) {
      fullResponse += delta;
      process.stdout.write(delta);
    }
    process.stdout.write("\n\n");

    messages.push({ role: "assistant", content: fullResponse });
  }
}

main().catch(console.error);
