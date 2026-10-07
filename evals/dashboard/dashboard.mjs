// @ts-check
// ---- pure helpers: formatting, escaping, score bands
const f1 = (n) => (Math.round(n * 10) / 10).toFixed(1);
const signed = (n) => (n > 0 ? '+' : '') + f1(n);
const esc = (s) =>
	String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const meanOf = (xs) => (xs.length ? xs.reduce((s, x) => s + x, 0) / xs.length : 0);
const when = (iso) => new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
const tone = (s) => `t${s.tone % 4}`;
const clsOf = (e) => e.cls || (e.movable ? 'movable' : 'structural');
const range = (evals) => (evals.length ? `${evals[0].id}–${evals[evals.length - 1].id}` : '');
const plural = (n, word) => (n === 1 ? word : `${word}s`);

/** Score band class. */
function cls(n) {
	if (n >= 80) return 'good';
	if (n >= 60) return 'warn';
	return 'bad';
}
/** Direction class of a delta. */
function deltaCls(d) {
	if (d > 0) return 'up';
	if (d < 0) return 'down';
	return 'flat';
}
/** Inline style of a heatmap cell. */
function shade(v) {
	if (v === null) return '';
	if (v >= 80) return 'background:var(--good-soft);color:var(--good)';
	if (v >= 60) return 'background:var(--warn-soft);color:var(--warn)';
	return 'background:var(--bad-soft);color:var(--bad)';
}
/** Text of a heatmap cell. */
function cellText(v) {
	if (v.s !== null) return f1(v.s);
	return v.w === 'na' ? 'n/a' : '—';
}
/** `<div class="…">…</div>` or nothing. */
function block(className, content) {
	return content ? `<div class="${className}">${content}</div>` : '';
}

/** One finding: chips for the evals it moves, what, what is missing, what to do, extra markup. */
function item(lookup, ids, what, missing, todo, extra = '') {
	const chips = ids.map((id) => chip(id, lookup)).join('');
	return `<li class="item"><div class="chips">${chips}</div><div><div class="what">${what}</div>${block('missing', missing)}${block('do', todo)}${extra}</div></li>`;
}

function unmeasuredGroup(evals, lookup) {
	const un = evals.filter((e) => e.unmeasured.n);
	if (!un.length) return null;
	const items = un.map((e) => {
		const reasons = [...new Set(e.unmeasured.items.map((i) => i.r))].map((r) => esc(r));
		const names = e.unmeasured.items.map((i) => `<li>${esc(i.n)}</li>`).join('');
		const count = `${e.unmeasured.n} ${plural(e.unmeasured.n, 'component')}`;
		const list = `<details><summary>${count}</summary><ul>${names}</ul></details>`;
		return item(
			lookup,
			[e.id],
			`${esc(e.name)}: ${count}`,
			reasons.join('; '),
			esc(e.unmeasuredHint || 'Give the component what the eval reads.'),
			list
		);
	});
	return {
		cls: 'warn',
		title: 'Not measured yet',
		lead: 'Component / eval pairs the suite cannot score in the latest run; they count as absent, not as zero. Components an eval does not apply to are not listed.',
		items,
	};
}

/**
 * The per-block tables a suite contributes through its evals' `extra` ({ title, lead, columns, rows }); null
 * when it contributes none. The same figures sit in the heatmap as block cells; the table adds what is missing
 * and what to do per block, lowest first.
 */
/** The per-block tables a suite's extra carries, keyed by the eval id they belong to. */
function blockTables(s) {
	return Object.entries(s.extra || {})
		.filter(([, v]) => v && Array.isArray(v.columns) && Array.isArray(v.rows) && typeof v.title === 'string')
		.map(([key, v]) => ({ id: s.evals.map((e) => e.id).find((x) => key.endsWith(x)), table: v }));
}
/** A table where every block scores 100 has nothing left to show. */
const tableComplete = (v) => v.rows.length > 0 && v.rows.every((r) => String(r[1]) === '100');

function tablesGroup(s, lookup) {
	// complete tables leave this group: the Done group names them
	const tables = blockTables(s).filter(({ table }) => !tableComplete(table));
	if (!tables.length) return null;
	const items = tables.map(({ id, table: v }) => {
		const head = v.columns.map((c) => `<th>${esc(c)}</th>`).join('');
		const cellsOf = (r) => r.map((c) => `<td>${esc(String(c))}</td>`).join('');
		const body = v.rows.map((r) => `<tr>${cellsOf(r)}</tr>`).join('');
		const lead = typeof v.lead === 'string' && v.lead ? `<p class="block-lead">${esc(v.lead)}</p>` : '';
		const table = `<table class="block-table"><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>`;
		return item(lookup, id ? [id] : [], esc(v.title), '', '', lead + table);
	});
	if (!items.length) return null;
	return {
		cls: `tables-${s.id}`,
		title: `${s.name}: per-block tables`,
		lead: 'One row per OML block, lowest score first: what is missing and what to do. The same scores sit in the heatmap as block cells.',
		items,
	};
}

/** The roadmap group of a suite that reports requirements; null when it reports none. */
function roadmapGroup(s, lookup) {
	const reqs = s.extra && s.extra.requirements;
	if (!reqs) return null;
	const roadmapIds = s.evals.filter((e) => clsOf(e) === 'roadmap').map((e) => e.id);
	const own = reqs.filter((r) => r.owner === 'osui' && r.status !== 'offered');
	const flows = (s.extra.flows || []).filter((f) => f.kit !== 'complete');
	const byGroup = {};
	for (const r of own) {
		if (!byGroup[r.group]) byGroup[r.group] = [];
		byGroup[r.group].push(r);
	}
	const items = Object.entries(byGroup).map(([g, rs]) => {
		const missing = rs.filter((r) => r.status === 'missing').length;
		const partial = rs.filter((r) => r.status === 'partial').length;
		const rows = rs
			.sort((a, b) => a.status.localeCompare(b.status) || a.name.localeCompare(b.name))
			.map((r) => requirementRow(r))
			.join('');
		return item(
			lookup,
			roadmapIds,
			`${esc(g)}: ${missing} missing, ${partial} partial`,
			'',
			'',
			`<ul class="req-groups">${rows}</ul>`
		);
	});
	if (flows.length) {
		const text = flows.map((f) => `${esc(f.flow)}: ${esc([...f.missing, ...f.partial].join(', '))}`).join('; ');
		items.push(
			item(
				lookup,
				roadmapIds,
				'Flows not kit-complete',
				text,
				'A flow is kit-complete when every UI element the document lists for it is offered or delegated.'
			)
		);
	}
	const delegated = reqs.filter((r) => r.owner !== 'osui');
	if (delegated.length) {
		items.push(
			item(
				lookup,
				roadmapIds,
				`Delegated to other OutSystems products (${delegated.length})`,
				delegated.map((r) => `${esc(r.name)} → ${esc(r.owner)}`).join('; '),
				'Reported so the parity table matches the document; not scored here.'
			)
		);
	}
	const roadmapScore = roadmapIds.length ? f1(lookup[roadmapIds[0]].e.score) : '';
	return {
		cls: 'roadmap',
		title: `Roadmap: ${s.name} requirements not offered yet`,
		lead: `${roadmapIds.join(', ')} at ${roadmapScore}. New components or features from the requirements document; neither refactors nor breaking changes.`,
		items,
	};
}

/** Human name of a heatmap sort key. */
function sortLabel(key) {
	if (key === 'n') return 'name';
	if (key === 'k') return 'category';
	if (key === 'mean') return 'mean score';
	return key;
}
/** Whether an eval applies to a row: its kind is listed, or the list names blocks and the row is one. */
function rowApplies(e, c) {
	if (!Array.isArray(e.appliesTo)) return true;
	return e.appliesTo.includes(c.k) || (c.c === 'component' && e.appliesTo.includes('block'));
}
/** `block` → `OML blocks`, else the plural of the kind. */
const measuresText = (kind) => (kind === 'block' ? 'OML blocks' : `${kind}s`);

/**
 * The cell of a row for an eval: the data set's, else not applicable by kind (the data set omits those cells to
 * stay small; the texts come with it), else no cell.
 */
function cellOf(c, id, e, kindTexts) {
	const hit = c.cells[id];
	if (hit) return hit;
	if (e && !rowApplies(e, c)) {
		const measures = e.appliesTo.map(measuresText).join(', ');
		const styleBlock = c.c === 'component' && (c.k === 'component' || c.k === 'layout');
		const outside =
			(styleBlock && kindTexts.styleBlock) || kindTexts[c.k] || `rows of the ${c.k} kind are outside it`;
		return { s: null, w: 'na', h: `Not applicable: this eval measures ${measures}; ${outside}.` };
	}
	return { s: null, w: 'unmeasured', h: 'No cell in this data set.' };
}
/** The runtime note of a block row: the pattern or stylesheet it drives, or pure OML. */
function runtimeNote(r) {
	if (r.c !== 'component') return '';
	if (r.rt && r.rt.p) return ` <small>pattern ${esc(r.rt.p)}</small>`;
	if (r.rt && r.rt.s) return ` <small>style ${esc(r.rt.s)}</small>`;
	return ' <small>pure OML</small>';
}

/** One heatmap cell. */
function cell(v) {
	if (v.s === null) return `<td class="cell ${v.w}" title="${esc(v.h)}">${cellText(v)}</td>`;
	return `<td class="cell" style="${shade(v.s)}" title="${esc(v.h)}">${f1(v.s)}</td>`;
}

/** One suite's polyline, dots and end labels on the trend chart. */
function trendLine(suite, k, runs, xs, y) {
	const pts = runs.map((r, i) => ({ r, i })).filter(({ r }) => r.suites[suite.id]);
	if (!pts.length) return '';
	const poly = pts.map(({ r, i }) => `${xs[i]},${y(r.suites[suite.id].index)}`).join(' ');
	const parts = [`<g class="${tone(suite)}">`];
	if (k === 0) {
		parts.push(
			`<polygon class="area" points="${xs[pts[0].i]},${y(0)} ${poly} ${xs[pts[pts.length - 1].i]},${y(0)}"/>`
		);
	}
	if (pts.length > 1) parts.push(`<polyline class="line" points="${poly}"/>`);
	pts.forEach(({ r, i }, j) => {
		const isLast = j === pts.length - 1;
		const v = r.suites[suite.id].index;
		parts.push(`<circle class="dot ${isLast ? 'last' : ''}" cx="${xs[i]}" cy="${y(v)}" r="4.5"/>`);
		if (j === 0 || isLast) {
			const dy = k === 0 ? -12 : 20;
			const anchor = j === 0 ? 'start' : 'end';
			parts.push(`<text class="label" x="${xs[i]}" y="${y(v) + dy}" text-anchor="${anchor}">${f1(v)}</text>`);
		}
	});
	parts.push('</g>');
	return parts.join('');
}
/** The right-hand label of a small multiple. */
function rangeLabel(vals, flat, d) {
	if (vals.length < 2) return 'first run';
	if (flat) return 'unchanged';
	return signed(d);
}
/** A chip for one eval id, coloured by its score. */
function chip(id, lookup) {
	if (id === 'all') return '<span class="chip">all</span>';
	const hit = lookup[id];
	const band = hit ? cls(hit.e.score) : '';
	const name = hit ? hit.e.name : '';
	return `<span class="chip ${band}" title="${esc(name)}">${esc(id)}</span>`;
}
/** One requirement row of the roadmap table. */
function requirementRow(r) {
	const reason = r.reason ? ` <small>· ${esc(r.reason)}</small>` : '';
	return `<li><span>${esc(r.name)}${reason}</span><span class="status-pill st-${esc(r.status)}">${esc(r.status)}</span></li>`;
}

/**
 * The dashboard page logic. `mount` renders the embedded data set into the page and wires the refresh
 * button to the artifact database. The build (tools/dashboard-page.mjs) inlines this module into
 * dashboard/index.html with the data set; the render check imports it and mounts it on a document stub.
 *
 * Every string that reaches innerHTML passes through `esc`; the data set is trusted content of this
 * repository (results/dashboard.json) or the artifact database document the page owner writes.
 * @param {any} document
 * @param {any} window
 * @param {{ getItem(key: string): string|null, setItem(key: string, value: string): void }} localStorage
 * @param {any} EMBEDDED the data set built by tools/dashboard-data.mjs (v5)
 */
export function mount(document, window, localStorage, EMBEDDED) {
	const DOC_PATH = 'evals/dashboard';
	const DATA_VERSION = 5;
	const categoryLabel = (c) => (D.categoryLabels && D.categoryLabels[c]) || c;
	// Documentation of the branch work, linked to the evals it moved. Kept in the page: it is
	// narrative, not a measurement.
	const APPLIED = [
		{
			evals: ['E01', 'E03', 'E05'],
			what: 'Agent documentation generated from the source (S-1, S-6)',
			detail: 'scripts/generate-ai-docs.mjs reads the same config classes, enums, API files and stories as the evals and writes docs-ai/: osui.components.json with a JSON Schema (lifecycle, typed props with defaults, allowed values and descriptions, events, CSS classes, --osui-* knobs, a markup skeleton for all 33 patterns), plus llms.txt, llms-components.txt (one ~430-token card per pattern instead of ~2,700 tokens of source), llms-tokens.txt with the legacy aliases marked, llms-utilities.txt and llms-patterns.txt. 111 config props received a verified comment so the cards have descriptions. E01 64.9 → 99.9, E03 0 → 100, E05 35.8 → 100.',
			do: 'Run npm run docs:ai in every PR that touches a pattern; the CI freshness check fails a stale commit. postdocs copies docs-ai/ into the documentation site so /llms.txt is served at its root.',
		},
		{
			evals: ['E10', 'E02', 'E01'],
			what: 'Typed configs and events for every pattern, additively (S-2, S-9)',
			detail: 'Helper.ParseConfigs accepts an object as well as a JSON string, so Create(id, configs) takes string | Configs in all 33 APIs and 9 factories; the string path is byte-for-byte the old JSON.parse. scripts/generate-pattern-types.mjs writes PatternTypes.ts: a Configs type per pattern (optional, documented props; provider-typed values degrade to unknown with the source type noted) and an EventName union with a string escape hatch, merged into the public API namespaces and emitted into the published .d.ts. Types are erased at build, so the bundle is unchanged. E10 39.4 → 60.8.',
			do: 'npm run types:generate after changing a config class; a test asserts the generated file is fresh and inside the public layer.',
		},
		{
			evals: ['E04'],
			what: 'Type strictness raised to noImplicitAny with zero suppressions (S-3, S-4, S-10)',
			detail: '72 implicit-any findings annotated across child maps, config indexing, l10n dictionaries, listener and window indexing and provider callbacks; the 4 @ts-expect-error replaced by typed casts, a window.monthSelectPlugin declaration and the true return type of SetDeviceBreakpoints; the Orientation alias in Global.d.ts repointed at the real enum (it resolved to any before); NewFloatingPosition declares its return type and is called without new. Enabling the flag surfaced three latent errors the Gulp build never reports (AnimateOnDrag, Tabs, Tooltip), now annotated. Emitted JavaScript is identical. E04 83.2 → 100.',
			do: 'Next step of this kind is strictNullChecks, a larger behaviour-neutral annotation pass.',
		},
		{
			evals: ['E05', 'E06'],
			what: 'API surface completed and made uniform (S-5, S-11, S-12)',
			detail: '24 API JSDoc blocks fixed (parameter names that no longer matched, missing parameters on Create for Carousel, Dropdown and Progress); camelCase parameters on GetAccordionById, ToggleNativeBehavior and SetEditableInput (JavaScript callers pass positionally, so nothing breaks); ChangeProperty added to SwipeEvents and TouchEvents with new error codes; the last keyCode use in the runtime (Menu icon key handler) reads e.key. 348/348 functions and 141/141 props documented. E06 97.7 → 98.7.',
			do: 'A new function or prop needs its JSDoc line before docs-ai regenerates, or E05 and the freshness check flag it.',
		},
		{
			evals: ['all'],
			what: 'The measurement loop itself: suites, registry, gate, doctor, reports (S-7, S-8, S-13 to S-16)',
			detail: 'evals/: a suite registry (suites.mjs) the runner, gate, history report and this data set iterate; self-describing metrics (each carries the meaning of its cells, its advice and its gate rules); a component registry (components.json) every classification is read from, with a doctor that flags unclassified or renamed components and derives defaults from code; results per run with per-component rows, unmeasured and not-applicable pairs, history.json, HISTORY.md and this data set. CI: the gate fails when an index drops more than 1 point, when one eval drops more than 3, when a no-decrease eval (R01 coverage) goes down or when an eval leaves more components unmeasured than the baseline; docs-ai/ freshness is checked; a sticky PR comment carries the before → after tables and the registry section.',
			do: 'npm run evals -- --label <name> after a change, then npm run evals:gate and npm run docs:ai:check; a new component gets its entry through npm run evals:doctor -- --fix.',
		},
		{
			evals: ['M01', 'M02', 'M04', 'M05', 'M06'],
			what: 'The OML block snapshot, the block cards and the pattern ↔ block crosswalk (ADR-0015)',
			detail: 'evals/model/osui.blocks.json is exported from the OutSystems UI module OML at a pinned commit (osui-blocks-export, outside the repository): 118 public blocks with parameters, placeholders, events, static entities and structures. From it the generator writes docs-ai/osui.blocks.json, llms-blocks.txt (one card per composable block, within 250 tokens, with an OpenUI and a TSX recipe), osui.enums.json and osui.icons.json, and llms.txt gains a Producers section with runtime-only markers. evals/components.json links every composable block to the pattern or stylesheet it drives (the doctor proposes links by API call and by name). The model suite M01–M06 scores the manifest, the crosswalk, the cards, the producer guidance and the silent surfaces (utility classes, knobs, icons, enum values).',
			do: 'npm run evals:model:export after the module OML changes (a fixed OML in evals/model/local/ is exported instead, for iteration), then npm run docs:ai and npm run evals -- --label <name>.',
		},
		{
			evals: ['M01', 'M03', 'M04'],
			what: 'The composable OML block as the row, two categories instead of the four kinds (ADR-0016)',
			detail: 'Every heatmap row is a composable block (public, not deprecated, not Licenses) or a platform style; a block inherits the cells of the pattern or stylesheet it drives and carries its own M01, M03 and M04 cells. The rows fall in two categories, components (OML blocks) and platform & layout styles, each with an index per suite computed back to the first recorded run. The per-block tables say what is missing and what to do; a complete table leaves the Findings and is named here.',
			do: 'A new block needs a block link in evals/components.json (npm run evals:doctor -- --fix proposes it); npm run evals:history:categories recomputes the category series when the universe changes.',
		},
		{
			evals: ['M01', 'M03'],
			what: 'Platform defaults and the Text-on-purpose parameters (ADR-0017)',
			detail: 'An optional block parameter without an OML default takes the platform default of its data type (False, 0, 0.0, "", #1900-01-01#, NullIdentifier(), an empty structure or list); the manifest and the cards carry it with its source. ExtendedClass, the DOM identifiers (MenuId, WidgetId, …), free texts (Title, Name, …), measures with a unit (Size, Height, Width), format masks, SVG content and URLs are Text on purpose and never a typing gap; Binary Data is precise. M03 weighs descriptions 60 and precise types 40.',
			do: 'A parameter that is Text by design goes into TEXT_ON_PURPOSE (evals/model/lib/snapshot.mjs) with its reason; the OML request list then holds only descriptions and genuinely untyped parameters.',
		},
	];
	const BACKLOG = {
		E02: {
			id: 'B-9',
			what: 'Validated enum types for the stringly-typed enums',
			impact: 'invalid values fall back to the default instead of reaching the DOM as a class name',
		},
		E06: {
			id: 'B-3',
			what: 'Return the response envelope from the remaining SwipeEvents / TouchEvents functions',
			impact: 'return type void → string; exceptions are caught and serialised instead of thrown',
		},
		E07: {
			id: 'B-5',
			what: 'Declarative auto-instantiation from data attributes',
			impact: 'DOM contract change for every block; the runtime would synthesise the current structure',
		},
		E08: {
			id: 'B-7 / B-8',
			what: 'Route direct token reads through --osui-* knobs; remove the 10 !important',
			impact: 'additive when the knob default equals the current value, except portaled elements (balloons, bottom sheets); the !important removal changes cascade order',
		},
		E09: {
			id: 'B-6',
			what: 'Flatten deep selectors into state classes on the styled element',
			impact: 'cascade order changes; overrides written against the current specificity break',
		},
		E10: {
			id: 'B-4',
			what: 'ES-module facade / npm package with named exports',
			impact: 'the single AMD bundle becomes several files; needs a compatibility shim for OutSystems.OSUI.*',
		},
	};
	const WHY = {
		movable:
			'Moves with additive changes: documentation, generated docs and types, annotations, token routing, ARIA, key handlers, state styles',
		structural: 'Moves only with a change to the DOM contract, the cascade or the composition model',
		roadmap: 'Moves with new components or features',
	};

	let D = EMBEDDED;
	let heatSort = { key: 'mean', dir: 'asc' };
	let expanded = new Set();

	const allEvals = () => D.suites.flatMap((s) => s.evals.map((e) => ({ e, s })));
	const byId = () => Object.fromEntries(allEvals().map(({ e, s }) => [e.id, { e, s }]));
	const suiteRuns = (runs, s) => runs.filter((r) => r.suites[s.id]);

	function render() {
		const runs = [...D.history].sort((a, b) => a.date.localeCompare(b.date));
		const last = runs[runs.length - 1];
		const indices = D.suites.map((s) => `${s.indexName} (${range(s.evals)})`).join(' and ');
		document.getElementById('meta').textContent =
			`${indices}, each an unweighted mean · ${runs.length} runs · latest ${last.label} @ ${last.sha} · data generated ${when(D.generated)}`;
		document.getElementById('strip').innerHTML = tiles(last)
			.map((t) => {
				const label = `<span class="eyebrow">${esc(t.label)}</span>`;
				const value = `<span class="value">${esc(t.value)}</span>`;
				const sub = `<span class="sub">${esc(t.sub)}</span>`;
				return `<div class="tile ${t.cls || ''}">${label}${value}${sub}</div>`;
			})
			.join('');
		renderTrend(runs);
		renderMultiples(runs);
		renderEvals();
		renderHeat();
		renderFindings();
	}

	/** The summary strip: one index tile per suite, then the cross-suite counts. */
	function tiles(last) {
		const evals = allEvals().map(({ e }) => e);
		const movable = evals.filter((e) => clsOf(e) === 'movable');
		const structural = evals.filter((e) => clsOf(e) === 'structural');
		const unmeasured = evals.reduce((s, e) => s + e.unmeasured.n, 0);
		const unmeasuredBy = evals
			.filter((e) => e.unmeasured.n)
			.map((e) => `${e.id} ${e.unmeasured.n}`)
			.join(' · ');
		const out = D.suites.map((s) => {
			const first = s.baseline;
			const sub =
				first.label === last.label
					? `first measured in ${first.label}`
					: `${signed(s.latest.index - first.index)} since ${first.label} (${f1(first.index)})`;
			return { cls: `index ${tone(s)}`, label: s.indexName, value: f1(s.latest.index), sub };
		});
		// the same evals scored per category: the OML blocks an agent composes, and the platform styles
		for (const s of D.suites) {
			for (const [category, t] of Object.entries(s.categories || {})) {
				const moved =
					t.base === null || t.baseLabel === last.label
						? `first measured in ${last.label}`
						: `${signed(t.index - t.base)} since ${t.baseLabel} (${f1(t.base)})`;
				out.push({
					cls: `category ${tone(s)}`,
					label: `${s.name} · ${categoryLabel(category)}`,
					value: f1(t.index),
					sub: `${t.evals} evals apply · ${moved}`,
				});
			}
		}
		out.push({
			cls: '',
			label: 'Movable evals',
			value: `${movable.filter((e) => e.score >= 80).length} / ${movable.length} ≥ 80`,
			sub: `mean ${f1(meanOf(movable.map((e) => e.score)))} · ${movable.filter((e) => e.score >= 99.9).length} at 100`,
		});
		if (structural.length) {
			out.push({
				cls: '',
				label: 'Structural evals',
				value: f1(meanOf(structural.map((e) => e.score))),
				sub: `${structural.map((e) => e.id).join(', ')} · wait on a breaking-change decision`,
			});
		}
		out.push(
			{
				cls: '',
				label: 'Rows measured',
				value: String(D.components.length),
				sub: `${D.components.filter((c) => c.c === 'component').length} OML blocks · ${D.components.filter((c) => c.c !== 'component').length} platform styles`,
			},
			{
				cls: '',
				label: 'Unmeasured pairs',
				value: String(unmeasured),
				sub: unmeasuredBy || 'everything measurable is measured',
			}
		);
		return out;
	}

	function renderTrend(runs) {
		const W = 960;
		const H = 260;
		const padL = 44;
		const padR = 28;
		const padT = 26;
		const padB = 48;
		const xs = runs.map((_, i) => padL + (i * (W - padL - padR)) / Math.max(1, runs.length - 1));
		const y = (v) => padT + (H - padT - padB) * (1 - v / 100);
		const parts = [
			`<svg class="trend" viewBox="0 0 ${W} ${H}" role="img" aria-label="Index per run and suite, scale 0 to 100">`,
		];
		for (const g of [0, 25, 50, 75, 100]) {
			parts.push(
				`<line class="grid" x1="${padL}" x2="${W - padR}" y1="${y(g)}" y2="${y(g)}"/>`,
				`<text x="${padL - 8}" y="${y(g) + 4}" text-anchor="end">${g}</text>`
			);
		}
		D.suites.forEach((suite, k) => parts.push(trendLine(suite, k, runs, xs, y)));
		runs.forEach((r, i) => {
			parts.push(
				// the axis numbers the runs in date order (L1, L2, …); label, commit and date stay in the tooltip
				`<text x="${xs[i]}" y="${H - padB + 20}" text-anchor="middle">L${i + 1}</text>`
			);
		});
		parts.push(`<line class="cross" id="cross" x1="0" x2="0" y1="${padT}" y2="${H - padB}" visibility="hidden"/>`);
		const half = runs.length > 1 ? (xs[1] - xs[0]) / 2 : (W - padL - padR) / 2;
		runs.forEach((r, i) => {
			parts.push(
				`<rect class="hit" data-i="${i}" x="${xs[i] - half}" y="${padT}" width="${half * 2}" height="${H - padT - padB}"/>`
			);
		});
		parts.push('</svg>');
		const legend = D.suites
			.map((suite) => `<span class="${tone(suite)}"><i></i>${esc(suite.indexName)}</span>`)
			.join('');
		const host = document.getElementById('trend');
		host.innerHTML = `${parts.join('')}<div class="chart-legend">${legend}</div>`;
		wireTrendTips(host, runs, xs, y, W, H);
	}

	/** Tooltip text for one run of the trend chart: every suite's index and its move from the previous run. */
	function trendTip(r, prev, runIndex) {
		const branch = r.branch ? ` · ${esc(r.branch)}` : '';
		const lines = D.suites
			.filter((suite) => r.suites[suite.id])
			.map((suite) => {
				const index = r.suites[suite.id].index;
				const vsPrev =
					prev && prev.suites[suite.id]
						? ` (${signed(index - prev.suites[suite.id].index)} vs ${esc(prev.label)})`
						: '';
				return `<br>${esc(suite.name)} ${f1(index)}${vsPrev}`;
			});
		return `<b>L${runIndex + 1} · ${esc(r.label)}</b> @ ${esc(r.sha)} · ${esc(r.date.slice(0, 10))}${branch}${lines.join('')}`;
	}

	function wireTrendTips(host, runs, xs, y, W, H) {
		const tip = document.getElementById('tip');
		const svg = host.querySelector('svg');
		const cross = host.querySelector('#cross');
		host.querySelectorAll('.hit').forEach((rect) => {
			rect.addEventListener('mousemove', () => {
				const i = Number(rect.dataset.i);
				const r = runs[i];
				// the tip is a child of the body, so it is placed in page coordinates (viewport box + scroll)
				const box = svg.getBoundingClientRect();
				const first = D.suites.find((suite) => r.suites[suite.id]);
				const px = box.left + (window.scrollX || 0) + (xs[i] / W) * box.width;
				const py = box.top + (window.scrollY || 0) + (y(first ? r.suites[first.id].index : 0) / H) * box.height;
				tip.innerHTML = trendTip(r, runs[i - 1], i);
				tip.style.left = `${px}px`;
				tip.style.top = `${py}px`;
				tip.hidden = false;
				cross.setAttribute('x1', xs[i]);
				cross.setAttribute('x2', xs[i]);
				cross.setAttribute('visibility', 'visible');
			});
			rect.addEventListener('mouseleave', () => {
				tip.hidden = true;
				cross.setAttribute('visibility', 'hidden');
			});
		});
	}

	function renderMultiples(runs) {
		const W = 200;
		const H = 56;
		const pad = 6;
		document.getElementById('multiples').innerHTML = allEvals()
			.map(({ e, s }) => {
				const vals = suiteRuns(runs, s).map((r) => r.suites[s.id].scores[e.id] ?? 0);
				const xs = vals.map((_, i) => pad + (i * (W - 2 * pad)) / Math.max(1, vals.length - 1));
				const y = (v) => pad + (H - 2 * pad) * (1 - v / 100);
				const flat = vals.every((v) => v === vals[0]);
				const flatCls = flat ? 'flat' : '';
				const pts = vals.map((v, i) => `${xs[i]},${y(v)}`).join(' ');
				const d = vals[vals.length - 1] - vals[0];
				const first = f1(vals[0]);
				const lastValue = f1(vals[vals.length - 1]);
				const series = vals.map((v) => f1(v));
				const title = `<div class="t"><b>${esc(e.id)} <span class="muted">${esc(e.name)}</span></b><span class="mono">${esc(clsOf(e))}</span></div>`;
				const chart = [
					`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(e.name)} ${series.join(', ')}">`,
					`<line class="grid" x1="${pad}" x2="${W - pad}" y1="${y(0)}" y2="${y(0)}"/>`,
					`<polygon class="sparea" points="${xs[0]},${y(0)} ${pts} ${xs[xs.length - 1]},${y(0)}"/>`,
					`<polyline class="spark ${flatCls}" points="${pts}"/>`,
					`<circle class="end ${flatCls}" cx="${xs[xs.length - 1]}" cy="${y(vals[vals.length - 1])}" r="3.5"/>`,
					'</svg>',
				].join('');
				const footer = `<div class="range"><span>${first}</span><span class="delta ${deltaCls(d)}">${rangeLabel(vals, flat, d)}</span><span><b>${lastValue}</b></span></div>`;
				return `<div class="multiple ${tone(s)}" title="${esc(e.name)}: ${series.join(' → ')}">${title}${chart}${footer}</div>`;
			})
			.join('');
	}

	function renderEvals() {
		document.querySelector('#evals tbody').innerHTML = allEvals()
			.map(({ e, s }) => {
				const base = e.base ?? e.score;
				const d = e.score - base;
				const klass = clsOf(e);
				const suiteTag = D.suites.length > 1 ? ` <span class="suite-tag">${esc(s.name)}</span>` : '';
				const cells = [
					`<td class="mono">${esc(e.id)}${suiteTag}</td>`,
					`<td><div class="eval-name">${esc(e.name)}</div><div class="eval-crit">${esc(e.criterion)}</div></td>`,
					`<td><div class="bar" title="${f1(e.score)} (baseline ${f1(base)})"><i style="width:${e.score}%"></i><b style="left:${base}%"></b></div></td>`,
					`<td class="num">${f1(base)}</td>`,
					`<td class="num"><span class="pill ${cls(e.score)}">${f1(e.score)}</span></td>`,
					`<td class="num delta ${deltaCls(d)}">${signed(d)}</td>`,
					`<td><span class="pill neutral" title="${esc(WHY[klass] || '')}">${esc(klass)}</span></td>`,
					`<td class="notes">${esc(e.summary)}</td>`,
				];
				return `<tr class="${tone(s)}">${cells.join('')}</tr>`;
			})
			.join('');
	}

	/** aria-sort value of a heatmap column. */
	function ariaSort(key) {
		if (heatSort.key !== key) return 'none';
		return heatSort.dir === 'asc' ? 'ascending' : 'descending';
	}

	/** The heatmap legend: bands, cell states, suite colours and the evals without a column. */
	function heatLegend(noColumn) {
		const suites = D.suites.map((s) => {
			const prefix = s.evals.length ? s.evals[0].id.charAt(0) : '';
			return `<span class="suite-tag ${tone(s)}">${esc(prefix)} · ${esc(s.name)}</span>`;
		});
		let noColumnNote = '';
		if (noColumn.length) {
			const verb = noColumn.length === 1 ? 'is' : 'are';
			const have = noColumn.length === 1 ? 'it has' : 'they have';
			noColumnNote = ` ${noColumn.join(', ')} ${verb} measured per file or per requirement, so ${have} no column.`;
		}
		return [
			'<span><i style="background:var(--good-soft)"></i>≥ 80</span>',
			'<span><i style="background:var(--warn-soft)"></i>60 – 79</span>',
			'<span><i style="background:var(--bad-soft)"></i>&lt; 60</span>',
			'<span><i style="background:var(--surface-2)"></i>n/a, not applicable: the eval does not measure this kind of row, or there is nothing of its kind to check (hover for the reason)</span>',
			'<span><i style="background:repeating-linear-gradient(135deg, var(--surface-2) 0 3px, transparent 3px 6px)"></i>— not measured: the row lacks what the eval reads, such as a story (hover for the reason and the fix)</span>',
			`<span>Column ids are coloured by suite: ${suites.join(' ')}. Click a row for what each eval found and what to do.${noColumnNote}</span>`,
		].join('');
	}

	function renderHeat() {
		const cols = D.suites.flatMap((s) => s.heatmapEvals.map((id) => ({ id, s })));
		const ids = cols.map((c) => c.id);
		const toneOf = Object.fromEntries(cols.map((c) => [c.id, tone(c.s)]));
		const lookup = byId();
		const noColumn = allEvals()
			.filter(({ e, s }) => !s.heatmapEvals.includes(e.id))
			.map(({ e }) => e.id);
		document.getElementById('heat-legend').innerHTML = heatLegend(noColumn);
		const rows = D.components.map((c) => {
			const vals = ids.map((id) => cellOf(c, id, lookup[id]?.e, D.kindTexts || {}));
			const measured = vals.filter((v) => v.s !== null).map((v) => v.s);
			return {
				...c,
				vals,
				mean: measured.length ? meanOf(measured) : null,
				min: measured.length ? Math.min(...measured) : null,
			};
		});
		const thead = document.querySelector('#heat thead');
		const tbody = document.querySelector('#heat tbody');
		const filterEl = document.getElementById('heat-filter');
		const kindEl = document.getElementById('heat-kind');
		const weakEl = document.getElementById('heat-weak');
		function value(r, key) {
			if (key === 'n') return r.id;
			if (key === 'k') return `${r.c} ${r.k}`;
			if (key === 'mean') return r.mean;
			return r.vals[ids.indexOf(key)].s;
		}
		function header() {
			const heads = [
				{ key: 'n', label: 'Row' },
				{ key: 'k', label: 'Category' },
				...ids.map((id) => ({ key: id, label: id, title: lookup[id]?.e.name || id })),
				{ key: 'mean', label: 'Mean' },
			];
			const cells = heads.map((c) => {
				const num = ids.includes(c.key) || c.key === 'mean' ? 'num' : '';
				const button = `<button type="button" data-key="${c.key}" aria-sort="${ariaSort(c.key)}" title="${esc(c.title || 'sort')}">${esc(c.label)}</button>`;
				return `<th scope="col" class="${num} ${toneOf[c.key] || ''}">${button}</th>`;
			});
			thead.innerHTML = `<tr>${cells.join('')}</tr>`;
			thead.querySelectorAll('button').forEach((b) =>
				b.addEventListener('click', () => {
					const key = b.dataset.key;
					const flipped = heatSort.dir === 'asc' ? 'desc' : 'asc';
					heatSort = heatSort.key === key ? { key, dir: flipped } : { key, dir: 'asc' };
					draw();
				})
			);
		}
		function detail(r) {
			const items = ids.map((id, i) => {
				const v = r.vals[i];
				return `<li><span class="id">${esc(id)}</span><span class="s" style="${shade(v.s)}">${cellText(v)}</span><span>${esc(v.h)}</span></li>`;
			});
			return `<tr class="detail"><td colspan="${ids.length + 3}"><ul>${items.join('')}</ul></td></tr>`;
		}
		function row(r) {
			const mean = r.mean === null ? '—' : f1(r.mean);
			const cells = r.vals.map((v) => cell(v)).join('');
			// a block row shows its name, its flow and, with several snapshots, its platform suffix from the id
			const suffix = r.id.endsWith(')') ? ` ${r.id.slice(r.id.lastIndexOf('('))}` : '';
			const flow = r.f ? ` <span class="faint">${esc(r.f)}${esc(suffix)}</span>` : '';
			const head = `<td class="name">${esc(r.n)}${flow}</td><td class="kind">${esc(categoryLabel(r.c))}${runtimeNote(r)}</td>`;
			const tail = `<td class="cell mean" style="${shade(r.mean)}">${mean}</td>`;
			const open = expanded.has(r.id);
			return `<tr class="row" tabindex="0" data-n="${esc(r.id)}" aria-expanded="${open}">${head}${cells}${tail}</tr>${open ? detail(r) : ''}`;
		}
		function compare(a, b) {
			const va = value(a, heatSort.key);
			const vb = value(b, heatSort.key);
			if (va === null && vb === null) return a.id.localeCompare(b.id);
			if (va === null) return 1;
			if (vb === null) return -1;
			const c = typeof va === 'string' ? va.localeCompare(vb) : va - vb;
			return (heatSort.dir === 'asc' ? c : -c) || a.id.localeCompare(b.id);
		}
		function draw() {
			header();
			const q = (filterEl.value || '').trim().toLowerCase();
			// the template selects the component category; a document without a select value follows it
			const kind = kindEl.value || 'component';
			const weak = Boolean(weakEl.checked);
			const shown = rows
				.filter(
					(r) =>
						(!q || r.id.toLowerCase().includes(q) || r.n.toLowerCase().includes(q)) &&
						(kind === 'all' || r.c === kind) &&
						(!weak || (r.min !== null && r.min < 60))
				)
				.sort((a, b) => compare(a, b));
			tbody.innerHTML = shown.map((r) => row(r)).join('');
			tbody.querySelectorAll('tr.row').forEach((tr) => {
				const toggle = () => {
					const n = tr.dataset.n;
					if (expanded.has(n)) expanded.delete(n);
					else expanded.add(n);
					draw();
				};
				tr.addEventListener('click', toggle);
				tr.addEventListener('keydown', (ev) => {
					if (ev.key === 'Enter' || ev.key === ' ') {
						ev.preventDefault();
						toggle();
					}
				});
			});
			const direction = heatSort.dir === 'asc' ? 'ascending' : 'descending';
			document.getElementById('heat-count').textContent =
				`${shown.length} of ${rows.length} rows shown, sorted by ${sortLabel(heatSort.key)} ${direction}. Cell values are the eval's score for the row in ${D.latest.label} (a block inherits its pattern's or stylesheet's); a documentation eval shows the documented share.`;
		}
		[filterEl, kindEl, weakEl].forEach((el) => {
			el.oninput = draw;
		});
		draw();
		const weakest = rows.filter((r) => r.min !== null && r.min < 60).length;
		document.getElementById('heat-caption').textContent =
			`${rows.length} rows × ${ids.length} evals from ${D.latest.label}. ${weakest} rows have at least one eval below 60.`;
	}

	// ---- findings

	function movableGroup(evals, lookup) {
		const mov = evals.filter((e) => clsOf(e) === 'movable' && e.score < 99.95);
		const items = mov.map((e) => {
			const b = BACKLOG[e.id];
			const beyond = b ? ` Beyond that: ${esc(b.id)}, ${esc(b.what)} (${esc(b.impact)}).` : '';
			return item(
				lookup,
				[e.id],
				`${esc(e.name)} at ${f1(e.score)}`,
				esc(e.advice[0]),
				esc(e.advice.slice(1).join(' ')) + beyond
			);
		});
		return {
			cls: 'accent',
			title: 'Movable: next steps on this branch',
			lead: 'Evals that can still move without a behaviour change. What the latest run found, and the step that moves it.',
			items,
		};
	}
	function structuralGroup(evals, lookup) {
		const str = evals.filter((e) => clsOf(e) === 'structural');
		if (!str.length) return null;
		const items = str.map((e) => {
			const b = BACKLOG[e.id];
			const what = b
				? `${esc(e.name)} at ${f1(e.score)} · ${esc(b.id)} ${esc(b.what)}`
				: `${esc(e.name)} at ${f1(e.score)}`;
			const impact = b ? `Impact: ${esc(b.impact)}.` : '';
			return item(lookup, [e.id], what, esc(e.advice.join(' ')), impact);
		});
		return {
			cls: 'bad',
			title: 'Structural: waits on a breaking-change decision',
			lead: 'Documented in REPORT.md §5.2 with illustrative code and behavioural impact; each needs an owner decision and its own PR.',
			items,
		};
	}
	function doneGroup(evals, lookup) {
		const done = evals.filter((e) => clsOf(e) === 'movable' && e.score >= 99.95);
		const doneLead = done.length ? `${done.map((e) => e.id).join(', ')} at 100. ` : '';
		const blocksDone = D.suites.flatMap((s) =>
			blockTables(s)
				.filter(({ id, table }) => id && tableComplete(table))
				.map(({ id }) => id)
		);
		const blocksLead = blocksDone.length ? `${blocksDone.join(', ')}: every block at 100. ` : '';
		const items = APPLIED.map((a) => {
			const chips = a.evals.map((id) => chip(id, lookup)).join('');
			return `<li class="item"><div class="chips">${chips}</div><div><div class="what">${esc(a.what)}</div><div class="detail">${esc(a.detail)}</div><div class="do">${esc(a.do)}</div></div></li>`;
		});
		return {
			cls: 'good',
			title: 'Done on the branch, behaviour-preserving',
			lead: `${doneLead}${blocksLead}What was built, what it changed and how to keep it there; S-numbers refer to REPORT.md §5.1, ADR numbers to docs-internal/adr.`,
			items,
		};
	}
	function readOpenState() {
		try {
			return JSON.parse(localStorage.getItem('osui-evals-findings-open') || '{}');
		} catch {
			return {};
		}
	}
	function renderFindings() {
		const lookup = byId();
		const evals = allEvals().map(({ e }) => e);
		const groups = [
			unmeasuredGroup(evals, lookup),
			...D.suites.map((s) => roadmapGroup(s, lookup)),
			...D.suites.map((s) => tablesGroup(s, lookup)),
			movableGroup(evals, lookup),
			structuralGroup(evals, lookup),
			doneGroup(evals, lookup),
		].filter((g) => g !== null);
		const openState = readOpenState();
		document.getElementById('findings').innerHTML = groups
			.map((g, i) => {
				const open = (openState[g.cls] ?? i === 0) ? 'open' : '';
				const summary = `<summary><div class="top"><h3>${esc(g.title)} <span class="count">${g.items.length}</span></h3><p class="muted">${esc(g.lead)}</p></div></summary>`;
				return `<details class="group ${g.cls}" data-key="${esc(g.cls)}" ${open}>${summary}<ol>${g.items.join('')}</ol></details>`;
			})
			.join('');
		document.querySelectorAll('#findings details').forEach((d) =>
			d.addEventListener('toggle', () => {
				openState[d.dataset.key] = d.open;
				try {
					localStorage.setItem('osui-evals-findings-open', JSON.stringify(openState));
				} catch {
					/* per-viewer convenience only */
				}
			})
		);
	}

	// ---- live data through the artifact database
	const btn = document.getElementById('refresh');
	const txt = document.getElementById('refresh-text');
	const status = document.getElementById('status');
	const badge = document.getElementById('source-badge');
	let dbPromise = null;
	function setStatus(text, kind) {
		status.textContent = text;
		status.className = `status ${kind || ''}`;
	}
	function setLoading(on) {
		btn.disabled = on;
		btn.classList.toggle('loading', on);
		btn.setAttribute('aria-busy', String(on));
		txt.textContent = on ? 'Refreshing' : 'Refresh';
		btn.title = on ? 'Refreshing' : 'Refresh';
	}
	function getDb() {
		if (!dbPromise) {
			dbPromise =
				window.claude && typeof window.claude.use === 'function'
					? window.claude.use('db').catch(() => null)
					: Promise.resolve(null);
		}
		return dbPromise;
	}
	function isDataSet(data) {
		return (
			Boolean(data) &&
			data.v === DATA_VERSION &&
			Array.isArray(data.history) &&
			Array.isArray(data.suites) &&
			Array.isArray(data.components)
		);
	}
	/** The rows of a published data set: inline, or read from the row documents the main document announces. */
	async function withRows(db, data) {
		if (!data || Array.isArray(data.components) || !(data.rowDocs > 0)) return data;
		const parts = [];
		for (let i = 1; i <= data.rowDocs; i++) {
			const part = await db.doc(`${DOC_PATH}-rows-${i}`).get();
			if (!part.exists) return { ...data, components: null };
			parts.push(...(part.data().components || []));
		}
		return { ...data, components: parts };
	}
	async function refresh(manual) {
		setLoading(true);
		if (manual) setStatus('Checking the dashboard database for a newer data set…');
		try {
			const db = await getDb();
			if (!db) {
				setStatus(
					`Live data is not available in this view; showing the embedded snapshot generated ${when(EMBEDDED.generated)}.`,
					'warn'
				);
				return;
			}
			const snap = await db.doc(DOC_PATH).get();
			if (!snap.exists) {
				setStatus(
					`No data set has been published to the dashboard yet; showing the embedded snapshot generated ${when(EMBEDDED.generated)}.`,
					'warn'
				);
				return;
			}
			const data = await withRows(db, snap.data());
			if (!isDataSet(data)) {
				setStatus(
					`The published data set is not version ${DATA_VERSION}; showing the embedded snapshot.`,
					'warn'
				);
				return;
			}
			const newer = data.generated > D.generated;
			if (newer || manual) {
				D = data;
				expanded = new Set();
				render();
				badge.textContent = 'live';
				badge.className = 'badge live';
				const verb = newer ? 'Updated' : 'Up to date';
				const checked = new Date().toLocaleTimeString(undefined, { timeStyle: 'short' });
				setStatus(
					`${verb}: ${data.latest.label} @ ${data.latest.sha}, generated ${when(data.generated)}. Checked ${checked}.`,
					'live'
				);
			}
		} catch (e) {
			const code = e && e.code ? e.code : 'error';
			setStatus(`Could not read the dashboard database (${code}); showing the last data set.`, 'warn');
		} finally {
			setLoading(false);
		}
	}
	btn.addEventListener('click', () => {
		void refresh(true);
	});

	render();
	void refresh(false);
}
