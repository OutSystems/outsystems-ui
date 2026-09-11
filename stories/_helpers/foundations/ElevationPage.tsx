import React from 'react';
import { Elevation, ZIndex } from '../token-data/elevation';
import { TokenTable } from './TokenTable';
import { FdDivider, FdSection, FoundationsShell } from './FoundationsShell';

const ELEVATION_LEVELS = ['1', '2', '3', '4'] as const;

function elevationLevel(token: string): string {
	return token.split('.')[1] ?? '1';
}

function ElevationShadowBox({ shadow, className = '' }: { shadow: string; className?: string }) {
	return (
		<div
			className={`fd-elevation-box${className ? ` ${className}` : ''}`}
			style={{ boxShadow: shadow } as React.CSSProperties}
			aria-hidden="true"
		/>
	);
}

export function ElevationPage() {
	const elevationByLevel = new Map(Elevation.map((row) => [elevationLevel(row.token), row]));

	return (
		<FoundationsShell
			eyebrow="Design system · Elevation"
			title="Elevation"
			lede="Shadows establish visual hierarchy, depth, and focus. Elevation and z-index tokens provide a consistent system across components — from subtle card lift to modal overlays."
		>
			<div className="fd-elevation-container">
				{ELEVATION_LEVELS.map((level) => {
					const row = elevationByLevel.get(level);
					return (
						<div
							key={level}
							className="fd-elevation-hero-box"
							style={{ boxShadow: row?.value ?? `var(--token-elevation-${level})` } as React.CSSProperties}
						>
							{level}
						</div>
					);
				})}
			</div>

			<FdSection title="Elevation tokens">
				<TokenTable
					className="fd-table--elevation"
					rows={Elevation as never}
					previewInToken
					preview={(row) => <ElevationShadowBox shadow={row.value} />}
				/>
			</FdSection>

			<FdDivider />

			<FdSection title="Z-index tokens">
				<p>
					Z-index tokens control stacking order — from background elements to high-priority overlays.
				</p>
				<TokenTable rows={ZIndex as never} />
			</FdSection>
		</FoundationsShell>
	);
}
