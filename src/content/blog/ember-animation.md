---
slug: "animation-de-particules"
title: "Animation de particules"
lang: "fr"
description: "Comment j’ai créé une animation de particules simple avec l’API Canvas pour le fond de mon site."
pubDate: "2025-11-6"
readingTime: 1
---

La semaine dernière, en terminant mon article précédent, je me suis rendu compte que même si j’aimais bien le design minimaliste en noir et blanc, il manquait un peu de vie.

C’était peut-être le poêle à pellet qui crépitait à côté de moi. Ou les particules flottantes de l'« Upside Down » de *Stranger Things* a la tv, que je me refais avant la dernière saison.  
Mais, j’ai eu envie d’ajouter un peu de mouvement et de me créer une petite ambiance.

## Rester simple et comprendre ce qu’on fait

Mon premier réflexe a été de penser à PixiJS. Un moteur de rendu, assez léger, et parfait pour des animations 2D.  
Mais dans ma démarche d'apprentissage autour de ce site web, je préfère commencer par la base, comprendre ce que je fais, et ne sortir un framework que si j’en ai réellement besoin.

Donc j'ai décidé de voir jusqu’où je pouvais aller avec la simple API Canvas.  
Je préfère utiliser les outils natifs et garder mon site aussi léger que possible.

## Modélisation

J'ai commencé par modéliser les particules comme des objets simples.

Une particule, ce n’est rien d’autre qu’un point avec une position, une vitesse, une taille, une durée de vie et de quoi en faire fluctuer l'apparence.

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

## Faire bouger la particule

J’ai écrit une méthode update qui agit un peu comme un `tick` dans un jeu vidéo. (j'aime le jeu vidéo)
À chaque frame, on met à jour la vitesse, la position, la taille, la transparence, etc.

```ts
update(noise2D:(x: number, y: number) => number,
  time:number,
  width:number,
  height:number) {
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


### Le secret derrière la fonction noise2D

Pour adoucir les mouvements, j’utilise `createNoise2D` de la librairie simplex-noise.
C’est un peu overkill, mais ça génère un bruit continu et fluide, et non des valeurs aléatoires qui sautent partout, ce qui donne un mouvement doux, qui dérive comme une fumée.

> Le simplex noise, c’est une fonction pseudo-aléatoire lissée, souvent utilisée pour simuler des mouvements naturels comme le vent ou la fumée.

## Dessiner la particule

Pour le rendu, j'ai fait quelque chose de très simple : un cercle avec un peu de blur.
Il a fallu pas mal jouer avec les paramètres pour avoir quelque chose qui me plait. Mais au final pas besoin de plus.

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

### Des petits agents


Chaque particule se comporte un peu comme un petit agent indépendant, elle suit ses propres règles, avec son mouvement et sa durée de vie, un peu comme les cellules du [Game of Life de Conway](https://fr.wikipedia.org/wiki/Jeu_de_la_vie).


## Le système complet

Une fois qu'on a nos particules, il ne reste plus qu'à créer une classe ParticleSystem qui remplit le canvas et orchestre le tout.

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

La fonction `requestAnimationFrame` est gérée par le navigateur et s'occupe de tout :
Elle appelle une fonction juste avant l’affichage de la frame suivante, se cale automatiquement sur le taux de rafraîchissement de l’écran et se met en pause quand l’onglet n’est plus actif.

Comme je lance ça dans un composant Svelte, il est essentiel d’arrêter proprement la boucle pour éviter des fuites de mémoire.
D’où un petit stop() :

```ts
stop()
{
  if (this.animationFrameId) {
    cancelAnimationFrame(this.animationFrameId);
    this.animationFrameId = null;
  }
}
```

C'est `cancelAnimationFrame` que l'on va utiliser cette fois.

## Au final

Au final, pas besoin de lib compliquée, et c’était plus simple que prévu.
L’API Canvas fait parfaitement le job et mon code reste léger.

C'était assez amusant de jouer avec les paramètres et de voir la scène évoluer en temps réel.
Je compte l’améliorer petit à petit et peut-être en faire quelques variations pour d'autres pages du site.