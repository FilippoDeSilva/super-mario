import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pixel Plumber – A Next.js Platformer",
  description: "A Super-Mario-style platformer built with Next.js, Phaser 3, TypeScript & TailwindCSS",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-black min-h-screen flex items-center justify-center font-pixel">
        {children}
      </body>
    </html>
  );
}
