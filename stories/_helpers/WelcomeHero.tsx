import React from 'react';
import { PatternCatalogue } from './PatternCatalogue';

const WELCOME_HERO = `<!-- HERO -->
<div class="hero">
  <div class="hero-grid">
    <div>
      <span class="eyebrow">The design system behind OutSystems apps</span>
      <h1>Build interfaces that<br /><em>already look right.</em></h1>
      <p class="lede">70+ UI patterns, a tokenised theme and ready-made screens. Drag them from the ODC Studio toolbox, set the properties, bind your data. One system for Reactive Web and Native Mobile.</p>
      <div class="hero-cta">
        <a class="w-btn w-btn-primary" href="https://www.outsystems.com/forge/component-overview/15931/outsystems-ui-odc" target="_blank" rel="noopener">Get started in ODC Studio</a>
        <a class="w-btn w-btn-ghost" href="?path=/docs/component-library--docs">Browse patterns</a>
      </div>
      <div class="hero-meta">
        <div><b>56</b>patterns</div>
        <div><b>24</b>screen templates</div>
        <div><b>600+</b>design tokens</div>
      </div>
    </div>
  </div>
</div>
`;

const WELCOME_SECTIONS = `
  <!-- VALUE — Consistent by default -->
  <div class="sec">
    <div class="sec-head">
      <div class="sec-kicker">Why it exists</div>
      <h2>Consistent by default</h2>
      <p>Every pattern ships behaviour, styling and accessibility together, so the screen you assemble in OutSystems is consistent, responsive and accessible before you style a single thing.</p>
    </div>
    <div class="grid-4">
      <div class="w-card">
        <div class="ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg></div>
        <h3>One framework</h3>
        <p>The same library powers Reactive Web and Native Mobile. No parallel component sets to keep in sync.</p>
      </div>
      <div class="w-card">
        <div class="ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg></div>
        <h3>Integrated, not bolted on</h3>
        <p>Patterns appear in the ODC Studio toolbox. Drag, bind data, ship. No wiring, no build step.</p>
      </div>
      <div class="w-card">
        <div class="ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="14" rx="2"/><path d="M8 21h8M12 18v3"/></svg></div>
        <h3>Responsive by default</h3>
        <p>Layouts and patterns adapt across breakpoints, which are themselves configurable per device.</p>
      </div>
      <div class="w-card">
        <div class="ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 1 0 18"/></svg></div>
        <h3>Yours to extend</h3>
        <p>Change the theme's tokens and every pattern follows. Need to go further? Each one exposes a documented CSS API.</p>
      </div>
    </div>
  </div>

  <!-- PIECES — How it fits together -->
  <div class="sec">
    <div class="sec-head">
      <div class="sec-kicker">How it fits together</div>
      <h2>Four pieces, in the order you'll meet them</h2>
      <p>From an empty workspace to a themed, data-bound app. Each step hands off to the next.</p>
    </div>
    <div class="pieces">
      <a class="piece" href="#"><span class="k">Step 1</span><b>App templates</b><span>Two starting points, optimised per device and adaptive from the first screen.</span></a>
      <a class="piece" href="#"><span class="k">Step 2</span><b>Screen templates</b><span>Whole screens with layout, logic and sample data. Swap in your entities.</span></a>
      <a class="piece" href="?path=/docs/component-library--docs"><span class="k">Step 3</span><b>Patterns</b><span>The building blocks. Configure properties, bind data and actions.</span></a>
      <a class="piece" href="?path=/docs/css-architecture--docs"><span class="k">Step 4</span><b>Theme &amp; tokens</b><span>Change tokens once; colour, type and spacing follow everywhere.</span></a>
    </div>
  </div>
`;

const WELCOME_TAIL = `
  <!-- FOUNDATIONS -->
  <div class="sec" id="foundations">
    <div class="sec-head">
      <div class="sec-kicker">Foundations</div>
      <h2>The layer everything else is built on</h2>
      <p>Tokens are the contract: patterns consume them, themes override them, dark mode is a re-mapping rather than a second stylesheet.</p>
    </div>
    <div class="grid-3">
      <div class="w-card">
        <h3>Colour</h3>
        <p>Primitive ramps resolve into semantic roles: primary, success, warning, danger, info.</p>
        <div class="swatches">
          <div class="sw" style="background:#f0f2ff"></div><div class="sw" style="background:#e4e8ff"></div>
          <div class="sw" style="background:#d0d7fa"></div><div class="sw" style="background:#b5c0f7"></div>
          <div class="sw" style="background:#94a5f4"></div><div class="sw" style="background:#6986f2"></div>
          <div class="sw" style="background:#105cef"></div><div class="sw" style="background:#0d4ec9"></div>
          <div class="sw" style="background:#04053d"></div>
        </div>
      </div>
      <div class="w-card">
        <h3>Typography</h3>
        <p>One family, a fixed scale, weights that carry hierarchy without extra rules.</p>
        <div style="margin-top:8px">
          <div class="type-row"><span class="lbl">Display</span><span style="font-size:24px;font-weight:800;letter-spacing:-.02em">Aa</span></div>
          <div class="type-row"><span class="lbl">Heading</span><span style="font-size:18px;font-weight:650">Aa</span></div>
          <div class="type-row"><span class="lbl">Body</span><span style="font-size:15px">Aa</span></div>
          <div class="type-row"><span class="lbl">Caption</span><span style="font-size:12px;color:var(--w-ink-3)">Aa</span></div>
        </div>
      </div>
      <a class="w-card" href="?path=/docs/css-architecture--docs">
        <h3>Tokens</h3>
        <p>Change one in the theme editor and every pattern that uses it follows.</p>
        <div style="margin-top:8px" class="mono">
          <div class="tok"><span>--token-semantics-primary-700</span><span>#105cef</span></div>
          <div class="tok"><span>--token-border-radius-300</span><span>12px</span></div>
          <div class="tok"><span>--token-scale-400</span><span>16px</span></div>
          <div class="tok"><span>--osui-card-padding</span><span>inherits</span></div>
        </div>
        <div class="arrow">CSS architecture →</div>
      </a>
    </div>
  </div>

  <!-- TEMPLATES -->
  <div class="sec" id="templates">
    <div class="sec-head">
      <div class="sec-kicker">Screen templates</div>
      <h2>Start from a screen, not a blank canvas</h2>
      <p>Dashboards, lists, detail views, forms, galleries and onboardings, with structure and sample data already in place.</p>
    </div>
    <div class="grid-4">
      <a class="tpl" href="https://success.outsystems.com/Documentation/11/Developing_an_Application/Design_UI/Screen_Templates" target="_blank" rel="noopener">
        <div class="shot">
          <div class="s-row" style="height:28px"><div class="blk accent"></div><div class="blk accent"></div><div class="blk accent"></div></div>
          <div class="s-row" style="flex:1"><div class="blk tall"></div></div>
        </div>
        <div class="cap"><b>Admin dashboard</b><span>Dashboards</span></div>
      </a>
      <a class="tpl" href="https://success.outsystems.com/Documentation/11/Developing_an_Application/Design_UI/Screen_Templates" target="_blank" rel="noopener">
        <div class="shot">
          <div class="s-row" style="flex:1"><div class="blk tall" style="max-width:38%"></div><div class="blk tall"></div></div>
        </div>
        <div class="cap"><b>Employees list &amp; detail</b><span>Lists · Details</span></div>
      </a>
      <a class="tpl" href="https://success.outsystems.com/Documentation/11/Developing_an_Application/Design_UI/Screen_Templates" target="_blank" rel="noopener">
        <div class="shot">
          <div class="s-row" style="height:22px"><div class="blk"></div></div>
          <div class="s-row" style="height:22px"><div class="blk"></div></div>
          <div class="s-row" style="flex:1"><div class="blk tall accent" style="max-width:40%"></div><div class="blk tall"></div></div>
        </div>
        <div class="cap"><b>Request form</b><span>Forms</span></div>
      </a>
      <a class="tpl" href="https://success.outsystems.com/Documentation/11/Developing_an_Application/Design_UI/Screen_Templates" target="_blank" rel="noopener">
        <div class="shot">
          <div class="s-row" style="flex:1"><div class="blk tall accent"></div><div class="blk tall"></div><div class="blk tall"></div></div>
          <div class="s-row" style="flex:1"><div class="blk tall"></div><div class="blk tall accent"></div><div class="blk tall"></div></div>
        </div>
        <div class="cap"><b>Product catalog</b><span>Galleries</span></div>
      </a>
    </div>
  </div>

  <!-- RESOURCES -->
  <div class="sec" id="resources">
    <div class="sec-head">
      <div class="sec-kicker">Resources</div>
      <h2>For the rest of the workflow</h2>
      <p>Design files, plugins and a reference sheet, so design and delivery stay on the same system.</p>
    </div>
    <div class="grid-3">
      <a class="w-card" href="https://outsystemsui.outsystems.com/OutsystemsUiWebsite/" target="_blank" rel="noopener">
        <div class="ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v13m0 0-4-4m4 4 4-4M4 19h16"/></svg></div>
        <h3>Design kits</h3>
        <p>Styles, patterns, widgets and layouts for Figma, Sketch and Adobe XD, mirroring the token layer.</p>
        <div class="arrow">Open kits →</div>
      </a>
      <a class="w-card" href="?path=/docs/css-architecture--docs">
        <div class="ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7h16M4 12h10M4 17h7"/></svg></div>
        <h3>CSS architecture</h3>
        <p>How tokens, the theme layer and the <code>--osui-*</code> component API fit together.</p>
        <div class="arrow">Open docs →</div>
      </a>
      <a class="w-card" href="https://success.outsystems.com/Documentation/11/Developing_an_Application/Design_UI/Patterns" target="_blank" rel="noopener">
        <div class="ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20a8 8 0 1 0-8-8v8h8Z"/></svg></div>
        <h3>Docs &amp; training</h3>
        <p>Technical documentation and guided courses, plus the community for everything neither one answers.</p>
        <div class="arrow">Go to docs →</div>
      </a>
    </div>
  </div>

  <!-- CTA -->
  <div class="cta">
    <div>
      <h2>Start with the pattern you need</h2>
      <p>Find it in the sidebar, see it running with every property and state, then drag it into your screen in ODC Studio.</p>
    </div>
    <div class="acts">
      <a class="w-btn w-btn-white" href="https://www.outsystems.com/forge/component-overview/15931/outsystems-ui-odc" target="_blank" rel="noopener">Get started</a>
    </div>
  </div>
`;

/**
 * Pointer-driven parallax on the hero gradient blobs.
 * Ported from the introduction-full mockup — damped travel + eased RAF so the
 * blobs drift instead of tracking the cursor 1:1. Skipped for reduced-motion.
 */
function useHeroParallax(rootRef: React.RefObject<HTMLDivElement | null>) {
	React.useEffect(() => {
		const root = rootRef.current;
		const hero = root?.querySelector('.hero') as HTMLElement | null;
		if (!hero || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

		const HOME = { x: 50, y: 35 };
		const TRAVEL = 0.55;
		const EASE = 0.1;

		const cur = { ...HOME };
		const target = { ...HOME };
		let raf: number | null = null;

		const frame = () => {
			cur.x += (target.x - cur.x) * EASE;
			cur.y += (target.y - cur.y) * EASE;
			hero.style.setProperty('--mx', `${cur.x.toFixed(2)}%`);
			hero.style.setProperty('--my', `${cur.y.toFixed(2)}%`);
			const settled = Math.abs(target.x - cur.x) < 0.05 && Math.abs(target.y - cur.y) < 0.05;
			raf = settled ? null : requestAnimationFrame(frame);
		};
		const kick = () => {
			if (raf === null) raf = requestAnimationFrame(frame);
		};

		const onMove = (e: PointerEvent) => {
			const r = hero.getBoundingClientRect();
			const px = ((e.clientX - r.left) / r.width) * 100;
			const py = ((e.clientY - r.top) / r.height) * 100;
			target.x = HOME.x + (px - HOME.x) * TRAVEL;
			target.y = HOME.y + (py - HOME.y) * TRAVEL;
			kick();
		};
		const onLeave = () => {
			target.x = HOME.x;
			target.y = HOME.y;
			kick();
		};

		hero.addEventListener('pointermove', onMove);
		hero.addEventListener('pointerleave', onLeave);
		return () => {
			hero.removeEventListener('pointermove', onMove);
			hero.removeEventListener('pointerleave', onLeave);
			if (raf !== null) cancelAnimationFrame(raf);
		};
	}, [rootRef]);
}

export function WelcomeHero() {
	const rootRef = React.useRef<HTMLDivElement>(null);
	useHeroParallax(rootRef);

	return (
		<div ref={rootRef} className="osui-welcome sb-unstyled">
			<div dangerouslySetInnerHTML={{ __html: WELCOME_HERO }} />
			<div className="welcome-body">
				<div dangerouslySetInnerHTML={{ __html: WELCOME_SECTIONS }} />
				<PatternCatalogue />
				<div dangerouslySetInnerHTML={{ __html: WELCOME_TAIL }} />
			</div>
		</div>
	);
}
