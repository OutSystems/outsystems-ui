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
 * URL without a file extension (ROU-13023). The pattern must omit the `<source type>`
 * attribute so the browser fetches the resource and detects the media type from the response.
 * The public sample from `url` is fetched and exposed through a `blob:` URL, which has no file
 * extension, so the story depends on no private endpoint (ADR-0009). Snapshotting is disabled:
 * a streaming video frame is not a stable visual baseline.
 */
export const UrlWithoutExtension: Story = {
	render: (args) => {
		const id = uid('video');
		const template = `<video ${osuiRoot(id)} class="osui-video" style="max-width:480px;width:100%;"></video>`;
		return renderPattern(template, (_root, register) => {
			const P = Patterns();
			let blobUrl = '';
			let disposed = false;

			register(() => {
				disposed = true;
				P.VideoAPI.Dispose?.(id);
				if (blobUrl) URL.revokeObjectURL(blobUrl);
			});

			(async () => {
				const response = await fetch(args.url);
				const blob = await response.blob();
				if (disposed) return;
				blobUrl = URL.createObjectURL(blob);
				P.VideoAPI.Create(
					id,
					cfg({
						URL: blobUrl,
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
			})();
		});
	},
	parameters: { chromatic: { disableSnapshot: true } },
};

/**
 * Same scenario against a real HTTP endpoint (ROU-13023): a server that streams a video from a URL
 * with no file extension, so the browser has to detect the media type from the response. That is the
 * customer case, and the one thing the `blob:` story above cannot reproduce.
 *
 * No URL ships with this story. The endpoints that behave this way live on internal OutSystems
 * environments, this repository is public, and anything written here would be inlined into every
 * published Storybook build. Paste the endpoint of the environment under test into the **URL**
 * control instead: it is read at render time, so nothing is committed and nothing is published.
 * Snapshot disabled, there is no stable baseline.
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
