import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderPattern, type Register } from './_helpers/osui';
import { cls, extendedClassArgType } from './_helpers/lowcode';

/**
 * Lightbox Image.
 *
 * There is no `LightboxImage` TypeScript pattern — the block is low-code only, and
 * the overlay is rendered by **PhotoSwipe 4.1.0**, the version the OutSystems
 * platform ships. It is a devDependency here purely so these stories can drive the
 * real thing (served at /vendor/photoswipe, loaded in preview-head.html BEFORE the
 * OUI theme so the OUI overrides win — that mirrors the platform's load order).
 *
 * What OUI owns is two slices of CSS:
 *   1. thumbnail + Service Studio preview classes
 *      (src/scss/04-patterns/03-interaction/_lightbox-image.scss) — safe areas on
 *      `.pswp__top-bar`, RTL counter flip, focus ring on the thumbnail link
 *   2. the overlay CHROME ICONS — `.pswp__button` sprites are stripped and replaced
 *      with icon-font glyphs (src/scss/01-foundations/_icon-library-odc.scss:521-552)
 *
 * (2) is what `Overlay chrome` exercises.
 */

/**
 * Fixture images are generated SVG, not fetched.
 *
 * Two reasons, both learned the hard way:
 *   • **Size matters to the chrome.** PhotoSwipe only adds `pswp--zoom-allowed` (the
 *     class that reveals the zoom button, per default-skin.css) when the image is
 *     LARGER than its fit size. And the arrows' translucent square is only visible
 *     where it overlaps image content — over the black backdrop it is invisible by
 *     definition. So the fixture must be big and wide enough to reach the viewport's
 *     left/right edges, or the design's chrome cannot be evaluated at all.
 *   • **No network.** Remote images made Chromatic and headless runs non-deterministic.
 */
// Wider than 16:9 on purpose. PhotoSwipeUI_Default reserves `barsSize` (44px top and
// an auto bottom) out of the fit area, so a 16:9 image in a 16:9 viewport still ends up
// letterboxed left/right — which parks the arrows over the backdrop instead of the image
// and hides their square. ~2.1:1 fills the width at common viewport sizes, matching the
// design frame (black bars above/below, image edge to edge).
const W = 2560;
const H = 1200;
const COUNT = 4;

/** A wide, deterministic photo stand-in. Mid-tone so the 25%-black arrow square reads. */
function photo(i: number): string {
	const hue = 190 + i * 34;
	const svg =
		`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">` +
		`<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">` +
		`<stop offset="0" stop-color="hsl(${hue},38%,72%)"/>` +
		`<stop offset="1" stop-color="hsl(${hue + 25},45%,38%)"/>` +
		`</linearGradient></defs>` +
		`<rect width="${W}" height="${H}" fill="url(#g)"/>` +
		`<text x="50%" y="52%" text-anchor="middle" font-family="sans-serif" font-size="200"` +
		` fill="rgba(255,255,255,0.85)">${i + 1}</text></svg>`;
	return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const IMAGES = Array.from({ length: COUNT }, (_, i) => photo(i));

/** PhotoSwipe v4 requires this exact skeleton to be present in the DOM before init. */
const PSWP_TEMPLATE = `
	<div class="pswp" tabindex="-1" role="dialog" aria-hidden="true">
		<div class="pswp__bg"></div>
		<div class="pswp__scroll-wrap">
			<div class="pswp__container">
				<div class="pswp__item"></div>
				<div class="pswp__item"></div>
				<div class="pswp__item"></div>
			</div>
			<div class="pswp__ui pswp__ui--hidden">
				<div class="pswp__top-bar">
					<div class="pswp__counter"></div>
					<button class="pswp__button pswp__button--close" title="Close (Esc)"></button>
					<button class="pswp__button pswp__button--share" title="Share"></button>
					<button class="pswp__button pswp__button--fs" title="Toggle fullscreen"></button>
					<button class="pswp__button pswp__button--zoom" title="Zoom in/out"></button>
					<div class="pswp__preloader">
						<div class="pswp__preloader__icn">
							<div class="pswp__preloader__cut">
								<div class="pswp__preloader__donut"></div>
							</div>
						</div>
					</div>
				</div>
				<div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">
					<div class="pswp__share-tooltip"></div>
				</div>
				<button class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)"></button>
				<button class="pswp__button pswp__button--arrow--right" title="Next (arrow right)"></button>
				<div class="pswp__caption"><div class="pswp__caption__center"></div></div>
			</div>
		</div>
	</div>`;

interface PswpChrome {
	counterEl: boolean;
	zoomEl: boolean;
	shareEl: boolean;
	fullscreenEl: boolean;
}

/**
 * Construct + open a gallery on the `.pswp` element inside `root`.
 *
 * `history: false` is not optional — with the default PhotoSwipe writes `#&gid=…` to
 * the URL, which fights Storybook's own routing and leaves the manager stuck on a
 * stale story after the overlay closes.
 */
function openGallery(root: HTMLElement, index: number, chrome: PswpChrome, register: Register, captions = false): void {
	const { PhotoSwipe, PhotoSwipeUI_Default } = window;
	if (!PhotoSwipe || !PhotoSwipeUI_Default) {
		throw new Error('PhotoSwipe globals missing — is /vendor/photoswipe loaded in preview-head.html?');
	}

	const pswpEl = root.querySelector<HTMLElement>('.pswp');
	if (!pswpEl) throw new Error('.pswp template not found in the story root');

	// `title` is what populates `.pswp__caption__center`. The design has no caption, so
	// the chrome story opts out; `Default` keeps it to exercise the caption rule OUI
	// carries for the phone safe area (_lightbox-image.scss).
	const items = IMAGES.map((src, i) => ({ src, w: W, h: H, ...(captions ? { title: `Image ${i + 1}` } : {}) }));
	const gallery = new PhotoSwipe(pswpEl, PhotoSwipeUI_Default, items, {
		index,
		history: false, // see note above
		bgOpacity: 1,
		showHideOpacity: false,
		closeOnScroll: false,
		...chrome,
	});
	gallery.init();
	register(() => gallery.close());
}

const chromeArgTypes = {
	counterEl: {
		name: 'counterEl',
		control: 'boolean',
		description: 'PhotoSwipe UI option — show the "n / total" counter.',
	},
	zoomEl: { name: 'zoomEl', control: 'boolean', description: 'PhotoSwipe UI option — show the zoom button.' },
	shareEl: {
		name: 'shareEl',
		control: 'boolean',
		description: 'PhotoSwipe UI option — show the share button (not in the design).',
	},
	fullscreenEl: {
		name: 'fullscreenEl',
		control: 'boolean',
		description: 'PhotoSwipe UI option — show the fullscreen button (not in the design).',
	},
} as const;

/* ── Thumbnail ──────────────────────────────────────────────────────────────── */

interface ThumbnailArgs extends PswpChrome {
	thumbnailWidth: number;
	extendedClass: string;
}

const meta: Meta = { title: 'Patterns/Interaction/LightboxImage' };
export default meta;

/**
 * The shipped thumbnail markup (`.lightbox-item > a > img`), wired to a real gallery
 * so the whole thumbnail → overlay journey is exercised. Click any image to open.
 */
export const Default: StoryObj<ThumbnailArgs> = {
	argTypes: {
		thumbnailWidth: { name: 'ThumbnailWidth (px)', control: { type: 'number', min: 80, max: 640 } },
		extendedClass: extendedClassArgType,
		...chromeArgTypes,
	},
	args: {
		thumbnailWidth: 220,
		extendedClass: '',
		counterEl: true,
		zoomEl: true,
		shareEl: false,
		fullscreenEl: false,
	},
	render: ({ thumbnailWidth, extendedClass, ...chrome }) =>
		renderPattern(
			`
			<div style="display: flex; flex-wrap: wrap; gap: 12px;">
				${IMAGES.map(
					(src, i) => `
					<div class="${cls('lightbox-item', extendedClass)}" style="width: ${thumbnailWidth}px;">
						<a href="${src}" data-index="${i}" aria-label="Open image ${i + 1}">
							<img src="${src}" alt="Lightbox thumbnail ${i + 1}"
								style="width: 100%; border-radius: var(--border-radius-soft);" />
						</a>
					</div>`
				).join('')}
			</div>
			${PSWP_TEMPLATE}`,
			(root, register) => {
				root.querySelectorAll<HTMLAnchorElement>('.lightbox-item a').forEach((link) => {
					link.addEventListener('click', (ev) => {
						ev.preventDefault();
						openGallery(root, Number(link.dataset.index ?? 0), chrome as PswpChrome, register, true);
					});
				});
			}
		),
};

/* ── Overlay chrome ─────────────────────────────────────────────────────────── */

/**
 * Opens straight onto image 3 of 4, so the overlay chrome the design specifies —
 * counter, zoom, close, prev/next — is on screen without interaction (and therefore
 * captured by Chromatic). Everything here is the real PhotoSwipe skin with the OUI
 * icon overrides on top; nothing is faked.
 */
export const OverlayChrome: StoryObj<PswpChrome> = {
	name: 'Overlay chrome',
	argTypes: chromeArgTypes,
	args: { counterEl: true, zoomEl: true, shareEl: false, fullscreenEl: false },
	render: (chrome) => renderPattern(PSWP_TEMPLATE, (root, register) => openGallery(root, 2, chrome, register)),
};
