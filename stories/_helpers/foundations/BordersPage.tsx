import React from 'react';
import { Border, BorderRadius, BorderStyle } from '../token-data/borders';
import { TokenTable } from './TokenTable';
import { FdSection, FoundationsShell } from './FoundationsShell';

function BorderPreview({ style }: { style: React.CSSProperties }) {
	return <div className="fd-border-token-preview" style={style} aria-hidden="true" />;
}

export function BordersPage() {
	return (
		<FoundationsShell
			eyebrow="Design system · Borders"
			title="Borders"
			lede="Border width, style, and radius tokens for consistent outlines, dividers, and corner treatment across components."
		>
			<FdSection title="Border size">
				<TokenTable
					className="fd-table--borders"
					rows={Border as never}
					preview={(row) => (
						<BorderPreview style={{ '--fd-border-size': row.value } as React.CSSProperties} />
					)}
				/>
			</FdSection>

			{BorderStyle.length > 0 ? (
				<FdSection title="Border style">
					<TokenTable
						className="fd-table--borders"
						rows={BorderStyle as never}
						preview={(row) => (
							<BorderPreview
								style={{ '--fd-border-style': row.value } as React.CSSProperties}
							/>
						)}
					/>
				</FdSection>
			) : null}

			<FdSection title="Border radius">
				<TokenTable
					className="fd-table--borders"
					rows={BorderRadius as never}
					preview={(row) => (
						<BorderPreview style={{ '--fd-border-radius': row.value } as React.CSSProperties} />
					)}
				/>
			</FdSection>
		</FoundationsShell>
	);
}
