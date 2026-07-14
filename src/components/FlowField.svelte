<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { FlowField } from "../lib/FlowField.ts";

  let canvas: HTMLCanvasElement;
  let field: FlowField;

  onMount(() => {
    field = new FlowField(canvas);
    // Respect an explicit reduced-motion opt-out: render a single static frame
    // of the flow rather than animating the streamlines.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) field.renderStatic();
    else field.start();
  });

  onDestroy(() => {
    field?.stop();
  });
</script>

<canvas bind:this={canvas} class="fixed inset-0 -z-10" aria-hidden="true"></canvas>
