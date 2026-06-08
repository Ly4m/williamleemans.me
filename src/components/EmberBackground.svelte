<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { EmberParticleSystem } from "../lib/ParticleSystem.ts";

  let canvas: HTMLCanvasElement;
  let system: EmberParticleSystem;

  onMount(() => {
    // Respect an explicit reduced-motion opt-out: leave the canvas empty so the
    // solid page background shows through, rather than animating the embers.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    system = new EmberParticleSystem(canvas);
    system.start();
  });

  onDestroy(() => {
    system?.stop();
  })
</script>

<canvas bind:this={canvas} class="-z-1 fixed"></canvas>