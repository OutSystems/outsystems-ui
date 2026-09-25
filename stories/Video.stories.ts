import type { Meta, StoryObj } from '@storybook/html-vite';
import { cfg, osuiRoot, Patterns, renderPattern, uid } from './_helpers/osui';

/** Video — the pattern root is a `<video>` element; it appends a `<source>` from URL. */
interface VideoArgs {
	url: string;
	controls: boolean;
	muted: boolean;
	loop: boolean;
}

const meta: Meta<VideoArgs> = {
	title: 'Patterns/Utilities/Video',
	argTypes: {
		url: { control: 'text', name: 'URL' },
		controls: { control: 'boolean', name: 'Controls' },
		muted: { control: 'boolean', name: 'Muted' },
		loop: { control: 'boolean', name: 'Loop' },
	},
	args: {
		url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
		controls: true,
		muted: true,
		loop: false,
	},
};
export default meta;

type Story = StoryObj<VideoArgs>;

/** Builds the pattern from the story args. Shared by every story driven purely by the URL control. */
function renderVideo(args: VideoArgs): HTMLElement {
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
			})
		);
		P.VideoAPI.Initialize(id);
		register(() => P.VideoAPI.Dispose?.(id));
	});
}

export const Default: Story = {
	render: renderVideo,
};

/**
 * URL without a file extension (ROU-13023). The pattern must omit the `<source type>` attribute so
 * that the browser fetches the resource and detects the media type from the response instead of
 * skipping the source unplayed.
 *
 * This Cloudinary demo asset is served from a path that carries no extension, so it reproduces the
 * customer case over real HTTP while staying public: any clone can run it, with no private endpoint
 * involved (ADR-0009). Snapshot disabled, a streaming video frame is not a stable visual baseline.
 */
export const UrlWithoutExtension: Story = {
	args: { url: 'https://res.cloudinary.com/demo/video/upload/glide-over-coastal-beach' },
	render: renderVideo,
	parameters: { chromatic: { disableSnapshot: true } },
};

/**
 * The same scenario against an internal endpoint (ROU-13023). The story above already exercises a
 * real HTTP response, but it comes from a CDN that labels it correctly as `video/mp4`. The endpoint
 * the customer reported labels its response `video/aspx`, so the browser has to fall back on
 * inspecting the container itself. This story is here to try that case against the environment
 * under test.
 *
 * No URL ships with it. Those endpoints live on internal OutSystems environments, this repository is
 * public, and anything written here would be inlined into every published Storybook build. Paste the
 * endpoint into the **URL** control instead: it is read at render time, so nothing is committed and
 * nothing is published. Snapshot disabled, there is no stable baseline.
 */
export const UrlWithoutExtensionLiveEndpoint: Story = {
	args: { url: '' },
	render: (args) => (args.url.trim() === '' ? emptyUrlNote() : renderVideo(args)),
	parameters: { chromatic: { disableSnapshot: true } },
};

/** Rendered while the URL control is empty, so the canvas itself says what the story needs. */
function emptyUrlNote(): HTMLElement {
	const note = document.createElement('p');
	note.style.cssText = 'font:14px/1.5 system-ui,sans-serif;max-width:60ch;';
	note.textContent = 'Paste the URL of an extension-less video endpoint into the URL control to run this story.';
	return note;
}
