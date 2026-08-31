import React from 'react';
import { PatternCatalogue } from './PatternCatalogue';

/**
 * Full-page pattern index for Storybook docs — head band + unrestricted catalogue.
 */
export function ComponentLibraryPage() {
	const rootRef = React.useRef<HTMLDivElement>(null);

	return (
		<div ref={rootRef} className="osui-component-library sb-unstyled">
			<header className="cl-head">
				<div className="cl-head-in">
					<span className="cl-eyebrow">Overview · Component Library</span>
					<h1>
						Every pattern,
						<br />
						<em>live and documented.</em>
					</h1>
					<p className="cl-lede">
						Browse the OutSystems UI catalogue by category. Each entry opens a running example with the
						properties you set in ODC Studio.
					</p>
				</div>
			</header>
			<div className="cl-body">
				<PatternCatalogue layout="full" />
			</div>
		</div>
	);
}
