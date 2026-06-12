import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic } from './_helpers/osui';
import { cls, extendedClassArgType } from './_helpers/lowcode';

/**
 * Lightbox Image — thumbnail markup only. At runtime the block opens the image
 * with PhotoSwipe (`.pswp` overrides in
 * src/scss/04-patterns/03-interaction/_lightbox-image.scss); the vendor lib is
 * not bundled in this library nor loaded in Storybook, so the story shows the
 * shipped thumbnail structure: `.lightbox-item > a > img`.
 */

interface LightboxImageArgs {
	thumbnailWidth: number;
	extendedClass: string;
}

const IMG = 'https://picsum.photos/seed/osui-lightbox/960/640';

const meta: Meta<LightboxImageArgs> = {
	title: 'Patterns/Interaction/LightboxImage',
	argTypes: {
		thumbnailWidth: { name: 'ThumbnailWidth (px)', control: { type: 'number', min: 80, max: 640 } },
		extendedClass: extendedClassArgType,
	},
	args: { thumbnailWidth: 240, extendedClass: '' },
};
export default meta;

type Story = StoryObj<LightboxImageArgs>;

export const Default: Story = {
	render: ({ thumbnailWidth, extendedClass }) =>
		renderStatic(`
			<div class="${cls('lightbox-item', extendedClass)}" style="width: ${thumbnailWidth}px;">
				<a href="${IMG}" target="_blank" rel="noreferrer" aria-label="Open image">
					<img src="${IMG}" alt="Lightbox thumbnail" style="width: 100%; border-radius: var(--border-radius-soft);" />
				</a>
			</div>`),
};
