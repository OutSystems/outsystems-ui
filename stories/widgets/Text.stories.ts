import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic } from '../_helpers/osui';

/**
 * Text — the OutSystems platform **widget**, transcribed to static markup
 * (see Widgets/Button for why the Widgets group is static; ADR-0009).
 *
 * Captured from @outsystems/runtime-widgets-js@6.25.4 under React 17:
 *   `span.<style>` containing the text, with no data attribute of its own.
 *
 * The plainest widget in the set: it exists in the Storybook so the base
 * typography the rest of the widgets inherit is snapshotted somewhere.
 */
const meta: Meta = { title: 'Widgets/Text' };
export default meta;
type Story = StoryObj;

export const Default: Story = {
	render: () => renderStatic(`<span class="">Plain platform Text widget output.</span>`),
};
