import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const transport = new StdioClientTransport({
  command: "node",
  args: ["dist/server.js"]
});

const client = new Client(
  {
    name: "example-client",
    version: "1.0.0"
  },
  {
    capabilities: {
      prompts: {},
      resources: {},
      tools: {}
    }
  }
);

await client.connect(transport);

// List prompts
const prompts = await client.listPrompts();

console.log(prompts);

// Get a prompt
const prompt = await client.getPrompt({
  name: "echo",
  arguments: {
    message: "Hello, world!"
  }
});

console.dir(prompt, { depth: null });

// List resources
const resources = await client.listResources();

console.log(resources);

// // Read a resource
// const resource = await client.readResource({
//   uri: "file:///example.txt"
// });

// Call a tool
// const result = await client.callTool({
//   name: "add",
//   arguments: {
//     a: 1,
//     b: 2
//   }
// });

// console.log(result);