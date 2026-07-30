import { createNoise3D } from "simplex-noise";

const TAU = Math.PI * 2;

/**
 * FlowField — the Now-page background: slow, drifting streamlines that follow a
 * simplex flow field and leave smearing tails. The "flowing" register of the site's
 * thin-line language (the rigid circuit decorations are the "constrained" register).
 * The "alive" counterpart to the reading pages' calm dot-grid. Replaces the retired
 * ember effect. Charcoal in light mode; a warm brass accent (#E4A94D) in dark mode.
 *
 * Tuning from the /prototype/flow-field session (variant A — Streamlines/smear):
 * density 1, glow 1, turbulence 1. Speed dialled down to 0.4 post-prototype for a
 * calmer drift. (The prototype ran monochrome; the dark-mode brass came later.)
 */
interface Particle {
  x: number;
  y: number;
  px: number;
  py: number;
  age: number;
  ttl: number;
}

export class FlowField {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private noise3D = createNoise3D();
  private particles: Particle[] = [];
  private raf = 0;
  private running = false;
  private dark = false;

  private w = 0;
  private h = 0;
  private dpr = 1;

  // locked tuning
  private readonly SPEED = 0.4;
  private readonly TURBULENCE = 1.0;
  private readonly GLOW = 1.0;
  private readonly FADE = 0.07; // per-frame bg bleed → tail length
  private readonly DENSITY = 260; // particle count at reference viewport

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
  }

  // ----- palette (theme-aware; charcoal in light, brass accent in dark) -----
  private lineRGB() {
    return this.dark ? [228, 169, 77] : [44, 44, 48];
  }
  private bgRGB() {
    return this.dark ? [26, 26, 26] : [250, 250, 250];
  }
  private isDark() {
    return document.documentElement.classList.contains("dark");
  }

  private resize = () => {
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.w = window.innerWidth;
    this.h = window.innerHeight;
    this.canvas.width = this.w * this.dpr;
    this.canvas.height = this.h * this.dpr;
    this.canvas.style.width = this.w + "px";
    this.canvas.style.height = this.h + "px";
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    this.fillBg();
  };

  private spawn(p: Particle) {
    p.x = p.px = Math.random() * this.w;
    p.y = p.py = Math.random() * this.h;
    p.age = 0;
    p.ttl = 180 + Math.random() * 320;
  }

  private initParticles() {
    const n = Math.round(
      this.DENSITY * Math.min(2, (this.w * this.h) / (1440 * 900)),
    );
    this.particles = Array.from({ length: n }, () => {
      const p: Particle = { x: 0, y: 0, px: 0, py: 0, age: 0, ttl: 0 };
      this.spawn(p);
      p.age = Math.random() * p.ttl;
      return p;
    });
  }

  private fillBg() {
    const [r, g, b] = this.bgRGB();
    this.ctx.fillStyle = `rgb(${r},${g},${b})`;
    this.ctx.fillRect(0, 0, this.w, this.h);
  }

  private step(z: number) {
    const s = 0.0015 * this.TURBULENCE;
    const spd = 1.1 * this.SPEED;
    for (const p of this.particles) {
      const a = this.noise3D(p.x * s, p.y * s, z) * TAU * 1.6;
      p.px = p.x;
      p.py = p.y;
      p.x += Math.cos(a) * spd;
      p.y += Math.sin(a) * spd;
      p.age++;
      if (
        p.age > p.ttl ||
        p.x < -40 ||
        p.x > this.w + 40 ||
        p.y < -40 ||
        p.y > this.h + 40
      )
        this.spawn(p);
    }
  }

  private drawSegments() {
    const [r, g, b] = this.lineRGB();
    this.ctx.lineWidth = 1;
    this.ctx.lineCap = "round";
    for (const p of this.particles) {
      if (p.age < 2) continue; // skip the teleport frame after respawn
      const fade = Math.min(1, p.age / 40) * (1 - p.age / p.ttl);
      this.ctx.strokeStyle = `rgba(${r},${g},${b},${0.5 * this.GLOW * fade})`;
      this.ctx.beginPath();
      this.ctx.moveTo(p.px, p.py);
      this.ctx.lineTo(p.x, p.y);
      this.ctx.stroke();
    }
  }

  private loop = (ts: number) => {
    if (!this.running) return;

    // repaint fully on theme flip so old-coloured smear doesn't linger
    const nowDark = this.isDark();
    if (nowDark !== this.dark) {
      this.dark = nowDark;
      this.fillBg();
    }

    const [r, g, b] = this.bgRGB();
    this.ctx.fillStyle = `rgba(${r},${g},${b},${this.FADE})`;
    this.ctx.fillRect(0, 0, this.w, this.h);

    this.step(ts * 0.00007 * this.SPEED);
    this.drawSegments();

    this.raf = requestAnimationFrame(this.loop);
  };

  start() {
    this.dark = this.isDark();
    this.resize();
    this.initParticles();
    this.fillBg();
    window.addEventListener("resize", this.resize);
    this.running = true;
    this.raf = requestAnimationFrame(this.loop);
  }

  /** prefers-reduced-motion: paint one still frame of frozen flow, no animation. */
  renderStatic() {
    this.dark = this.isDark();
    this.resize();
    this.initParticles();
    this.fillBg();
    for (let i = 0; i < 220; i++) {
      this.step(i * 0.0001);
      this.drawSegments();
    }
    window.addEventListener("resize", this.resize);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
    window.removeEventListener("resize", this.resize);
  }
}
