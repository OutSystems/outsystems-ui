/**
 * Phone frame for the phone-first patterns (Action Sheet, Bottom Sheet, Bottom Bar,
 * Floating Actions). Same presentation as the MobileUI Storybook: the pattern is shown
 * inside a phone-sized app screen centred in the canvas, not loose in a desktop-wide box.
 *
 * - The frame is a transformed box (`translateZ(0)`), so it is the containing block of the
 *   `position: fixed` sheets, overlays and FAB — they anchor to the phone, not the viewport.
 * - It renders the native layout skeleton (`.layout.layout-native > .main` with the header,
 *   `.content > .main-content` and the `.content-bottom > .footer` grid rows), so the
 *   patterns meet the same ancestors — and the same `--bottom-bar-size` footer — as in a
 *   mobile app.
 * - The body keeps its `desktop` class. OutSystems UI's `.phone` rules also resize h2–h5,
 *   which would restyle a docs page around the canvas, so the few phone-only rules these
 *   patterns need are restored inside the frame by `.storybook/phone-frame.scss`.
 */

export const PHONE_FRAME_CLASS = 'osui-phone-frame';

/** Default screen size — a 390pt-wide phone, cropped to a height that fits a docs canvas. */
export const PHONE_WIDTH = 390;
export const PHONE_HEIGHT = 700;

export interface PhoneFrameOptions {
	/** Title in the native header. `''` renders the screen without a header. */
	title?: string;
	/** Markup for the MainContent placeholder; defaults to {@link phoneList} of sample rows. */
	content?: string;
	/** Markup for the layout's Bottom placeholder (`.footer`, `--bottom-bar-size` tall), e.g. a Bottom Bar. */
	footer?: string;
	/** Off-canvas markup rendered inside the frame after the layout: sheets, overlays, the FAB stack. */
	overlay?: string;
	/** Frame width in px; defaults to {@link PHONE_WIDTH}. */
	width?: number;
	/** Frame height in px; defaults to {@link PHONE_HEIGHT}. */
	height?: number;
}

const SAMPLE_ROWS: Array<[title: string, meta: string]> = [
	['Order #4821', 'Shipped · arrives Thursday'],
	['Order #4817', 'Processing'],
	['Order #4790', 'Delivered 12 March'],
	['Order #4766', 'Delivered 2 March'],
];

/**
 * A `.list` of rows for the MainContent placeholder: a bold title with a muted line under it.
 *
 * @param rows title / meta pairs
 * @returns the list markup
 */
export function phoneList(rows: ReadonlyArray<readonly [title: string, meta: string]> = SAMPLE_ROWS): string {
	return `
		<div class="list">
			${rows
				.map(
					([title, meta]) => `
			<div class="list-item">
				<div>
					<div class="font-semi-bold">${title}</div>
					<div class="font-size-s text-neutral-7">${meta}</div>
				</div>
			</div>`
				)
				.join('')}
		</div>`;
}

/**
 * A native-layout screen in a phone-sized frame.
 *
 * @param options screen title, placeholders and frame size
 * @returns the frame markup (callers pass it to `renderPattern` / `renderStatic`)
 */
export function phoneFrame(options?: PhoneFrameOptions): string {
	const {
		title = 'Northwind',
		content = phoneList(),
		footer = '',
		overlay = '',
		width = PHONE_WIDTH,
		height = PHONE_HEIGHT,
	} = options ?? {};
	const header = title
		? `
			<div class="header">
				<div class="header-top">
					<div class="header-top-content display-flex align-items-center full-height">
						<div class="header-left"><i class="icon ph ph-list" aria-hidden="true" style="font-size: 24px;"></i></div>
						<h1 class="header-title">${title}</h1>
						<div class="header-right"></div>
					</div>
				</div>
			</div>`
		: '';
	const bottom = footer ? `<div class="content-bottom"><div class="footer">${footer}</div></div>` : '';
	return `
		<div class="${PHONE_FRAME_CLASS}" style="width: ${width}px; height: ${height}px;">
			<div class="layout layout-native">
				<div class="main">
					${header}
					<div class="content">
						<div class="main-content" role="main">${content}</div>
					</div>
					${bottom}
				</div>
			</div>
			${overlay}
		</div>`;
}
