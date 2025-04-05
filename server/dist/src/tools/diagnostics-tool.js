import { z } from "zod";
// Mock diagnostic test results
const performSpeedTest = () => {
    return {
        downloadSpeed: Math.round(Math.random() * 80 + 20), // 20-100 Mbps
        uploadSpeed: Math.round(Math.random() * 30 + 10), // 10-40 Mbps
        ping: Math.round(Math.random() * 50 + 10), // 10-60 ms
        jitter: Math.round(Math.random() * 8 + 1), // 1-9 ms
        packetLoss: parseFloat((Math.random() * 2).toFixed(2)), // 0-2%
        timestamp: new Date().toISOString()
    };
};
const pingHost = (host) => {
    const successful = Math.random() > 0.1; // 90% success rate
    return {
        host,
        success: successful,
        avgResponseTime: successful ? Math.round(Math.random() * 100 + 20) : null, // 20-120 ms
        packetLoss: successful ? parseFloat((Math.random() * 5).toFixed(2)) : 100, // 0-5% or 100%
        timestamp: new Date().toISOString()
    };
};
const checkDnsResolution = (domain) => {
    const successful = Math.random() > 0.05; // 95% success rate
    return {
        domain,
        success: successful,
        resolvedIp: successful ? `203.0.113.${Math.floor(Math.random() * 255)}` : null,
        responseTime: successful ? Math.round(Math.random() * 100 + 10) : null, // 10-110 ms
        timestamp: new Date().toISOString()
    };
};
export const registerDiagnosticsTools = (server) => {
    // Run speed test
    server.tool("run-speed-test", {}, async () => {
        console.log(`[TOOL CALL] run-speed-test - Running internet speed test`);
        const results = performSpeedTest();
        console.log(`[TOOL RESULT] run-speed-test - Download: ${results.downloadSpeed} Mbps, Upload: ${results.uploadSpeed} Mbps, Ping: ${results.ping} ms`);
        return {
            content: [{
                    type: "text",
                    text: `Speed test completed:\n` +
                        `Download: ${results.downloadSpeed} Mbps\n` +
                        `Upload: ${results.uploadSpeed} Mbps\n` +
                        `Ping: ${results.ping} ms\n` +
                        `Jitter: ${results.jitter} ms\n` +
                        `Packet Loss: ${results.packetLoss}%\n` +
                        `Tested at: ${results.timestamp}`
                }],
        };
    });
    // Ping a host
    server.tool("ping-host", {
        host: z.string()
    }, async ({ host }) => {
        console.log(`[TOOL CALL] ping-host - Pinging host: ${host}`);
        const results = pingHost(host);
        if (results.success) {
            console.log(`[TOOL RESULT] ping-host - Successfully pinged ${host}: ${results.avgResponseTime}ms`);
        }
        else {
            console.log(`[TOOL RESULT] ping-host - Failed to ping ${host}`);
        }
        return {
            content: [{
                    type: "text",
                    text: results.success
                        ? `Successfully pinged ${host}:\n` +
                            `Average response time: ${results.avgResponseTime} ms\n` +
                            `Packet loss: ${results.packetLoss}%\n` +
                            `Timestamp: ${results.timestamp}`
                        : `Failed to ping ${host}. 100% packet loss.\n` +
                            `Timestamp: ${results.timestamp}`
                }],
        };
    });
    // Check DNS resolution
    server.tool("check-dns", {
        domain: z.string()
    }, async ({ domain }) => {
        console.log(`[TOOL CALL] check-dns - Checking DNS resolution for: ${domain}`);
        const results = checkDnsResolution(domain);
        if (results.success) {
            console.log(`[TOOL RESULT] check-dns - Successfully resolved ${domain} to ${results.resolvedIp}`);
        }
        else {
            console.log(`[TOOL RESULT] check-dns - Failed to resolve ${domain}`);
        }
        return {
            content: [{
                    type: "text",
                    text: results.success
                        ? `Successfully resolved ${domain}:\n` +
                            `IP Address: ${results.resolvedIp}\n` +
                            `Response time: ${results.responseTime} ms\n` +
                            `Timestamp: ${results.timestamp}`
                        : `Failed to resolve ${domain}.\n` +
                            `Timestamp: ${results.timestamp}`
                }],
        };
    });
    // Restart router (simulation)
    server.tool("restart-router", {
        force: z.boolean().default(false)
    }, async ({ force }) => {
        console.log(`[TOOL CALL] restart-router - Restarting router with force=${force}`);
        // Simulate restart delay
        const restartTime = force ? "30 seconds" : "2 minutes";
        return {
            content: [{
                    type: "text",
                    text: `Router restart initiated. The router will reboot in the next ${restartTime}.\n` +
                        `All connections will be temporarily lost during this process.\n` +
                        `Force restart: ${force ? "Yes" : "No"}\n` +
                        `Initiated at: ${new Date().toISOString()}`
                }],
        };
    });
};
