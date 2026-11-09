import React from 'react';

const INFO_ICON = (
	<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
		<circle cx="12" cy="12" r="9" />
		<path d="M12 11v5" />
		<circle cx="12" cy="7.8" r="1.05" fill="currentColor" stroke="none" />
	</svg>
);

const ERROR_ICON = (
	<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
		<path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
		<path d="M12 9v4" />
		<path d="M12 17h.01" />
	</svg>
);

type DocsNoteProps = {
	title: string;
	children: React.ReactNode;
	variant?: 'alt' | 'error';
};

/** Info callout — same markup and styling as Getting Started `.note` boxes. */
export function DocsNote({ title, children, variant }: DocsNoteProps) {
	const icon = variant === 'error' ? ERROR_ICON : INFO_ICON;

	return (
		<div className={variant ? `note ${variant}` : 'note'}>
			<span className="ic" aria-hidden="true">
				{icon}
			</span>
			<div>
				<b>{title}</b>
				{children}
			</div>
		</div>
	);
}
