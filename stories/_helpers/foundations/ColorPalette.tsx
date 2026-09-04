import React from 'react';
import { CopyButton } from './CopyButton';
import { ColorTokenValue } from './ColorTokenValue';
import { useTokenColorFill } from './colors-theme';
import { TokenTable, type TokenRow } from './TokenTable';

export type ColorToken = {
	token: string;
	value: string;
	css_variable: string;
	utility_class: string;
	usage: string;
	name?: string;
};

const STAR_ICON = (
	<svg width="16" height="16" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
		<path d="M234.5,114.38l-45.1,39.36,13.51,58.6a16,16,0,0,1-23.84,17.34l-51.11-31-51,31a16,16,0,0,1-23.84-17.34L66.61,153.8,21.5,114.38a16,16,0,0,1,9.11-28.06l59.46-5.15,23.21-55.36a15.95,15.95,0,0,1,29.44,0h0L168,81.17l59.44,5.15a16,16,0,0,1,9.11,28.06Z" />
	</svg>
);

type ColorSwatchPreviewProps = {
	row: ColorToken;
	variant: 'text' | 'icon' | 'bg';
};

function ColorSwatchPreview({ row, variant }: ColorSwatchPreviewProps) {
	const fill = useTokenColorFill(row.value, row.css_variable);

	if (variant === 'text') {
		return (
			<span className="fd-color-swatch-preview fd-color-swatch-preview--text" style={{ color: fill }}>
				Aa
			</span>
		);
	}

	if (variant === 'icon') {
		return (
			<span className="fd-color-swatch-preview fd-color-swatch-preview--icon" style={{ color: fill }}>
				{STAR_ICON}
			</span>
		);
	}

	return (
		<span className="fd-color-swatch-preview fd-color-swatch-preview--bg" style={{ backgroundColor: fill }} />
	);
}

type ColorPaletteProps = {
	colorsData: Record<string, ColorToken[]>;
};

function PaletteSwatch({ token, onSelect }: { token: ColorToken; onSelect: () => void }) {
	const fill = useTokenColorFill(token.value, token.css_variable);

	return (
		<button
			type="button"
			className="fd-color-swatch"
			style={{ '--fd-swatch': fill } as React.CSSProperties}
			title={token.token}
			onClick={onSelect}
		/>
	);
}

function ColorCardItem({ row }: { row: ColorToken }) {
	const fill = useTokenColorFill(row.value, row.css_variable);

	return (
		<div className="fd-color-card">
			<div className="fd-color-card__swatch" style={{ '--fd-swatch': fill } as React.CSSProperties}>
				<b>{row.name}</b>
			</div>
			<div className="fd-color-card__body">
				<p>
					<strong>Token:</strong> <code>{row.token}</code>
				</p>
				<p>
					<strong>CSS variable:</strong> <code>{row.css_variable}</code>
				</p>
				<p>
					<strong>Utility class:</strong> <code>{row.utility_class}</code>
				</p>
				<p>
					<strong>Value:</strong>{' '}
					<ColorTokenValue cssVariable={row.css_variable} fallback={row.value} property="backgroundColor" />
				</p>
			</div>
		</div>
	);
}

function BorderColorPreview({ row }: { row: ColorToken }) {
	const fill = useTokenColorFill(row.value, row.css_variable);

	return (
		<div className="fd-border-token-preview" style={{ '--fd-border-color': fill } as React.CSSProperties} />
	);
}

function ColorModal({
	open,
	color,
	onClose,
}: {
	open: boolean;
	color: ColorToken | null;
	onClose: () => void;
}) {
	const swatchFill = useTokenColorFill(color?.value ?? '', color?.css_variable ?? '');
	const panelRef = React.useRef<HTMLDivElement>(null);

	React.useEffect(() => {
		if (open && color) panelRef.current?.focus();
	}, [open, color]);

	if (!open || !color) return null;

	const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
		// Only clicks on the backdrop itself close the modal; clicks inside the panel bubble up here too.
		if (e.target === e.currentTarget) onClose();
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (e.key === 'Escape') onClose();
	};

	return (
		<div
			className="fd-color-modal"
			role="dialog"
			aria-modal="true"
			onClick={handleBackdropClick}
			onKeyDown={handleKeyDown}
		>
			<div className="fd-color-modal__panel" ref={panelRef} tabIndex={-1}>
				<div className="fd-color-modal__swatch" style={{ backgroundColor: swatchFill }} />
				<div className="fd-color-modal__body">
					<h3>{color.name ?? color.token}</h3>
					<p>
						<strong>Token:</strong> <code>{color.token}</code>
						<CopyButton text={color.token} />
					</p>
					<p>
						<strong>CSS variable:</strong> <code>{color.css_variable}</code>
						<CopyButton text={color.css_variable} />
					</p>
					<p>
						<strong>Utility class:</strong> <code>{color.utility_class}</code>
						<CopyButton text={color.utility_class} />
					</p>
					<p>
						<strong>Value:</strong>{' '}
						<ColorTokenValue cssVariable={color.css_variable} fallback={color.value} property="backgroundColor" />
					</p>
				</div>
			</div>
		</div>
	);
}

export function ColorPalette({ colorsData }: ColorPaletteProps) {
	const [selected, setSelected] = React.useState<ColorToken | null>(null);

	return (
		<>
			{Object.entries(colorsData).map(([category, items]) => {
				if (!Array.isArray(items) || items.length === 0) return null;
				return (
					<div key={category} className="fd-color-line">
						<div className="fd-color-line__name">{category.charAt(0).toUpperCase() + category.slice(1)}</div>
						{items.map((token) => (
							<PaletteSwatch key={token.token} token={token} onSelect={() => setSelected(token)} />
						))}
					</div>
				);
			})}
			<ColorModal open={selected !== null} color={selected} onClose={() => setSelected(null)} />
		</>
	);
}

export function ColorScaleLabels() {
	const scales = ['100', '200', '300', '400', '500', '600', '700', '800', '900', '1000', '1100', '1200'];
	return (
		<div className="fd-color-line fd-color-line--labels">
			<div className="fd-color-line__name" />
			{scales.map((s) => (
				<div key={s} className="fd-color-line__label">
					{s}
				</div>
			))}
		</div>
	);
}

export function ColorCard({ colorsData }: { colorsData: ColorToken[] }) {
	return (
		<div className="fd-color-cards">
			{colorsData.map((row) => (
				<ColorCardItem key={row.token} row={row} />
			))}
		</div>
	);
}

function renderColorTokenValue(row: TokenRow, property: 'color' | 'backgroundColor' | 'borderColor') {
	return (
		<ColorTokenValue cssVariable={row.css_variable} fallback={row.value} property={property} />
	);
}

function ColorDetailTable({ rows, variant }: { rows: ColorToken[]; variant: 'text' | 'icon' | 'bg' }) {
	const valueProperty = variant === 'bg' ? 'backgroundColor' : 'color';

	return (
		<TokenTable
			className="fd-table--colors"
			rows={rows}
			previewInToken
			preview={(row) => <ColorSwatchPreview row={row} variant={variant} />}
			renderValue={(row) => renderColorTokenValue(row, valueProperty)}
		/>
	);
}

export function ColorTextList({ colorsData }: { colorsData: ColorToken[] }) {
	return <ColorDetailTable rows={colorsData} variant="text" />;
}

export function ColorIconList({ colorsData }: { colorsData: ColorToken[] }) {
	return <ColorDetailTable rows={colorsData} variant="icon" />;
}

function flattenBg(colorsObject: Record<string, ColorToken[] | Record<string, unknown>>): ColorToken[] {
	let flat: ColorToken[] = [];
	for (const value of Object.values(colorsObject)) {
		if (Array.isArray(value)) flat = flat.concat(value);
		else if (value && typeof value === 'object') flat = flat.concat(flattenBg(value as Record<string, ColorToken[]>));
	}
	return flat;
}

export function ColorBgList({ colorsData }: { colorsData: { bg: Record<string, ColorToken[]> } }) {
	const rows = flattenBg(colorsData.bg ?? {});
	if (!rows.length) return <p>Background color data not available.</p>;
	return <ColorDetailTable rows={rows} variant="bg" />;
}

export function ColorBorderTable({ rows }: { rows: ColorToken[] }) {
	return (
		<TokenTable
			rows={rows}
			className="fd-table--border-color"
			preview={(row) => <BorderColorPreview row={row} />}
			renderValue={(row) => renderColorTokenValue(row, 'borderColor')}
		/>
	);
}
