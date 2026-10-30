import React from 'react';

type PatternDocShellProps = {
	eyebrow: string;
	title: string;
	lede: React.ReactNode;
	toolbar?: React.ReactNode;
	preview?: React.ReactNode;
	children: React.ReactNode;
};

export function PatternDocShell({ eyebrow, title, lede, toolbar, preview, children }: PatternDocShellProps) {
	return (
		<div className="osui-pattern-doc sb-unstyled">
			<header className="pd-head">
				<div className="pd-head-in">
					<span className="pd-eyebrow">{eyebrow}</span>
					<h1>{title}</h1>
					<p className="pd-lede">{lede}</p>
					{toolbar ? <div className="pd-toolbar">{toolbar}</div> : null}
				</div>
			</header>
			{preview}
			<div className="pd-inner">
				<article className="pd-body">{children}</article>
			</div>
		</div>
	);
}

export function PdPreview({ title = 'Demo', children }: { title?: string; children: React.ReactNode }) {
	return (
		<section className="pd-preview">
			<h2>{title}</h2>
			{children}
		</section>
	);
}

/** Inline story canvas inside a docs section (e.g. Examples). */
export function PdExample({
	title,
	description,
	implement,
	children,
}: {
	title: string;
	description?: string;
	/** Optional ODC Studio steps (e.g. StudioHowTo accordion). */
	implement?: React.ReactNode;
	children: React.ReactNode;
}) {
	return (
		<div className="pd-example">
			<h3>{title}</h3>
			{description ? <p className="pd-example__desc">{description}</p> : null}
			{implement ? (
				<div className="pd-example__frame">
					<div className="pd-example__canvas">{children}</div>
					<div className="pd-example__foot">{implement}</div>
				</div>
			) : (
				<div className="pd-example__canvas">{children}</div>
			)}
		</div>
	);
}

export function PdUseGuidance({
	whenToUse,
	whenNotToUse,
}: {
	whenToUse: string[];
	whenNotToUse?: string[];
}) {
	return (
		<div className="pd-guidance">
			<div className="pd-guidance__card pd-guidance__card--do">
				<h3>When to use</h3>
				<ul className="pd-guidance__list">
					{whenToUse.map((item) => (
						<li key={item}>{item}</li>
					))}
				</ul>
			</div>
			{whenNotToUse?.length ? (
				<div className="pd-guidance__card pd-guidance__card--dont">
					<h3>When not to use</h3>
					<ul className="pd-guidance__list">
						{whenNotToUse.map((item) => (
							<li key={item}>{item}</li>
						))}
					</ul>
				</div>
			) : null}
		</div>
	);
}

export function PdSection({
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
		<section className="pd-sec">
			<Tag id={id}>{title}</Tag>
			{children}
		</section>
	);
}

export function PdDivider() {
	return <hr className="pd-divider" />;
}

export function PdList({ items }: { items: React.ReactNode[] }) {
	return (
		<ul className="pd-list">
			{items.map((item, index) => (
				<li key={index}>{item}</li>
			))}
		</ul>
	);
}

/** Keyboard key cap for accessibility docs. */
export function PdKey({ children, wide }: { children: React.ReactNode; wide?: boolean }) {
	return <kbd className={wide ? 'pd-key pd-key--wide' : 'pd-key'}>{children}</kbd>;
}

export function PdSteps({ items }: { items: string[] }) {
	return (
		<ol className="pd-steps">
			{items.map((item) => (
				<li key={item}>{item}</li>
			))}
		</ol>
	);
}

export function PdCodeBlock({ children }: { children: string }) {
	return <pre className="pd-code">{children}</pre>;
}

export function PdRelatedGrid({
	items,
}: {
	items: Array<{ name: string; href: string; blurb?: string }>;
}) {
	return (
		<div className="pd-related">
			{items.map((item) => (
				<a key={item.name} className="pd-related__card" href={item.href}>
					<b>{item.name}</b>
					{item.blurb ? <span>{item.blurb}</span> : null}
				</a>
			))}
		</div>
	);
}
