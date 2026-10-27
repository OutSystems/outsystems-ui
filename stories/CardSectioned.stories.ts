import type { Meta, StoryObj } from '@storybook/html-vite';
import {
	articleSectionedCardMarkup,
	profileSectionedCardMarkup,
	propertySectionedCardMarkup,
	sectionedCardMarkup,
} from './_helpers/card-markup';
import { renderStatic } from './_helpers/osui';
import { extendedClassArgType, usePaddingArgType } from './_helpers/lowcode';

/**
 * Card Sectioned — image, title, body, and footer slots. Styles in `_card-sectioned.scss`.
 */

const meta: Meta = {
	title: 'Patterns/Content/Card Sectioned',
	tags: ['!ui-pending', 'ui-reviewed'],
	parameters: {
		docs: {
			source: { disable: true },
			canvas: { sourceState: 'none' },
		},
	},
};
export default meta;

type Story = StoryObj;

export const BasicUsage: Story = {
	name: 'Basic usage',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				story:
					'Property listing with UsePadding True and ImagePadding False — content uses the pattern padding, image stays full-bleed.',
			},
		},
	},
	render: () =>
		renderStatic(
			propertySectionedCardMarkup({
				usePadding: true,
				isVertical: true,
				imagePadding: false,
			}),
		),
};

export const WithPadding: Story = {
	name: 'With padding',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				story:
					'Profile card with UsePadding and ImagePadding True — inset photo, name, bio, stats, and an OS UI Secondary button.',
			},
		},
	},
	render: () => renderStatic(profileSectionedCardMarkup()),
};

export const Horizontal: Story = {
	name: 'Horizontal',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				story:
					'Horizontal Card Sectioned with UsePadding True and ImagePadding False — full-bleed image beside title, separator, and author row.',
			},
		},
	},
	render: () => renderStatic(articleSectionedCardMarkup()),
};

type SectionedArgs = { usePadding: boolean; isVertical: boolean; imagePadding: boolean; extendedClass: string };

export const Playground: StoryObj<SectionedArgs> = {
	name: 'Playground',
	args: { usePadding: true, isVertical: true, imagePadding: true, extendedClass: '' },
	argTypes: {
		usePadding: usePaddingArgType,
		isVertical: { name: 'IsVertical', control: 'boolean', description: 'Set the orientation.' },
		imagePadding: {
			name: 'ImagePadding',
			control: 'boolean',
			description: 'When true, image has 24px of padding. Has no effect while UsePadding is false.',
		},
		extendedClass: extendedClassArgType,
	},
	render: ({ usePadding, isVertical, imagePadding, extendedClass }) =>
		renderStatic(sectionedCardMarkup({ usePadding, isVertical, imagePadding, extendedClass })),
};
