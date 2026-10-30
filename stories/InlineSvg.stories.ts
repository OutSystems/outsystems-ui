import type { Meta, StoryObj } from '@storybook/html-vite';
import { cfg, osuiRoot, Patterns, renderPattern, uid } from './_helpers/osui';
import { labeledBoard } from './_helpers/showcase';

const SAMPLE_SVG =
	'<svg viewBox="0 0 24 24" width="64" height="64"><path fill="currentColor" d="M12 2l2.9 6.3 6.9.7-5.2 4.6 1.5 6.8L12 17.8 5.9 20.4l1.5-6.8L2.2 9l6.9-.7z"/></svg>';

/** Outline icon whose stroke follows `currentColor`, so a text-* utility recolours it. */
const CLOUD_UPLOAD_SVG =
	'<svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M7 18a4.5 4.5 0 0 1-.6-8.96A6 6 0 0 1 18 9.5a4 4 0 0 1-.5 8"/><path d="M12 12v9"/><path d="m8.5 15.5 3.5-3.5 3.5 3.5"/></svg>';

const meta: Meta<{ svgCode: string }> = {
	title: 'Patterns/Utilities/InlineSvg',
	argTypes: {
		svgCode: {
			control: 'text',
			name: 'SVGCode',
			description: 'SVG markup code, that is going to be appended on the HTML.',
		},
	},
	args: { svgCode: SAMPLE_SVG },
};
export default meta;

type Story = StoryObj<{ svgCode: string }>;

/** Create + Initialize one Inline SVG exactly like the Playground does. */
function initInlineSvg(id: string, svgCode: string, register: (dispose: () => void) => void): void {
	const P = Patterns();
	P.InlineSvgAPI.Create(id, cfg({ SVGCode: svgCode }));
	P.InlineSvgAPI.Initialize(id);
	register(() => P.InlineSvgAPI.Dispose?.(id));
}

export const Playground: Story = {
	render: (args) => {
		const id = uid('inline-svg');
		const template = `<div ${osuiRoot(id)} class="osui-inline-svg" style="color:#f5a623;"></div>`;
		return renderPattern(template, (_root, register) => initInlineSvg(id, args.svgCode, register));
	},
};

export const BasicUsage: Story = {
	tags: ['docs-example'],
	name: 'Basic usage',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				story: 'The <code>SVGCode</code> markup is injected inside <code>.osui-inline-svg</code>. Because the path uses <code>fill="currentColor"</code>, the icon takes the surrounding text colour.',
			},
		},
	},
	render: () => {
		const id = uid('inline-svg');
		return renderPattern(`<div ${osuiRoot(id)} class="osui-inline-svg"></div>`, (_root, register) =>
			initInlineSvg(id, SAMPLE_SVG, register)
		);
	},
};

export const ThemedColors: Story = {
	tags: ['docs-example'],
	name: 'Themed with utility classes',
	parameters: {
		layout: 'padded',
		controls: { disable: true },
		docs: {
			description: {
				story: 'The same stroke icon recoloured with <code>text-*</code> utility classes passed through <code>ExtendedClass</code> — the SVG inherits <code>currentColor</code>, which an <code>&lt;img&gt;</code> never could.',
			},
		},
	},
	render: () => {
		const entries = ['text-primary', 'text-success', 'text-error', 'text-neutral-6'].map((extendedClass) => ({
			extendedClass,
			id: uid('inline-svg'),
		}));
		const board = labeledBoard(
			entries.map(({ extendedClass, id }) => ({
				label: extendedClass,
				html: `<div ${osuiRoot(id)} class="osui-inline-svg ${extendedClass}"></div>`,
			})),
			{ direction: 'row', gap: 32, wrap: true }
		);
		return renderPattern(board.outerHTML, (_root, register) => {
			for (const { id } of entries) {
				initInlineSvg(id, CLOUD_UPLOAD_SVG, register);
			}
		});
	},
};
