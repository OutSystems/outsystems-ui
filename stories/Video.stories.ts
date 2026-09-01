import type { Meta, StoryObj } from '@storybook/html-vite';
import { extendedClassArgType } from './_helpers/lowcode';
import { cfg, osuiRoot, Patterns, renderPattern, uid } from './_helpers/osui';

/** Video — the pattern root is a video element; it appends a source from URL. */
interface VideoArgs {
	url: string;
	controls: boolean;
	muted: boolean;
	loop: boolean;
	extendedClass: string;
}

const meta: Meta<VideoArgs> = {
	title: 'Patterns/Utilities/Video',
	argTypes: {
		url: { control: 'text', name: 'URL' },
		controls: { control: 'boolean', name: 'Controls' },
		muted: { control: 'boolean', name: 'Muted' },
		loop: { control: 'boolean', name: 'Loop' },
		extendedClass: extendedClassArgType,
	},
	args: {
		url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
		controls: true,
		muted: true,
		loop: false,
		extendedClass: '',
	},
};
export default meta;

type Story = StoryObj<VideoArgs>;

export const Default: Story = {
	render: (args) => {
		const id = uid('video');
		const template = `<video ${osuiRoot(id)} class="osui-video" style="max-width:480px;width:100%;"></video>`;
		return renderPattern(template, (_root, register) => {
			const P = Patterns();
			P.VideoAPI.Create(
				id,
				cfg({
					URL: args.url,
					Controls: args.controls,
					Muted: args.muted,
					Loop: args.loop,
					Autoplay: false,
					Width: '',
					Height: '',
					PosterURL: '',
					Captions: '[]',
					ExtendedClass: args.extendedClass,
				})
			);
			P.VideoAPI.Initialize(id);
			register(() => P.VideoAPI.Dispose?.(id));
		});
	},
};
