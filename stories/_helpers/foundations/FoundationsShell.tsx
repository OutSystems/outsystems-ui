import React from 'react';

type FoundationsShellProps = {
	eyebrow: string;
	title: string;
	lede?: React.ReactNode;
	children: React.ReactNode;
};

/** Shared chrome for Foundations docs pages — matches CSS Architecture / Getting Started layout. */
export function FoundationsShell({ eyebrow, title, lede, children }: FoundationsShellProps) {
	return (
		<div className="osui-foundations sb-unstyled">
			<header className="fd-head">
				<div className="fd-head-in">
					<span className="fd-eyebrow">{eyebrow}</span>
					<h1>{title}</h1>
					{lede ? <p className="fd-lede">{lede}</p> : null}
				</div>
			</header>
			<div className="fd-inner">
				<article className="fd-body">{children}</article>
			</div>
		</div>
	);
}

export function FdSection({
	id,
	title,
	level = 2,
	children,
}: {
	id?: string;
	title: string;
	level?: 2 | 3 | 4;
	children: React.ReactNode;
}) {
	const Tag = level === 4 ? 'h4' : level === 3 ? 'h3' : 'h2';
	return (
		<section className="fd-sec">
			<Tag id={id}>{title}</Tag>
			{children}
		</section>
	);
}

export function FdDivider() {
	return <hr className="fd-divider" />;
}

export function FdChecklist({ items }: { items: string[] }) {
	return (
		<ul className="fd-checklist">
			{items.map((item) => (
				<li key={item}>{item}</li>
			))}
		</ul>
	);
}
