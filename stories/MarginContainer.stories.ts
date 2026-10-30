import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic } from './_helpers/osui';
import { cls, extendedClassArgType } from './_helpers/lowcode';

/**
 * Margin Container — CSS-only utility wrapping content in the standard screen
 * padding (src/scss/04-patterns/06-utilities/_margin-container.scss —
 * `$token-scale-600`, denser on native phone/tablet layouts).
 */

interface MarginContainerArgs {
	extendedClass: string;
}

const meta: Meta<MarginContainerArgs> = {
	title: 'Patterns/Utilities/MarginContainer',
	argTypes: { extendedClass: extendedClassArgType },
	args: { extendedClass: '' },
};
export default meta;

type Story = StoryObj<MarginContainerArgs>;

/** Dashed frame standing in for the screen edge, with a Margin Container inside. */
function marginContainerMarkup(content: string, extendedClass = ''): string {
	return `
		<div style="max-width: 420px; border: 1px dashed var(--color-border); border-radius: var(--border-radius-soft);">
			<div class="${cls('margin-container', extendedClass)}">${content}</div>
		</div>`;
}

export const Playground: Story = {
	render: ({ extendedClass }) =>
		renderStatic(
			marginContainerMarkup(
				'<div class="card" style="padding: 16px;">Content inside a Margin Container keeps the standard screen padding (dashed line = container edge).</div>',
				extendedClass
			)
		),
};

export const BasicUsage: Story = {
	tags: ['docs-example'],
	name: 'Basic usage',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				story: 'A Card dropped into the MarginContainer placeholder — the padding between the dashed frame and the card is the theme screen margin (<code>$token-scale-600</code>).',
			},
		},
	},
	render: () =>
		renderStatic(
			marginContainerMarkup(`
				<div class="card" style="padding: 16px;">
					<h5 style="margin: 0 0 4px;">Quarterly summary</h5>
					<p style="margin: 0; color: var(--color-text-subtle);">Revenue is up 12% against the previous quarter, driven by renewals.</p>
				</div>`)
		),
};

export const InsideLayout: Story = {
	tags: ['docs-example'],
	name: 'Inside a layout',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				story: 'A typical screen: an edge-to-edge header strip and a full-bleed image stay outside, while the text content sits in a Margin Container so it never touches the screen edge.',
			},
		},
	},
	render: () =>
		renderStatic(`
			<div style="max-width: 420px; border: 1px dashed var(--color-border); border-radius: var(--border-radius-soft); overflow: hidden;">
				<div style="background: var(--color-primary); color: var(--color-neutral-0); padding: 12px 16px; font-weight: 600;">Trip details</div>
				<div style="height: 120px; background: linear-gradient(135deg, var(--color-primary-lighter, #9fc3ff), var(--color-primary-lightest, #e3eeff));" aria-hidden="true"></div>
				<div class="margin-container">
					<h5 style="margin: 0 0 4px;">Lisbon to Porto</h5>
					<p style="margin: 0 0 12px; color: var(--color-text-subtle);">Friday, 14 Nov · 08:30 – 11:15 · Alfa Pendular</p>
					<button class="btn btn-primary" type="button">Check in</button>
				</div>
			</div>`),
};
