import type { Meta, StoryObj } from '@storybook/html-vite';
import { cls, styleClassesArgType } from '../_helpers/lowcode';
import { renderStatic } from '../_helpers/osui';

/**
 * Image — the OutSystems platform **widget**, transcribed to static markup
 * (see Widgets/Button for why the Widgets group is static; ADR-0009).
 *
 * Captured from @outsystems/runtime-widgets-js@6.25.4 under React 17 with
 * `type: 1` (External):
 *   `img[data-image][src][alt=""]`
 *
 * The widget's three `type` values (Static 0, External 1, Binary 2) only change
 * how `src` is resolved — Binary builds a data URI from a runtime BinaryData
 * object — so they share this one DOM shape.
 */
type WidgetArgs = { styleClasses: string };

const meta: Meta<WidgetArgs> = {
	title: 'Widgets/Image',
	args: { styleClasses: '' },
	argTypes: { styleClasses: styleClassesArgType },
};
export default meta;
type Story = StoryObj<WidgetArgs>;

export const Default: Story = {
	render: ({ styleClasses }) =>
		renderStatic(
			`<img data-image="" class="${cls(styleClasses)}" src="https://outsystemsui.outsystems.com/OutSystemsUIWebsite/img/logo.png" alt="">`
		),
};
