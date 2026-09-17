/**
 * Font-readiness gate for the story canvas.
 *
 * Why this exists
 * ---------------
 * Several OUI patterns measure DOM geometry once, at build time, and write the
 * result into a CSS custom property. Tabs is the clearest case: it reads the
 * active header item's `getBoundingClientRect().width` inside a single
 * `requestAnimationFrame` and stores it as `--tabs-indicator-size`
 * (OSFramework/OSUI/Pattern/Tabs/Tabs.ts). The header item is `fit-content`, so
 * that width depends on the *font metrics in effect at the moment of the
 * measurement*.
 *
 * `preview-head.html` pulls Inter from Google Fonts with `display=swap`, and the
 * canvas body resolves to it (`_resets.scss` → `$token-font-family` →
 * `var(--token-font-family, "Inter", …)`). With `swap`, text paints in the
 * fallback face first and re-flows when Inter arrives. Nothing in the framework
 * re-measures on font load — the only re-measure hooks are window resize and
 * orientationchange — so whichever face happened to be active when the rAF ran
 * is baked in for the life of the instance.
 *
 * Chromatic waits for web fonts before it captures, so the *text* always renders
 * in Inter and matches its baseline exactly, while the indicator carries either
 * the fallback width or the Inter width depending on how the network raced. That
 * showed up as a recurring ~4px-wide pixel diff on Tabs stories in PRs that
 * touched nothing related.
 *
 * Awaiting fonts before the first story renders removes the race for every
 * measure-at-build pattern at once, so this is wired as a global `loaders` entry
 * in `.storybook/preview.ts` rather than per-story.
 *
 * Note on `document.fonts.ready`: it resolves once *pending* font loads settle,
 * and a face nothing has used yet is not pending. A stylesheet `<link>` alone
 * does not start the fetch. So we explicitly kick each family with
 * `document.fonts.load()` first, then await `ready`.
 */

/** Families the canvas lays out against, with the weights OUI actually uses. */
const CANVAS_FACES: readonly string[] = [
	// Inter — body font for the whole canvas. Remote (Google Fonts), `display=swap`,
	// i.e. the one that actually races. Weights match the $token-font-weight-* scale
	// that component SCSS references.
	'300 1rem "Inter"',
	'400 1rem "Inter"',
	'500 1rem "Inter"',
	'600 1rem "Inter"',
	'700 1rem "Inter"',
	// Icon fonts — local (/vendor/*), so normally fast, but glyph metrics still
	// contribute to the measured width of any icon-bearing pattern.
	'1rem "FontAwesome"',
	'1rem "Phosphor"',
];

/**
 * Hard ceiling on the wait. A blocked or offline Google Fonts request must not
 * hang the whole Storybook — better to render with fallback metrics than to show
 * nothing. Comfortably above a cold Google Fonts fetch.
 */
const FONT_TIMEOUT_MS = 3000;

let fontsReady: Promise<void> | undefined;

/**
 * Resolve once the canvas fonts are loaded (or the timeout elapses). Memoized:
 * the work happens on the first story and every later story awaits the settled
 * promise, so this costs nothing after startup.
 */
export function waitForCanvasFonts(): Promise<void> {
	if (fontsReady) return fontsReady;

	// Non-browser / older-engine safety: `document.fonts` is optional in the type
	// domain we compile against, and these files are not part of the library build.
	if (typeof document === 'undefined' || !document.fonts) {
		fontsReady = Promise.resolve();
		return fontsReady;
	}

	const load = Promise.all(
		// A family that is not served (or a blocked request) rejects; that must not
		// reject the whole gate, so each kick swallows its own failure.
		CANVAS_FACES.map((face) => document.fonts.load(face).catch(() => undefined))
	).then(() => document.fonts.ready.then(() => undefined));

	const timeout = new Promise<void>((resolve) => {
		setTimeout(resolve, FONT_TIMEOUT_MS);
	});

	fontsReady = Promise.race([load, timeout]);
	return fontsReady;
}
