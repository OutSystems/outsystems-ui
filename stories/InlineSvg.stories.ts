import type { Meta, StoryObj } from '@storybook/html-vite';
import { extendedClassArgType } from './_helpers/lowcode';
import { cfg, osuiRoot, Patterns, renderPattern, uid } from './_helpers/osui';

const SAMPLE_SVG =
	'<svg viewBox="0 0 24 24" width="64" height="64"><path fill="currentColor" d="M12 2l2.9 6.3 6.9.7-5.2 4.6 1.5 6.8L12 17.8 5.9 20.4l1.5-6.8L2.2 9l6.9-.7z"/></svg>';

const meta: Meta<{ svgCode: string; extendedClass: string }> = {
	title: 'Patterns/Utilities/InlineSvg',
	argTypes: { svgCode: { control: 'text', name: 'SVGCode' }, extendedClass: extendedClassArgType },
	args: { svgCode: SAMPLE_SVG, extendedClass: '' },
};
export default meta;

type Story = StoryObj<{ svgCode: string; extendedClass: string }>;

export const Default: Story = {
	render: (args) => {
		const id = uid('inline-svg');
		const template = `<div ${osuiRoot(id)} class="osui-inline-svg" style="color:#f5a623;"></div>`;
		return renderPattern(template, (_root, register) => {
			const P = Patterns();
			P.InlineSvgAPI.Create(id, cfg({ SVGCode: args.svgCode, ExtendedClass: args.extendedClass }));
			P.InlineSvgAPI.Initialize(id);
			register(() => P.InlineSvgAPI.Dispose?.(id));
		});
	},
};
