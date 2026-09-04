import React from 'react';

const COPY_ICON = (
	<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
		<rect x="9" y="9" width="13" height="13" rx="2" />
		<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
	</svg>
);

const CHECK_ICON = (
	<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
		<path d="M20 6 9 17l-5-5" />
	</svg>
);

type CopyButtonProps = {
	text: string;
	className?: string;
	label?: string;
};

/** Copy control — uses CSS API Reference `.api-copy-icon` styles. */
export function CopyButton({ text, className = '', label }: CopyButtonProps) {
	const [copied, setCopied] = React.useState(false);
	const copyLabel = label ?? `Copy ${text}`;

	const onCopy = React.useCallback(async () => {
		try {
			await navigator.clipboard.writeText(text);
			setCopied(true);
			window.setTimeout(() => setCopied(false), 1400);
		} catch {
			/* ignore */
		}
	}, [text]);

	return (
		<button
			type="button"
			className={`api-copy-icon${copied ? ' is-copied' : ''}${className ? ` ${className}` : ''}`}
			title={copied ? 'Copied' : copyLabel}
			aria-label={copied ? 'Copied' : copyLabel}
			onClick={onCopy}
		>
			{copied ? CHECK_ICON : COPY_ICON}
		</button>
	);
}
