import { THEME_ROLE_NAMES, type Role } from './theme-roles';

const ROOT = (): HTMLElement => document.documentElement;

const defaultCache = new Map<string, string>();

export function rgbToHex(rgb: string): string | null {
	const m = rgb.match(/^rgba?\(([^)]+)\)/);
	if (!m) return null;
	const [r, g, b] = m[1].split(',').map((n) => parseFloat(n));
	if ([r, g, b].some(Number.isNaN)) return null;
	const h = (n: number) => Math.round(n).toString(16).padStart(2, '0');
	return `#${h(r)}${h(g)}${h(b)}`;
}

export function currentOverride(name: string): string {
	return ROOT().style.getPropertyValue(name);
}

export function isChanged(name: string): boolean {
	return currentOverride(name) !== '';
}

/** Resolve a role's shipped default, optionally under `.theme-dark`. Results are cached per session. */
export function resolveDefault(role: Role, dark = false): string {
	const cacheKey = `${dark ? 'd' : 'l'}:${role.name}`;
	const cached = defaultCache.get(cacheKey);
	if (cached !== undefined) return cached;

	const root = ROOT();
	const override = root.style.getPropertyValue(role.name);
	if (override) root.style.removeProperty(role.name);

	const scope = document.createElement('div');
	scope.className = dark ? 'theme-dark' : '';
	scope.style.cssText = 'position:absolute;visibility:hidden;pointer-events:none';
	document.body.appendChild(scope);

	const probe = document.createElement('div');
	scope.appendChild(probe);

	let resolved = '';
	if (role.type === 'color') {
		probe.style.color = `var(${role.name})`;
		resolved = rgbToHex(getComputedStyle(probe).color) ?? '';
	} else {
		probe.style.borderTopLeftRadius = `var(${role.name})`;
		const v = getComputedStyle(probe).borderTopLeftRadius;
		resolved = role.name === '--border-radius-default' && v === '0px' ? '' : v;
	}

	document.body.removeChild(scope);
	if (override) root.style.setProperty(role.name, override);
	defaultCache.set(cacheKey, resolved);
	return resolved;
}

export function applyOverride(name: string, value: string): void {
	ROOT().style.setProperty(name, value);
}

export function clearOverride(name: string): void {
	ROOT().style.removeProperty(name);
}

export function buildCss(): string {
	const names = THEME_ROLE_NAMES.filter(isChanged);
	if (names.length === 0) return '/* No overrides yet. Edit a role to see the CSS. */';
	return `:root {\n${names.map((n) => `  ${n}: ${currentOverride(n).trim()};`).join('\n')}\n}`;
}

/** Current effective value: inline override, else shipped default for the active mode. */
export function effectiveValue(role: Role, dark: boolean): string {
	const override = currentOverride(role.name);
	return override !== '' ? override : resolveDefault(role, dark);
}

// ─── contrast ────────────────────────────────────────────────────────────────

function luminance(hex: string): number | null {
	const h = hex.replace('#', '');
	if (h.length !== 6) return null;
	const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255).map((c) =>
		c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
	);
	return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(a: string, b: string): number | null {
	const la = luminance(a);
	const lb = luminance(b);
	if (la === null || lb === null) return null;
	const [hi, lo] = la > lb ? [la, lb] : [lb, la];
	return (hi + 0.05) / (lo + 0.05);
}

export type ContrastGrade = 'ok' | 'warn' | 'bad';

export function contrastGrade(ratio: number): [ContrastGrade, string] {
	if (ratio >= 4.5) return ['ok', 'AA'];
	if (ratio >= 3) return ['warn', 'AA large'];
	return ['bad', 'Fails'];
}

// ─── import ──────────────────────────────────────────────────────────────────

/** Parse a `:root { … }` block (or bare declarations) into role overrides. */
export function parseThemeImport(text: string): Map<string, string> {
	const out = new Map<string, string>();
	const block = text.match(/:root\s*\{([^}]*)\}/s)?.[1] ?? text;
	const re = /(--(?:color|border-radius)-[\w-]+)\s*:\s*([^;]+)/g;
	let m: RegExpExecArray | null;
	while ((m = re.exec(block)) !== null) {
		const name = m[1].trim();
		if (THEME_ROLE_NAMES.includes(name)) out.set(name, m[2].trim());
	}
	return out;
}
