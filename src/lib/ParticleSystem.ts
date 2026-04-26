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
    const [r, g, b] = dark ? [212, 175, 55] : [0, 0, 0];
    const [gr, gg, gb] = dark ? [212, 175, 55] : [255, 140, 30];
    const glowRadius = this.radius * 5;

    const glow = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, glowRadius);
    glow.addColorStop(0, `rgba(${gr}, ${gg}, ${gb}, ${this.alpha * 0.3})`);
    glow.addColorStop(1, `rgba(${gr}, ${gg}, ${gb}, 0)`);

    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(this.x, this.y, glowRadius, 0, TAU);
    ctx.fill();

    const core = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
    core.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${this.alpha})`);
    core.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

    ctx.fillStyle = core;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, TAU);
    ctx.fill();
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
