import { ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
// Mock data for diagnostics
const diagnosticsData = {
    system: {
        uptime: 1209600, // seconds (14 days)
        cpuUsage: 12, // percentage
        memoryUsage: 35, // percentage
        temperature: 42, // celsius
        firmwareVersion: "v2.5.3",
        firmwareLastUpdated: "2023-11-15T08:23:45Z"
    },
    connection: {
        status: "online",
        ipAddress: "203.0.113.10",
        gateway: "203.0.113.1",
        dns: ["8.8.8.8", "8.8.4.4"],
        downloadSpeed: 85.6, // Mbps
        uploadSpeed: 25.3, // Mbps
        ping: 28, // ms
        lastChecked: new Date().toISOString()
    },
    logs: [
        {
            timestamp: "2023-12-01T12:34:56Z",
            level: "info",
            message: "System restarted"
        },
        {
            timestamp: "2023-12-01T12:35:22Z",
            level: "info",
            message: "WAN connection established"
        },
        {
            timestamp: "2023-12-02T03:15:42Z",
            level: "warning",
            message: "Multiple login attempts from 198.51.100.23"
        },
        {
            timestamp: "2023-12-03T18:23:11Z",
            level: "error",
            message: "WiFi interface 5GHz temporarily down"
        },
        {
            timestamp: "2023-12-03T18:25:03Z",
            level: "info",
            message: "WiFi interface 5GHz recovered"
        }
    ]
};
export const registerDiagnosticsResources = (server) => {
    // Get system diagnostics
    server.resource("system-diagnostics", new ResourceTemplate("router://diagnostics/system", { list: undefined }), async () => {
        console.log("[RESOURCE CALL] system-diagnostics - Getting system diagnostic information");
        return {
            contents: [
                {
                    uri: "router://diagnostics/system",
                    text: JSON.stringify(diagnosticsData.system)
                },
            ],
        };
    });
    // Get connection diagnostics
    server.resource("connection-diagnostics", new ResourceTemplate("router://diagnostics/connection", { list: undefined }), async () => {
        console.log("[RESOURCE CALL] connection-diagnostics - Getting connection diagnostic information");
        return {
            contents: [
                {
                    uri: "router://diagnostics/connection",
                    text: JSON.stringify(diagnosticsData.connection)
                },
            ],
        };
    });
    // Get system logs
    server.resource("system-logs", new ResourceTemplate("router://diagnostics/logs", { list: undefined }), async () => {
        console.log("[RESOURCE CALL] system-logs - Retrieving system logs");
        return {
            contents: [
                {
                    uri: "router://diagnostics/logs",
                    text: JSON.stringify(diagnosticsData.logs)
                },
            ],
        };
    });
    // Get filtered logs by level
    server.resource("logs-by-level", new ResourceTemplate("router://diagnostics/logs/{level}", { list: undefined }), async (uri, { level }) => {
        console.log(`[RESOURCE CALL] logs-by-level - Retrieving logs with level: ${level}`);
        const filteredLogs = diagnosticsData.logs.filter(log => log.level === level);
        if (filteredLogs.length === 0) {
            console.log(`[RESOURCE INFO] logs-by-level - No logs found with level: ${level}`);
        }
        return {
            contents: [
                {
                    uri: uri.href,
                    text: JSON.stringify(filteredLogs)
                },
            ],
        };
    });
};
