# Unforce Make / 无为创造

Modular IoT blocks that magnetically snap together, auto-join Wi-Fi, and let an AI Agent understand your entire space.

> Hackathon 2026 project — expect frequent changes.

## Repo Structure

```
.
├── src/               # Aila — Electron desktop AI Agent
│   ├── main/          #   Main process
│   ├── preload/       #   Preload scripts
│   └── renderer/      #   Renderer (React)
├── web/               # Product website (Next.js)
│   ├── app/           #   Pages: Landing, Agent, Dev, Docs
│   ├── lib/           #   i18n, utils
│   └── public/        #   Static assets, 3D models, images
├── scripts/           # Build & dev scripts
└── idea/              # Hackathon ideas & notes
```

### Future directories (planned)

| Directory   | Purpose                              |
|-------------|--------------------------------------|
| `comms/`    | Communication layer (MQTT Host, UDP relay, WebSocket bridge) |
| `firmware/` | ESP32 module firmware (Arduino/ESP-IDF) |
| `sdk/`      | Client SDK for third-party integrations |

## Quick Start

### Desktop Agent (Aila)

```bash
bun install
bun run dev
```

### Website

```bash
cd web
npm install
npm run dev
```

Deployed at: https://unforce-make.vercel.app

## Tech Stack

- **Hardware**: ESP32-S3 / ESP32-C3, POGO-pin magnetic connectors
- **Protocols**: MQTT (sensors/actuators), UDP (video), WebSocket (audio)
- **Desktop Agent**: Electron + React + Bun
- **Website**: Next.js 16 + React 19 + Tailwind CSS 4 + Three.js
- **AI**: OpenAI GPT-4o via Vercel AI SDK

## Team

Team Unforce Make (无为创造)
