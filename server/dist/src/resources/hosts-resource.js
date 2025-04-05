import { ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
// Mock data for connected hosts
const hostsData = {
    devices: [
        {
            id: "device1",
            hostname: "john-laptop",
            ip: "192.168.1.100",
            mac: "AA:BB:CC:DD:EE:FF",
            connectionType: "wifi",
            network: "main",
            lastSeen: new Date().toISOString(),
            downloadSpeed: 15.2, // Mbps
            uploadSpeed: 5.8, // Mbps
            signalStrength: 87 // percentage
        },
        {
            id: "device2",
            hostname: "living-room-tv",
            ip: "192.168.1.101",
            mac: "11:22:33:44:55:66",
            connectionType: "wifi",
            network: "main",
            lastSeen: new Date().toISOString(),
            downloadSpeed: 28.6,
            uploadSpeed: 8.2,
            signalStrength: 92
        },
        {
            id: "device3",
            hostname: "kitchen-tablet",
            ip: "192.168.1.102",
            mac: "AA:11:BB:22:CC:33",
            connectionType: "wifi",
            network: "5g",
            lastSeen: new Date().toISOString(),
            downloadSpeed: 65.3,
            uploadSpeed: 22.1,
            signalStrength: 85
        },
        {
            id: "device4",
            hostname: "desktop-pc",
            ip: "192.168.1.103",
            mac: "DD:EE:FF:00:11:22",
            connectionType: "ethernet",
            lastSeen: new Date().toISOString(),
            downloadSpeed: 92.7,
            uploadSpeed: 35.4
        }
    ]
};
export const registerHostsResources = (server) => {
    // Get all connected hosts
    server.resource("hosts-list", new ResourceTemplate("router://hosts", { list: undefined }), async () => {
        console.log("[RESOURCE CALL] hosts-list - Listing all connected hosts");
        return {
            contents: [
                {
                    uri: "router://hosts",
                    text: JSON.stringify(hostsData.devices.map(device => ({
                        id: device.id,
                        hostname: device.hostname,
                        ip: device.ip,
                        connectionType: device.connectionType
                    })))
                },
            ],
        };
    });
    // Get specific host details
    server.resource("host-detail", new ResourceTemplate("router://hosts/{deviceId}", { list: undefined }), async (uri, { deviceId }) => {
        console.log(`[RESOURCE CALL] host-detail - Getting details for device: ${deviceId}`);
        const device = hostsData.devices.find(d => d.id === deviceId);
        if (!device) {
            console.log(`[RESOURCE ERROR] host-detail - Device not found: ${deviceId}`);
            return {
                contents: [
                    {
                        uri: uri.href,
                        text: JSON.stringify({ error: "Device not found" })
                    },
                ],
            };
        }
        return {
            contents: [
                {
                    uri: uri.href,
                    text: JSON.stringify(device)
                },
            ],
        };
    });
    // Get hosts by network
    server.resource("hosts-by-network", new ResourceTemplate("router://networks/{networkId}/hosts", { list: undefined }), async (uri, { networkId }) => {
        console.log(`[RESOURCE CALL] hosts-by-network - Listing hosts on network: ${networkId}`);
        const networkHosts = hostsData.devices.filter(d => d.connectionType === "wifi" && d.network === networkId);
        if (networkHosts.length === 0) {
            console.log(`[RESOURCE INFO] hosts-by-network - No hosts found on network: ${networkId}`);
        }
        return {
            contents: [
                {
                    uri: uri.href,
                    text: JSON.stringify(networkHosts.map(device => ({
                        id: device.id,
                        hostname: device.hostname,
                        ip: device.ip,
                        signalStrength: device.signalStrength
                    })))
                },
            ],
        };
    });
};
