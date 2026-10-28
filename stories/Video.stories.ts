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
		url: { control: 'text', name: 'URL', description: 'Video source: a URL or a base64 data URL.' },
		controls: { control: 'boolean', name: 'Controls', description: 'Shows the native player controls.' },
		muted: { control: 'boolean', name: 'OptionalConfigs.Muted', description: 'Starts muted.' },
		loop: {
			control: 'boolean',
			name: 'OptionalConfigs.Loop',
			description: 'Restarts playback when the video ends.',
		},
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

export const Playground: Story = {
	render: renderVideo,
};

const DEMO_VIDEO_URL = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';
const DEMO_POSTER_URL =
	'https://fastly.picsum.photos/id/58/1280/853.jpg?hmac=YO3QnOm9TpyM5DqsJjoM4CHg8oIq4cMWLpd9ALoP908';

/** The full runtime config with the block defaults (Controls True, everything else off/empty). */
const VIDEO_DEFAULTS = {
	URL: DEMO_VIDEO_URL,
	Controls: true,
	Muted: false,
	Loop: false,
	Autoplay: false,
	Width: '',
	Height: '',
	PosterURL: '',
	Captions: '[]',
};

/**
 * Docs-page variant: same Create/Initialize/Dispose sequence as the Playground, with config
 * overrides instead of args, and a status line fed by the `StateChanged` event.
 */
function renderVideoDoc(overrides: Record<string, unknown>, sizeStyle = 'max-width:480px;width:100%;'): HTMLElement {
	const id = uid('video');
	const template = `
		<div style="display:grid;gap:8px;justify-items:start;">
			<video ${osuiRoot(id)} class="osui-video" style="${sizeStyle}"></video>
			<span data-state style="font-size:13px;color:var(--color-neutral-8, #445);" aria-live="polite">State: Unstarted</span>
		</div>`;
	return renderPattern(template, (root, register) => {
		const P = Patterns();
		const state = root.querySelector('[data-state]')!;
		P.VideoAPI.Create(id, cfg({ ...VIDEO_DEFAULTS, ...overrides }));
		// The platform callback receives (VideoId, VideoState); the state is always the last argument.
		P.VideoAPI.RegisterCallback?.(id, 'StateChanged', (...args: unknown[]) => {
			state.textContent = `State: ${String(args[args.length - 1])}`;
		});
		P.VideoAPI.Initialize(id);
		register(() => P.VideoAPI.Dispose?.(id));
	});
}

export const BasicUsage: Story = {
	tags: ['docs-example'],
	name: 'Basic usage',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				story: 'Only <code>URL</code> is set; <code>Controls</code> keeps its default of True so the browser renders its native player. The line under the player follows the <code>StateChanged</code> event (Unstarted, Playing, Paused, Ended).',
			},
		},
	},
	render: () => renderVideoDoc({}),
};

export const PosterImage: Story = {
	tags: ['docs-example'],
	name: 'Poster image',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				story: '<code>OptionalConfigs.PosterURL</code> shows a still image until playback starts — useful when the first frame of the video is dark or blank.',
			},
		},
	},
	render: () => renderVideoDoc({ PosterURL: DEMO_POSTER_URL }),
};

export const AutoplayLoop: Story = {
	tags: ['docs-example'],
	name: 'Autoplay and loop',
	parameters: {
		layout: 'padded',
		chromatic: { disableSnapshot: true },
		docs: {
			description: {
				story: '<code>OptionalConfigs.Autoplay</code>, <code>OptionalConfigs.Muted</code> and <code>OptionalConfigs.Loop</code> set to True give a silent background-style clip that starts on its own and repeats. Browsers refuse to autoplay with sound, so Muted must accompany Autoplay.',
			},
		},
	},
	render: () => renderVideoDoc({ Autoplay: true, Muted: true, Loop: true }),
};

export const FixedSize: Story = {
	tags: ['docs-example'],
	name: 'Fixed size',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				story: '<code>Width</code> and <code>Height</code> accept pixels or percentages and are written to the <code>&lt;video&gt;</code> element; here the player is pinned to 320 × 180.',
			},
		},
	},
	render: () => renderVideoDoc({ Width: '320', Height: '180' }, ''),
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
 *
 * The same control also takes a base64 data URL (`data:video/mp4;base64,...`, ROU-11717): the pattern
 * omits the `<source type>` and the browser plays the embedded data. Storybook does not persist such a
 * value in the story link (only `[a-zA-Z0-9 _-]` survive in URL args), so paste it into the control.
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
