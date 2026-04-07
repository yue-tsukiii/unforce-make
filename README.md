# Unforce Make / 无为创造

Modular IoT blocks that magnetically snap together, auto-join Wi-Fi, and let a cloud AI agent understand and control your space.

> Hackathon 2026 project — expect frequent changes.

## Repo Structure

```text
.
├── src/main/          # Bun + Hono agent server
├── web/               # Next.js website
├── scripts/           # Local utility scripts
└── idea/              # Notes and planning docs
```

## Local Development

### Agent Server

```bash
bun install
cp .env.example .env
OPENAI_API_KEY=... bun run dev
```

Server endpoints:
- `GET /health`
- `GET /ready`
- `GET /v1/blocks`
- `GET /v1/hardware/ws`
- `POST /v1/chat/sessions`
- `POST /v1/chat/sessions/:sessionId/messages`

### Website

```bash
cd web
bun install
cp .env.example .env.local
NEXT_PUBLIC_AGENT_SERVER_URL=http://localhost:8787 bun run dev
```

## Railway Deployment

Deploy this repo as two Railway services:
- `agent-server`
- `web`

### 1. Agent Server Service

Service settings:
- Root Directory: repo root
- Builder: Dockerfile
- Dockerfile Path: `Dockerfile`

Environment variables:
- `OPENAI_API_KEY`
- `AGENT_MODEL=openai/gpt-5-mini`
- `CORS_ORIGIN=https://<your-web-domain>`
- `AGENT_DATA_DIR=/data`

Optional:
- `TAVILY_API_KEY`
- `ANTHROPIC_API_KEY`
- `GOOGLE_API_KEY`
- `PORT` is provided by Railway automatically

Recommended Railway settings:
- Add a volume mounted at `/data`
- Healthcheck path: `/health`
- Readiness path: `/ready`

Deploy check:
- `GET https://<agent-domain>/health` should return `ok: true`
- `GET https://<agent-domain>/ready` should return `200` once `OPENAI_API_KEY` and an active model are available

### 2. Web Service

Service settings:
- Root Directory: `web`
- Builder: Dockerfile
- Dockerfile Path: `Dockerfile`

Environment variables:
- `NEXT_PUBLIC_AGENT_SERVER_URL=https://<your-agent-domain>`

Deploy check:
- Open `/agent`
- Confirm the right panel shows live hardware data from the server WebSocket
- Send a prompt and confirm streamed tool calls and assistant text render correctly

## Notes

- The agent server is now the single runtime for both coding tools and hardware tools.
- Hardware updates are distributed over WebSocket through the shared `HardwareStore`.
- Persistent session/memory/config data lives under `AGENT_DATA_DIR`.
- The old `web/app/api/chat` path is no longer the active chat path for the website UI.

## Tech Stack

- Hardware: ESP32-S3 / ESP32-C3, POGO-pin magnetic connectors
- Server: Bun + Hono + `pi-coding-agent`
- Website: Next.js 16 + React 19 + Tailwind CSS 4 + Three.js
- AI: OpenAI / other providers via `pi-ai`

## Team

Team Unforce Make (无为创造)
