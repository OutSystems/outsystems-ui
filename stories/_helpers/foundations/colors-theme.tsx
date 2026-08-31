import React from 'react';
import { rgbToHex } from '../theme-editor-utils';

type ColorsThemeContextValue = {
	dark: boolean;
};

const ColorsThemeContext = React.createContext<ColorsThemeContextValue>({ dark: false });

export function ColorsThemeProvider({
	dark,
	children,
}: {
	dark: boolean;
	children: React.ReactNode;
}) {
	return <ColorsThemeContext.Provider value={{ dark }}>{children}</ColorsThemeContext.Provider>;
}

export function useColorsTheme(): ColorsThemeContextValue {
	return React.useContext(ColorsThemeContext);
}

export type TokenColorProperty = 'color' | 'backgroundColor' | 'borderColor';

/** Resolve a `--token-*` colour under an optional `.theme-dark` scope (matches Theme Editor probe). */
export function resolveTokenCssValue(
	cssVariable: string,
	dark: boolean,
	property: TokenColorProperty = 'color',
): string {
	if (typeof document === 'undefined') return '';

	const scope = document.createElement('div');
	scope.className = dark ? 'theme-dark' : '';
	scope.style.cssText = 'position:absolute;visibility:hidden;pointer-events:none';
	document.body.appendChild(scope);

	const probe = document.createElement('div');
	scope.appendChild(probe);
	probe.style[property] = `var(${cssVariable})`;
	const computed = getComputedStyle(probe)[property];
	document.body.removeChild(scope);

	return rgbToHex(computed) ?? computed;
}

export function useResolvedTokenValue(
	cssVariable: string,
	fallback: string,
	property: TokenColorProperty = 'color',
): string {
	const { dark } = useColorsTheme();
	const [value, setValue] = React.useState(fallback);

	React.useEffect(() => {
		if (!dark) {
			setValue(fallback);
			return;
		}
		const resolved = resolveTokenCssValue(cssVariable, true, property);
		setValue(resolved || fallback);
	}, [cssVariable, dark, fallback, property]);

	return value;
}

/** Light = generated fallback hex; dark = live `var(--token-*)` inside `.theme-dark`. */
export function useTokenColorFill(fallback: string, cssVariable: string): string {
	const { dark } = useColorsTheme();
	return dark ? tokenCssVar(cssVariable) : fallback;
}

export function tokenCssVar(cssVariable: string): string {
	return `var(${cssVariable})`;
}
