/**
 * MCP (Model Context Protocol) Client Manager
 *
 * Connects to MCP servers defined in mcp.json, discovers their tools,
 * and routes tool calls from Nova Sonic to the appropriate MCP server.
 */

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { spawn } from "node:child_process";
import path from "node:path";
import fs from "node:fs";

interface McpServerConfig {
  command: string;
  args?: string[];
  env?: Record<string, string>;
}

interface McpServerEntry {
  name: string;
  client: Client;
  transport: StdioClientTransport;
  tools: Array<{
    name: string;
    description?: string;
    inputSchema: any;
  }>;
}

export class McpManager {
  private servers: Map<string, McpServerEntry> = new Map();
  // Maps tool name → server name for routing
  private toolToServer: Map<string, string> = new Map();

  /**
   * Load MCP server configs from mcp.json and connect to all of them.
   */
  async initialize(configPath?: string): Promise<void> {
    const cfgPath = configPath || path.join(process.cwd(), "mcp.json");

    if (!fs.existsSync(cfgPath)) {
      console.log(`[mcp] No config found at ${cfgPath}, skipping MCP setup`);
      return;
    }

    const config = JSON.parse(fs.readFileSync(cfgPath, "utf-8"));
    const servers = config.mcpServers || {};

    for (const [name, cfg] of Object.entries(servers)) {
      try {
        await this.connectServer(name, cfg as McpServerConfig);
      } catch (error) {
        console.error(`[mcp] Failed to connect to ${name}:`, error);
      }
    }

    console.log(`[mcp] Initialized ${this.servers.size} server(s), ${this.toolToServer.size} tool(s) available`);
  }

  private async connectServer(name: string, config: McpServerConfig): Promise<void> {
    console.log(`[mcp] Connecting to ${name}: ${config.command} ${(config.args || []).join(" ")}`);

    const transport = new StdioClientTransport({
      command: config.command,
      args: config.args || [],
      env: { ...process.env, ...(config.env || {}) } as Record<string, string>,
    });

    const client = new Client({
      name: "nova-sonic-mcp-client",
      version: "1.0.0",
    });

    await client.connect(transport);

    // Discover tools
    const toolsResult = await client.listTools();
    const tools = (toolsResult.tools || []).map((t: any) => ({
      name: t.name,
      description: t.description || "",
      inputSchema: t.inputSchema || { type: "object", properties: {} },
    }));

    const entry: McpServerEntry = { name, client, transport, tools };
    this.servers.set(name, entry);

    // Register tool→server mapping
    for (const tool of tools) {
      this.toolToServer.set(tool.name, name);
      console.log(`[mcp]   Tool: ${tool.name} — ${(tool.description || "").slice(0, 80)}`);
    }

    console.log(`[mcp] Connected to ${name} with ${tools.length} tool(s)`);
  }

  /**
   * Get all MCP tools formatted for Nova Sonic's toolConfiguration.
   * Descriptions are truncated to keep token usage manageable for voice.
   */
  getToolSpecs(): Array<{ toolSpec: { name: string; description: string; inputSchema: { json: string } } }> {
    const MAX_DESC_LENGTH = 200;
    const specs: Array<{ toolSpec: { name: string; description: string; inputSchema: { json: string } } }> = [];

    for (const server of this.servers.values()) {
      for (const tool of server.tools) {
        const fullDesc = tool.description || tool.name;
        // Take just the first sentence or MAX_DESC_LENGTH chars
        const firstSentence = fullDesc.split(/\.\s/)[0];
        const desc = firstSentence.length <= MAX_DESC_LENGTH
          ? firstSentence + "."
          : fullDesc.slice(0, MAX_DESC_LENGTH).trimEnd() + "...";

        specs.push({
          toolSpec: {
            name: tool.name,
            description: desc,
            inputSchema: {
              json: JSON.stringify(tool.inputSchema),
            },
          },
        });
      }
    }

    return specs;
  }

  /**
   * Check if a tool name belongs to an MCP server.
   */
  hasTool(toolName: string): boolean {
    return this.toolToServer.has(toolName);
  }

  /**
   * Call an MCP tool and return the result.
   */
  async callTool(toolName: string, args: Record<string, any>): Promise<any> {
    const serverName = this.toolToServer.get(toolName);
    if (!serverName) {
      throw new Error(`[mcp] No server found for tool: ${toolName}`);
    }

    const server = this.servers.get(serverName);
    if (!server) {
      throw new Error(`[mcp] Server ${serverName} not found`);
    }

    console.log(`[mcp] Calling ${toolName} on ${serverName} with args:`, JSON.stringify(args).slice(0, 200));

    const result = await server.client.callTool({
      name: toolName,
      arguments: args,
    });

    console.log(`[mcp] Result from ${toolName}:`, JSON.stringify(result).slice(0, 200));
    return result;
  }

  /**
   * Disconnect all MCP servers.
   */
  async shutdown(): Promise<void> {
    for (const [name, server] of this.servers) {
      try {
        await server.client.close();
        console.log(`[mcp] Disconnected from ${name}`);
      } catch (error) {
        console.error(`[mcp] Error disconnecting from ${name}:`, error);
      }
    }
    this.servers.clear();
    this.toolToServer.clear();
  }
}
