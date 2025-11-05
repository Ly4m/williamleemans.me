<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { EmberParticleSystem } from "../lib/ParticleSystem.ts";

  let canvas: HTMLCanvasElement;
  let system: EmberParticleSystem;

  onMount(() => {
    system = new EmberParticleSystem(canvas);
    system.start();
  });

  onDestroy(() => {
    system?.stop();
  })
</script>

<canvas bind:this={canvas} class="-z-1 fixed"></canvas>