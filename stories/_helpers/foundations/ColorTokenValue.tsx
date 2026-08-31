import React from 'react';
import { CopyButton } from './CopyButton';
import { type TokenColorProperty, useResolvedTokenValue } from './colors-theme';

type ColorTokenValueProps = {
	cssVariable: string;
	fallback: string;
	property?: TokenColorProperty;
};

export function ColorTokenValue({ cssVariable, fallback, property = 'color' }: ColorTokenValueProps) {
	const value = useResolvedTokenValue(cssVariable, fallback, property);

	return (
		<span className="fd-inline">
			<code>{value}</code>
			<CopyButton text={value} />
		</span>
	);
}
