import { createNoise2D } from 'simplex-noise';

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
    this.y = height + Math.random() * 100;
    this.vx = 0;
    this.baseVy = -0.5 - Math.random() * 0.3;
    this.vy = this.baseVy;
    this.radius = 1 + Math.random() * 2.5;
    this.baseRadius = this.radius;
    this.ttl = 500 + Math.random() * 2200;
    this.life = Math.random() * this.ttl;
    this.alpha = 1;
    this.flickerPhase = Math.random() * TAU;
  }

  update(noise2D: (x: number, y: number) => number, time: number, width: number, height: number) {
    this.vx = noise2D(this.x * 0.01, this.y * 0.01 + time * 0.0005) * 0.2;
    this.vy = this.baseVy;

    this.x += this.vx;
    this.y += this.vy;

    const flickerSpeed = 0.025;
    const flicker = 0.75 + 0.5 * Math.sin(this.life * flickerSpeed + this.flickerPhase);

    this.radius = this.baseRadius * flicker;
    this.alpha = (1 - this.life / this.ttl) * flicker;

    this.life++;

    if (this.life > this.ttl || this.y < -10) {
      this.reset(width, height);
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
    gradient.addColorStop(0, `rgba(0, 0, 00, ${this.alpha})`);
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = gradient;
    ctx.shadowColor = `rgba(255, 140, 30, ${this.alpha})`;
    ctx.shadowBlur = this.radius * 2;

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, TAU);
    ctx.fill();
  }
}

export class EmberParticleSystem {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private particles: EmberParticle[];
  private noise2D: (x: number, y: number) => number;
  private width: number;
  private height: number;
  private tick: number;
  private animationFrameId: number | null = null;

  constructor(canvas: HTMLCanvasElement, particleCount = 300) {
    this.canvas = canvas;

    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas context not found');
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

    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.particles.forEach(p => p.reset(this.width, this.height));
  }

  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  updateAndDraw() {
    this.tick++;

    this.clear();

    for (const particle of this.particles) {
      particle.update(this.noise2D, this.tick, this.width, this.height);
      particle.draw(this.ctx);
    }

    this.animationFrameId = requestAnimationFrame(() => this.updateAndDraw());
  }

  start() {
    this.updateAndDraw();
  }

  stop()  {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }
}
