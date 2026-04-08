"use client";

import dynamic from "next/dynamic";

const GameCanvas = dynamic(() => import("@/components/GameCanvas"), { ssr: false });

export default function Home() {
  return (
    <main className="relative flex flex-col items-center justify-center w-screen h-screen bg-black">
      <GameCanvas />
    </main>
  );
}
