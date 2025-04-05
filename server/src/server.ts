import { createServer } from "./config/server-config.js";
import { registerWifiResources } from "./resources/wifi-resource.js";
import { registerHostsResources } from "./resources/hosts-resource.js";
import { registerDiagnosticsResources } from "./resources/diagnostics-resource.js";
import { registerWifiTools } from "./tools/wifi-tool.js";
import { registerDiagnosticsTools } from "./tools/diagnostics-tool.js";
import { registerRouterPrompts } from "./prompts/router-prompts.js";
import { setupStdioTransport } from "./transport/stdio-transport.js";
import { setupExpressServer } from "./api/express-server.js";

// Create the MCP server
const server = createServer();

// Register resources
console.log("[SERVER] Registering WiFi resources");
registerWifiResources(server);
console.log("[SERVER] Registering Hosts resources");
registerHostsResources(server);
console.log("[SERVER] Registering Diagnostics resources");
registerDiagnosticsResources(server);

// Register tools
console.log("[SERVER] Registering WiFi tools");
registerWifiTools(server);
console.log("[SERVER] Registering Diagnostics tools");
registerDiagnosticsTools(server);

// Register prompts
console.log("[SERVER] Registering Router prompts");
registerRouterPrompts(server);

// Setup the transports
console.log("[SERVER] Setting up stdio transport");
await setupStdioTransport(server);

// Setup the Express server for SSE
console.log("[SERVER] Setting up Express server");
setupExpressServer(server); 