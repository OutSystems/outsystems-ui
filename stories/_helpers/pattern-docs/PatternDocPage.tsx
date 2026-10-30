import React from 'react';
import { PdAnatomy } from './AnatomyDiagram';
import { cssApiLinkForSlug, cssApiPropertiesForSlug } from './css-api';
import { ApiTable, PropertyTable } from './PropertyTable';
import {
	PdDivider,
	PdList,
	PdRelatedGrid,
	PdSection,
	PdUseGuidance,
	PatternDocShell,
} from './PatternDocShell';
import { PATTERN_CATALOGUE } from '../PatternCatalogue';
import type { PatternDocMeta } from './types';

const CATALOGUE_BLURBS = Object.fromEntries(PATTERN_CATALOGUE.map((p) => [p.name, p.blurb]));

const PATTERN_BLURBS: Record<string, string> = {
	Accordion: 'Stacked sections that expand on click.',
	Alert: 'Inline status message with a severity tone.',
	BlankSlate: 'Empty-state placeholder with optional action.',
	'Blank Slate': 'Empty-state placeholder with optional action.',
	Card: 'Simple bordered surface for grouped content.',
	'Card Sectioned': 'Image, title, body, and footer in one tile.',
	'Card Background': 'Hero tile with image and colour overlay.',
	'Card Item': 'List row with avatar, title, and trailing slot.',
	Carousel: 'Swipeable set of slides with controls.',
	'Chat Message': 'Bubble layout for conversational UI.',
	'Flip Content': 'Two-sided card that flips on interaction.',
	'Floating Content': 'Positioned overlay anchored to a trigger.',
	'List Item Content': 'Title, caption and trailing slot for lists.',
	Notification: 'Toast-style feedback that auto-dismisses.',
	Section: 'Page section with title and body slots.',
	Table: 'Styled data table for structured content.',
	Tag: 'Compact label for status or taxonomy.',
	'User Avatar': 'Initials or image avatar for a person.',
	UserAvatar: 'Initials or image avatar for a person.',
};

type PatternDocPageProps = {
	meta: PatternDocMeta;
	/** Inline demo — must be rendered from MDX so Canvas `of` resolves as a story. */
	preview?: React.ReactNode;
	/** Additional story canvases — render from MDX (Canvas `of` must resolve in MDX). */
	examples?: React.ReactNode;
};

export function PatternDocPage({ meta, preview, examples }: PatternDocPageProps) {
	const cssProps = meta.cssApiSlug ? cssApiPropertiesForSlug(meta.cssApiSlug) : [];
	const cssLink = meta.cssApiSlug ? cssApiLinkForSlug(meta.cssApiSlug) : null;
	const stylingSelector = meta.stylingSelector ?? `.${meta.name.toLowerCase()}`;
	const hasApi = (meta.events?.length ?? 0) > 0 || (meta.apiSections?.length ?? 0) > 0;

	return (
		<PatternDocShell
			eyebrow={`Patterns · ${meta.category}`}
			title={meta.name}
			lede={meta.lede}
			preview={preview ?? null}
			toolbar={
				<>
					{meta.odcUrl ? (
						<a className="pd-btn pd-btn--ghost" href={meta.odcUrl} target="_blank" rel="noopener noreferrer">
							ODC documentation ↗
						</a>
					) : null}
					{meta.o11Url ? (
						<a className="pd-btn pd-btn--ghost" href={meta.o11Url} target="_blank" rel="noopener noreferrer">
							O11 documentation ↗
						</a>
					) : null}
				</>
			}
		>
			{examples ? <div className="pd-examples">{examples}</div> : null}

			{examples ? <PdDivider /> : null}

			<PdSection id="overview" title="Overview">
				<p>{meta.overview}</p>
				<PdUseGuidance whenToUse={meta.whenToUse} whenNotToUse={meta.whenNotToUse} />
			</PdSection>

			<PdDivider />

			<PdSection id="anatomy" title="Anatomy">
				<p>DOM structure the runtime expects (simplified):</p>
				<PdAnatomy anatomy={meta.anatomy} />
			</PdSection>

			<PdDivider />

			<PdSection id="properties" title="Properties">
				{meta.properties.map((group, index) => (
					<React.Fragment key={group.title ?? `group-${index}`}>
						{group.title ? <h3>{group.title}</h3> : null}
						<PropertyTable rows={group.rows} />
					</React.Fragment>
				))}
			</PdSection>

			{hasApi ? (
				<>
					<PdDivider />

					<PdSection id="api" title="Events &amp; runtime API">
						{meta.events?.length ? (
							<>
								<h3>Events</h3>
								<ApiTable rows={meta.events} />
							</>
						) : null}
						{meta.apiSections?.map((section) => (
							<React.Fragment key={section.title}>
								<h3>{section.title}</h3>
								<ApiTable rows={section.rows} />
							</React.Fragment>
						))}
						<p className="pd-muted">
							Full signatures:{' '}
							<a href="https://outsystems-ui-docs.github.io/" target="_blank" rel="noopener noreferrer">
								TypeDoc API reference ↗
							</a>
						</p>
					</PdSection>
				</>
			) : null}

			{cssProps.length ? (
				<>
					<PdDivider />
					<PdSection id="styling" title="Styling">
						<p>
							Visual settings are exposed as <code>--osui-*</code> CSS custom properties on{' '}
							<code>{stylingSelector}</code>. Override per instance or in your theme.
						</p>
						<div className="pd-table-wrap">
							<table className="pd-table pd-table--css">
								<thead>
									<tr>
										<th>Property</th>
										<th>Default</th>
									</tr>
								</thead>
								<tbody>
									{cssProps.map((row) => (
										<tr key={row.name}>
											<td>
												<code>{row.name}</code>
											</td>
											<td>
												<code>{row.default}</code>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
						{cssLink ? (
							<p>
								<a href={cssLink}>Browse in CSS API Reference →</a>
							</p>
						) : null}
					</PdSection>
				</>
			) : null}

			<PdDivider />

			<PdSection id="accessibility" title="Accessibility">
				<PdList items={meta.accessibility} />
			</PdSection>

			<PdDivider />

			<PdSection id="related" title="Related patterns">
				<PdRelatedGrid
					items={meta.related.map((r) => ({
						name: r.name,
						href: r.storyId.endsWith('--docs')
							? `?path=/docs/${r.storyId}`
							: `?path=/story/${r.storyId}`,
						blurb: PATTERN_BLURBS[r.name] ?? CATALOGUE_BLURBS[r.name],
					}))}
				/>
			</PdSection>
		</PatternDocShell>
	);
}
