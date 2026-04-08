# 🎮 Pixel Plumber — A Super Mario-Style Platformer

> **Built with Next.js 14 + Phaser 3 + TypeScript + TailwindCSS**

A fully playable browser-based side-scrolling platformer inspired by classic Mario gameplay. Zero external asset files — all graphics are generated procedurally at boot time using Phaser's graphics API.

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🕹️ Controls

| Action | Keyboard        | Touch          |
|--------|----------------|----------------|
| Move   | ← →  Arrow Keys | ◀ ▶ buttons    |
| Jump   | ↑ / Space       | ▲ button       |

## ✨ Features

- **Title Screen** with animated clouds and blinking start prompt
- **Scrolling Level** with parallax clouds, hills, and bushes
- **Player Movement** — run left/right, jump, gravity, collision
- **Collectible Coins** — floating, animated, score popup
- **Breakable Bricks** — smash from below with particle effects
- **Question Blocks** — bump from below to spawn bonus coins
- **Enemies (Groombas)** — patrol, stomp to defeat, or get hit
- **Pipes** — decorative obstacles
- **HUD** — score, coin count, lives, world indicator, timer
- **Win Condition** — reach the flag pole at the end of the level
- **Game Over** — lose all lives → game over screen
- **Level Complete** — firework particles and score tally
- **Touch Controls** — on-screen D-pad and jump button
- **Responsive** — Phaser auto-scales to fit any window

## 🏗️ Architecture

```
mario-next/
├── app/                     # Next.js App Router
│   ├── globals.css          # Tailwind + pixel font
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home — dynamically imports GameCanvas
├── components/
│   └── GameCanvas.tsx       # React component mounting Phaser (client-only)
├── game/
│   ├── config.ts            # Phaser game configuration
│   ├── constants.ts         # Tile size, physics, colors, level map
│   ├── types.ts             # TypeScript interfaces
│   ├── utils/
│   │   └── textures.ts      # Procedural texture generation
│   └── scenes/
│       ├── BootScene.ts     # Generates all textures
│       ├── MenuScene.ts     # Title screen
│       ├── GameScene.ts     # Main gameplay
│       ├── HudScene.ts      # Score/lives overlay
│       ├── GameOverScene.ts # Game over screen
│       └── WinScene.ts      # Level complete screen
├── tailwind.config.ts
├── tsconfig.json
├── next.config.mjs
└── package.json
```

## 🧰 Tech Stack

| Layer     | Technology       |
|-----------|-----------------|
| Framework | Next.js 14 (App Router) |
| Language  | TypeScript (strict) |
| Styling   | TailwindCSS 3   |
| Game Engine | Phaser 3       |
| Assets    | Procedurally generated (no files) |

## 📝 Notes

- Phaser is loaded **client-side only** via `next/dynamic` with `{ ssr: false }` to prevent SSR issues.
- All textures are drawn with `Phaser.GameObjects.Graphics` at boot — no sprite sheets or image files needed.
- The level is defined as a **string array** in `constants.ts` — edit it to design new levels!
- The game uses original character names and art to avoid any copyright issues.
