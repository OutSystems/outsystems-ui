import React from 'react';
import { DocsNote } from '../DocsNote';
import { BorderRadius } from '../token-data/borders';
import { FdSection, FoundationsShell } from './FoundationsShell';
import { VarStack } from './VarStack';

/** Row shape of the generated `BorderRadius` table in ../token-data/borders. */
type BorderRadiusRow = {
	token: string;
	css_variable: string;
	utility_class: string;
	value: string;
};

/** Shape tier slots — soft-profile defaults on :root. `.shape-*` utilities remap all tiers. */
const SHAPE_TIER_SLOTS = [
	{ themeVariable: '--border-radius-2xs', label: '2xs', usage: 'Small controls — Tag, Avatar (soft = 4px).' },
	{ themeVariable: '--border-radius-xs', label: 'xs', usage: 'Controls — Button, Input, Dropdown (soft = 8px).' },
	{ themeVariable: '--border-radius-sm', label: 'sm', usage: 'Surfaces — Alert, Popover, Balloon (soft = 12px).' },
	{ themeVariable: '--border-radius-md', label: 'md', usage: 'Elevated surfaces — round profile surfaces (16px).' },
	{ themeVariable: '--border-radius-xl', label: 'xl', usage: 'Card, Accordion, picker popups (soft = 8px).' },
] as const;

/** Layout shape profile utilities — remap every tier slot at once. */
const SHAPE_PROFILE_UTILITIES = [
	{ className: 'shape-soft', label: 'Soft', usage: 'Default profile — controls xs=8px, surfaces sm=12px, card/popup xl=8px.' },
	{ className: 'shape-round', label: 'Round', usage: 'Pill/round profile — controls xs=999px, surfaces md=16px.' },
	{ className: 'shape-rectangular', label: 'Rectangular', usage: 'All tiers → 0px.' },
] as const;

/** Legacy aliases kept for TS runtime reads. */
const LEGACY_SHAPE_ALIASES = [
	{ themeVariable: '--border-radius-none', label: 'None (alias)', usage: '0px — `ShapeTypes.Sharp`.' },
	{ themeVariable: '--border-radius-soft', label: 'Soft (alias → xs)', usage: '8px — `ShapeTypes.SoftRounded`.' },
	{ themeVariable: '--border-radius-rounded', label: 'Rounded (alias)', usage: '999px — fixed pill/circle chrome.' },
] as const;

/** Hero strip order — most rounded first. */
const HERO_TIER_ORDER = [
	'--border-radius-md',
	'--border-radius-sm',
	'--border-radius-xs',
	'--border-radius-none',
] as const;

function ShapeBox({ radius, className = '' }: { radius: string; className?: string }) {
	return (
		<div
			className={`fd-shape-box${className ? ` ${className}` : ''}`}
			style={{ '--fd-shape-radius': radius } as React.CSSProperties}
			aria-hidden="true"
		/>
	);
}

export function ShapePage() {
	return (
		<FoundationsShell
			eyebrow="Design system · Shape"
			title="Shape"
			lede="Border radius — tier slots and layout profiles"
		>
			<DocsNote title="How shape works">
				Components read a <strong>tier slot</strong> (<code>--border-radius-xs</code>,{' '}
				<code>--border-radius-sm</code>, …). Layout utilities <code>.shape-soft</code>,{' '}
				<code>.shape-round</code>, <code>.shape-rectangular</code> remap all tiers for the active
				profile. See ADR-0010.
			</DocsNote>

			<FdSection title="Tier slots (soft defaults)">
				<div className="fd-shape-hero">
					{HERO_TIER_ORDER.map((varName) => {
						const row = SHAPE_TIER_SLOTS.find((s) => s.themeVariable === varName) ??
							LEGACY_SHAPE_ALIASES.find((s) => s.themeVariable === varName);
						if (!row) return null;
						return (
							<div key={varName} className="fd-shape-hero-item">
								<ShapeBox radius={`var(${varName})`} />
								<span className="fd-shape-hero-label">{row.label}</span>
							</div>
						);
					})}
				</div>
				<VarStack
					lines={SHAPE_TIER_SLOTS.map((s) => ({
						label: s.usage,
						value: s.themeVariable,
					}))}
				/>
			</FdSection>

			<FdSection title="Layout profiles (.shape-*)">
				<VarStack
					lines={SHAPE_PROFILE_UTILITIES.map((s) => ({
						label: s.usage,
						value: `.${s.className}`,
					}))}
				/>
			</FdSection>

			<FdSection title="Legacy aliases">
				<VarStack
					lines={LEGACY_SHAPE_ALIASES.map((s) => ({
						label: s.usage,
						value: s.themeVariable,
					}))}
				/>
			</FdSection>

			<FdSection title="Primitive border-radius tokens">
				<VarStack
					lines={(BorderRadius as BorderRadiusRow[]).map((row) => ({
						label: `${row.value} — ${row.utility_class}`,
						value: row.css_variable,
					}))}
				/>
			</FdSection>
		</FoundationsShell>
	);
}
