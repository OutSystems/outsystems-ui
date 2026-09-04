import React from 'react';
import { Colors } from '../token-data/colors';
import {
	ColorBgList,
	ColorCard,
	ColorIconList,
	ColorPalette,
	ColorScaleLabels,
	ColorTextList,
	ColorBorderTable,
} from './ColorPalette';
import { ColorsThemeProvider } from './colors-theme';
import { FdDivider, FdSection, FoundationsShell } from './FoundationsShell';
import { TokenThemeToggle } from './TokenThemeToggle';

export function ColorsPage() {
	const [tokenDark, setTokenDark] = React.useState(false);

	return (
		<ColorsThemeProvider dark={tokenDark}>
			<FoundationsShell
				eyebrow="Design system · Colours"
				title="Colours"
				lede="A comprehensive overview of the design tokens for our colour system — organised into primitives and semantic roles for consistent application across all interfaces."
			>
				<div className="fd-colors-toolbar">
					<p>
						Preview how tokens resolve in the shipped light and dark themes. Swatches and values read from{' '}
						<code>--token-*</code> via the compiled bundle — the same <code>.theme-dark</code> scope components
						use.
					</p>
					<TokenThemeToggle dark={tokenDark} onChange={setTokenDark} />
				</div>

				<div className={`fd-colors-zone${tokenDark ? ' theme-dark' : ''}`}>
					<FdSection title="Semantic colours">
						<p>
							Semantic colour tokens are applied based on their intended meaning. The semantic palette includes
							Primary, Success, Warning, Info, and Danger.
						</p>
						<ColorCard colorsData={Colors.semanticsbase as never} />
						<h3>Semantic colour scale</h3>
						<ColorScaleLabels />
						<ColorPalette colorsData={Colors.semantics as never} />
					</FdSection>

					<FdDivider />

					<FdSection title="Background colours">
						<p>
							Background tokens establish visual hierarchy and define distinct content areas — from neutral surfaces
							to interactive states.
						</p>
						<ColorBgList colorsData={Colors as never} />
					</FdSection>

					<FdDivider />

					<FdSection title="Text colours">
						<p>Text tokens ensure readability and visual hierarchy for all typographic elements.</p>
						<ColorTextList colorsData={Colors.text as never} />
					</FdSection>

					<FdDivider />

					<FdSection title="Icon colours">
						<p>Icon tokens define colours for iconography across default, subtle, and semantic states.</p>
						<ColorIconList colorsData={Colors.icon as never} />
					</FdSection>

					<FdDivider />

					<FdSection title="Border colours">
						<p>Border colour tokens for dividers, outlines, and component borders.</p>
						<ColorBorderTable rows={Colors.border as never} />
					</FdSection>

					<FdDivider />

					<FdSection title="Primitive colours">
						<p>
							Raw colour ramps that semantic tokens resolve from. Use for reference — prefer semantic tokens in
							app code.
						</p>
						<ColorScaleLabels />
						<ColorPalette colorsData={Colors.primitives as never} />
					</FdSection>
				</div>
			</FoundationsShell>
		</ColorsThemeProvider>
	);
}
