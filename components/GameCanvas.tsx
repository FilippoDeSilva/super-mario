"use client";

import { useEffect, useRef } from "react";

const GAME_CONTAINER_ID = "phaser-game";

export default function GameCanvas() {
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    // Dynamic import to keep Phaser off the SSR bundle
    let cancelled = false;

    const boot = async () => {
      const Phaser = (await import("phaser")).default;
      const { createGameConfig } = await import("@/game/config");

      if (cancelled) return;

      gameRef.current = new Phaser.Game(createGameConfig(GAME_CONTAINER_ID));
    };

    boot();

    return () => {
      cancelled = true;
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Phaser mounts into this div */}
      <div
        id={GAME_CONTAINER_ID}
        className="rounded-lg shadow-2xl shadow-blue-900/50 overflow-hidden border-4 border-gray-800"
      />

      {/* Overlay label */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
        <span className="text-[10px] text-white/40 font-pixel tracking-widest">
          NEXT.JS + PHASER 3 + TYPESCRIPT + TAILWIND
        </span>
      </div>
    </div>
  );
}
