import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic } from '../_helpers/osui';

/**
 * Icon — the OutSystems platform **widget**, transcribed to static markup
 * (see Widgets/Button for why the Widgets group is static; ADR-0009).
 *
 * Captured from @outsystems/runtime-widgets-js@6.25.4 under React 17:
 *   `i[data-icon][aria-hidden=true].fa.fa-<name>`
 *
 * ─── Why the `iconLibrary` toolbar toggle does not change these ──────────────
 * It cannot, and it never could — this is a property of the widget, not of the
 * transcription. The toggle (`.storybook/preview.ts`) adds
 * `.iconLibrary-phosphor` to `<html>`, which rewrites the `--osui-icon-*` custom
 * properties in `src/scss/01-foundations/_icon-library-odc.scss`. Those variables
 * are read only by **OUI's own** pseudo-element icons — the dropdown caret, the
 * search glyph, the checkbox check, flatpickr's month arrows and so on. The
 * compiled ODC bundle contains **no `.fa-*` selector at all**, so an `<i class="fa
 * fa-star">` takes its glyph straight from the FontAwesome stylesheet and is
 * untouched by the toggle. The platform widget hardcodes that `fa fa-` prefix, so
 * the live widget behaved identically here before this story became static.
 *
 * ODC's `OutSystems.OSUI.Utils.IconLibrary.ApplyIconLibraryClass` does not change
 * this either: it only stamps the same `iconLibrary-<name>` class on `<html>`.
 *
 * So instead of pretending the toggle applies, the story shows both libraries
 * explicitly: the row the widget actually emits, and the Phosphor-class row an
 * app on the Phosphor library renders. Flipping the toolbar is expected to leave
 * both rows unchanged — that is the correct result, and having both visible is
 * what makes it verifiable rather than merely surprising.
 *
 * Also worth knowing: `iconSize` produced **no DOM difference** at capture time —
 * sizes 1, 2 and 3 all emitted the same `class="fa fa-<name>"`, no size class and
 * no inline `font-size`. Adding `fa-2x`-style classes would be inventing markup
 * the widget does not emit, so the sizes are not represented. If a future package
 * version starts emitting a size class, re-capture and extend this story.
 */
const meta: Meta = { title: 'Widgets/Icon' };
export default meta;
type Story = StoryObj;

/** Exactly what the widget emits, for the four icons the original story used. */
const faIcon = (name: string) => `<i class="fa fa-${name}" aria-hidden="true" data-icon=""></i>`;
/** The same glyphs as an app on the Phosphor library would render them. */
const phIcon = (name: string) => `<i class="ph ph-${name}" aria-hidden="true" data-icon=""></i>`;

const row = (label: string, icons: string) => `
	<div style="display:flex;gap:20px;align-items:center;">
		<code style="min-width:13ch;font:12px/1.4 monospace;opacity:.7;">${label}</code>
		${icons}
	</div>`;

export const Default: Story = {
	render: () =>
		renderStatic(`
			<div style="display:flex;flex-direction:column;gap:16px;">
				${row('fa fa-*', ['star', 'bell', 'check', 'cog'].map(faIcon).join('\n\t\t\t\t'))}
				${row('ph ph-*', ['star', 'bell', 'check', 'gear'].map(phIcon).join('\n\t\t\t\t'))}
			</div>`),
};
