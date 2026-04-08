import Phaser from "phaser";
import { TILE, COLORS } from "../constants";

/** Helper to create an off-screen graphics context. */
function gfx(scene: Phaser.Scene): Phaser.GameObjects.Graphics {
  const g = scene.add.graphics();
  g.setVisible(false);
  return g;
}

/** Generate all placeholder textures at boot so no external assets are needed. */
export function generateTextures(scene: Phaser.Scene): void {
  const T = TILE;

  // ── Ground tile ─────────────────────────────────────
  if (!scene.textures.exists("ground")) {
    const g = gfx(scene);
    g.fillStyle(COLORS.GROUND_TOP);
    g.fillRect(0, 0, T, 4);
    g.fillStyle(COLORS.GROUND);
    g.fillRect(0, 4, T, T - 4);
    g.fillStyle(0x704020);
    g.fillRect(4, 10, 4, 4);
    g.fillRect(20, 18, 6, 4);
    g.fillRect(12, 24, 4, 4);
    g.generateTexture("ground", T, T);
    g.destroy();
  }

  // ── Brick tile ──────────────────────────────────────
  if (!scene.textures.exists("brick")) {
    const g = gfx(scene);
    g.fillStyle(COLORS.BRICK);
    g.fillRect(0, 0, T, T);
    g.fillStyle(0x8a3000);
    g.fillRect(0, 0, T, 2);
    g.fillRect(0, T / 2, T, 2);
    g.fillRect(T / 2, 0, 2, T / 2);
    g.fillRect(0, T / 2, 2, T / 2);
    g.fillRect(T - 2, T / 2, 2, T / 2);
    g.generateTexture("brick", T, T);
    g.destroy();
  }

  // ── Question block ──────────────────────────────────
  if (!scene.textures.exists("question")) {
    const g = gfx(scene);
    g.fillStyle(COLORS.QUESTION);
    g.fillRect(0, 0, T, T);
    g.fillStyle(0xb8860b);
    g.fillRect(0, 0, T, 2);
    g.fillRect(0, 0, 2, T);
    g.fillRect(T - 2, 0, 2, T);
    g.fillRect(0, T - 2, T, 2);
    g.fillStyle(0xffffff);
    g.fillRect(12, 6, 8, 4);
    g.fillRect(16, 10, 4, 4);
    g.fillRect(12, 14, 8, 4);
    g.fillRect(12, 14, 4, 4);
    g.fillRect(12, 22, 4, 4);
    g.generateTexture("question", T, T);
    g.destroy();
  }

  // ── Coin ────────────────────────────────────────────
  if (!scene.textures.exists("coin")) {
    const g = gfx(scene);
    g.fillStyle(COLORS.COIN);
    g.fillCircle(T / 2, T / 2, T / 3);
    g.fillStyle(0xffa500);
    g.fillCircle(T / 2, T / 2, T / 5);
    g.generateTexture("coin", T, T);
    g.destroy();
  }

  // ── Pipe top ────────────────────────────────────────
  if (!scene.textures.exists("pipe_top")) {
    const g = gfx(scene);
    g.fillStyle(COLORS.PIPE);
    g.fillRect(0, 0, T * 2, T);
    g.fillStyle(COLORS.PIPE_DARK);
    g.fillRect(0, 0, 4, T);
    g.fillRect(T * 2 - 4, 0, 4, T);
    g.fillStyle(0x80ff80);
    g.fillRect(8, 0, 8, T);
    g.generateTexture("pipe_top", T * 2, T);
    g.destroy();
  }

  // ── Pipe body ───────────────────────────────────────
  if (!scene.textures.exists("pipe_body")) {
    const g = gfx(scene);
    g.fillStyle(COLORS.PIPE);
    g.fillRect(0, 0, T * 2, T);
    g.fillStyle(COLORS.PIPE_DARK);
    g.fillRect(0, 0, 4, T);
    g.fillRect(T * 2 - 4, 0, 4, T);
    g.fillStyle(0x80ff80);
    g.fillRect(8, 0, 8, T);
    g.generateTexture("pipe_body", T * 2, T);
    g.destroy();
  }

  // ── Player (Pixel Plumber!) ─────────────────────────
  if (!scene.textures.exists("player")) {
    const g = gfx(scene);
    g.fillStyle(COLORS.PLAYER);
    g.fillRect(6, 10, 20, 14);
    g.fillStyle(COLORS.PLAYER_SKIN);
    g.fillRect(8, 0, 16, 12);
    g.fillStyle(COLORS.PLAYER);
    g.fillRect(4, 0, 24, 6);
    g.fillStyle(0x000000);
    g.fillRect(12, 6, 3, 3);
    g.fillRect(20, 6, 3, 3);
    g.fillStyle(0x5c3317);
    g.fillRect(10, 10, 14, 2);
    g.fillStyle(0x0000aa);
    g.fillRect(8, 24, 6, 8);
    g.fillRect(18, 24, 6, 8);
    g.fillStyle(0x5c3317);
    g.fillRect(6, 28, 8, 4);
    g.fillRect(18, 28, 8, 4);
    g.generateTexture("player", T, T);
    g.destroy();
  }

  // ── Player jump frame ───────────────────────────────
  if (!scene.textures.exists("player_jump")) {
    const g = gfx(scene);
    g.fillStyle(COLORS.PLAYER);
    g.fillRect(6, 10, 20, 14);
    g.fillStyle(COLORS.PLAYER_SKIN);
    g.fillRect(8, 0, 16, 12);
    g.fillStyle(COLORS.PLAYER);
    g.fillRect(4, 0, 24, 6);
    g.fillStyle(0x000000);
    g.fillRect(12, 6, 3, 3);
    g.fillRect(20, 6, 3, 3);
    g.fillStyle(0x5c3317);
    g.fillRect(10, 10, 14, 2);
    g.fillStyle(0x0000aa);
    g.fillRect(4, 22, 6, 10);
    g.fillRect(22, 22, 6, 10);
    g.fillStyle(0x5c3317);
    g.fillRect(2, 28, 8, 4);
    g.fillRect(22, 28, 8, 4);
    g.generateTexture("player_jump", T, T);
    g.destroy();
  }

  // ── Enemy (Groomba) ─────────────────────────────────
  if (!scene.textures.exists("enemy")) {
    const g = gfx(scene);
    g.fillStyle(COLORS.ENEMY);
    g.fillCircle(T / 2, T / 2 - 2, T / 2 - 2);
    g.fillStyle(0x000000);
    g.fillRect(6, 8, 5, 5);
    g.fillRect(20, 8, 5, 5);
    g.fillRect(4, 6, 8, 2);
    g.fillRect(20, 6, 8, 2);
    g.fillStyle(0x5c3317);
    g.fillRect(2, T - 6, 10, 6);
    g.fillRect(T - 12, T - 6, 10, 6);
    g.generateTexture("enemy", T, T);
    g.destroy();
  }

  // ── Enemy squished ──────────────────────────────────
  if (!scene.textures.exists("enemy_flat")) {
    const g = gfx(scene);
    g.fillStyle(COLORS.ENEMY);
    g.fillRect(2, T - 10, T - 4, 10);
    g.fillStyle(0x000000);
    g.fillRect(6, T - 8, 4, 2);
    g.fillRect(20, T - 8, 4, 2);
    g.generateTexture("enemy_flat", T, T);
    g.destroy();
  }

  // ── Flag pole ───────────────────────────────────────
  if (!scene.textures.exists("flag_pole")) {
    const g = gfx(scene);
    g.fillStyle(COLORS.FLAG_POLE);
    g.fillRect(14, 0, 4, T);
    g.generateTexture("flag_pole", T, T);
    g.destroy();
  }

  // ── Flag ────────────────────────────────────────────
  if (!scene.textures.exists("flag")) {
    const g = gfx(scene);
    g.fillStyle(COLORS.FLAG);
    g.fillTriangle(16, 0, 16, 20, 0, 10);
    g.generateTexture("flag", T, T);
    g.destroy();
  }

  // ── Cloud ───────────────────────────────────────────
  if (!scene.textures.exists("cloud")) {
    const g = gfx(scene);
    g.fillStyle(0xffffff, 0.9);
    g.fillCircle(24, 24, 20);
    g.fillCircle(48, 18, 26);
    g.fillCircle(72, 24, 20);
    g.generateTexture("cloud", 96, 48);
    g.destroy();
  }

  // ── Hill ────────────────────────────────────────────
  if (!scene.textures.exists("hill")) {
    const g = gfx(scene);
    g.fillStyle(COLORS.HILL, 0.7);
    g.fillTriangle(0, 80, 60, 0, 120, 80);
    g.generateTexture("hill", 120, 80);
    g.destroy();
  }

  // ── Bush ────────────────────────────────────────────
  if (!scene.textures.exists("bush")) {
    const g = gfx(scene);
    g.fillStyle(COLORS.BUSH, 0.8);
    g.fillCircle(16, 20, 16);
    g.fillCircle(40, 16, 20);
    g.fillCircle(64, 20, 16);
    g.generateTexture("bush", 80, 36);
    g.destroy();
  }

  // ── Particle (small white square) ───────────────────
  if (!scene.textures.exists("particle")) {
    const g = gfx(scene);
    g.fillStyle(0xffffff);
    g.fillRect(0, 0, 4, 4);
    g.generateTexture("particle", 4, 4);
    g.destroy();
  }

  // ── Brick particle ─────────────────────────────────
  if (!scene.textures.exists("brick_particle")) {
    const g = gfx(scene);
    g.fillStyle(COLORS.BRICK);
    g.fillRect(0, 0, 8, 8);
    g.generateTexture("brick_particle", 8, 8);
    g.destroy();
  }
}
