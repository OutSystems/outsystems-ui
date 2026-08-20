import React from 'react';
import { DocsNote } from './DocsNote';
import { DocsToc } from './DocsToc';

const TOC_ITEMS = [
	{ id: 'big-picture', label: 'The big picture' },
	{ id: 'tier-1', label: 'Design tokens' },
	{ id: 'tier-3', label: 'Theme layer' },
	{ id: 'tier-4', label: 'Component CSS API' },
	{ id: 'theming', label: 'Theming & dark mode' },
	{ id: 'authoring', label: 'Quick reference' },
];

const HOPS = [
	{
		n: 1,
		layer: 'Component CSS API',
		form: 'var(--osui-{component}-{prop})',
		note: 'per-instance override',
		cat: 'api',
	},
	{
		n: 2,
		layer: 'Framework theme layer',
		form: 'var(--{role})',
		note: ':root · app / theme override',
		cat: 'theme',
	},
	{
		n: 3,
		layer: 'Design-token SCSS vars',
		form: '$token-{…}',
		note: 'compile-time',
		cat: 'scss',
	},
	{
		n: 4,
		layer: 'Design tokens at :root',
		form: 'var(--token-{…}, <primitive>)',
		note: 'runtime override surface',
		cat: 'token',
	},
];

const CODE_CARD_HOPS = `.card {
  --osui-card-background: var(--color-background-surface); // Component API → theme role
}
background-color: var(--osui-card-background);             // property → Component API`;

const CODE_THEME_LAYER =
	'// Framework theme layer — src/scss/01-foundations/_root.scss\n' +
	':root { --color-background-surface: #{$token-bg-surface-default}; } // role → token';

const CODE_TOKEN_VAR =
	'// Design tokens — src/scss/tokens/_variables.scss  (generated)\n' +
	'$token-bg-surface-default: var(--token-bg-surface-default, var(--token-primitives-base-white, #ffffff));';

const CODE_BUILD = 'npx build.tokens --dest src/scss/tokens/ --prefix token   # runs in prebuild / predev';

const CODE_ROOT =
	':root {\n' +
	'  --color-background-surface: #{$token-bg-surface-default};\n' +
	'  --color-text:               #{$token-text-default};\n' +
	'  --color-primary:            #{$token-semantics-primary-base};\n' +
	'\n' +
	'  // one shape vocabulary; set --border-radius-default once to re-radius everything\n' +
	'  --border-radius-soft:   var(--border-radius-default, #{$token-border-radius-200}); // 8px\n' +
	'  --border-radius-softer: var(--border-radius-default, #{$token-border-radius-400}); // 16px\n' +
	'  --border-radius-rounded:var(--border-radius-default, #{$token-border-radius-full});// 999px\n' +
	'}';

const CODE_CARD_API =
	'.card {\n' +
	'  --osui-card-background:    var(--color-background-surface);   // → theme role (themeable)\n' +
	'  --osui-card-border-width:  #{$token-border-size-025};         // → token directly (structural)\n' +
	'  --osui-card-border-radius: var(--border-radius-soft);\n' +
	'  --osui-card-padding:       #{$token-scale-600};\n' +
	'  --osui-card-shadow:        #{$token-elevation-1};\n' +
	'\n' +
	'  background-color: var(--osui-card-background);\n' +
	'  border-radius:    var(--osui-card-border-radius);\n' +
	'  padding:          var(--osui-card-padding);\n' +
	'}';

const CODE_THEME_EXAMPLES =
	':root          { --color-primary: #6d28d9; }            /* re-skin one role */\n' +
	':root          { --token-bg-surface-default: #1b1b1b; } /* re-skin globally via a token */\n' +
	':root          { --border-radius-default: 12px; }       /* round every corner */\n' +
	'.card.is-promo { --osui-card-shadow: var(--osui-elevation-overlay); } /* one instance */';

function HopChain() {
	return (
		<div className="ca-hops">
			<div className="ca-hops-label">any CSS property reads down ↓</div>
			{HOPS.map((h, i) => (
				<div key={h.n}>
					<div className={`ca-hop ca-hop--${h.cat}`}>
						<div className="ca-hop-n">{h.n}</div>
						<div className="ca-hop-body">
							<div className="ca-hop-layer">{h.layer}</div>
							<code className="ca-hop-form">{h.form}</code>
						</div>
						<div className="ca-hop-note">{h.note}</div>
					</div>
					{i < HOPS.length - 1 ? (
						<div className="ca-hop-fall">
							<span>↓ falls back to</span>
						</div>
					) : null}
				</div>
			))}
		</div>
	);
}

function DocsCodeBlock({ code }: { code: string }) {
	const [label, setLabel] = React.useState('Copy');

	const onCopy = React.useCallback(async () => {
		try {
			await navigator.clipboard.writeText(code);
			setLabel('Copied');
			window.setTimeout(() => setLabel('Copy'), 1400);
		} catch {
			/* ignore */
		}
	}, [code]);

	return (
		<div className="code">
			<pre>{highlightLight(code)}</pre>
			<button type="button" onClick={onCopy}>
				{label}
			</button>
		</div>
	);
}

function highlightLight(code: string): React.ReactNode {
	const parts: React.ReactNode[] = [];
	const re = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)/g;
	let last = 0;
	let m: RegExpExecArray | null;
	let key = 0;
	while ((m = re.exec(code))) {
		if (m.index > last) parts.push(code.slice(last, m.index));
		parts.push(
			<span className="c" key={key++}>
				{m[0]}
			</span>
		);
		last = m.index + m[0].length;
	}
	if (last < code.length) parts.push(code.slice(last));
	return parts.length ? parts : code;
}

/**
 * Full CSS Architecture docs page (TSX body — MDX broke on `*` inside <code>).
 * Content matches the previous MDX page; chrome matches Getting Started.
 */
export function CssArchitecturePage() {
	const rootRef = React.useRef<HTMLDivElement>(null);

	return (
		<div ref={rootRef} className="osui-css-architecture sb-unstyled">
			<header className="ca-head">
				<div className="ca-head-in">
					<span className="ca-eyebrow">Overview · CSS Architecture</span>
					<h1>CSS Architecture</h1>
					<p className="ca-lede">
						How OutSystems UI styles every component: three cooperating layers —{' '}
						<strong>design tokens</strong>, a <strong>framework theme layer at <code>:root</code></strong>,
						and a per-component <strong>CSS API</strong> — tied together by a single resolution chain. This
						is the Storybook summary; the full write-up lives in <code>docs/css-architecture.md</code>, and
						every <code>--osui-*</code> property is catalogued on the <strong>CSS API Reference</strong>{' '}
						page.
					</p>
				</div>
			</header>
			<div className="ca-inner">
				<div className="cols">
					<article className="ca-body">
						<h2 id="big-picture">The big picture</h2>
						<p>
							Every property resolves through a <strong>four-hop chain</strong>. Each hop is one layer with
							one job, and each has a sensible default so the layer below is optional:
						</p>
						<HopChain />
						<p>Traced through the Card background, top to bottom:</p>
						<DocsCodeBlock code={CODE_CARD_HOPS} />
						<DocsCodeBlock code={CODE_THEME_LAYER} />
						<DocsCodeBlock code={CODE_TOKEN_VAR} />
						<p>
							<strong>Anyone can intercept at any hop:</strong> an app sets{' '}
							<code>--token-bg-surface-default</code> to re-skin globally, a theme sets{' '}
							<code>--color-background-surface</code> to change just the surface role, and a single
							instance sets <code>--osui-card-background</code> to override one card — none of them touch
							a component rule.
						</p>

						<h2 id="tier-1">
							Tier 1 — Design tokens (<code>--token-*</code> / <code>$token-*</code>)
						</h2>
						<p>
							The bottom layer comes from the <code>outsystems-design-tokens</code> package and is{' '}
							<strong>generated</strong>, never hand-edited:
						</p>
						<DocsCodeBlock code={CODE_BUILD} />
						<p>It emits two cooperating surfaces (both gitignored):</p>
						<table>
							<thead>
								<tr>
									<th>Surface</th>
									<th>What</th>
									<th>Use it when</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>
										<code>$token-*</code> SCSS vars
									</td>
									<td>
										each expands to <code>var(--token-*, &lt;fallback&gt;)</code>
									</td>
									<td>
										<strong>writing component SCSS</strong> — gives compile-time checking + a baked-in
										fallback
									</td>
								</tr>
								<tr>
									<td>
										<code>--token-*</code> at <code>:root</code>
									</td>
									<td>raw values</td>
									<td>
										the <strong>runtime theming surface</strong> an app/DTE overrides
									</td>
								</tr>
							</tbody>
						</table>
						<p>
							Tokens are themselves layered — <strong>primitives → semantics → component</strong> — and
							the fallback chain encodes it: a semantic token (<code>bg-surface-default</code>) falls back
							through a primitive (<code>primitives-base-white</code>) which falls back to a literal, so a
							component renders correctly even if no <code>--token-*</code> are defined at runtime.
						</p>
						<DocsNote title="Verified">
							<p>
								The compiled bundle does <strong>not</strong> ship the <code>--token-*</code>{' '}
								<code>:root</code> block — it relies on the <code>var(--token-*, fallback)</code>{' '}
								fallbacks. The generated <code>tokens/_root.scss</code> is the canonical override set an
								app supplies at <code>:root</code>.
							</p>
						</DocsNote>
						<p>Rules of thumb:</p>
						<ul>
							<li>
								CSS <strong>property value</strong> → write <code>$token-*</code> directly:{' '}
								<code>padding: $token-scale-600;</code>
							</li>
							<li>
								CSS <strong>custom-property declaration</strong> → interpolate:{' '}
								<code>{'--osui-card-padding: #{$token-scale-600};'}</code>
							</li>
							<li>
								Retired, never reintroduce: <code>--space-*</code>, <code>--font-size-*</code>,{' '}
								<code>--shadow-*</code>, <code>--border-size-*</code>, and the <code>get-*-color()</code>{' '}
								helpers.
							</li>
						</ul>

						<h2 id="tier-3">
							Tier 3 — Framework theme layer at <code>:root</code>
						</h2>
						<p>
							<code>src/scss/01-foundations/_root.scss</code> declares OUI&apos;s stable, framework-owned
							theming contract — un-prefixed role knobs that sit between tokens and components. Each
							defaults <strong>through</strong> a <code>$token-*</code>, so overriding the token still
							cascades.
						</p>
						<DocsCodeBlock code={CODE_ROOT} />
						<table>
							<thead>
								<tr>
									<th>Group</th>
									<th>Vars</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>Surfaces</td>
									<td>
										<code>--color-background-{'{body,surface,header,sidemenu,footer,login,input,…}'}</code>
									</td>
								</tr>
								<tr>
									<td>Text</td>
									<td>
										<code>--color-text</code>, <code>--color-text-{'{subtle,subtlest,disabled,inverse}'}</code>
									</td>
								</tr>
								<tr>
									<td>Borders</td>
									<td>
										<code>--color-border</code>, <code>--color-border-{'{subtle,subtlest,input,…}'}</code>
									</td>
								</tr>
								<tr>
									<td>Brand / status / neutral</td>
									<td>
										<code>--color-{'{primary,secondary,error,warning,success,info}'}</code>,{' '}
										<code>--color-neutral-0..10</code>
									</td>
								</tr>
								<tr>
									<td>Radius</td>
									<td>
										<code>--border-radius-{'{none,soft,softer,rounded}'}</code>
									</td>
								</tr>
							</tbody>
						</table>
						<p>
							App-layout plumbing also lives in <code>_root.scss</code> but is <strong>not</strong> part of
							the theme contract: <code>--size-*</code>, z-index <code>--layer-*</code>, and safe areas{' '}
							<code>--os-safe-area-*</code>.
						</p>

						<h2 id="tier-4">
							Tier 4 — Component CSS API (<code>--osui-*</code>)
						</h2>
						<p>
							Every visual component declares its own custom properties at its root selector, defaulting
							either to a theme role (themeable props) or straight to a <code>$token-*</code> (structural
							props), then reads them in property values:
						</p>
						<DocsCodeBlock code={CODE_CARD_API} />
						<p>Rules:</p>
						<ul>
							<li>
								Naming: <code>--osui-{'{component}-{property}'}</code>.
							</li>
							<li>
								Property declarations <strong>must</strong> go through the <code>--osui-*</code> var (never
								directly through <code>$token-*</code> / <code>--color-*</code>), so a consumer can
								override one instance without touching tokens or the theme.
							</li>
							<li>
								Route <strong>themeable</strong> props through the theme role, <strong>structural</strong>{' '}
								props straight to <code>$token-*</code>.
							</li>
						</ul>
						<p>
							See the <strong>CSS API Reference</strong> page for the full list of every{' '}
							<code>--osui-*</code> property and its default.
						</p>

						<h2 id="theming">Theming &amp; dark mode</h2>
						<p>
							A theme is <strong>entirely CSS-custom-property overrides</strong> scoped under a single class
							(or a media query). It overrides theme-layer roles and/or the underlying tokens — never a
							component rule.
						</p>
						<DocsCodeBlock code={CODE_THEME_EXAMPLES} />
						<DocsNote title="Invariant">
							<p>
								If a theme needs to touch a <em>component rule</em>, that&apos;s a leak in the
								component&apos;s CSS API — fix it in the component, not the theme.
							</p>
						</DocsNote>
						<p>
							<strong>Dark theme</strong> (<code>src/scss/01-foundations/_theme-dark.scss</code>) ships and
							is opt-in, <strong>manual only</strong>:
						</p>
						<ul>
							<li>
								Add <code>.theme-dark</code> to <code>&lt;body&gt;</code> (the screen&apos;s outermost
								element) to switch to dark; remove it for the default light palette.
							</li>
							<li>
								There is <strong>no OS auto-detection</strong> — an app that wants to follow the OS reads{' '}
								<code>prefers-color-scheme</code> itself and toggles the class.
							</li>
						</ul>
						<p>
							It re-maps the dark <code>--token-*</code> <strong>and</strong> re-declares the{' '}
							<code>--color-*</code> roles (needed because <code>--color-*</code> is substituted at{' '}
							<code>:root</code>, so a token override on <code>&lt;body&gt;</code> alone wouldn&apos;t
							reach components reading <code>--color-*</code>).
						</p>
						<DocsNote title="Try it" variant="alt">
							<p>
								Use the <strong>Appearance</strong> toolbar control above to switch Light / Dark across any
								story.
							</p>
						</DocsNote>

						<h2 id="authoring">Quick reference</h2>
						<p>Walk <strong>down</strong> the chain only as far as you need:</p>
						<ol>
							<li>
								Reading a <strong>themeable</strong> colour/radius? → use the theme role:{' '}
								<code>var(--color-*)</code>, <code>var(--border-radius-*)</code>.
							</li>
							<li>
								Reading a <strong>structural</strong> size/space/elevation/border? → use{' '}
								<code>$token-*</code> directly.
							</li>
							<li>
								Exposing it on a component? → declare <code>--osui-{'{component}-{prop}'}</code> defaulting
								to (1) or (2), and read the <code>--osui-*</code> var in the property.
							</li>
						</ol>
						<DocsNote title="Red flags" variant="error">
							<p>
								Hardcoded hex/px where a <code>$token-*</code> exists; reintroducing retired vars; a
								property reading <code>$token-*</code> / <code>--color-*</code> directly instead of via
								its <code>--osui-*</code>; a theme touching a component rule.
							</p>
						</DocsNote>
					</article>
					<DocsToc items={TOC_ITEMS} />
				</div>
			</div>
		</div>
	);
}
