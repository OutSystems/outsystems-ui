import { cls } from './lowcode';

export const FLOATING_POSITIONS = [
	'top-left',
	'top',
	'top-right',
	'left',
	'center',
	'right',
	'bottom-left',
	'bottom',
	'bottom-right',
] as const;

export type FloatingPosition = (typeof FLOATING_POSITIONS)[number];

function mockScreen(): string {
	return `<div class="floating-content-demo-screen">
		<p class="floating-content-demo-screen__hint">Page content scrolls behind the floating block.</p>
		<div class="floating-content-demo-skeleton" aria-hidden="true"></div>
		<div class="floating-content-demo-skeleton" aria-hidden="true"></div>
		<div class="floating-content-demo-skeleton" aria-hidden="true"></div>
	</div>`;
}

function floatingPanel(fullWidth = false): string {
	return `<div class="${cls('floating-content-demo-panel', fullWidth && 'floating-content-demo-panel--full')}">Floating content</div>`;
}

export function floatingContentMarkup(
	position: FloatingPosition,
	{
		useMargin = true,
		fullWidth = false,
		fullHeight = false,
		extendedClass = '',
	}: {
		useMargin?: boolean;
		fullWidth?: boolean;
		fullHeight?: boolean;
		extendedClass?: string;
	} = {}
): string {
	return `<div class="floating-content-demo-wrap">
		${mockScreen()}
		<div class="${cls(
			'floating-content',
			`floating-content-${position}`,
			useMargin && 'floating-content-margin',
			fullWidth && 'floating-content-full-width',
			fullHeight && 'floating-content-full-height',
			extendedClass
		)}">
			${floatingPanel(fullWidth)}
		</div>
	</div>`;
}
