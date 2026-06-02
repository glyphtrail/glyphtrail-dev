<script lang="ts">
  import { onMount } from 'svelte';
  import GraphField from '$lib/components/GraphField.svelte';
  import type { PageData } from './$types';

  const GITHUB = 'https://github.com/glyphtrail/glyphtrail';
  let { data }: { data: PageData } = $props();
  const lastUpdatedIso = $derived.by(() => {
    const date = new Date(data.lastUpdated);
    const dateMs = date.getTime();
    if (Number.isNaN(dateMs) || dateMs > Date.now() + 5 * 60_000) {
      return undefined;
    }

    return date.toISOString();
  });

  // Reveal-on-scroll action.
  function reveal(node: HTMLElement, delay = 0) {
    if (typeof IntersectionObserver === 'undefined') {
      node.classList.add('in');
      return;
    }
    node.style.transitionDelay = `${delay}ms`;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            node.classList.add('in');
            io.unobserve(node);
          }
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    io.observe(node);
    return { destroy: () => io.disconnect() };
  }

  const features = [
    {
      title: 'Typed symbol graph',
      body: 'A code knowledge graph of functions, methods, structs, classes and traits with call graph and dependency graph edges in one navigable view.',
      icon: 'graph'
    },
    {
      title: 'Blast-radius analysis',
      body: 'Before an agent edits a symbol, ask what touches it. Seed impact from a symbol, a file, or a git diff and walk the transitive radius.',
      icon: 'radius'
    },
    {
      title: 'Cross-repo impact',
      body: 'Register your repos once and trace a change across them. When a crate other repos depend on changes, see which break and where.',
      icon: 'repos'
    },
    {
      title: 'Query in Cypher',
      body: 'Structural code search over a native graph database. Find definitions, callers, callees, neighbors and semantic relationships with graph traversal.',
      icon: 'search'
    },
    {
      title: 'Local & private',
      body: 'The whole pipeline runs on your machine. .gitignore, .aiignore and an ignore list keep secrets out of the index entirely.',
      icon: 'shield'
    },
    {
      title: 'MCP server for code intelligence',
      body: 'Expose the graph to Claude Code and any MCP client as first-class tools. Agents query structure instead of guessing from grep.',
      icon: 'plug'
    },
    {
      title: 'Local-first code intelligence',
      body: 'Native Rust, no runtime. Re-analyze only changed files and query your local graph in milliseconds.',
      icon: 'bolt'
    },
    {
      title: 'Tree-sitter static analysis',
      body: 'Rust, Python, JS, TS/TSX, Go, Java, C, C++, C#, Ruby and Kotlin parsed with Tree-sitter based static analysis on one query surface.',
      icon: 'lang'
    }
  ];

  const steps = [
    { n: '01', t: 'Discover', d: 'Walk the tree, honouring .gitignore and ignore lists.' },
    { n: '02', t: 'Parse', d: 'Tree-sitter turns each file into an AST.' },
    { n: '03', t: 'Extract', d: 'Pull out symbols: functions, types, classes, comments.' },
    { n: '04', t: 'Link', d: 'Build calls, imports, implements and inheritance edges.' },
    { n: '05', t: 'Store', d: 'Persist to a native graph database, per repo.' },
    { n: '06', t: 'Query', d: 'Answer in Cypher over CLI or MCP, in milliseconds.' },
    { n: '07', t: 'Trace', d: 'Federate the graph across repos for blast radius.' }
  ];

  const tools = [
    {
      name: 'query',
      d: 'Graph lookups and structural code search: def, callers, callees, neighbors'
    },
    { name: 'impact', d: 'Blast radius for a symbol, file or diff - across repos' },
    { name: 'endpoints', d: 'The API and route surface of the codebase' },
    { name: 'list_repos', d: 'The registry powering cross-repo impact' }
  ];

  const codingAgents = [
    'claude',
    'codex',
    'copilot',
    'opencode',
    'kilo',
    'cursor',
    'aider',
    'gemini',
    'cody',
    'tabnine',
    'continue',
    'windsurf'
  ];

  let animatedAgent = $state('agents');

  onMount(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    let currentAgent = 0;
    let currentLength = 0;
    let erasing = false;

    animatedAgent = '';

    const nextStep = () => {
      const agent = codingAgents[currentAgent];

      if (erasing) {
        if (currentLength > 0) {
          currentLength -= 1;
          animatedAgent = agent.slice(0, currentLength);
          timer = setTimeout(nextStep, 45);
          return;
        }

        erasing = false;
        currentAgent = (currentAgent + 1) % codingAgents.length;
        timer = setTimeout(nextStep, 130);
        return;
      }

      if (currentLength < agent.length) {
        currentLength += 1;
        animatedAgent = agent.slice(0, currentLength);
        timer = setTimeout(nextStep, 75);
        return;
      }

      erasing = true;
      timer = setTimeout(nextStep, 420);
    };

    timer = setTimeout(nextStep, 120);

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  });
</script>

<svelte:head>
  {#if lastUpdatedIso}
    <meta name="last-modified" content={lastUpdatedIso} />
    <meta property="article:modified_time" content={lastUpdatedIso} />
  {/if}
</svelte:head>

<!-- ===================== NAV ===================== -->
<header class="nav">
  <div class="container nav-inner">
    <a class="brand" href="#top" aria-label="glyphtrail home">
      <svg class="brand-mark" width="30" height="30" viewBox="0 0 64 64" aria-hidden="true">
        <defs>
          <linearGradient id="navg" x1="12" y1="52" x2="52" y2="12" gradientUnits="userSpaceOnUse">
            <stop stop-color="#6366f1" />
            <stop offset="1" stop-color="#22d3ee" />
          </linearGradient>
        </defs>
        <path
          d="M16 46 C 28 46, 24 32, 32 32 C 40 32, 36 18, 48 18"
          stroke="url(#navg)"
          stroke-width="3.5"
          stroke-linecap="round"
          fill="none"
        />
        <circle cx="16" cy="46" r="5.5" fill="#6366f1" />
        <circle cx="32" cy="32" r="5" fill="#8b8ff6" />
        <circle cx="48" cy="18" r="5.5" fill="#22d3ee" />
      </svg>
      <span class="brand-name">glyphtrail</span>
    </a>

    <nav class="nav-links">
      <a href="#features">Features</a>
      <a href="#how">How it works</a>
      <a href="#cli">CLI</a>
      <a href="#mcp">MCP</a>
    </nav>

    <a class="btn btn-ghost nav-cta" href={GITHUB} target="_blank" rel="noopener noreferrer">
      <svg width="17" height="17" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
        <path
          d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z"
        />
      </svg>
      GitHub
    </a>
  </div>
</header>

<main id="top">
  <!-- ===================== HERO ===================== -->
  <section class="hero">
    <div class="hero-bg"><GraphField /></div>
    <div class="hero-glow" aria-hidden="true"></div>

    <div class="container hero-inner">
      <span class="eyebrow">Code intelligence for AI coding agents</span>
      <h1 class="hero-title">
        Stop letting <span class="hero-agent">{animatedAgent}</span><br />
        <span class="gradient-text">guess from grep.</span>
      </h1>
      <p class="hero-sub">
        glyphtrail builds a local-first code intelligence graph from Tree-sitter based static
        analysis, then gives coding agents exact answers: structural code search, call graph and
        dependency graph traversal, and blast radius / impact analysis across repositories via CLI
        and MCP.
      </p>

      <div class="hero-cta">
        <a class="btn btn-primary" href="#how">See how it works</a>
        <a class="btn btn-ghost" href={GITHUB} target="_blank" rel="noopener noreferrer">
          View on GitHub
        </a>
      </div>

      <ul class="hero-meta">
        <li>Runs locally</li>
        <li>Rust-native</li>
        <li>Graph-powered</li>
        <li>MCP-native</li>
      </ul>
    </div>
  </section>

  <!-- ===================== PROBLEM ===================== -->
  <section class="band">
    <div class="container compare" use:reveal>
      <div class="compare-col bad">
        <span class="compare-tag">Without a map</span>
        <p class="compare-line">grep <span class="dim">"handleAuth"</span></p>
        <p class="compare-note">
          27 text matches across 14 files. No idea which are calls, which are comments, or what
          breaks if you touch it. The agent picks one and hopes.
        </p>
      </div>
      <div class="compare-arrow" aria-hidden="true">→</div>
      <div class="compare-col good">
        <span class="compare-tag">With glyphtrail</span>
        <p class="compare-line">glyphtrail impact <span class="dim">handleAuth</span></p>
        <p class="compare-note">
          3 direct callers, 1 trait impl, 2 transitive dependents across 2 crates. Exact symbols,
          exact locations. The agent edits knowing the radius.
        </p>
      </div>
    </div>
  </section>

  <!-- ===================== FEATURES ===================== -->
  <section id="features" class="section">
    <div class="container">
      <div class="section-head" use:reveal>
        <span class="eyebrow">Features</span>
        <h2>A structural index, not a search box</h2>
        <p class="section-lead">
          Agents are good at reasoning and bad at remembering where things live. glyphtrail gives
          them ground truth about the code instead of a pile of text matches.
        </p>
      </div>

      <div class="grid">
        {#each features as f, i (f.title)}
          <article class="card" use:reveal={Math.min(i * 60, 300)}>
            <span class="card-icon" aria-hidden="true">
              {#if f.icon === 'graph'}
                <svg viewBox="0 0 24 24"
                  ><circle cx="5" cy="6" r="2.4" /><circle cx="19" cy="6" r="2.4" /><circle
                    cx="12"
                    cy="18"
                    r="2.4"
                  /><path d="M6.8 7.4 10.6 15.8M17.2 7.4 13.4 15.8M7 6h10" /></svg
                >
              {:else if f.icon === 'radius'}
                <svg viewBox="0 0 24 24"
                  ><circle cx="12" cy="12" r="2.6" /><circle
                    cx="12"
                    cy="12"
                    r="6"
                    opacity="0.6"
                  /><circle cx="12" cy="12" r="9.5" opacity="0.3" /></svg
                >
              {:else if f.icon === 'repos'}
                <svg viewBox="0 0 24 24"
                  ><path d="M12 3 21 8l-9 5-9-5 9-5zM3 13l9 5 9-5M3 17l9 5 9-5" /></svg
                >
              {:else if f.icon === 'search'}
                <svg viewBox="0 0 24 24"
                  ><circle cx="10.5" cy="10.5" r="6.5" /><path d="M15.5 15.5 21 21" /></svg
                >
              {:else if f.icon === 'shield'}
                <svg viewBox="0 0 24 24"
                  ><path d="M12 3 20 6v6c0 5-3.5 7.7-8 9-4.5-1.3-8-4-8-9V6z" /><path
                    d="m9 12 2 2 4-4"
                  /></svg
                >
              {:else if f.icon === 'plug'}
                <svg viewBox="0 0 24 24"
                  ><path d="M9 2v6M15 2v6M6 8h12v3a6 6 0 0 1-12 0zM12 17v5" /></svg
                >
              {:else if f.icon === 'bolt'}
                <svg viewBox="0 0 24 24"><path d="M13 2 4 14h7l-1 8 9-12h-7z" /></svg>
              {:else if f.icon === 'lang'}
                <svg viewBox="0 0 24 24"><path d="m8 7-4 5 4 5M16 7l4 5-4 5M13.5 5l-3 14" /></svg>
              {:else}
                <svg viewBox="0 0 24 24"><path d="m5 8 4 4-4 4M12 16h7" /></svg>
              {/if}
            </span>
            <h3>{f.title}</h3>
            <p>{f.body}</p>
          </article>
        {/each}
      </div>
    </div>
  </section>

  <!-- ===================== HOW IT WORKS ===================== -->
  <section id="how" class="section section-alt">
    <div class="container">
      <div class="section-head" use:reveal>
        <span class="eyebrow">How it works</span>
        <h2>From source files to queryable graph</h2>
        <p class="section-lead">
          A seven-stage pipeline turns a repository into a code graph and vector store for GraphRAG
          over codebases. Re-runs are incremental.
        </p>
      </div>

      <ol class="pipeline">
        {#each steps as s, i (s.n)}
          <li class="pstep" use:reveal={Math.min(i * 70, 350)}>
            <span class="pstep-n">{s.n}</span>
            <div>
              <h3>{s.t}</h3>
              <p>{s.d}</p>
            </div>
          </li>
        {/each}
      </ol>
    </div>
  </section>

  <!-- ===================== CLI ===================== -->
  <section id="cli" class="section">
    <div class="container cli-grid">
      <div class="section-head left" use:reveal>
        <span class="eyebrow">Command line</span>
        <h2>One binary. Index, then ask.</h2>
        <p class="section-lead">
          Point glyphtrail at a repo and it builds the index. From there, every question is a
          subcommand - and the same answers stream to your agent over MCP.
        </p>
        <div class="cli-points">
          <div><strong>query callers</strong> — who invokes a function</div>
          <div><strong>query neighbors</strong> — direct graph neighbours</div>
          <div><strong>query search</strong> — names and doc comments</div>
          <div><strong>impact</strong> — the blast radius of a change</div>
        </div>
      </div>

      <div class="terminal" use:reveal={120}>
        <div class="term-bar">
          <span class="dot r"></span><span class="dot y"></span><span class="dot g"></span>
          <span class="term-title">glyphtrail</span>
        </div>
        <pre class="term-body"><code
            ><span class="c-prompt">$</span> <span class="c-cmd">glyphtrail</span> analyze .
<span class="c-dim">  parsed 412 files · 6,840 symbols · 11,209 edges</span>
<span class="c-ok">  ✓ graph ready in 1.8s</span>

<span class="c-prompt">$</span> <span class="c-cmd">glyphtrail</span> impact <span class="c-arg"
              >TokenStore</span
            >
<span class="c-key">callers</span>      3   auth::login, auth::refresh, mw::guard
<span class="c-key">implements</span>   1   trait SessionBacking
<span class="c-key">dependents</span>   2   crate::api, crate::worker
<span class="c-warn">  ⚠ 6 symbols in blast radius</span>

<span class="c-prompt">$</span> <span class="c-cmd">glyphtrail</span> mcp
<span class="c-dim">  MCP server on stdio · query · impact · endpoints</span></code
          ></pre>
      </div>
    </div>
  </section>

  <!-- ===================== MCP ===================== -->
  <section id="mcp" class="section section-alt">
    <div class="container">
      <div class="section-head" use:reveal>
        <span class="eyebrow">MCP integration</span>
        <h2>Tools your agent can actually call</h2>
        <p class="section-lead">
          Start the MCP server and the graph becomes a code intelligence toolset. Claude Code,
          Cursor, Windsurf, Codex and other MCP clients query structure directly - no copy-pasting
          code into context.
        </p>
      </div>

      <div class="tools">
        {#each tools as t, i (t.name)}
          <div class="tool" use:reveal={Math.min(i * 50, 300)}>
            <code>{t.name}</code>
            <span>{t.d}</span>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- ===================== CTA ===================== -->
  <section class="section">
    <div class="container cta" use:reveal>
      <div class="cta-glow" aria-hidden="true"></div>
      <h2>Give your agent a map of the code.</h2>
      <p>
        glyphtrail is open source and runs entirely on your machine. Clone it, index a repo, and
        wire it into your agent over MCP.
      </p>
      <div class="hero-cta">
        <a class="btn btn-primary" href={GITHUB} target="_blank" rel="noopener noreferrer">
          Get glyphtrail
        </a>
        <a class="btn btn-ghost" href="#top">Back to top</a>
      </div>
    </div>
  </section>
</main>

<!-- ===================== FOOTER ===================== -->
<footer class="footer">
  <div class="container footer-inner">
    <div class="footer-brand">
      <span class="brand-name">glyphtrail</span>
      <p class="footer-tag">
        Local code intelligence graph for AI coding agents: Tree-sitter static analysis, structural
        code search, dependency impact, blast-radius analysis, CLI and MCP server.
      </p>
      <p class="footer-note">
        Early development - evolving fast. Formerly developed as <code>codegraph</code>.
      </p>
    </div>
    <nav class="footer-links">
      <a href="#features">Features</a>
      <a href="#how">How it works</a>
      <a href="#cli">CLI</a>
      <a href="#mcp">MCP</a>
      <a href={GITHUB} target="_blank" rel="noopener noreferrer">GitHub</a>
    </nav>
  </div>
  <div class="container footer-bottom">
    <span>
      © {new Date().getFullYear()}
      <a class="footer-author" href="https://github.com/sunsided" rel="me noopener" target="_blank"
        >Markus Mayer</a
      >
    </span>
    <span>Built with SvelteKit · deployed on GitHub Pages</span>
  </div>
</footer>

<style>
  /* ---------- nav ---------- */
  .nav {
    position: sticky;
    top: 0;
    z-index: 50;
    backdrop-filter: blur(14px);
    background: rgba(11, 15, 23, 0.72);
    border-bottom: 1px solid var(--border);
  }
  .nav-inner {
    display: flex;
    align-items: center;
    gap: 24px;
    height: 64px;
  }
  .brand {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    font-weight: 700;
  }
  .brand-mark {
    display: block;
  }
  .brand-name {
    font-size: 1.12rem;
    letter-spacing: -0.02em;
  }
  .nav-links {
    display: flex;
    gap: 26px;
    margin-left: auto;
    font-size: 0.92rem;
    color: var(--muted);
  }
  .nav-links a {
    transition: color 0.15s ease;
  }
  .nav-links a:hover {
    color: var(--text);
  }
  .nav-cta {
    padding: 8px 14px;
    font-size: 0.9rem;
  }

  /* ---------- buttons ---------- */
  .btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 12px 22px;
    border-radius: 999px;
    font-weight: 600;
    font-size: 0.96rem;
    border: 1px solid transparent;
    cursor: pointer;
    transition:
      transform 0.15s ease,
      box-shadow 0.2s ease,
      background 0.2s ease,
      border-color 0.2s ease;
    white-space: nowrap;
  }
  .btn-primary {
    background: var(--accent);
    color: #06121b;
    box-shadow: 0 8px 28px -10px rgba(34, 211, 238, 0.6);
  }
  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 14px 36px -10px rgba(34, 211, 238, 0.75);
  }
  .btn-ghost {
    background: var(--surface-2);
    border-color: var(--border-strong);
    color: var(--text);
  }
  .btn-ghost:hover {
    transform: translateY(-2px);
    border-color: rgba(255, 255, 255, 0.28);
    background: rgba(255, 255, 255, 0.08);
  }

  /* ---------- hero ---------- */
  .hero {
    position: relative;
    overflow: hidden;
    padding: clamp(72px, 13vw, 150px) 0 clamp(64px, 9vw, 110px);
    border-bottom: 1px solid var(--border);
  }
  .hero-bg {
    position: absolute;
    inset: 0;
    opacity: 0.85;
    mask-image: radial-gradient(120% 80% at 50% 30%, #000 35%, transparent 78%);
  }
  .hero-glow {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(50% 40% at 20% 0%, rgba(99, 102, 241, 0.22), transparent 70%),
      radial-gradient(45% 45% at 85% 20%, rgba(34, 211, 238, 0.16), transparent 70%);
    pointer-events: none;
  }
  .hero-inner {
    position: relative;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .hero-title {
    margin-top: 20px;
    font-size: clamp(2.5rem, 7vw, 4.6rem);
    font-weight: 800;
  }
  .hero-agent {
    display: inline-block;
    min-width: 8ch;
    text-align: left;
  }
  .hero-agent::after {
    content: '_';
    margin-left: 0.08em;
    color: var(--faint);
    animation: caret-blink 1s steps(1, end) infinite;
  }
  @keyframes caret-blink {
    50% {
      opacity: 0;
    }
  }
  .hero-sub {
    margin-top: 22px;
    max-width: 640px;
    color: var(--muted);
    font-size: clamp(1.02rem, 2vw, 1.2rem);
  }
  .hero-cta {
    margin-top: 34px;
    display: flex;
    gap: 14px;
    flex-wrap: wrap;
    justify-content: center;
  }
  .hero-meta {
    margin: 40px 0 0;
    padding: 0;
    list-style: none;
    display: flex;
    gap: 10px 28px;
    flex-wrap: wrap;
    justify-content: center;
    color: var(--faint);
    font-family: var(--font-mono);
    font-size: 0.82rem;
  }
  .hero-meta li {
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }
  .hero-meta li::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--cyan);
    box-shadow: 0 0 8px var(--cyan);
  }

  /* ---------- band / compare ---------- */
  .band {
    border-bottom: 1px solid var(--border);
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.02), transparent);
  }
  .compare {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: stretch;
    gap: 18px;
    padding: clamp(40px, 6vw, 64px) 24px;
  }
  .compare-col {
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 26px;
    background: var(--surface);
  }
  .compare-col.good {
    border-color: rgba(34, 211, 238, 0.32);
    background: linear-gradient(180deg, rgba(34, 211, 238, 0.06), var(--surface));
  }
  .compare-tag {
    font-family: var(--font-mono);
    font-size: 0.74rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--faint);
  }
  .compare-col.good .compare-tag {
    color: var(--cyan);
  }
  .compare-line {
    margin: 14px 0 12px;
    font-family: var(--font-mono);
    font-size: 1.05rem;
    color: var(--text);
  }
  .compare-line .dim {
    color: var(--faint);
  }
  .compare-note {
    color: var(--muted);
    font-size: 0.95rem;
  }
  .compare-arrow {
    display: flex;
    align-items: center;
    color: var(--faint);
    font-size: 1.6rem;
  }

  /* ---------- sections ---------- */
  .section {
    padding: clamp(64px, 10vw, 120px) 0;
  }
  .section-alt {
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.018), transparent);
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
  }
  .section-head {
    max-width: 680px;
    margin: 0 auto 52px;
    text-align: center;
  }
  .section-head.left {
    margin: 0;
    text-align: left;
  }
  .section-head h2 {
    margin-top: 16px;
    font-size: clamp(1.8rem, 4vw, 2.8rem);
  }
  .section-lead {
    margin-top: 18px;
    color: var(--muted);
    font-size: 1.05rem;
  }

  /* ---------- features grid ---------- */
  .grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 18px;
  }
  .card {
    border: 1px solid var(--border);
    border-radius: var(--radius);
    background: var(--surface);
    padding: 26px 24px;
    transition:
      transform 0.2s ease,
      border-color 0.2s ease,
      background 0.2s ease;
  }
  .card:hover {
    transform: translateY(-4px);
    border-color: var(--border-strong);
    background: var(--surface-2);
  }
  .card-icon {
    display: inline-flex;
    width: 44px;
    height: 44px;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    background: var(--accent-soft);
    border: 1px solid var(--border-strong);
    margin-bottom: 16px;
  }
  .card-icon svg {
    width: 22px;
    height: 22px;
    fill: none;
    stroke: var(--cyan);
    stroke-width: 1.7;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
  .card h3 {
    font-size: 1.06rem;
    margin-bottom: 8px;
  }
  .card p {
    color: var(--muted);
    font-size: 0.92rem;
  }

  /* ---------- pipeline ---------- */
  .pipeline {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    counter-reset: none;
  }
  .pstep {
    position: relative;
    display: flex;
    gap: 14px;
    align-items: flex-start;
    border: 1px solid var(--border);
    border-radius: var(--radius);
    background: var(--surface);
    padding: 22px 20px;
  }
  .pstep-n {
    font-family: var(--font-mono);
    font-weight: 600;
    font-size: 0.95rem;
    color: transparent;
    background: var(--accent);
    -webkit-background-clip: text;
    background-clip: text;
    flex: none;
  }
  .pstep h3 {
    font-size: 1.02rem;
    margin-bottom: 5px;
  }
  .pstep p {
    color: var(--muted);
    font-size: 0.9rem;
  }

  /* ---------- cli ---------- */
  .cli-grid {
    display: grid;
    grid-template-columns: 0.9fr 1.1fr;
    gap: 48px;
    align-items: center;
  }
  .cli-points {
    margin-top: 26px;
    display: grid;
    gap: 12px;
  }
  .cli-points div {
    padding-left: 18px;
    position: relative;
    color: var(--muted);
    font-size: 0.96rem;
  }
  .cli-points strong {
    color: var(--text);
    font-family: var(--font-mono);
    font-weight: 600;
  }
  .cli-points div::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0.62em;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--accent);
  }
  .terminal {
    border: 1px solid var(--border-strong);
    border-radius: var(--radius);
    overflow: hidden;
    background: #070a11;
    box-shadow: 0 30px 70px -30px rgba(0, 0, 0, 0.8);
  }
  .term-bar {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 16px;
    background: rgba(255, 255, 255, 0.03);
    border-bottom: 1px solid var(--border);
  }
  .dot {
    width: 11px;
    height: 11px;
    border-radius: 50%;
    display: inline-block;
  }
  .dot.r {
    background: #ff5f57;
  }
  .dot.y {
    background: #febc2e;
  }
  .dot.g {
    background: #28c840;
  }
  .term-title {
    margin-left: 8px;
    font-family: var(--font-mono);
    font-size: 0.8rem;
    color: var(--faint);
  }
  .term-body {
    margin: 0;
    padding: 22px;
    font-size: 0.86rem;
    line-height: 1.7;
    overflow-x: auto;
    color: #cdd6e6;
  }
  .c-prompt {
    color: #54e6b5;
  }
  .c-cmd {
    color: #a78bfa;
    font-weight: 600;
  }
  .c-arg {
    color: #f5d76e;
  }
  .c-key {
    color: #7dd3fc;
  }
  .c-dim {
    color: #5b6678;
  }
  .c-ok {
    color: #54e6b5;
  }
  .c-warn {
    color: #fbbf6e;
  }

  /* ---------- mcp tools ---------- */
  .tools {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 14px;
  }
  .tool {
    display: flex;
    align-items: center;
    gap: 16px;
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    background: var(--surface);
    padding: 16px 20px;
    transition:
      border-color 0.2s ease,
      background 0.2s ease;
  }
  .tool:hover {
    border-color: var(--border-strong);
    background: var(--surface-2);
  }
  .tool code {
    flex: none;
    color: var(--cyan);
    font-size: 0.9rem;
    background: rgba(34, 211, 238, 0.08);
    border: 1px solid rgba(34, 211, 238, 0.2);
    padding: 4px 10px;
    border-radius: 7px;
  }
  .tool span {
    color: var(--muted);
    font-size: 0.92rem;
  }

  /* ---------- cta ---------- */
  .cta {
    position: relative;
    overflow: hidden;
    text-align: center;
    border: 1px solid var(--border-strong);
    border-radius: 24px;
    padding: clamp(48px, 8vw, 84px) 28px;
    background: linear-gradient(180deg, rgba(99, 102, 241, 0.08), rgba(34, 211, 238, 0.05));
  }
  .cta-glow {
    position: absolute;
    inset: 0;
    background: radial-gradient(50% 120% at 50% 0%, rgba(34, 211, 238, 0.18), transparent 60%);
    pointer-events: none;
  }
  .cta h2 {
    position: relative;
    font-size: clamp(1.8rem, 4.5vw, 3rem);
  }
  .cta p {
    position: relative;
    margin: 18px auto 0;
    max-width: 540px;
    color: var(--muted);
  }
  .cta .hero-cta {
    position: relative;
  }

  /* ---------- footer ---------- */
  .footer {
    border-top: 1px solid var(--border);
    padding: 56px 0 32px;
    background: rgba(255, 255, 255, 0.012);
  }
  .footer-inner {
    display: flex;
    justify-content: space-between;
    gap: 40px;
    flex-wrap: wrap;
  }
  .footer-tag {
    margin-top: 10px;
    color: var(--muted);
    max-width: 320px;
    font-size: 0.95rem;
  }
  .footer-note {
    margin-top: 10px;
    color: var(--faint);
    font-size: 0.82rem;
  }
  .footer-note code {
    color: var(--muted);
    font-size: 0.85em;
  }
  .footer-links {
    display: flex;
    flex-wrap: wrap;
    gap: 14px 22px;
    height: fit-content;
    color: var(--muted);
    font-size: 0.92rem;
  }
  .footer-links a:hover {
    color: var(--text);
  }
  .footer-bottom {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
    margin-top: 40px;
    padding-top: 22px;
    border-top: 1px solid var(--border);
    color: var(--faint);
    font-size: 0.82rem;
  }
  .footer-author {
    color: var(--muted);
    font-weight: 500;
    transition: color 0.15s ease;
  }
  .footer-author:hover {
    color: var(--text);
  }

  /* ---------- reveal ---------- */
  /* The hidden initial state is gated behind html.js, set by an inline script
     in app.html. Without JS - crawlers, archive.org, scripts disabled - the
     class is absent, so these sections render fully visible instead of stuck
     at opacity 0 waiting for an IntersectionObserver that never runs. */
  :global(.js .section-head),
  :global(.js .card),
  :global(.js .pstep),
  :global(.js .tool),
  :global(.js .compare),
  :global(.js .terminal),
  :global(.js .cta) {
    opacity: 0;
    transform: translateY(18px);
    transition:
      opacity 0.6s ease,
      transform 0.6s ease;
  }
  :global(.in) {
    opacity: 1 !important;
    transform: none !important;
  }

  /* ---------- responsive ---------- */
  @media (max-width: 940px) {
    .grid {
      grid-template-columns: repeat(2, 1fr);
    }
    .pipeline {
      grid-template-columns: repeat(2, 1fr);
    }
    .cli-grid {
      grid-template-columns: 1fr;
      gap: 32px;
    }
    .tools {
      grid-template-columns: 1fr;
    }
  }
  @media (max-width: 720px) {
    .nav-links {
      display: none;
    }
    .compare {
      grid-template-columns: 1fr;
    }
    .compare-arrow {
      transform: rotate(90deg);
      justify-content: center;
    }
  }
  @media (max-width: 520px) {
    .grid {
      grid-template-columns: 1fr;
    }
    .pipeline {
      grid-template-columns: 1fr;
    }
    .footer-bottom {
      flex-direction: column;
      gap: 6px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    :global(.js .section-head),
    :global(.js .card),
    :global(.js .pstep),
    :global(.js .tool),
    :global(.js .compare),
    :global(.js .terminal),
    :global(.js .cta) {
      opacity: 1;
      transform: none;
    }
  }
</style>
