# Amazon Nova 2 Sonic — Kiro CLI Tool Integration

Voice-powered AI assistant using Amazon Nova 2 Sonic for real-time speech-to-speech, with [Kiro CLI](https://kiro.dev/docs/cli/) as a tool for executing tasks on your local system.

Based on the [Amazon Nova Samples](https://github.com/aws-samples/amazon-nova-samples/tree/main/speech-to-speech/amazon-nova-2-sonic/repeatable-patterns/bedrock-knowledge-base) project.

## Key Features

- **Real-time Speech-to-Speech**: Bidirectional WebSocket audio streaming with Amazon Nova 2 Sonic
- **Kiro CLI Tool**: Nova Sonic can delegate tasks to Kiro — run commands, check disk space, read files, generate code, and more
- **Natural Conversational Experience**: Web interface with microphone input and spoken responses

## How it Works

```
User speaks → Nova 2 Sonic → detects task → ask_kiro tool → kiro-cli headless → result
                                                                                    ↓
User ← spoken response ← Nova 2 Sonic ← incorporates answer ←─────────────────────┘
```

When you ask something like *"How much disk space do I have?"*, Nova Sonic recognizes it needs system access, calls Kiro CLI in headless mode, and reads the answer back to you.

## Prerequisites

- Node.js 18+
- AWS account with Bedrock access (Nova 2 Sonic model enabled)
- AWS CLI configured with credentials
- [Kiro CLI](https://kiro.dev/docs/cli/) installed
- Kiro API key ([generate one](https://app.kiro.dev)) — requires Pro/Pro+/Power subscription

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

3. **Build and run:**
   ```bash
   npm run build
   npm start
   ```

4. **Open your browser:**
   ```
   http://localhost:3000
   ```

5. **Grant microphone permissions** when prompted, then start talking!

## Example Questions

- *"How much disk space is available on this machine?"*
- *"What files are in my home directory?"*
- *"What's the current CPU usage?"*
- *"Create a Python script that prints the Fibonacci sequence"*
- *"What version of Node.js is installed?"*

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

## Repository Structure

```
.
├── public/                 # Frontend web application
│   ├── index.html          # Main entry point
│   └── src/                # Frontend source code
├── src/                    # TypeScript source files
│   ├── client.ts           # Nova Sonic bidirectional stream client + Kiro tool
│   ├── server.ts           # Express + Socket.IO server
│   ├── consts.ts           # Tool schemas, audio/text configs, system prompt
│   ├── types.ts            # TypeScript type definitions
│   ├── logger.ts           # Logging utilities
│   └── bedrock-kb-client.ts # (unused) Bedrock Knowledge Base client for future use
└── tsconfig.json
```

## Troubleshooting

- **Kiro not responding**: Check that `KIRO_API_KEY` is set and `kiro-cli` is in your PATH (`which kiro-cli`)
- **No audio**: Ensure your browser has microphone permissions and WebAudio API support
- **AWS errors**: Verify credentials (`aws sts get-caller-identity`) and that Nova 2 Sonic is enabled in your region
