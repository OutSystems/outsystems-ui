import React from 'react';
import { Transition, TransitionCurve } from '../token-data/transition';
import { TokenTable } from './TokenTable';
import { FdSection, FoundationsShell } from './FoundationsShell';

export function TransitionsPage() {
	return (
		<FoundationsShell
			eyebrow="Design system · Transitions"
			title="Transitions"
			lede="Timing and easing tokens for consistent, purposeful motion across interactive elements."
		>
			<FdSection title="Transition time">
				<TokenTable
					rows={Transition as never}
					preview={(row) => (
						<div className="fd-transition-preview">
							<span
								className="fd-transition-dot"
								style={{ animationDuration: row.value } as React.CSSProperties}
							/>
						</div>
					)}
				/>
			</FdSection>

			<FdSection title="Transition curve">
				<TokenTable
					rows={TransitionCurve as never}
					preview={(row) => (
						<div className="fd-transition-preview">
							<span
								className="fd-transition-dot"
								style={{ animationTimingFunction: row.value.replace(/^\$/, '') } as React.CSSProperties}
							/>
						</div>
					)}
				/>
			</FdSection>
		</FoundationsShell>
	);
}
