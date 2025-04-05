import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export const registerRouterPrompts = (server: McpServer): void => {
  // Prompt for troubleshooting WiFi issues
  server.prompt(
    "troubleshoot-wifi", 
    { 
      problem: z.string(),
      deviceType: z.string().optional(),
      connectionHistory: z.string().optional()
    }, 
    ({ problem, deviceType, connectionHistory }) => {
      const includeHistory = connectionHistory === "true";
      
      console.log(`[PROMPT CALL] troubleshoot-wifi - Problem: ${problem}`);
      console.log(`[PROMPT PARAMS] troubleshoot-wifi - deviceType: ${deviceType || 'not provided'}, connectionHistory: ${includeHistory ? 'requested' : 'not requested'}`);
      
      return {
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: `I need help troubleshooting a WiFi issue with my router. 
Problem description: ${problem}
${deviceType ? `Device type: ${deviceType}` : ''}
${includeHistory ? 'Please include connection history in your analysis.' : ''}

Please analyze this WiFi problem and suggest solutions. You can use the router diagnostic tools to help diagnose the issue.`
            },
          },
        ],
      };
    }
  );

  // Prompt for optimizing WiFi network
  server.prompt(
    "optimize-wifi",
    { 
      networkId: z.string(),
      primaryUse: z.string(),
      interferenceIssues: z.string().optional()
    }, 
    ({ networkId, primaryUse, interferenceIssues }) => {
      const hasInterference = interferenceIssues === "true";
      
      console.log(`[PROMPT CALL] optimize-wifi - Optimizing network: ${networkId} for ${primaryUse}`);
      console.log(`[PROMPT PARAMS] optimize-wifi - interferenceIssues: ${hasInterference ? 'yes' : 'no/not specified'}`);
      
      return {
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: `Please help me optimize my WiFi network (${networkId}) for ${primaryUse} usage.
${hasInterference ? 'I am experiencing interference issues with neighboring networks.' : ''}

Analyze my current network configuration and suggest optimal settings for channel, band, and other parameters to improve performance for ${primaryUse} use case.
Please explain the benefits of each recommendation.`
            },
          },
        ],
      };
    }
  );

  // Prompt for explaining router logs
  server.prompt(
    "explain-logs",
    { 
      logLevel: z.string().optional(),
      timeframe: z.string().optional()
    }, 
    ({ logLevel = "all", timeframe = "recent" }) => {
      console.log(`[PROMPT CALL] explain-logs - Explaining ${logLevel} logs from timeframe: ${timeframe}`);
      
      return {
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: `Please analyze and explain my router logs in simple terms.
Log level filter: ${logLevel}
Timeframe: ${timeframe}

For each significant log entry:
1. Explain what it means in non-technical terms
2. Indicate if it's something I should be concerned about
3. Suggest any actions I should take based on these logs

Additionally, provide an overall assessment of my router's health based on these logs.`
            },
          },
        ],
      };
    }
  );

  // Prompt for security assessment
  server.prompt(
    "security-assessment",
    { 
      includeDevices: z.string().optional(),
      includeNetworks: z.string().optional()
    }, 
    ({ includeDevices = "true", includeNetworks = "true" }) => {
      const checkDevices = includeDevices !== "false";
      const checkNetworks = includeNetworks !== "false";
      
      console.log(`[PROMPT CALL] security-assessment - Devices: ${checkDevices ? 'included' : 'excluded'}, Networks: ${checkNetworks ? 'included' : 'excluded'}`);
      
      return {
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: `Please perform a security assessment of my router configuration.
${checkNetworks ? 'Include analysis of WiFi network security settings.' : ''}
${checkDevices ? 'Include analysis of connected devices and potential vulnerabilities.' : ''}

For this assessment:
1. Identify any security weaknesses in my current setup
2. Suggest improvements to enhance network security
3. Provide a simple security score (1-10) based on current configuration
4. Recommend best practices for maintaining a secure home network`
            },
          },
        ],
      };
    }
  );
}; 