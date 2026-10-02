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
 * The per-block tables a suite contributes through its evals' `extra` ({ title, columns, rows }); null when it
 * contributes none. Blocks are not components, so their figures live here rather than in the heatmap.
 */
function tablesGroup(s, lookup) {
	const tables = Object.entries(s.extra || {}).filter(
		([, v]) => v && Array.isArray(v.columns) && Array.isArray(v.rows) && typeof v.title === 'string'
	);
	if (!tables.length) return null;
	const items = tables.map(([key, v]) => {
		const id = s.evals.map((e) => e.id).find((x) => key.endsWith(x));
		const head = v.columns.map((c) => `<th>${esc(c)}</th>`).join('');
		const cellsOf = (r) => r.map((c) => `<td>${esc(String(c))}</td>`).join('');
		const body = v.rows.map((r) => `<tr>${cellsOf(r)}</tr>`).join('');
		const table = `<table class="block-table"><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>`;
		return item(lookup, id ? [id] : [], esc(v.title), '', '', table);
	});
	return {
		cls: `tables-${s.id}`,
		title: `${s.name}: per-block tables`,
		lead: 'One row per OML block, lowest score first, with what would move it. Blocks are not components and have no heatmap cells.',
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
	if (key === 'k') return 'tier';
	if (key === 'mean') return 'mean score';
	return key;
}
/** Why a component of a tier sits outside an eval (the data set omits those cells to stay small). */
const OUTSIDE_TIER = {
	pattern: 'this is a pattern with a TypeScript contract',
	component: 'this is a CSS-only component with an anatomy but no TypeScript contract',
	layout: 'layout partials style markup the app template or the runtime emits, so they have no markup contract of their own',
	utility: 'utility classes have no anatomy, knobs or story of their own; the utilities suite measures them',
};

/** The cell of a component for an eval: the data set's, else not applicable by tier, else no cell. */
function cellOf(c, id, e) {
	const hit = c.cells[id];
	if (hit) return hit;
	if (e && Array.isArray(e.appliesTo) && !e.appliesTo.includes(c.k)) {
		const measures = e.appliesTo.map((t) => `${t}s`).join(', ');
		const outside = OUTSIDE_TIER[c.k] || `${c.k} components are outside it`;
		return { s: null, w: 'na', h: `Not applicable: this eval measures ${measures}; ${outside}.` };
	}
	return { s: null, w: 'unmeasured', h: 'No cell in this data set.' };
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
 * @param {any} EMBEDDED the data set built by tools/dashboard-data.mjs (v4)
 */
export function mount(document, window, localStorage, EMBEDDED) {
	const DOC_PATH = 'evals/dashboard';
	const DATA_VERSION = 4;
	const TIER_LABEL = {
		pattern: 'patterns',
		component: 'CSS-only components',
		layout: 'layout partials',
		utility: 'utility classes',
	};
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
		// the same evals scored per tier, so a helper class cannot move the pattern figure
		for (const s of D.suites) {
			for (const [tier, t] of Object.entries(s.tiers || {})) {
				const moved =
					t.base === null || t.baseLabel === last.label
						? `first measured in ${last.label}`
						: `${signed(t.index - t.base)} since ${t.baseLabel} (${f1(t.base)})`;
				out.push({
					cls: `tier ${tone(s)}`,
					label: `${s.name} · ${TIER_LABEL[tier] || tier}`,
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
				label: 'Components measured',
				value: String(D.components.length),
				sub: Object.entries(TIER_LABEL)
					.map(([k, label]) => [D.components.filter((c) => c.k === k).length, label])
					.filter(([n]) => n > 0)
					.map(([n, label]) => `${n} ${label}`)
					.join(', '),
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
				`<text x="${xs[i]}" y="${H - padB + 18}" text-anchor="middle">${esc(r.label)}</text>`,
				`<text x="${xs[i]}" y="${H - padB + 34}" text-anchor="middle" style="font-family:var(--font-mono);font-size:11px">${esc(r.sha)}</text>`
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
		const captions = D.suites.map((suite) => {
			const rs = suiteRuns(runs, suite);
			return `${suite.name} ${f1(rs[0].suites[suite.id].index)} → ${f1(rs[rs.length - 1].suites[suite.id].index)} over ${rs.length} runs`;
		});
		document.getElementById('trend-caption').textContent =
			`${captions.join('; ')}. Each eval has its own small chart below so no line hides another.`;
		wireTrendTips(host, runs, xs, y, W, H);
	}

	/** Tooltip text for one run of the trend chart: every suite's index and its move from the previous run. */
	function trendTip(r, prev) {
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
		return `<b>${esc(r.label)}</b> @ ${esc(r.sha)} · ${esc(r.date.slice(0, 10))}${branch}${lines.join('')}`;
	}

	function wireTrendTips(host, runs, xs, y, W, H) {
		const tip = document.getElementById('tip');
		const svg = host.querySelector('svg');
		const cross = host.querySelector('#cross');
		host.querySelectorAll('.hit').forEach((rect) => {
			rect.addEventListener('mousemove', () => {
				const i = Number(rect.dataset.i);
				const r = runs[i];
				const box = svg.getBoundingClientRect();
				const hostBox = host.getBoundingClientRect();
				const first = D.suites.find((suite) => r.suites[suite.id]);
				const px = box.left - hostBox.left + (xs[i] / W) * box.width;
				const py = box.top - hostBox.top + (y(first ? r.suites[first.id].index : 0) / H) * box.height;
				tip.innerHTML = trendTip(r, runs[i - 1]);
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
			'<span><i style="background:var(--surface-2)"></i>n/a, not applicable: the eval does not measure this kind of component, or there is nothing of its kind to check (hover for the reason)</span>',
			'<span><i style="background:repeating-linear-gradient(135deg, var(--surface-2) 0 3px, transparent 3px 6px)"></i>— not measured: the component lacks what the eval reads, such as a story (hover for the reason and the fix)</span>',
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
			const vals = ids.map((id) => cellOf(c, id, lookup[id]?.e));
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
			if (key === 'n' || key === 'k') return r[key];
			if (key === 'mean') return r.mean;
			return r.vals[ids.indexOf(key)].s;
		}
		function header() {
			const heads = [
				{ key: 'n', label: 'Component' },
				{ key: 'k', label: 'Tier' },
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
			const head = `<td class="name">${esc(r.n)}</td><td class="kind">${esc(r.k)}</td>`;
			const tail = `<td class="cell mean" style="${shade(r.mean)}">${mean}</td>`;
			const open = expanded.has(r.n);
			return `<tr class="row" tabindex="0" data-n="${esc(r.n)}" aria-expanded="${open}">${head}${cells}${tail}</tr>${open ? detail(r) : ''}`;
		}
		function compare(a, b) {
			const va = value(a, heatSort.key);
			const vb = value(b, heatSort.key);
			if (va === null && vb === null) return a.n.localeCompare(b.n);
			if (va === null) return 1;
			if (vb === null) return -1;
			const c = typeof va === 'string' ? va.localeCompare(vb) : va - vb;
			return (heatSort.dir === 'asc' ? c : -c) || a.n.localeCompare(b.n);
		}
		function draw() {
			header();
			const q = (filterEl.value || '').trim().toLowerCase();
			const kind = kindEl.value || 'all';
			const weak = Boolean(weakEl.checked);
			const shown = rows
				.filter(
					(r) =>
						(!q || r.n.toLowerCase().includes(q)) &&
						(kind === 'all' || r.k === kind) &&
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
				`${shown.length} of ${rows.length} components shown, sorted by ${sortLabel(heatSort.key)} ${direction}. Cell values are the eval's per-component score in ${D.latest.label}; a documentation eval shows the documented share.`;
		}
		[filterEl, kindEl, weakEl].forEach((el) => {
			el.oninput = draw;
		});
		draw();
		const weakest = rows.filter((r) => r.min !== null && r.min < 60).length;
		document.getElementById('heat-caption').textContent =
			`${rows.length} components × ${ids.length} evals from ${D.latest.label}. ${weakest} components have at least one eval below 60.`;
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
		const items = APPLIED.map((a) => {
			const chips = a.evals.map((id) => chip(id, lookup)).join('');
			return `<li class="item"><div class="chips">${chips}</div><div><div class="what">${esc(a.what)}</div><div class="detail">${esc(a.detail)}</div><div class="do">${esc(a.do)}</div></div></li>`;
		});
		return {
			cls: 'good',
			title: 'Done on the branch, behaviour-preserving',
			lead: `${doneLead}What was built, what it changed and how to keep it there; S-numbers refer to REPORT.md §5.1.`,
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
		return Boolean(data) && data.v === DATA_VERSION && Array.isArray(data.history) && Array.isArray(data.suites);
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
			const data = snap.data();
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
