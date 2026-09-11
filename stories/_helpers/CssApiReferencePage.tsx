import React from 'react';
import {
	CSS_API_MANIFEST,
	type CssApiCategory,
	type CssApiComponent,
	type CssApiProperty,
	type CssApiPropertyKind,
} from './css-api-manifest';

const { totals, categories } = CSS_API_MANIFEST;

const CODE_INSTANCE =
	'/* One instance — scope to a wrapper or the component root */\n' +
	'.my-page .sidebar {\n' +
	'  --osui-sidebar-background: #1a1a2e;\n' +
	'  --osui-sidebar-color: #ffffff;\n' +
	'}';

const SEARCH_ICON = (
	<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
		<circle cx="11" cy="11" r="7" />
		<path d="m20 20-3.5-3.5" />
	</svg>
);

const KIND_CHIPS: Array<{ id: CssApiPropertyKind; label: string }> = [
	{ id: 'color', label: 'Colour' },
	{ id: 'spacing', label: 'Size' },
	{ id: 'shadow', label: 'Shadow' },
	{ id: 'border', label: 'Border' },
	{ id: 'other', label: 'Other' },
];

const KIND_BADGE: Record<CssApiPropertyKind, string> = {
	color: 'Colour',
	spacing: 'Size',
	shadow: 'Shadow',
	border: 'Border',
	other: 'Other',
};

function navCategoryLabel(label: string): string {
	return label.replace(/ – /g, ' ').toUpperCase();
}

function countComponentProperties(component: CssApiComponent): number {
	return component.variants.reduce((sum, variant) => sum + variant.properties.length, 0);
}

function flattenComponents(data: CssApiCategory[]) {
	return data.flatMap((cat) =>
		cat.components.map((component) => ({
			categoryId: cat.id,
			categoryLabel: cat.label,
			component,
			count: countComponentProperties(component),
		}))
	);
}

function defaultSelectedSlug(): string {
	const foundations = categories.find((cat) => cat.id === 'foundations');
	return foundations?.components.find((c) => c.slug === 'foundations-root')?.slug ?? foundations?.components[0]?.slug ?? '';
}

function categoryIdForSlug(slug: string): string | null {
	for (const cat of categories) {
		if (cat.components.some((component) => component.slug === slug)) return cat.id;
	}
	return null;
}

const RAIL_HANDLE_ICON = (
	<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" aria-hidden="true">
		<path d="M15 6l-6 6 6 6" />
	</svg>
);

const NAV_CHEVRON = (
	<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
		<path d="m9 18 6-6-6-6" />
	</svg>
);

function storyHref(id: string): string {
	return `?path=/story/${id}`;
}

function matchesQuery(text: string, query: string): boolean {
	return text.toLowerCase().includes(query);
}

function propertyMatches(prop: CssApiProperty, component: CssApiComponent, query: string): boolean {
	if (!query) return true;
	return (
		matchesQuery(prop.name, query) ||
		matchesQuery(prop.default, query) ||
		matchesQuery(prop.hint, query) ||
		matchesQuery(component.name, query)
	);
}

function filterProperties(
	component: CssApiComponent,
	query: string,
	kinds: Set<CssApiPropertyKind>
): CssApiComponent['variants'] {
	const q = query.trim().toLowerCase();
	return component.variants
		.map((variant) => {
			const properties = variant.properties.filter((prop) => {
				if (kinds.size && !kinds.has(prop.kind)) return false;
				return propertyMatches(prop, component, q);
			});
			return properties.length ? { ...variant, properties } : null;
		})
		.filter(Boolean) as CssApiComponent['variants'];
}

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

const SNIPPET_ICON = (
	<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
		<path d="m16 18 6-6-6-6" />
		<path d="m8 6-6 6 6 6" />
	</svg>
);

function CopyIconButton({
	text,
	label,
	icon = 'copy',
}: {
	text: string;
	label: string;
	icon?: 'copy' | 'snippet';
}) {
	const [copied, setCopied] = React.useState(false);

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
			className={`api-copy-icon${copied ? ' is-copied' : ''}`}
			onClick={onCopy}
			title={copied ? 'Copied' : label}
			aria-label={copied ? 'Copied' : label}
		>
			{copied ? (
				CHECK_ICON
			) : icon === 'snippet' ? (
				SNIPPET_ICON
			) : (
				COPY_ICON
			)}
		</button>
	);
}

function DocsCodeBlock({ code }: { code: string }) {
	const [label, setLabel] = React.useState('Copy');

	const onCopy = React.useCallback(async () => {
		try {
			await navigator.clipboard.writeText(code);
			setLabel('Copied');
			window.setTimeout(() => setLabel('Copy'), 1400);
		} catch {
			/* ignore */
		}
	}, [code]);

	return (
		<div className="code">
			<pre>{code}</pre>
			<button type="button" onClick={onCopy}>
				{label}
			</button>
		</div>
	);
}

function HowToUseSection() {
	return (
		<section className="api-guide" id="how-to-use">
			<h2>How to use</h2>
			<p>
				Scroll the list below or pick a component in the sidebar, then override any <strong>property</strong>{' '}
				on its root selector (or a wrapper above it). Defaults resolve through the chain on{' '}
				<a href="?path=/docs/design-system-css-architecture--docs">CSS Architecture</a>.
			</p>
			<DocsCodeBlock code={CODE_INSTANCE} />
		</section>
	);
}

function KindBadge({ kind }: { kind: CssApiPropertyKind }) {
	return <span className={`api-kind api-kind--${kind}`}>{KIND_BADGE[kind]}</span>;
}

function propertyDefaultDisplay(prop: CssApiProperty): string {
	if (prop.chain === 'token') return prop.hint;
	return prop.default;
}

function PropertyTableHeader() {
	return (
		<div className="api-prop-head" role="row">
			<span role="columnheader">Property</span>
			<span role="columnheader">Kind</span>
			<span role="columnheader">Default</span>
			<span className="api-prop-head__action" role="columnheader" aria-label="Snippet">
				<span aria-hidden="true" />
			</span>
		</div>
	);
}

function PropertyRow({ prop, selector }: { prop: CssApiProperty; selector: string }) {
	const snippet = `${selector} {\n  ${prop.name}: /* your value */;\n}`;

	return (
		<div className="api-prop-row" role="row">
			<div className="api-prop-row__name" role="cell">
				<span className="api-prop-row__label">{prop.name}</span>
				<CopyIconButton text={prop.name} label={`Copy ${prop.name}`} />
			</div>
			<div className="api-prop-row__kind" role="cell">
				<KindBadge kind={prop.kind} />
			</div>
			<div className="api-prop-row__default" role="cell">
				<code>{propertyDefaultDisplay(prop)}</code>
				{prop.chain !== 'token' && prop.hint !== prop.default ? (
					<code>{prop.hint}</code>
				) : null}
			</div>
			<div className="api-prop-row__snippet" role="cell">
				<CopyIconButton text={snippet} label="Copy snippet" icon="snippet" />
			</div>
		</div>
	);
}

function componentHasVisibleProperties(
	component: CssApiComponent,
	query: string,
	kinds: Set<CssApiPropertyKind>
): boolean {
	return filterProperties(component, query, kinds).length > 0;
}

function ComponentSection({
	component,
	query,
	kinds,
	sectionRef,
}: {
	component: CssApiComponent;
	query: string;
	kinds: Set<CssApiPropertyKind>;
	sectionRef: (el: HTMLElement | null) => void;
}) {
	if (!componentHasVisibleProperties(component, query, kinds)) return null;

	return (
		<section id={component.slug} className="api-section" ref={sectionRef}>
			<ComponentPanel component={component} query={query} kinds={kinds} />
		</section>
	);
}

function ComponentPanel({
	component,
	query,
	kinds,
}: {
	component: CssApiComponent;
	query: string;
	kinds: Set<CssApiPropertyKind>;
}) {
	const variants = filterProperties(component, query, kinds);
	const primarySelector = component.variants[0]?.selector ?? '';
	const visibleCount = variants.reduce((sum, v) => sum + v.properties.length, 0);

	return (
		<div className="api-panel">
			<header className="api-panel-head">
				<div className="api-panel-title">
					<h2>{component.name}</h2>
					{primarySelector ? <code>{primarySelector}</code> : null}
				</div>
				{component.storyId ? (
					<div className="api-panel-links">
						<a href={storyHref(component.storyId)}>See it running →</a>
					</div>
				) : null}
			</header>
			<p className="api-panel-hint">
				Set any of these on <code>{primarySelector}</code>, or on a wrapper class above it, to change this
				component alone.
			</p>

			{variants.length ? (
				variants.map((variant) => (
					<div key={variant.selector} className="api-prop-list" role="table">
						{variant.selector !== primarySelector ? (
							<div className="api-prop-list__selector">
								Selector <code>{variant.selector}</code>
							</div>
						) : null}
						<PropertyTableHeader />
						{variant.properties.map((prop) => (
							<PropertyRow key={`${variant.selector}-${prop.name}`} prop={prop} selector={variant.selector} />
						))}
					</div>
				))
			) : (
				<div className="api-empty">No properties match your filters.</div>
			)}

			<p className="api-panel-foot">
				{visibleCount} propert{visibleCount === 1 ? 'y' : 'ies'}
			</p>
		</div>
	);
}

function allCategoryIds(): Set<string> {
	return new Set(categories.map((cat) => cat.id));
}

function SidebarNav({
	selectedSlug,
	onSelect,
	query,
}: {
	selectedSlug: string;
	onSelect: (slug: string) => void;
	query: string;
}) {
	const q = query.trim().toLowerCase();
	const searching = Boolean(q);
	const [expanded, setExpanded] = React.useState<Set<string>>(allCategoryIds);

	const toggleCategory = React.useCallback((categoryId: string) => {
		setExpanded((prev) => {
			const next = new Set(prev);
			if (next.has(categoryId)) next.delete(categoryId);
			else next.add(categoryId);
			return next;
		});
	}, []);

	return (
		<nav className="api-nav">
			{categories.map((cat) => {
				const items = cat.components.filter((component) => {
					if (!q) return true;
					if (matchesQuery(component.name, q)) return true;
					return component.variants.some((variant) =>
						variant.properties.some((prop) => propertyMatches(prop, component, q))
					);
				});

				if (!items.length) return null;

				const isExpanded = searching || expanded.has(cat.id);

				return (
					<div key={cat.id} className={`api-nav-group${isExpanded ? ' is-expanded' : ''}`}>
						<button
							type="button"
							className="api-nav-group__toggle"
							aria-expanded={isExpanded}
							onClick={() => toggleCategory(cat.id)}
						>
							<span className="api-nav-group__chevron">{NAV_CHEVRON}</span>
							<span className="api-nav-group__label">{navCategoryLabel(cat.label)}</span>
							<span className="api-nav-group__count">{items.length}</span>
						</button>
						{isExpanded ? (
							<div className="api-nav-group__items">
								{items.map((component) => {
									const count = countComponentProperties(component);
									const active = component.slug === selectedSlug;
									return (
										<button
											key={component.slug}
											type="button"
											className={`api-nav-item${active ? ' is-active' : ''}`}
											aria-current={active ? 'page' : undefined}
											onClick={() => onSelect(component.slug)}
										>
											<span>{component.name}</span>
											<i>{count}</i>
										</button>
									);
								})}
							</div>
						) : null}
					</div>
				);
			})}
		</nav>
	);
}

/**
 * Interactive CSS API reference — sidebar nav, kind chips, property rows.
 * Data is generated from SCSS (`npm run docs:css-api`).
 */
export function CssApiReferencePage() {
	const searchRef = React.useRef<HTMLInputElement>(null);
	const sectionRefs = React.useRef<Map<string, HTMLElement>>(new Map());
	const [selectedSlug, setSelectedSlug] = React.useState(defaultSelectedSlug);
	const [query, setQuery] = React.useState('');
	const [kinds, setKinds] = React.useState<Set<CssApiPropertyKind>>(() => new Set());
	const [railCollapsed, setRailCollapsed] = React.useState(false);

	React.useEffect(() => {
		const onKeyDown = (event: KeyboardEvent) => {
			if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
				event.preventDefault();
				searchRef.current?.focus();
			}
		};

		window.addEventListener('keydown', onKeyDown);
		return () => window.removeEventListener('keydown', onKeyDown);
	}, []);

	const allEntries = React.useMemo(() => flattenComponents(categories), []);
	const visibleComponents = React.useMemo(
		() =>
			allEntries
				.map((entry) => entry.component)
				.filter((component) => componentHasVisibleProperties(component, query, kinds)),
		[allEntries, query, kinds]
	);

	const scrollToComponent = React.useCallback((slug: string) => {
		const section = sectionRefs.current.get(slug);
		if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
		setSelectedSlug(slug);
	}, []);

	React.useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) setSelectedSlug(entry.target.id);
				}
			},
			{ root: null, rootMargin: '-81px 0px -65% 0px', threshold: 0 }
		);

		sectionRefs.current.forEach((el) => observer.observe(el));
		return () => observer.disconnect();
	}, [query, kinds, visibleComponents.length]);

	const toggleKind = (kind: CssApiPropertyKind) => {
		setKinds((prev) => {
			const next = new Set(prev);
			if (next.has(kind)) next.delete(kind);
			else next.add(kind);
			return next;
		});
	};

	const hasFilters = Boolean(query.trim()) || kinds.size > 0;

	return (
		<div className="osui-css-api-reference sb-unstyled">
			<header className="api-head">
				<div className="api-head-in">
					<span className="api-eyebrow">Design system · CSS API Reference</span>
					<h1>
						Customize any component,
						<br />
						<em>property by property.</em>
					</h1>
					<p className="api-lede">
						{totals.properties} properties across {totals.components} components. See{' '}
						<a href="?path=/docs/design-system-css-architecture--docs">CSS Architecture</a> for how defaults resolve.
					</p>
				</div>
			</header>

			<div className="api-inner">
				<div className="api-body">
					<HowToUseSection />
				</div>
			</div>

			<div className="api-browser">
				<div className="api-toolbar">
					<div className="api-toolbar-in">
						<span className="api-toolbar-label" id="api-kind-filters-label">
							Filters
						</span>
						<div className="api-chips" role="group" aria-labelledby="api-kind-filters-label">
							{KIND_CHIPS.map((chip) => (
								<button
									key={chip.id}
									type="button"
									className={`api-chip api-chip--${chip.id}${kinds.has(chip.id) ? ' is-active' : ''}`}
									aria-pressed={kinds.has(chip.id)}
									onClick={() => toggleKind(chip.id)}
								>
									{chip.label}
								</button>
							))}
							{hasFilters ? (
								<button
									type="button"
									className="api-clear"
									onClick={() => {
										setQuery('');
										setKinds(new Set());
									}}
								>
									Clear
								</button>
							) : null}
						</div>
					</div>
				</div>

				<div className={`api-wrap${railCollapsed ? ' is-rail-collapsed' : ''}`}>
					<aside className={`api-rail${railCollapsed ? ' is-rail-collapsed' : ''}`} aria-label="Components">
						<div className="api-rail-inner">
							<div className="api-rail-body" id="api-component-nav">
								<div className="api-rail-head">
									<div className="api-rail-head__copy">
										<span className="api-rail-head__title">Components</span>
										<span className="api-rail-head__meta">{totals.components} total</span>
									</div>
								</div>
								<label className="api-search">
									{SEARCH_ICON}
									<input
										ref={searchRef}
										type="search"
										value={query}
										onChange={(e) => setQuery(e.target.value)}
										placeholder="Filter components"
										aria-label="Filter components"
									/>
								</label>
								<SidebarNav selectedSlug={selectedSlug} onSelect={scrollToComponent} query={query} />
							</div>

							<div className="api-rail-peek" aria-hidden={!railCollapsed}>
								<button
									type="button"
									className="api-rail-peek__label"
									onClick={() => setRailCollapsed(false)}
									title="Browse components"
									aria-label="Browse components"
								>
									Browse components
								</button>
							</div>
						</div>

						<button
							type="button"
							className="api-rail-handle"
							aria-expanded={!railCollapsed}
							aria-controls="api-component-nav"
							onClick={() => setRailCollapsed((collapsed) => !collapsed)}
							title={railCollapsed ? 'Expand component list' : 'Collapse component list'}
							aria-label={railCollapsed ? 'Expand component list' : 'Collapse component list'}
						>
							<span className={`api-rail-handle__icon${railCollapsed ? ' is-collapsed' : ''}`}>
								{RAIL_HANDLE_ICON}
							</span>
						</button>
					</aside>

					<div className="api-shell__main">
						{visibleComponents.length ? (
							<div className="api-catalog">
								{visibleComponents.map((component) => (
									<ComponentSection
										key={component.slug}
										component={component}
										query={query}
										kinds={kinds}
										sectionRef={(el) => {
											if (el) sectionRefs.current.set(component.slug, el);
											else sectionRefs.current.delete(component.slug);
										}}
									/>
								))}
							</div>
						) : (
							<div className="api-empty">No components match your filters.</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
