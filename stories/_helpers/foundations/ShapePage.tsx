import React from 'react';
import { DocsNote } from '../DocsNote';
import { BorderRadius } from '../token-data/borders';
import { FdSection, FoundationsShell } from './FoundationsShell';
import { VarStack } from './VarStack';

type BorderRadiusRow = {
	token: string;
	css_variable: string;
	utility_class: string;
	value: string;
};

/** Theme-layer shape vocabulary — see src/scss/01-foundations/_root.scss */
const SHAPE_THEME_VARIABLES = [
	{
		themeVariable: '--border-radius-none',
		label: 'None',
		tokenKey: 'border.radius.0',
		usage: 'Sharp corners — panels and surfaces with no rounding.',
	},
	{
		themeVariable: '--border-radius-soft',
		label: 'Soft',
		tokenKey: 'border.radius.200',
		usage: 'Controls and flat surfaces — buttons, inputs, checkboxes, cards.',
	},
	{
		themeVariable: '--border-radius-softer',
		label: 'Softer',
		tokenKey: 'border.radius.400',
		usage: 'Elevated surfaces — dropdowns, popovers, balloons.',
	},
	{
		themeVariable: '--border-radius-rounded',
		label: 'Rounded',
		tokenKey: 'border.radius.full',
		usage: 'Circular elements — avatars, switches, badges, pills.',
	},
] as const;

/** Hero strip order — most rounded first, like Mobile UI Shape docs. */
const HERO_THEME_VARIABLE_ORDER = [
	'--border-radius-rounded',
	'--border-radius-softer',
	'--border-radius-soft',
	'--border-radius-none',
] as const;

function borderRadiusByToken(): Map<string, BorderRadiusRow> {
	return new Map((BorderRadius as BorderRadiusRow[]).map((row) => [row.token, row]));
}

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
	const radiusByToken = borderRadiusByToken();
	const themeVariableByKey = new Map(SHAPE_THEME_VARIABLES.map((entry) => [entry.themeVariable, entry]));

	const heroDemos = HERO_THEME_VARIABLE_ORDER.map((themeVariable) => {
		const entry = themeVariableByKey.get(themeVariable);
		if (!entry) return null;
		return {
			...entry,
			value: radiusByToken.get(entry.tokenKey)?.value ?? '0px',
		};
	}).filter(Boolean) as Array<(typeof SHAPE_THEME_VARIABLES)[number] & { value: string }>;

	return (
		<FoundationsShell
			eyebrow="Design system · Shape"
			title="Shape"
			lede="OutSystems UI expresses shape through theme variables — semantic corner radii that components read via the CSS API. Set --border-radius-default once at :root to re-radius the whole framework."
		>
			<div className="fd-shape-container">
				{heroDemos.map(({ themeVariable, label, value }) => (
					<div
						key={themeVariable}
						className="fd-shape-hero-box"
						style={{ '--fd-shape-radius': value } as React.CSSProperties}
					>
						{label}
					</div>
				))}
			</div>

			<FdSection title="Theme variables">
				<p>
					Components consume <code>--border-radius-*</code> theme variables, not primitive tokens directly.
					Each theme variable falls back to a <code>--token-border-radius-*</code> value unless overridden.
				</p>
				<table className="fd-table fd-table--shape">
					<thead>
						<tr>
							<th>Shape</th>
							<th>Theme variable</th>
							<th>Backing token</th>
							<th>Usage</th>
						</tr>
					</thead>
					<tbody>
						{SHAPE_THEME_VARIABLES.map(({ themeVariable, label, tokenKey, usage }) => {
							const row = radiusByToken.get(tokenKey);
							if (!row) return null;

							return (
								<tr key={themeVariable}>
									<td>
										<div className="fd-shape-row">
											<ShapeBox radius={row.value} />
											<span className="fd-shape-row__label">
												<b>{label}</b>
											</span>
										</div>
									</td>
									<td>
										<VarStack
											lines={[
												{ label: 'Theme variable', value: themeVariable },
												{ label: 'Value', value: row.value },
											]}
										/>
									</td>
									<td>
										<VarStack
											lines={[
												{ label: 'CSS variable', value: row.css_variable },
												{ label: 'Utility class', value: row.utility_class },
												{ label: 'Token', value: row.token },
											]}
										/>
									</td>
									<td>{usage}</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</FdSection>

			<DocsNote title="Primitive scale">
				The full <code>--token-border-radius-*</code> scale (0 through full) lives on the{' '}
				<strong>Borders</strong> page. OutSystems UI does not ship Mobile UI-style shape families (
				<code>token-soft-*</code>, <code>token-round-*</code>) — use the theme variables above or override{' '}
				<code>--border-radius-default</code> in the Theme Editor.
			</DocsNote>
		</FoundationsShell>
	);
}
