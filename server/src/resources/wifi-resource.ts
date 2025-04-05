import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";

// Mock data for WiFi configuration
const wifiConfigData = {
  networks: [
    {
      id: "main",
      ssid: "HomeNetwork",
      password: "************",
      security: "WPA2-PSK",
      channel: 6,
      band: "2.4GHz",
      enabled: true
    },
    {
      id: "guest",
      ssid: "HomeNetwork-Guest",
      password: "******",
      security: "WPA2-PSK",
      channel: 11,
      band: "2.4GHz",
      enabled: true
    },
    {
      id: "5g",
      ssid: "HomeNetwork-5G",
      password: "************",
      security: "WPA3",
      channel: 36,
      band: "5GHz",
      enabled: true
    }
  ]
};

export const registerWifiResources = (server: McpServer): void => {
  // Get all WiFi networks
  server.resource(
    "wifi-networks",
    new ResourceTemplate("router://wifi/networks", { list: undefined }),
    async () => {
      console.log("[RESOURCE CALL] wifi-networks - Listing all WiFi networks");
      return {
        contents: [
          {
            uri: "router://wifi/networks",
            text: JSON.stringify(wifiConfigData.networks.map(net => ({
              id: net.id,
              ssid: net.ssid,
              band: net.band,
              enabled: net.enabled
            })))
          },
        ],
      };
    }
  );

  // Get specific network details
  server.resource(
    "wifi-network-detail",
    new ResourceTemplate("router://wifi/networks/{networkId}", { list: undefined }),
    async (uri, { networkId }) => {
      console.log(`[RESOURCE CALL] wifi-network-detail - Getting details for network: ${networkId}`);
      const network = wifiConfigData.networks.find(n => n.id === networkId);
      if (!network) {
        console.log(`[RESOURCE ERROR] wifi-network-detail - Network not found: ${networkId}`);
        return {
          contents: [
            {
              uri: uri.href,
              text: JSON.stringify({ error: "Network not found" })
            },
          ],
        };
      }
      return {
        contents: [
          {
            uri: uri.href,
            text: JSON.stringify({
              ...network,
              password: "********" // Masked for security
            })
          },
        ],
      };
    }
  );
}; 