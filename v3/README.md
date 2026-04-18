# Amazon Nova 2 Sonic — Voice-Powered AWS Advisor

A friendly, voice-powered AWS advisor using Amazon Nova 2 Sonic for real-time speech-to-speech conversations. It proactively learns about your background, suggests relevant AWS features, and recommends the best certification path for you.

Powered by [Kiro CLI](https://kiro.dev/docs/cli/) for system tasks and [MCP](https://modelcontextprotocol.io/) for extensible tool access (including AWS documentation search).

Based on the [Amazon Nova Samples](https://github.com/aws-samples/amazon-nova-samples/tree/main/speech-to-speech/amazon-nova-2-sonic/repeatable-patterns/bedrock-knowledge-base) project.

## Key Features

- **Friendly AWS Advisor**: Asks about your experience and recommends certifications and new AWS features tailored to you
- **Real-time Speech-to-Speech**: Bidirectional WebSocket audio streaming with Amazon Nova 2 Sonic
- **Auto-Start**: Streaming begins automatically on page load — no button press needed
- **Concise Responses**: All answers are kept to 3 sentences maximum for comfortable listening
- **Kiro CLI Tool**: Delegates system tasks to Kiro — run commands, check disk space, read files, generate code, and more
- **MCP Tool Support**: Connects to any MCP server for extensible tool access; ships with the AWS Knowledge MCP server for searching AWS documentation, checking regional availability, and more

## How it Works

```
User speaks → Nova 2 Sonic → detects intent
                                   ├── system task → ask_kiro → kiro-cli headless → result
                                   └── AWS question → MCP → AWS Knowledge server → result
                                                                                       ↓
User ← spoken response ← Nova 2 Sonic ← incorporates answer ←────────────────────────┘
```

## Tools

### ask_kiro (built-in)
Kiro CLI in headless mode for system interaction — file operations, shell commands, code generation, etc.

### AWS Knowledge MCP Server (via MCP)
Provides 6 tools for AWS documentation and service discovery:
- `aws___search_documentation` — Search AWS docs, guides, and best practices
- `aws___read_documentation` — Fetch and read specific AWS doc pages
- `aws___get_regional_availability` — Check service availability across regions
- `aws___list_regions` — List all AWS regions
- `aws___recommend` — Get content recommendations for AWS doc pages
- `aws___retrieve_agent_sop` — Get step-by-step AWS workflow procedures

### Adding More MCP Servers

Edit `mcp.json` to add any MCP-compatible server:

```json
{
  "mcpServers": {
    "aws-knowledge": {
      "command": "uvx",
      "args": ["mcp-proxy", "--transport", "streamablehttp", "https://knowledge-mcp.global.api.aws"]
    },
    "your-server": {
      "command": "node",
      "args": ["path/to/your/mcp-server.js"]
    }
  }
}
```

Tools are discovered automatically on startup and made available to Nova Sonic.

## Prerequisites

- Node.js 18+
- AWS account with Bedrock access (Nova 2 Sonic model enabled)
- AWS CLI configured with credentials
- [Kiro CLI](https://kiro.dev/docs/cli/) installed
- Kiro API key ([generate one](https://app.kiro.dev)) — requires Pro/Pro+/Power subscription
- [uvx](https://docs.astral.sh/uv/) (for the AWS Knowledge MCP server proxy)

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your values
   ```

3. **Configure MCP servers** (optional — ships with AWS Knowledge pre-configured):
   ```bash
   # Edit mcp.json to add/remove MCP servers
   ```

4. **Build and run:**
   ```bash
   npm run build
   npm start
   ```

5. **Open your browser:**
   ```
   http://localhost:3000
   ```

6. **Grant microphone permissions** — streaming starts automatically!

## Example Conversations

- *"Hi, I'm a backend developer interested in cloud computing"* → Asks about your experience and suggests a starting point
- *"What AWS certifications should I go for?"* → Recommends based on your background
- *"What's new in AWS Lambda?"* → Searches AWS docs via MCP and summarizes
- *"How much disk space do I have?"* → Runs system check via Kiro
- *"Is Amazon Bedrock available in eu-west-1?"* → Checks regional availability via MCP

## Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `AWS_REGION` | AWS region for Bedrock | `us-east-1` |
| `AWS_PROFILE` | AWS CLI profile (optional) | default provider chain |
| `KIRO_API_KEY` | **Required.** Kiro API key for headless mode | — |
| `KIRO_CLI_PATH` | Path to kiro-cli binary | `kiro-cli` (from PATH) |
| `KIRO_WORKSPACE` | Working directory for Kiro | current directory |
| `KIRO_TIMEOUT` | Timeout for Kiro commands (ms) | `120000` |
| `PORT` | Server port | `3000` |

## Personas

The system prompt in `src/consts.ts` supports two personas — swap by commenting/uncommenting:

### Friendly AWS Advisor (default)
A warm, curious advisor that asks about your background, suggests AWS features, and recommends the best certification path for you.

### Darko Mode 🤓
Inspired by [Darko Mesaros](https://rup12.net/) — a ridiculously enthusiastic nerdy interviewer who writes Rust, collects vintage computers from the 1970s, and once deployed AWS infrastructure through a teletype. In this mode, the assistant interviews you to discover what crazy projects you want to build on AWS, gets way too excited about your ideas, and finds the perfect AWS services to make them happen.

To activate Darko mode, edit `src/consts.ts`: comment out the default prompt and uncomment the Darko prompt, then rebuild.

## Repository Structure

```
.
├── mcp.json                # MCP server configuration
├── public/                 # Frontend web application
│   ├── index.html          # Main entry point
│   └── src/                # Frontend source code (auto-starts streaming)
├── src/                    # TypeScript source files
│   ├── client.ts           # Nova Sonic bidirectional stream client + Kiro + MCP routing
│   ├── mcp-client.ts       # MCP client manager (connects to MCP servers, discovers tools)
│   ├── server.ts           # Express + Socket.IO server (initializes MCP on startup)
│   ├── consts.ts           # Tool schemas, audio/text configs, system prompt
│   ├── types.ts            # TypeScript type definitions
│   ├── logger.ts           # Logging utilities
│   └── bedrock-kb-client.ts # (unused) Bedrock Knowledge Base client for future use
└── tsconfig.json
```

## Troubleshooting

- **Kiro not responding**: Check that `KIRO_API_KEY` is set and `kiro-cli` is in your PATH (`which kiro-cli`)
- **MCP server not connecting**: Ensure `uvx` is installed (`pip install uv`) and `mcp.json` is in the project root
- **No audio / "Listening" but no response**: Check your Bluetooth audio device is properly connected; try disconnecting and reconnecting
- **Voice output interrupted (ERR_STREAM_PREMATURE_CLOSE)**: Too many tools or large tool descriptions can cause timeouts; MCP tool descriptions are auto-truncated to mitigate this
- **No audio**: Ensure your browser has microphone permissions and WebAudio API support
- **AWS errors**: Verify credentials (`aws sts get-caller-identity`) and that Nova 2 Sonic is enabled in your region
