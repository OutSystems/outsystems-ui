import React from 'react';
import { CopyButton } from './CopyButton';
import {
	Body,
	Display,
	FontFamily,
	Heading,
	LetterSpacing,
	LineHeight,
	Size,
	Weight,
} from '../token-data/typography';
import { FdDivider, FdSection, FoundationsShell } from './FoundationsShell';

type TypoComposite = {
	token: string;
	name: string;
	size: { token: string; value: string };
	line_height: { token: string; value: string };
	weight: { token: string; value: string };
};

type TypoToken = {
	token: string;
	css_variable: string;
	utility_class: string;
	value: string;
};

function TypoCompositeTable({ data }: { data: TypoComposite[] }) {
	return (
		<table className="fd-table fd-table--typo">
			<thead>
				<tr>
					<th>Preview</th>
					<th>Token</th>
					<th>Variables</th>
				</tr>
			</thead>
			<tbody>
				{data.map((row) => (
					<tr key={row.token}>
						<td>
							<div
								className="fd-typo-preview"
								style={
									{
										fontWeight: row.weight.value,
										fontSize: row.size.value,
										lineHeight: row.line_height.value,
									} as React.CSSProperties
								}
							>
								{row.name}
							</div>
						</td>
						<td>
							<div className="fd-inline">
								<code>{row.token}</code>
								<CopyButton text={row.token} />
							</div>
						</td>
						<td>
							<div className="fd-var-stack">
								<div className="fd-inline">
									<span className="fd-var-label">Font-size</span>
									<code>
										{row.size.token} ({row.size.value})
									</code>
									<CopyButton text={row.size.token} />
								</div>
								<div className="fd-inline">
									<span className="fd-var-label">Font-weight</span>
									<code>
										{row.weight.token} ({row.weight.value})
									</code>
									<CopyButton text={row.weight.token} />
								</div>
								<div className="fd-inline">
									<span className="fd-var-label">Line-height</span>
									<code>
										{row.line_height.token} ({row.line_height.value})
									</code>
									<CopyButton text={row.line_height.token} />
								</div>
							</div>
						</td>
					</tr>
				))}
			</tbody>
		</table>
	);
}

function TypoTokenTable({ data, styleProp }: { data: TypoToken[]; styleProp: string }) {
	return (
		<table className="fd-table fd-table--typo-token">
			<thead>
				<tr>
					<th>Preview</th>
					<th>Token</th>
					<th>CSS variable</th>
					<th>Utility class</th>
					<th>Value</th>
				</tr>
			</thead>
			<tbody>
				{data.map((row) => (
					<tr key={row.token}>
						<td>
							<div
								className={`fd-typo-preview fd-typo-preview--token${styleProp === '--line-height' ? ' fd-typo-preview--lh' : ''}`}
								style={{ [styleProp]: row.value } as React.CSSProperties}
							>
								Aa
							</div>
						</td>
						<td>
							<div className="fd-inline">
								<span className="fd-token-pill">{row.token}</span>
								<CopyButton text={row.token} />
							</div>
						</td>
						<td>
							<div className="fd-inline">
								<code>{row.css_variable}</code>
								<CopyButton text={row.css_variable} />
							</div>
						</td>
						<td>
							<div className="fd-inline">
								<code>{row.utility_class}</code>
								<CopyButton text={row.utility_class} />
							</div>
						</td>
						<td>
							<div className="fd-inline">
								<code>{row.value}</code>
								<CopyButton text={row.value} />
							</div>
						</td>
					</tr>
				))}
			</tbody>
		</table>
	);
}

export function TypographyPage() {
	return (
		<FoundationsShell
			eyebrow="Design system · Typography"
			title="Typography"
			lede="Text styles from display headings to body copy — composite tokens that combine font family, size, weight, and line height for consistent hierarchy."
		>
			<FdSection title="Display">
				<p>Large, high-impact text for page titles and hero sections.</p>
				<TypoCompositeTable data={Display as TypoComposite[]} />
			</FdSection>

			<FdSection title="Heading">
				<p>Structured hierarchy from H1 to H6 for scannable content organisation.</p>
				<TypoCompositeTable data={Heading as TypoComposite[]} />
			</FdSection>

			<FdSection title="Body">
				<p>Foundation styles for paragraphs, lists, and detailed readable content.</p>
				<TypoCompositeTable data={Body as TypoComposite[]} />
			</FdSection>

			<FdDivider />

			<FdSection title="Typography tokens">
				<p>Individual font properties that composite styles are built from.</p>
				<h3>Font family</h3>
				<TypoTokenTable data={FontFamily as TypoToken[]} styleProp="fontFamily" />
				<h3>Font size</h3>
				<TypoTokenTable data={Size as TypoToken[]} styleProp="fontSize" />
				<h3>Font weight</h3>
				<TypoTokenTable data={Weight as TypoToken[]} styleProp="fontWeight" />
				<h3>Line height</h3>
				<TypoTokenTable data={LineHeight as TypoToken[]} styleProp="lineHeight" />
				<h3>Letter spacing</h3>
				<TypoTokenTable data={LetterSpacing as TypoToken[]} styleProp="letterSpacing" />
			</FdSection>
		</FoundationsShell>
	);
}
