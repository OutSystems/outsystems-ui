import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderPattern } from '../_helpers/osui';

/**
 * Link — the OutSystems platform **widget**, transcribed to static markup
 * (see Widgets/Button for why the Widgets group is static; ADR-0009).
 *
 * Captured from @outsystems/runtime-widgets-js@6.25.4 under React 17:
 *   `a[data-link][aria-disabled][href]`
 *
 * The live widget routes through react-router (the old story had to wrap it in a
 * `MemoryRouter` for that reason). Routing has no DOM footprint beyond `href`, so
 * transcribing it also drops this story's last non-platform dependency —
 * react-router-dom is no longer needed by the Storybook at all.
 *
 * A disabled Link emits `aria-disabled="true"` and drops `href`.
 *
 * The click handler below only calls `preventDefault()`. `href` is real markup and
 * is kept, but a bare `<a href="/somewhere">` inside the Storybook iframe would
 * navigate the canvas to a 404 — the live widget never did that, because
 * react-router intercepted the click (the old story wrapped it in a
 * `MemoryRouter` for exactly this reason). Swallowing the navigation is the
 * static equivalent of that interception, and it changes no attribute.
 */
const meta: Meta = { title: 'Widgets/Link' };
export default meta;
type Story = StoryObj;

export const Default: Story = {
	render: () =>
		renderPattern(`<a data-link="" aria-disabled="false" class="" href="/somewhere">Go to page</a>`, (root) => {
			root.querySelector<HTMLElement>('[data-link]')?.addEventListener('click', (e) => e.preventDefault());
		}),
};
