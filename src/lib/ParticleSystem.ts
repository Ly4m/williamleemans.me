import { createNoise2D } from "simplex-noise";

const TAU = Math.PI * 2;

class EmberParticle {
  x: number = 0;
  y: number = 0;
  vx: number = 0;
  vy: number = 0;
  baseVy: number = 0;
  radius: number = 0;
  baseRadius: number = 0;
  life: number = 0;
  ttl: number = 0;
  alpha: number = 0;
  flickerPhase: number;
  colorTemp: number = 0; // 0 = cool ember (red-orange), 1 = hot ember (white-yellow)

  constructor(width: number, height: number) {
    this.flickerPhase = Math.random() * TAU;
    this.reset(width, height);
  }

  reset(width: number, height: number) {
    this.x = Math.random() * width;
    this.y = Math.random() * height;

    this.vx = 0;
    this.baseVy = (-0.5 - Math.random()) * 0.2;
    this.vy = this.baseVy;

    this.radius = 1 + Math.random() * 1.5;
    this.baseRadius = this.radius;

    this.ttl = 500 + Math.random() * 2200;
    this.life = 0;
    this.alpha = 0;
    this.flickerPhase = Math.random() * TAU;
    this.colorTemp = Math.random();
  }

  update(
    noise2D: (x: number, y: number) => number,
    time: number,
    width: number,
    height: number,
  ) {
    this.vx = noise2D(this.x * 0.01, this.y * 0.01 + time * 0.0005) * 0.2;
    this.vy = this.baseVy;

    this.x += this.vx;
    this.y += this.vy;

    const flickerSpeed = 0.015;
    const flicker =
      0.75 + 0.5 * Math.sin(this.life * flickerSpeed + this.flickerPhase);

    this.radius = this.baseRadius * flicker;
    this.alpha = (1 - this.life / this.ttl) * flicker;

    this.life++;

    if (this.life > this.ttl || this.y < -10) {
      this.reset(width, height);
    }
  }

  draw(ctx: CanvasRenderingContext2D, dark: boolean) {
    if (dark) {
      // Color temperature: cool = deep orange-red, hot = white-yellow
      const t = this.colorTemp;
      const coreWhite = Math.floor(160 + t * 95);   // 160–255
      const coreGreen = Math.floor(80 + t * 140);   // 80–220
      const glowGreen = Math.floor(60 + t * 80);    // 60–140

      const glowRadius = this.radius * 10;
      const glow = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, glowRadius);
      glow.addColorStop(0,   `rgba(255, ${glowGreen + 60}, 10, ${this.alpha * 0.55})`);
      glow.addColorStop(0.3, `rgba(220, ${glowGreen}, 5, ${this.alpha * 0.25})`);
      glow.addColorStop(0.7, `rgba(160, 30, 0, ${this.alpha * 0.08})`);
      glow.addColorStop(1,   `rgba(120, 10, 0, 0)`);

      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(this.x, this.y, glowRadius, 0, TAU);
      ctx.fill();

      // Hot core: white-yellow center → orange-amber edge
      const core = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
      core.addColorStop(0,   `rgba(255, ${coreWhite}, ${Math.floor(t * 80)}, ${this.alpha})`);
      core.addColorStop(0.5, `rgba(255, ${coreGreen}, 20, ${this.alpha * 0.85})`);
      core.addColorStop(1,   `rgba(220, 60, 5, 0)`);

      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, TAU);
      ctx.fill();
    } else {
      // Light mode: subtle dark-grey wisps
      const glowRadius = this.radius * 7;
      const glow = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, glowRadius);
      glow.addColorStop(0, `rgba(40, 40, 40, ${this.alpha * 0.18})`);
      glow.addColorStop(1, `rgba(40, 40, 40, 0)`);

      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(this.x, this.y, glowRadius, 0, TAU);
      ctx.fill();

      const core = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
      core.addColorStop(0, `rgba(80, 80, 80, ${this.alpha * 0.45})`);
      core.addColorStop(1, `rgba(80, 80, 80, 0)`);

      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, TAU);
      ctx.fill();
    }
  }
}

export class EmberParticleSystem {
  private canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private readonly particles: EmberParticle[];
  private readonly noise2D: (x: number, y: number) => number;
  private width: number;
  private height: number;
  private tick: number;
  private animationFrameId: number | null = null;
  private dark: boolean = false;
  private observer: MutationObserver | null = null;
  private resizeHandler: () => void;

  constructor(canvas: HTMLCanvasElement, particleCount = 100) {
    this.canvas = canvas;

    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas context not found");
    this.ctx = ctx;

    this.noise2D = createNoise2D();
    this.particles = [];
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.tick = 0;

    canvas.width = this.width;
    canvas.height = this.height;

    for (let i = 0; i < particleCount; i++) {
      this.particles.push(new EmberParticle(this.width, this.height));
    }

    this.dark = document.documentElement.classList.contains("dark");
    this.observer = new MutationObserver(() => {
      this.dark = document.documentElement.classList.contains("dark");
    });
    this.observer.observe(document.documentElement, { attributeFilter: ["class"] });

    this.resizeHandler = () => this.resize();
    window.addEventListener("resize", this.resizeHandler);
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.particles.forEach((p) => p.reset(this.width, this.height));
  }

  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  updateAndDraw() {
    this.tick++;

    this.clear();

    for (const particle of this.particles) {
      particle.update(this.noise2D, this.tick, this.width, this.height);
      particle.draw(this.ctx, this.dark);
    }

    this.animationFrameId = requestAnimationFrame(() => this.updateAndDraw());
  }

  start() {
    this.updateAndDraw();
  }

  stop() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.observer?.disconnect();
    window.removeEventListener("resize", this.resizeHandler);
  }
}
