import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { addons } from 'storybook/preview-api';
import {
	CH_OVERRIDES_CHANGED,
	CH_RESET,
	THEME_ROLE_GROUPS,
	THEME_ROLE_NAMES,
	type Role,
	type RoleGroup,
} from './theme-roles';
import {
	applyOverride,
	buildCss,
	clearOverride,
	contrastGrade,
	contrastRatio,
	currentOverride,
	effectiveValue,
	isChanged,
	resolveDefault,
} from './theme-editor-utils';
import { CH_APP_APPEARANCE, readStoredAppearance } from './storybook-appearance.js';
import { ThemeEditorPreview } from './ThemeEditorPreview';

const SEARCH_ICON = (
	<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
		<circle cx="11" cy="11" r="7" />
		<path d="m20 20-3.5-3.5" />
	</svg>
);

const RAIL_HANDLE_ICON = (
	<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" aria-hidden="true">
		<path d="M15 6l-6 6 6 6" />
	</svg>
);

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

const CONTRAST_EXEMPT_TEXT_ROLES = new Set([
	'--color-text-inverse',
	'--color-text-disabled', // WCAG — inactive/disabled UI is exempt from contrast requirements
]);

const CONTRAST_PAIRS: Array<{ label: string; fg: string; bg: string }> = [
	{ label: 'Text on Surface', fg: '--color-text', bg: '--color-background-surface' },
	{ label: 'Text subtle on Surface', fg: '--color-text-subtle', bg: '--color-background-surface' },
	{ label: 'Inverse on Primary', fg: '--color-text-inverse', bg: '--color-primary' },
];

function roleByToken(token: string): Role | undefined {
	for (const g of THEME_ROLE_GROUPS) {
		const role = g.roles.find((r) => r.name === token);
		if (role) return role;
	}
	return undefined;
}

function curValue(token: string, dark: boolean): string {
	const role = roleByToken(token);
	if (!role) return '';
	return effectiveValue(role, dark);
}

function RoleRow({
	role,
	dark,
	surfaceHex,
	onChange,
}: {
	role: Role;
	dark: boolean;
	surfaceHex: string;
	onChange: () => void;
}) {
	const def = useMemo(() => resolveDefault(role, dark), [role, dark]);
	const [text, setText] = useState(() => currentOverride(role.name) || def);
	const changed = isChanged(role.name);

	useEffect(() => {
		if (!changed) setText(def);
		else setText(currentOverride(role.name));
	}, [def, changed, role.name]);

	const colorHex = /^#[0-9a-f]{6}$/i.test(text) ? text : def || '#000000';

	const setValue = (v: string) => {
		const trimmed = v.trim();
		if (trimmed === '' || trimmed === def) {
			clearOverride(role.name);
			setText(def);
		} else {
			applyOverride(role.name, trimmed);
			setText(trimmed);
		}
		onChange();
	};

	const contrastBadge = useMemo(() => {
		if (role.type !== 'color' || !role.name.startsWith('--color-text-')) {
			return null;
		}
		if (CONTRAST_EXEMPT_TEXT_ROLES.has(role.name)) {
			return null;
		}
		const ratio = contrastRatio(text, surfaceHex);
		if (ratio === null) return null;
		const [grade, label] = contrastGrade(ratio);
		return { grade, label: `${label} ${ratio.toFixed(1)}` };
	}, [role, text, surfaceHex]);

	return (
		<div className={`te-role${changed ? ' is-changed' : ''}`} data-token={role.name} data-label={role.label}>
			{role.type === 'length' ? (
				<span className="te-role__sw te-role__sw--size">px</span>
			) : (
				<span className="te-role__sw" style={{ background: colorHex }}>
					<input
						type="color"
						value={colorHex}
						aria-label={`Pick colour for ${role.label}`}
						onInput={(e) => setValue((e.target as HTMLInputElement).value)}
					/>
				</span>
			)}
			<span className="te-role__meta">
				<span className="te-role__name">
					{role.label}
					{contrastBadge ? (
						<span className={`te-badge te-badge--${contrastBadge.grade}`}>{contrastBadge.label}</span>
					) : null}
				</span>
				<code>{role.name}</code>
			</span>
			<span className="te-role__val">
				<input
					type="text"
					value={text}
					spellCheck={false}
					placeholder={role.note ?? def}
					onChange={(e) => setText(e.target.value)}
					onBlur={(e) => setValue(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === 'Enter') setValue((e.target as HTMLInputElement).value);
					}}
				/>
				<button
					type="button"
					className="te-role__reset"
					title="Reset to default"
					hidden={!changed}
					onClick={() => {
						clearOverride(role.name);
						setText(def);
						onChange();
					}}
				>
					↺
				</button>
			</span>
		</div>
	);
}

function ThemeModeToggle({
	previewDark,
	onChange,
	compact = false,
}: {
	previewDark: boolean;
	onChange: (dark: boolean) => void;
	compact?: boolean;
}) {
	return (
		<div className={`te-theme-mode${compact ? ' te-theme-mode--compact' : ''}`} role="group" aria-label="Theme mode">
			{compact ? null : <span className="te-theme-mode__label">Theme</span>}
			<div className="te-theme-mode__group">
				<button
					type="button"
					className="te-theme-mode__btn"
					aria-pressed={!previewDark}
					title="Light theme"
					onClick={() => onChange(false)}
				>
					{SUN_ICON}
					<span>Light</span>
				</button>
				<button
					type="button"
					className="te-theme-mode__btn"
					aria-pressed={previewDark}
					title="Dark theme"
					onClick={() => onChange(true)}
				>
					{MOON_ICON}
					<span>Dark</span>
				</button>
			</div>
		</div>
	);
}

function GroupSection({
	group,
	dark,
	surfaceHex,
	query,
	onChange,
	sectionRef,
}: {
	group: RoleGroup;
	dark: boolean;
	surfaceHex: string;
	query: string;
	onChange: () => void;
	sectionRef: (el: HTMLElement | null) => void;
}) {
	const q = query.trim().toLowerCase();
	const visibleRoles = group.roles.filter(
		(r) => !q || r.label.toLowerCase().includes(q) || r.name.includes(q)
	);
	if (visibleRoles.length === 0) return null;

	return (
		<section className="te-grp" id={group.id} ref={sectionRef}>
			<h2>{group.title}</h2>
			{group.blurb ? <p>{group.blurb}</p> : null}
			{visibleRoles.map((role) => (
				<RoleRow
					key={role.name}
					role={role}
					dark={dark}
					surfaceHex={surfaceHex}
					onChange={onChange}
				/>
			))}
		</section>
	);
}

export function ThemeEditorPage(): React.ReactElement {
	const [query, setQuery] = useState('');
	const [previewDark, setPreviewDark] = useState(false);
	const [changeTick, setChangeTick] = useState(0);
	const [feedback, setFeedback] = useState('');
	const [activeGroup, setActiveGroup] = useState(THEME_ROLE_GROUPS[0]?.id ?? '');
	const [docsDark, setDocsDark] = useState(() => readStoredAppearance() === 'dark');
	const [railCollapsed, setRailCollapsed] = useState(false);
	const [viewMode, setViewMode] = useState<'editor' | 'preview'>('editor');

	const searchRef = useRef<HTMLInputElement>(null);
	const sectionRefs = useRef<Map<string, HTMLElement>>(new Map());

	// changeTick is deliberately listed in deps below without being read in the
	// callbacks: these memos read the external override store, and the tick is
	// what invalidates them after a mutation.
	const changedCount = useMemo(() => THEME_ROLE_NAMES.filter(isChanged).length, [changeTick]);

	const cssOutput = useMemo(() => buildCss(), [changeTick]);

	const surfaceHex = useMemo(() => curValue('--color-background-surface', previewDark), [changeTick, previewDark]);

	const emitState = useCallback(() => {
		try {
			addons.getChannel().emit(CH_OVERRIDES_CHANGED, THEME_ROLE_NAMES.filter(isChanged).length);
		} catch {
			/* channel not ready */
		}
	}, []);

	const bump = useCallback(() => {
		setChangeTick((n) => n + 1);
		emitState();
	}, [emitState]);

	const showFeedback = (msg: string, ms = 1800) => {
		setFeedback(msg);
		window.setTimeout(() => setFeedback(''), ms);
	};

	const resetAll = () => {
		THEME_ROLE_NAMES.forEach(clearOverride);
		bump();
		showFeedback('Reset all tokens.', 1500);
	};

	const exportCss = async () => {
		try {
			await navigator.clipboard.writeText(buildCss());
			showFeedback(changedCount > 0 ? 'Copied to clipboard.' : 'Copied (no overrides yet).');
		} catch {
			showFeedback('Copy failed — select the output manually.');
		}
	};

	// Channel: toolbar reset + announce state on mount
	useEffect(() => {
		const resync = () => bump();
		try {
			const ch = addons.getChannel();
			ch.on(CH_RESET, resync);
			emitState();
			return () => ch.off(CH_RESET, resync);
		} catch {
			emitState();
			return undefined;
		}
	}, [bump, emitState]);

	// Docs appearance sync (story canvas, not MDX)
	useEffect(() => {
		const sync = () => setDocsDark(readStoredAppearance() === 'dark');
		sync();
		try {
			const ch = addons.getChannel();
			ch.on(CH_APP_APPEARANCE, sync);
			return () => ch.off(CH_APP_APPEARANCE, sync);
		} catch {
			return undefined;
		}
	}, []);

	// Cmd/Ctrl+K focuses role filter (no hint in UI).
	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
				e.preventDefault();
				searchRef.current?.focus();
			}
		};
		document.addEventListener('keydown', onKey);
		return () => document.removeEventListener('keydown', onKey);
	}, []);

	// Scroll spy for rail active group (page scroll, like CSS API Reference)
	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) setActiveGroup(entry.target.id);
				}
			},
			{ root: null, rootMargin: '-81px 0px -65% 0px', threshold: 0 }
		);

		sectionRefs.current.forEach((el) => observer.observe(el));
		return () => observer.disconnect();
	}, [query]);

	const groupsWithChanges = useMemo(() => {
		const set = new Set<string>();
		THEME_ROLE_GROUPS.forEach((g) => {
			if (g.roles.some((r) => isChanged(r.name))) set.add(g.id);
		});
		return set;
	}, [changeTick]);

	const filteredGroupCount = useMemo(() => {
		const q = query.trim().toLowerCase();
		if (!q) return THEME_ROLE_GROUPS.length;
		return THEME_ROLE_GROUPS.filter((g) =>
			g.roles.some((r) => r.label.toLowerCase().includes(q) || r.name.includes(q))
		).length;
	}, [query]);

	const totalTokens = THEME_ROLE_NAMES.length;

	const contrastRows = useMemo(() => {
		return CONTRAST_PAIRS.map(({ label, fg, bg }) => {
			const ratio = contrastRatio(curValue(fg, previewDark), curValue(bg, previewDark));
			if (ratio === null) return null;
			const [grade, txt] = contrastGrade(ratio);
			return { label, grade, txt, ratio: ratio.toFixed(2) };
		}).filter(Boolean) as Array<{ label: string; grade: string; txt: string; ratio: string }>;
	}, [changeTick, previewDark]);

	const scrollToGroup = useCallback((id: string) => {
		const section = sectionRefs.current.get(id);
		if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
		setActiveGroup(id);
	}, []);

	const navigateToGroup = useCallback(
		(id: string) => {
			if (viewMode === 'preview') {
				setViewMode('editor');
				setActiveGroup(id);
				requestAnimationFrame(() => sectionRefs.current.get(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
			} else {
				scrollToGroup(id);
			}
		},
		[viewMode, scrollToGroup]
	);

	const switchView = useCallback(
		(mode: 'editor' | 'preview') => {
			setViewMode(mode);
			if (mode === 'editor') {
				requestAnimationFrame(() => scrollToGroup(activeGroup));
			}
		},
		[activeGroup, scrollToGroup]
	);

	return (
		<div className={`osui-theme-editor sb-unstyled${docsDark ? ' docs-dark' : ''}`}>
			<header className="te-head">
				<div className="te-head-in">
					<span className="te-eyebrow">Design system · Theme Editor</span>
					<h1>
						Edit theme tokens,
						<br />
						<em>see it live.</em>
					</h1>
					<p className="te-lede">
						Override <code>--color-*</code> and <code>--border-radius-*</code> tokens at{' '}
						<code>:root</code>. Export CSS for your app.
					</p>
				</div>
			</header>

			<div className="te-toolbar">
				<div className="te-toolbar-in">
					<div className="te-seg te-seg--view" role="group" aria-label="View">
						<button type="button" aria-pressed={viewMode === 'editor'} onClick={() => switchView('editor')}>
							Editor
						</button>
						<button type="button" aria-pressed={viewMode === 'preview'} onClick={() => switchView('preview')}>
							Preview
						</button>
					</div>
				{changedCount > 0 ? (
					<span className="te-chip-diff">
						<span>{changedCount}</span> changed
					</span>
				) : null}
				<span className="te-spacer" />
				{feedback ? <span className="te-feedback">{feedback}</span> : null}
				<button type="button" className="te-btn te-btn--quiet" onClick={resetAll}>
					Reset all
				</button>
				<button type="button" className="te-btn te-btn--primary" onClick={exportCss}>
					Export
				</button>
				</div>
			</div>

			<div className={`te-wrap${railCollapsed ? ' is-rail-collapsed' : ''} is-view-${viewMode}`}>
				<nav className={`te-rail${railCollapsed ? ' is-rail-collapsed' : ''}`} aria-label="Token groups">
					<div className="te-rail-inner">
						<div className="te-rail-body" id="te-role-nav">
							<div className="te-rail-head">
								<div className="te-rail-head__copy">
									<span className="te-rail-head__title">Token groups</span>
									<span className="te-rail-head__meta">{totalTokens} tokens</span>
								</div>
							</div>
							<label className="te-search">
								{SEARCH_ICON}
								<input
									ref={searchRef}
									type="search"
									placeholder="Filter tokens"
									value={query}
									onChange={(e) => setQuery(e.target.value)}
									aria-label="Filter tokens"
								/>
							</label>
							<div className="te-nav">
								{THEME_ROLE_GROUPS.map((g) => {
									const q = query.trim().toLowerCase();
									const count = q
										? g.roles.filter((r) => r.label.toLowerCase().includes(q) || r.name.includes(q)).length
										: g.roles.length;
									if (q && count === 0) return null;
									return (
										<button
											key={g.id}
											type="button"
											className={`te-nav-item${activeGroup === g.id ? ' is-active' : ''}${groupsWithChanges.has(g.id) ? ' has-changes' : ''}`}
											aria-current={activeGroup === g.id ? 'true' : undefined}
											onClick={() => navigateToGroup(g.id)}
										>
											<span>{g.title}</span>
											<i>{count}</i>
										</button>
									);
								})}
							</div>
							<p className="te-rail__hint">
								{totalTokens} tokens. Type to filter by label or name, for example <code>radius</code> or{' '}
								<code>--color-text</code>.
							</p>
						</div>

						<div className="te-rail-peek" aria-hidden={!railCollapsed}>
							<button
								type="button"
								className="te-rail-peek__label"
								onClick={() => setRailCollapsed(false)}
								title="Browse tokens"
								aria-label="Browse tokens"
							>
								Browse tokens
							</button>
						</div>
					</div>

					<button
						type="button"
						className="te-rail-handle"
						aria-expanded={!railCollapsed}
						aria-controls="te-role-nav"
						onClick={() => setRailCollapsed((collapsed) => !collapsed)}
						title={railCollapsed ? 'Expand token list' : 'Collapse token list'}
						aria-label={railCollapsed ? 'Expand token list' : 'Collapse token list'}
					>
						<span className={`te-rail-handle__icon${railCollapsed ? ' is-collapsed' : ''}`}>
							{RAIL_HANDLE_ICON}
						</span>
					</button>
				</nav>

				<main className="te-roles">
					{viewMode === 'editor' ? (
						<div className="te-editor-bar">
							<p>Token defaults for the active theme.</p>
							<ThemeModeToggle previewDark={previewDark} onChange={setPreviewDark} compact />
						</div>
					) : null}
					{filteredGroupCount === 0 ? (
						<p className="te-empty">No tokens match your filter.</p>
					) : (
						THEME_ROLE_GROUPS.map((group) => (
							<GroupSection
								key={group.id}
								group={group}
								dark={previewDark}
								surfaceHex={surfaceHex}
								query={query}
								onChange={bump}
								sectionRef={(el) => {
									if (el) sectionRefs.current.set(group.id, el);
									else sectionRefs.current.delete(group.id);
								}}
							/>
						))
					)}
				</main>

				<aside className="te-side">
					<div className={`te-preview-zone${previewDark ? ' theme-dark' : ''}`}>
						<div className="te-preview-zone__head">
							<h3>
								Preview <span className="te-live">live</span>
							</h3>
							<ThemeModeToggle previewDark={previewDark} onChange={setPreviewDark} compact />
						</div>
						<ThemeEditorPreview />
					</div>

					<div className="te-panel">
						<h4>Contrast</h4>
						<div className="te-contrast">
							{contrastRows.map((row) => (
								<div key={row.label} className="te-contrast-row">
									<span className="te-contrast-pair">{row.label}</span>
									<span className={`te-badge te-badge--${row.grade}`}>{row.txt}</span>
									<span className="te-contrast-ratio">{row.ratio}:1</span>
								</div>
							))}
						</div>
					</div>

					<div className="te-panel">
						<h4>CSS output (changed tokens only)</h4>
						<pre className="te-output">{cssOutput}</pre>
					</div>
				</aside>
			</div>
		</div>
	);
}
