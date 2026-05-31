<script lang="ts">
  import { onMount } from 'svelte';

  // Ambient node-graph backdrop: drifting symbol nodes, edges between near
  // neighbours, and "trail" pulses that travel along edges - the glyphtrail.

  let canvas: HTMLCanvasElement;

  onMount(() => {
    const maybeCtx = canvas.getContext('2d');
    if (!maybeCtx) return;
    // Capture as non-null so the nested draw helpers type-check (narrowing from
    // the guard above does not cross function boundaries).
    const ctx: CanvasRenderingContext2D = maybeCtx;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    type Node = { x: number; y: number; vx: number; vy: number; r: number };
    type Edge = { a: number; b: number };
    type Pulse = { edge: number; t: number; speed: number; dir: number };

    let w = 0;
    let h = 0;
    let dpr = 1;
    let nodes: Node[] = [];
    let edges: Edge[] = [];
    let pulses: Pulse[] = [];
    let raf = 0;

    const LINK_DIST = 150;

    function build() {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const density = Math.min(64, Math.max(20, Math.round((w * h) / 26000)));
      nodes = Array.from({ length: density }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        r: Math.random() * 1.6 + 1.1
      }));
      pulses = [];
    }

    function computeEdges() {
      edges = [];
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          if (dx * dx + dy * dy < LINK_DIST * LINK_DIST) edges.push({ a: i, b: j });
        }
      }
    }

    function spawnPulse() {
      if (!edges.length) return;
      pulses.push({
        edge: Math.floor(Math.random() * edges.length),
        t: 0,
        speed: 0.006 + Math.random() * 0.01,
        dir: Math.random() < 0.5 ? 1 : -1
      });
    }

    function drawEdges() {
      ctx.lineWidth = 1;
      for (const e of edges) {
        const a = nodes[e.a];
        const b = nodes[e.b];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        ctx.strokeStyle = `rgba(99, 110, 200, ${(1 - dist / LINK_DIST) * 0.5})`;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }

    function drawNodes() {
      for (const n of nodes) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(165, 180, 255, 0.55)';
        ctx.fill();
      }
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);

      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < -20) n.x = w + 20;
        if (n.x > w + 20) n.x = -20;
        if (n.y < -20) n.y = h + 20;
        if (n.y > h + 20) n.y = -20;
      }
      computeEdges();
      drawEdges();
      drawNodes();

      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        p.t += p.speed;
        if (p.t >= 1 || p.edge >= edges.length) {
          pulses.splice(i, 1);
          continue;
        }
        const e = edges[p.edge];
        const a = nodes[e.a];
        const b = nodes[e.b];
        const tt = p.dir === 1 ? p.t : 1 - p.t;
        const x = a.x + (b.x - a.x) * tt;
        const y = a.y + (b.y - a.y) * tt;

        const trailLen = 0.14;
        const t2 = Math.max(0, p.t - trailLen);
        const tt2 = p.dir === 1 ? t2 : 1 - t2;
        const tx = a.x + (b.x - a.x) * tt2;
        const ty = a.y + (b.y - a.y) * tt2;
        const g = ctx.createLinearGradient(tx, ty, x, y);
        g.addColorStop(0, 'rgba(34, 211, 238, 0)');
        g.addColorStop(1, 'rgba(34, 211, 238, 0.9)');
        ctx.strokeStyle = g;
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(x, y);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(x, y, 2.6, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(125, 240, 255, 0.95)';
        ctx.shadowColor = 'rgba(34, 211, 238, 0.9)';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      if (pulses.length < 7 && Math.random() < 0.04) spawnPulse();

      raf = requestAnimationFrame(draw);
    }

    function staticFrame() {
      build();
      computeEdges();
      ctx.clearRect(0, 0, w, h);
      drawEdges();
      drawNodes();
    }

    let resizeTimer: ReturnType<typeof setTimeout>;
    function onResize() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (reduced) staticFrame();
        else build();
      }, 150);
    }

    if (reduced) {
      staticFrame();
    } else {
      build();
      raf = requestAnimationFrame(draw);
    }
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', onResize);
    };
  });
</script>

<canvas bind:this={canvas} aria-hidden="true"></canvas>

<style>
  canvas {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    display: block;
  }
</style>
