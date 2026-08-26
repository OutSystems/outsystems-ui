import React from 'react';

const SUN_ICON = (
	<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
		<circle cx="12" cy="12" r="4" />
		<path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
	</svg>
);

const MOON_ICON = (
	<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
		<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
	</svg>
);

type TokenThemeToggleProps = {
	dark: boolean;
	onChange: (dark: boolean) => void;
};

/** Light / dark token theme — applies `.theme-dark` on the colours preview zone. */
export function TokenThemeToggle({ dark, onChange }: TokenThemeToggleProps) {
	return (
		<div className="fd-token-theme" role="group" aria-label="Token theme">
			<span className="fd-token-theme__label">Token theme</span>
			<div className="fd-token-theme__group">
				<button
					type="button"
					className="fd-token-theme__btn"
					aria-pressed={!dark}
					title="Light tokens"
					onClick={() => onChange(false)}
				>
					{SUN_ICON}
					<span>Light</span>
				</button>
				<button
					type="button"
					className="fd-token-theme__btn"
					aria-pressed={dark}
					title="Dark tokens"
					onClick={() => onChange(true)}
				>
					{MOON_ICON}
					<span>Dark</span>
				</button>
			</div>
		</div>
	);
}
