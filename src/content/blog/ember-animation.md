---
slug: "particle-animation"
title: "Particle Animation"
lang: "en"
description: "How I built a simple particle animation with the Canvas API for my website background"
pubDate: "2025-11-6"
readingTime: 1
---

Last week, while finishing my previous post, I realized that even though I like the minimalism of this black and white design, it was missing a bit of life.

Maybe it was the pellet stove burning next to me. Or the floating particles in the Upside Down from Stranger Things on my TV (which I’m rewatching before the final season).
But I suddenly wanted to add some motion.

I almost reached for PixiJS, a 2D rendering engine, but decided to see how far I could get with the humble Canvas API. 
I'm all for using the platform and keeping my website as light and simple as possible.

```ts
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
}
```

Then we make it move with an update function, a bit like in a video game.

```ts
update(
  noise2D
:
(x: number, y: number) => number,
  time
:
number,
  width
:
number,
  height
:
number,
)
{
  this.vx = noise2D(this.x * 0.01, this.y * 0.01 + time * 0.0005) * 0.2;
  this.vy = this.baseVy;

  this.x += this.vx;
  this.y += this.vy;

  const flickerSpeed = 0.025;
  const flicker =
    0.75 + 0.5 * Math.sin(this.life * flickerSpeed + this.flickerPhase);

  this.radius = this.baseRadius * flicker;
  this.alpha = (1 - this.life / this.ttl) * flicker;

  this.life++;

  if (this.life > this.ttl || this.y < -10) {
    this.reset(width, height);
  }
}
```

For the noise2D function I use the 'createNoise2D' from the simplex-noise library.
It's a bit overkill, but it generates smooth, continuous noise rather than random jumps,
so the particles gently drift instead of twitching around.

> Simplex noise is a smooth, pseudo-random function, often used for natural movement, like smoke or wind.

Finally, we render everything with a simple draw function:

```ts
draw(ctx:CanvasRenderingContext2D) {
  const gradient = ctx.createRadialGradient(
    this.x,
    this.y,
    0,
    this.x,
    this.y,
    this.radius,
  );
  gradient.addColorStop(0, `rgba(0, 0, 0, ${this.alpha})`);
  gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

  ctx.fillStyle = gradient;
  ctx.shadowColor = `rgba(0, 0, 0, ${this.alpha})`;
  ctx.shadowBlur = this.radius * 2;

  ctx.beginPath();
  ctx.arc(this.x, this.y, this.radius, 0, TAU);
  ctx.fill();
}
```

It’s kind of agent-like; every particle moves on its own, following simple rules, a bit like the cells in Conway’s Game
of Life.

Now I just wrapped that in a ParticleSystem class that populates the canvas and runs a loop to update and draw the
particles.

```ts
updateAndDraw()
{
  this.tick++;
  this.clear();

  for (const particle of this.particles) {
    particle.update(this.noise2D,
      this.tick,
      this.width,
      this.height);

    particle.draw(this.ctx);
  }

  this.animationFrameId = requestAnimationFrame(
    () => this.updateAndDraw()
  );
}
```

requestAnimationFrame is managed by the browser and calls a function before the next frame. 
It automatically syncs to the display’s refresh rate and pauses when the tab is not in focus.

All of this is run when I mount a Svelte component each time the user navigates, and to prevent a memory leak it's
important to stop it using the cancelAnimationFrame when the component unmounts.

```ts
stop()
{
  if (this.animationFrameId) {
    cancelAnimationFrame(this.animationFrameId);
    this.animationFrameId = null;
  }
}
```

In the end, it didn’t require any fancy library and was easier than I thought.
It’s always fun to tweak the parameters and see how the animation reacts. I plan to keep improving it and maybe create a few variations.
