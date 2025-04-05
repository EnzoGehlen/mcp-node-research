import { z } from "zod";
// Shared with the resource
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
export const registerWifiTools = (server) => {
    // Enable/disable a WiFi network
    server.tool("toggle-wifi-network", {
        networkId: z.string(),
        enabled: z.boolean()
    }, async ({ networkId, enabled }) => {
        console.log(`[TOOL CALL] toggle-wifi-network - Setting network ${networkId} to ${enabled ? 'enabled' : 'disabled'}`);
        const network = wifiConfigData.networks.find(n => n.id === networkId);
        if (!network) {
            console.log(`[TOOL ERROR] toggle-wifi-network - Network not found: ${networkId}`);
            return {
                content: [{ type: "text", text: `Error: Network with id ${networkId} not found` }],
            };
        }
        network.enabled = enabled;
        return {
            content: [{
                    type: "text",
                    text: `WiFi network "${network.ssid}" (${networkId}) ${enabled ? 'enabled' : 'disabled'} successfully`
                }],
        };
    });
    // Update WiFi network configuration
    server.tool("update-wifi-config", {
        networkId: z.string(),
        ssid: z.string().optional(),
        password: z.string().optional(),
        channel: z.number().min(1).max(165).optional(),
        security: z.enum(["WPA2-PSK", "WPA3", "WPA/WPA2", "None"]).optional(),
    }, async ({ networkId, ssid, password, channel, security }) => {
        console.log(`[TOOL CALL] update-wifi-config - Updating network ${networkId} configuration`);
        console.log(`[TOOL PARAMS] update-wifi-config - ssid: ${ssid ? 'provided' : 'not provided'}, password: ${password ? 'provided' : 'not provided'}, channel: ${channel || 'not provided'}, security: ${security || 'not provided'}`);
        const network = wifiConfigData.networks.find(n => n.id === networkId);
        if (!network) {
            console.log(`[TOOL ERROR] update-wifi-config - Network not found: ${networkId}`);
            return {
                content: [{ type: "text", text: `Error: Network with id ${networkId} not found` }],
            };
        }
        // Update properties if provided
        if (ssid)
            network.ssid = ssid;
        if (password)
            network.password = password;
        if (channel)
            network.channel = channel;
        if (security)
            network.security = security;
        return {
            content: [{
                    type: "text",
                    text: `WiFi network ${networkId} configuration updated successfully:\n` +
                        `SSID: ${network.ssid}\n` +
                        `Security: ${network.security}\n` +
                        `Channel: ${network.channel}\n` +
                        `Band: ${network.band}\n` +
                        `Enabled: ${network.enabled}`
                }],
        };
    });
    // Create a new WiFi network
    server.tool("create-wifi-network", {
        id: z.string(),
        ssid: z.string(),
        password: z.string(),
        band: z.enum(["2.4GHz", "5GHz"]),
        channel: z.number().min(1).max(165),
        security: z.enum(["WPA2-PSK", "WPA3", "WPA/WPA2", "None"]),
        enabled: z.boolean().default(true)
    }, async ({ id, ssid, password, band, channel, security, enabled }) => {
        console.log(`[TOOL CALL] create-wifi-network - Creating new network with id: ${id}`);
        // Check if network ID already exists
        if (wifiConfigData.networks.some(n => n.id === id)) {
            console.log(`[TOOL ERROR] create-wifi-network - Network with ID already exists: ${id}`);
            return {
                content: [{ type: "text", text: `Error: A network with id "${id}" already exists` }],
            };
        }
        // Create new network
        const newNetwork = {
            id,
            ssid,
            password,
            band,
            channel,
            security,
            enabled
        };
        wifiConfigData.networks.push(newNetwork);
        console.log(`[TOOL SUCCESS] create-wifi-network - Network created: ${id} (${ssid})`);
        return {
            content: [{
                    type: "text",
                    text: `New WiFi network created successfully:\n` +
                        `ID: ${id}\n` +
                        `SSID: ${ssid}\n` +
                        `Band: ${band}\n` +
                        `Channel: ${channel}\n` +
                        `Security: ${security}\n` +
                        `Enabled: ${enabled}`
                }],
        };
    });
};
