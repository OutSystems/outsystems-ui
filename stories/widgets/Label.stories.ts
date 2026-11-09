import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic } from '../_helpers/osui';

/**
 * Label — the OutSystems platform **widget**, transcribed to static markup
 * (see Widgets/Button for why the Widgets group is static; ADR-0009).
 *
 * Captured from @outsystems/runtime-widgets-js@6.25.4 under React 17:
 *   `label[data-label][for=<target input id>]`
 *
 * `mandatory: true` appends ` mandatory` to the className — hence the leading
 * space in `class=" mandatory"`, which is emitted verbatim and reproduced. The
 * asterisk is drawn by CSS on `.mandatory`, not by markup.
 *
 * `for=""` is reproduced as emitted: the platform resolves it from the target
 * widget's generated id, which the React capture harness stubbed out. Nothing is
 * gained by inventing an id for a label that has no input beside it — the story
 * exists to snapshot the `.mandatory` treatment, and Widgets/Form covers a label
 * genuinely bound to an input.
 */
const meta: Meta = { title: 'Widgets/Label' };
export default meta;
type Story = StoryObj;

export const Default: Story = {
	render: () => renderStatic(`<label data-label="" class=" mandatory" for="">Email address</label>`),
};
