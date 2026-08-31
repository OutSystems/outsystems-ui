import React from 'react';
import { Gap, Margin, Padding, Spacing } from '../token-data/spacing';
import { FdDivider, FdSection, FoundationsShell } from './FoundationsShell';
import { TokenTable } from './TokenTable';
import { UtilityTable } from './UtilityTable';

/** Largest spacing token — used to scale the preview track (space.9000 = 360px). */
const SPACING_MAX_PX = Math.max(...Spacing.map((row) => parseFloat(row.value)));
/** Up to space.1200 the preview is 1:1; above that, excess is compressed into the remaining track. */
const PREVIEW_ONE_TO_ONE_MAX = 48;
const PREVIEW_TRACK_MAX = 88;

function spacingPreviewGap(value: string): number {
	const px = parseFloat(value);
	if (!px || Number.isNaN(px)) return 0;
	if (px <= PREVIEW_ONE_TO_ONE_MAX) return px;
	const excess = px - PREVIEW_ONE_TO_ONE_MAX;
	const maxExcess = SPACING_MAX_PX - PREVIEW_ONE_TO_ONE_MAX;
	return PREVIEW_ONE_TO_ONE_MAX + (excess / maxExcess) * (PREVIEW_TRACK_MAX - PREVIEW_ONE_TO_ONE_MAX);
}

function SpacingPreview({ value }: { value: string }) {
	const gap = spacingPreviewGap(value);
	return (
		<div className="fd-space-preview" title={value}>
			<span className="fd-space-preview__gap" style={{ width: `${gap}px` }} aria-hidden="true" />
			<span className="fd-space-preview__bar" aria-hidden="true" />
		</div>
	);
}

export function SpacingPage() {
	return (
		<FoundationsShell
			eyebrow="Design system · Spacing"
			title="Spacing"
			lede="Spacing tokens provide a consistent scale for margins, padding, and gaps — creating clear, organised, scannable interfaces."
		>
			<FdSection title="Spacing scale">
				<TokenTable
					className="fd-table--spacing"
					rows={Spacing as never}
					preview={(row) => <SpacingPreview value={row.value} />}
				/>
			</FdSection>

			<FdDivider />

			<FdSection title="Margin utilities">
				<p>
					Margin utility classes apply spacing outside elements. Class names follow the{' '}
					<code>outsystems-design-tokens</code> convention and will ship when utility generation is enabled in
					the build.
				</p>
				<UtilityTable rows={Margin as never} />
			</FdSection>

			<FdDivider />

			<FdSection title="Padding utilities">
				<p>
					Padding utility classes apply spacing inside elements — between content and borders.
				</p>
				<UtilityTable rows={Padding as never} />
			</FdSection>

			<FdDivider />

			<FdSection title="Gap utilities">
				<p>Gap utility classes set flex and grid gap spacing.</p>
				<UtilityTable rows={Gap as never} />
			</FdSection>
		</FoundationsShell>
	);
}
