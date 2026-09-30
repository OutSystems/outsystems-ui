// @ts-check
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
 * @param {any} EMBEDDED the data set built by tools/dashboard-data.mjs (v3)
 */
export function mount(document, window, localStorage, EMBEDDED) {
	const DOC_PATH = 'evals/dashboard';
	const DATA_VERSION = 3;
	const f1 = (n) => (Math.round(n * 10) / 10).toFixed(1);
	const signed = (n) => (n > 0 ? '+' : '') + f1(n);
	const cls = (n) => (n >= 80 ? 'good' : n >= 60 ? 'warn' : 'bad');
	const deltaCls = (d) => (d > 0 ? 'up' : d < 0 ? 'down' : 'flat');
	const esc = (s) =>
		String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
	const meanOf = (xs) => (xs.length ? xs.reduce((s, x) => s + x, 0) / xs.length : 0);
	const when = (iso) => new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
	const tone = (s) => `t${s.tone % 3}`;
	const clsOf = (e) => e.cls || (e.movable ? 'movable' : 'structural');
	const range = (evals) => (evals.length ? `${evals[0].id}–${evals[evals.length - 1].id}` : '');

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
			what: 'The measurement loop itself: suites, registry, gate, doctor, reports (S-7, S-8, S-13 to S-15)',
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

	let D = EMBEDDED;
	let heatSort = { key: 'mean', dir: 'asc' };
	let expanded = new Set();

	const allEvals = () => D.suites.flatMap((s) => s.evals.map((e) => ({ e, s })));
	const byId = () => Object.fromEntries(allEvals().map(({ e, s }) => [e.id, { e, s }]));
	const suiteRuns = (runs, s) => runs.filter((r) => r.suites[s.id]);

	function render() {
		const runs = [...D.history].sort((a, b) => a.date.localeCompare(b.date));
		const last = runs[runs.length - 1];
		document.getElementById('meta').textContent =
			`${D.suites.map((s) => `${s.indexName} (${range(s.evals)})`).join(' and ')}, each an unweighted mean · ${runs.length} runs · latest ${last.label} @ ${last.sha} · data generated ${when(D.generated)}`;

		// summary strip
		const evals = allEvals().map(({ e }) => e);
		const movable = evals.filter((e) => clsOf(e) === 'movable'),
			structural = evals.filter((e) => clsOf(e) === 'structural');
		const unmeasured = evals.reduce((s, e) => s + e.unmeasured.n, 0);
		const tiles = [
			...D.suites.map((s) => {
				const first = s.baseline;
				return {
					cls: `index ${tone(s)}`,
					label: s.indexName,
					value: f1(s.latest.index),
					sub:
						first.label === last.label
							? `first measured in ${first.label}`
							: `${signed(s.latest.index - first.index)} since ${first.label} (${f1(first.index)})`,
				};
			}),
			{
				label: 'Movable evals',
				value: `${movable.filter((e) => e.score >= 80).length} / ${movable.length} ≥ 80`,
				sub: `mean ${f1(meanOf(movable.map((e) => e.score)))} · ${movable.filter((e) => e.score >= 99.9).length} at 100`,
			},
			structural.length
				? {
						label: 'Structural evals',
						value: f1(meanOf(structural.map((e) => e.score))),
						sub: `${structural.map((e) => e.id).join(', ')} · wait on a breaking-change decision`,
					}
				: null,
			{
				label: 'Components measured',
				value: String(D.components.length),
				sub: `${D.components.filter((c) => c.k === 'pattern').length} patterns, ${D.components.filter((c) => c.k === 'css').length} CSS-only`,
			},
			{
				label: 'Unmeasured pairs',
				value: String(unmeasured),
				sub:
					evals
						.filter((e) => e.unmeasured.n)
						.map((e) => `${e.id} ${e.unmeasured.n}`)
						.join(' · ') || 'everything measurable is measured',
			},
		];
		document.getElementById('strip').innerHTML = tiles
			.filter(Boolean)
			.map(
				(t) =>
					`<div class="tile ${t.cls || ''}"><span class="eyebrow">${esc(t.label)}</span><span class="value">${esc(t.value)}</span><span class="sub">${esc(t.sub)}</span></div>`
			)
			.join('');

		renderTrend(runs);
		renderMultiples(runs);
		renderEvals();
		renderHeat();
		renderFindings();
	}

	function renderTrend(runs) {
		const W = 960,
			H = 260,
			padL = 44,
			padR = 28,
			padT = 26,
			padB = 48;
		const xs = runs.map((_, i) => padL + (i * (W - padL - padR)) / Math.max(1, runs.length - 1));
		const y = (v) => padT + (H - padT - padB) * (1 - v / 100);
		let s = `<svg class="trend" viewBox="0 0 ${W} ${H}" role="img" aria-label="Index per run and suite, scale 0 to 100">`;
		for (const g of [0, 25, 50, 75, 100])
			s += `<line class="grid" x1="${padL}" x2="${W - padR}" y1="${y(g)}" y2="${y(g)}"/><text x="${padL - 8}" y="${y(g) + 4}" text-anchor="end">${g}</text>`;
		D.suites.forEach((suite, k) => {
			const pts = runs.map((r, i) => ({ r, i })).filter(({ r }) => r.suites[suite.id]);
			if (!pts.length) return;
			const poly = pts.map(({ r, i }) => `${xs[i]},${y(r.suites[suite.id].index)}`).join(' ');
			s += `<g class="${tone(suite)}">`;
			if (k === 0)
				s += `<polygon class="area" points="${xs[pts[0].i]},${y(0)} ${poly} ${xs[pts[pts.length - 1].i]},${y(0)}"/>`;
			if (pts.length > 1) s += `<polyline class="line" points="${poly}"/>`;
			pts.forEach(({ r, i }, j) => {
				const isLast = j === pts.length - 1,
					v = r.suites[suite.id].index;
				s += `<circle class="dot ${isLast ? 'last' : ''}" cx="${xs[i]}" cy="${y(v)}" r="4.5"/>`;
				if (j === 0 || isLast)
					s += `<text class="label" x="${xs[i]}" y="${y(v) + (k === 0 ? -12 : 20)}" text-anchor="${j === 0 ? 'start' : 'end'}">${f1(v)}</text>`;
			});
			s += '</g>';
		});
		runs.forEach((r, i) => {
			s += `<text x="${xs[i]}" y="${H - padB + 18}" text-anchor="middle">${esc(r.label)}</text><text x="${xs[i]}" y="${H - padB + 34}" text-anchor="middle" style="font-family:var(--font-mono);font-size:11px">${esc(r.sha)}</text>`;
		});
		s += `<line class="cross" id="cross" x1="0" x2="0" y1="${padT}" y2="${H - padB}" visibility="hidden"/>`;
		const half = runs.length > 1 ? (xs[1] - xs[0]) / 2 : (W - padL - padR) / 2;
		runs.forEach((r, i) => {
			s += `<rect class="hit" data-i="${i}" x="${xs[i] - half}" y="${padT}" width="${half * 2}" height="${H - padT - padB}"/>`;
		});
		s += '</svg>';
		const host = document.getElementById('trend');
		host.innerHTML =
			s +
			`<div class="chart-legend">${D.suites.map((suite) => `<span class="${tone(suite)}"><i></i>${esc(suite.indexName)}</span>`).join('')}</div>`;
		document.getElementById('trend-caption').textContent =
			D.suites
				.map((suite) => {
					const rs = suiteRuns(runs, suite);
					return `${suite.name} ${f1(rs[0].suites[suite.id].index)} → ${f1(rs[rs.length - 1].suites[suite.id].index)} over ${rs.length} runs`;
				})
				.join('; ') + '. Each eval has its own small chart below so no line hides another.';
		const tip = document.getElementById('tip'),
			svg = host.querySelector('svg'),
			cross = host.querySelector('#cross');
		host.querySelectorAll('.hit').forEach((rect) => {
			rect.addEventListener('mousemove', () => {
				const i = Number(rect.dataset.i),
					r = runs[i],
					prev = runs[i - 1];
				const box = svg.getBoundingClientRect(),
					hostBox = host.getBoundingClientRect();
				const first = D.suites.find((suite) => r.suites[suite.id]);
				const px = box.left - hostBox.left + (xs[i] / W) * box.width,
					py = box.top - hostBox.top + (y(first ? r.suites[first.id].index : 0) / H) * box.height;
				tip.innerHTML =
					`<b>${esc(r.label)}</b> @ ${esc(r.sha)} · ${esc(r.date.slice(0, 10))}${r.branch ? ` · ${esc(r.branch)}` : ''}` +
					D.suites
						.filter((suite) => r.suites[suite.id])
						.map(
							(suite) =>
								`<br>${esc(suite.name)} ${f1(r.suites[suite.id].index)}${prev && prev.suites[suite.id] ? ` (${signed(r.suites[suite.id].index - prev.suites[suite.id].index)} vs ${esc(prev.label)})` : ''}`
						)
						.join('');
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
		const W = 200,
			H = 56,
			pad = 6;
		document.getElementById('multiples').innerHTML = allEvals()
			.map(({ e, s }) => {
				const vals = suiteRuns(runs, s).map((r) => r.suites[s.id].scores[e.id] ?? 0);
				const xs = vals.map((_, i) => pad + (i * (W - 2 * pad)) / Math.max(1, vals.length - 1));
				const y = (v) => pad + (H - 2 * pad) * (1 - v / 100);
				const flat = vals.every((v) => v === vals[0]);
				const pts = vals.map((v, i) => `${xs[i]},${y(v)}`).join(' ');
				const d = vals[vals.length - 1] - vals[0];
				return `<div class="multiple ${tone(s)}" title="${esc(e.name)}: ${vals.map(f1).join(' → ')}">
				<div class="t"><b>${esc(e.id)} <span class="muted">${esc(e.name)}</span></b><span class="mono">${esc(clsOf(e))}</span></div>
				<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(e.name)} ${vals.map(f1).join(', ')}">
					<line class="grid" x1="${pad}" x2="${W - pad}" y1="${y(0)}" y2="${y(0)}"/>
					<polygon class="sparea" points="${xs[0]},${y(0)} ${pts} ${xs[xs.length - 1]},${y(0)}"/>
					<polyline class="spark ${flat ? 'flat' : ''}" points="${pts}"/>
					<circle class="end ${flat ? 'flat' : ''}" cx="${xs[xs.length - 1]}" cy="${y(vals[vals.length - 1])}" r="3.5"/>
				</svg>
				<div class="range"><span>${f1(vals[0])}</span><span class="delta ${deltaCls(d)}">${vals.length < 2 ? 'first run' : flat ? 'unchanged' : signed(d)}</span><span><b>${f1(vals[vals.length - 1])}</b></span></div>
			</div>`;
			})
			.join('');
	}

	function renderEvals() {
		const WHY = {
			movable:
				'Moves with additive changes: documentation, generated docs and types, annotations, token routing, ARIA, key handlers, state styles',
			structural: 'Moves only with a change to the DOM contract, the cascade or the composition model',
			roadmap: 'Moves with new components or features',
		};
		document.querySelector('#evals tbody').innerHTML = allEvals()
			.map(({ e, s }) => {
				const base = e.base ?? e.score,
					d = e.score - base;
				const klass = clsOf(e);
				return `<tr class="${tone(s)}">
				<td class="mono">${esc(e.id)}${D.suites.length > 1 ? ` <span class="suite-tag">${esc(s.name)}</span>` : ''}</td>
				<td><div class="eval-name">${esc(e.name)}</div><div class="eval-crit">${esc(e.criterion)}</div></td>
				<td><div class="bar" title="${f1(e.score)} (baseline ${f1(base)})"><i style="width:${e.score}%"></i><b style="left:${base}%"></b></div></td>
				<td class="num">${f1(base)}</td>
				<td class="num"><span class="pill ${cls(e.score)}">${f1(e.score)}</span></td>
				<td class="num delta ${deltaCls(d)}">${signed(d)}</td>
				<td><span class="pill neutral" title="${esc(WHY[klass] || '')}">${esc(klass)}</span></td>
				<td class="notes">${esc(e.summary)}</td>
			</tr>`;
			})
			.join('');
	}

	function renderHeat() {
		const cols = D.suites.flatMap((s) => s.heatmapEvals.map((id) => ({ id, s })));
		const ids = cols.map((c) => c.id);
		const toneOf = Object.fromEntries(cols.map((c) => [c.id, tone(c.s)]));
		const lookup = byId();
		const noColumn = allEvals()
			.filter(({ e, s }) => !s.heatmapEvals.includes(e.id))
			.map(({ e }) => e.id);
		document.getElementById('heat-legend').innerHTML = [
			'<span><i style="background:var(--good-soft)"></i>≥ 80</span>',
			'<span><i style="background:var(--warn-soft)"></i>60 – 79</span>',
			'<span><i style="background:var(--bad-soft)"></i>&lt; 60</span>',
			'<span><i style="background:var(--surface-2)"></i>n/a, not applicable: the eval does not measure this kind of component, or there is nothing of its kind to check (hover for the reason)</span>',
			'<span><i style="background:repeating-linear-gradient(135deg, var(--surface-2) 0 3px, transparent 3px 6px)"></i>— not measured: the component lacks what the eval reads, such as a story (hover for the reason and the fix)</span>',
			`<span>Column ids are coloured by suite: ${D.suites.map((s) => `<span class="suite-tag ${tone(s)}">${esc(s.evals[0]?.id.charAt(0) ?? '')} · ${esc(s.name)}</span>`).join(' ')}. Click a row for what each eval found and what to do.${noColumn.length ? ` ${noColumn.join(', ')} ${noColumn.length === 1 ? 'is' : 'are'} measured per file or per requirement, so ${noColumn.length === 1 ? 'it has' : 'they have'} no column.` : ''}</span>`,
		].join('');
		const rows = D.components.map((c) => {
			const vals = ids.map((id) => c.cells[id] || { s: null, w: 'unmeasured', h: 'No cell in this data set.' });
			const measured = vals.filter((v) => v.s !== null).map((v) => v.s);
			return {
				...c,
				vals,
				mean: measured.length ? meanOf(measured) : null,
				min: measured.length ? Math.min(...measured) : null,
			};
		});
		const thead = document.querySelector('#heat thead'),
			tbody = document.querySelector('#heat tbody');
		const filterEl = document.getElementById('heat-filter'),
			kindEl = document.getElementById('heat-kind'),
			weakEl = document.getElementById('heat-weak');
		const shade = (v) =>
			v === null
				? ''
				: v >= 80
					? 'background:var(--good-soft);color:var(--good)'
					: v >= 60
						? 'background:var(--warn-soft);color:var(--warn)'
						: 'background:var(--bad-soft);color:var(--bad)';
		const value = (r, key) =>
			key === 'n' || key === 'k' ? r[key] : key === 'mean' ? r.mean : r.vals[ids.indexOf(key)].s;
		function header() {
			const heads = [
				{ key: 'n', label: 'Component' },
				{ key: 'k', label: 'Kind' },
				...ids.map((id) => ({ key: id, label: id, title: lookup[id]?.e.name || id })),
				{ key: 'mean', label: 'Mean' },
			];
			thead.innerHTML =
				'<tr>' +
				heads
					.map(
						(c) =>
							`<th class="${ids.includes(c.key) || c.key === 'mean' ? 'num' : ''} ${toneOf[c.key] || ''}"><button type="button" data-key="${c.key}" aria-sort="${heatSort.key === c.key ? (heatSort.dir === 'asc' ? 'ascending' : 'descending') : 'none'}" title="${esc(c.title || 'sort')}">${esc(c.label)}</button></th>`
					)
					.join('') +
				'</tr>';
			thead.querySelectorAll('button').forEach((b) =>
				b.addEventListener('click', () => {
					const key = b.dataset.key;
					heatSort =
						heatSort.key === key
							? { key, dir: heatSort.dir === 'asc' ? 'desc' : 'asc' }
							: { key, dir: 'asc' };
					draw();
				})
			);
		}
		function detail(r) {
			return `<tr class="detail"><td colspan="${ids.length + 3}"><ul>${ids
				.map((id, i) => {
					const v = r.vals[i];
					return `<li><span class="id">${esc(id)}</span><span class="s" style="${shade(v.s)}">${v.s === null ? (v.w === 'na' ? 'n/a' : '—') : f1(v.s)}</span><span>${esc(v.h)}</span></li>`;
				})
				.join('')}</ul></td></tr>`;
		}
		function draw() {
			header();
			const q = (filterEl.value || '').trim().toLowerCase(),
				kind = kindEl.value || 'all',
				weak = Boolean(weakEl.checked);
			const shown = rows
				.filter(
					(r) =>
						(!q || r.n.toLowerCase().includes(q)) &&
						(kind === 'all' || r.k === kind) &&
						(!weak || (r.min !== null && r.min < 60))
				)
				.sort((a, b) => {
					const va = value(a, heatSort.key),
						vb = value(b, heatSort.key);
					if (va === null && vb === null) return a.n.localeCompare(b.n);
					if (va === null) return 1;
					if (vb === null) return -1;
					const c = typeof va === 'string' ? va.localeCompare(vb) : va - vb;
					return (heatSort.dir === 'asc' ? c : -c) || a.n.localeCompare(b.n);
				});
			tbody.innerHTML = shown
				.map(
					(r) => `<tr class="row" tabindex="0" data-n="${esc(r.n)}" aria-expanded="${expanded.has(r.n)}">
				<td class="name">${esc(r.n)}</td><td class="kind">${r.k === 'pattern' ? 'pattern' : 'css'}</td>
				${r.vals.map((v) => (v.s === null ? `<td class="cell ${v.w}" title="${esc(v.h)}">${v.w === 'na' ? 'n/a' : '—'}</td>` : `<td class="cell" style="${shade(v.s)}" title="${esc(v.h)}">${f1(v.s)}</td>`)).join('')}
				<td class="cell mean" style="${shade(r.mean)}">${r.mean === null ? '—' : f1(r.mean)}</td>
			</tr>${expanded.has(r.n) ? detail(r) : ''}`
				)
				.join('');
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
			document.getElementById('heat-count').textContent =
				`${shown.length} of ${rows.length} components shown, sorted by ${heatSort.key === 'n' ? 'name' : heatSort.key === 'k' ? 'kind' : heatSort.key === 'mean' ? 'mean score' : heatSort.key} ${heatSort.dir === 'asc' ? 'ascending' : 'descending'}. Cell values are the eval's per-component score in ${D.latest.label}; a documentation eval shows the documented share.`;
		}
		[filterEl, kindEl, weakEl].forEach((el) => {
			el.oninput = draw;
		});
		draw();
		const weakest = rows.filter((r) => r.min !== null && r.min < 60).length;
		document.getElementById('heat-caption').textContent =
			`${rows.length} components × ${ids.length} evals from ${D.latest.label}. ${weakest} components have at least one eval below 60.`;
	}

	function chip(id, lookup) {
		if (id === 'all') return `<span class="chip">all</span>`;
		const hit = lookup[id];
		const score = hit ? hit.e.score : null;
		return `<span class="chip ${score === null ? '' : cls(score)}" title="${esc(hit ? hit.e.name : '')}">${esc(id)}</span>`;
	}
	function renderFindings() {
		const lookup = byId();
		const evals = allEvals().map(({ e }) => e);
		const item = (ids, what, missing, todo, extra = '') =>
			`<li class="item"><div class="chips">${ids.map((id) => chip(id, lookup)).join('')}</div><div><div class="what">${what}</div>${missing ? `<div class="missing">${missing}</div>` : ''}${todo ? `<div class="do">${todo}</div>` : ''}${extra}</div></li>`;

		const groups = [];
		// 1. cannot measure
		const un = evals.filter((e) => e.unmeasured.n);
		if (un.length)
			groups.push({
				cls: 'warn',
				title: 'Not measured yet',
				lead: 'Component / eval pairs the suite cannot score in the latest run; they count as absent, not as zero. Components an eval does not apply to are not listed.',
				items: un.map((e) => {
					const reasons = [...new Set(e.unmeasured.items.map((i) => i.r))];
					return item(
						[e.id],
						`${esc(e.name)}: ${e.unmeasured.n} component${e.unmeasured.n === 1 ? '' : 's'}`,
						`${reasons.map(esc).join('; ')}`,
						esc(e.unmeasuredHint || 'Give the component what the eval reads.'),
						`<details><summary>${e.unmeasured.n} component${e.unmeasured.n === 1 ? '' : 's'}</summary><ul>${e.unmeasured.items.map((i) => `<li>${esc(i.n)}</li>`).join('')}</ul></details>`
					);
				}),
			});
		// 2. roadmap: requirements a suite reports as missing or partial
		for (const s of D.suites) {
			const reqs = s.extra && s.extra.requirements;
			if (!reqs) continue;
			const roadmapIds = s.evals.filter((e) => clsOf(e) === 'roadmap').map((e) => e.id);
			const own = reqs.filter((r) => r.owner === 'osui' && r.status !== 'offered');
			const flows = (s.extra.flows || []).filter((f) => f.kit !== 'complete');
			const byGroup = {};
			for (const r of own) (byGroup[r.group] ??= []).push(r);
			const groupItems = Object.entries(byGroup).map(([g, rs]) =>
				item(
					roadmapIds,
					`${esc(g)}: ${rs.filter((r) => r.status === 'missing').length} missing, ${rs.filter((r) => r.status === 'partial').length} partial`,
					'',
					'',
					`<ul class="req-groups">${rs
						.sort((a, b) => a.status.localeCompare(b.status) || a.name.localeCompare(b.name))
						.map(
							(r) =>
								`<li><span>${esc(r.name)}${r.reason ? ` <small>· ${esc(r.reason)}</small>` : ''}</span><span class="status-pill st-${esc(r.status)}">${esc(r.status)}</span></li>`
						)
						.join('')}</ul>`
				)
			);
			if (flows.length)
				groupItems.push(
					item(
						roadmapIds,
						'Flows not kit-complete',
						flows.map((f) => `${esc(f.flow)}: ${esc([...f.missing, ...f.partial].join(', '))}`).join('; '),
						'A flow is kit-complete when every UI element the document lists for it is offered or delegated.'
					)
				);
			const delegated = reqs.filter((r) => r.owner !== 'osui');
			if (delegated.length)
				groupItems.push(
					item(
						roadmapIds,
						`Delegated to other OutSystems products (${delegated.length})`,
						delegated.map((r) => `${esc(r.name)} → ${esc(r.owner)}`).join('; '),
						'Reported so the parity table matches the document; not scored here.'
					)
				);
			const roadmapScore = roadmapIds.length ? f1(lookup[roadmapIds[0]].e.score) : '';
			groups.push({
				cls: 'roadmap',
				title: `Roadmap: ${s.name} requirements not offered yet`,
				lead: `${roadmapIds.join(', ')} at ${roadmapScore}. New components or features from the requirements document; neither refactors nor breaking changes.`,
				items: groupItems,
			});
		}
		// 3. movable next steps
		const mov = evals.filter((e) => clsOf(e) === 'movable' && e.score < 99.95);
		groups.push({
			cls: 'accent',
			title: 'Movable: next steps on this branch',
			lead: 'Evals that can still move without a behaviour change. What the latest run found, and the step that moves it.',
			items: mov.map((e) =>
				item(
					[e.id],
					`${esc(e.name)} at ${f1(e.score)}`,
					esc(e.advice[0]),
					esc(e.advice.slice(1).join(' ')) +
						(BACKLOG[e.id]
							? ` Beyond that: ${esc(BACKLOG[e.id].id)}, ${esc(BACKLOG[e.id].what)} (${esc(BACKLOG[e.id].impact)}).`
							: '')
				)
			),
		});
		// 4. structural
		const str = evals.filter((e) => clsOf(e) === 'structural');
		if (str.length)
			groups.push({
				cls: 'bad',
				title: 'Structural: waits on a breaking-change decision',
				lead: 'Documented in REPORT.md §5.2 with illustrative code and behavioural impact; each needs an owner decision and its own PR.',
				items: str.map((e) => {
					const b = BACKLOG[e.id];
					return b
						? item(
								[e.id],
								`${esc(e.name)} at ${f1(e.score)} · ${esc(b.id)} ${esc(b.what)}`,
								esc(e.advice.join(' ')),
								`Impact: ${esc(b.impact)}.`
							)
						: item([e.id], `${esc(e.name)} at ${f1(e.score)}`, esc(e.advice.join(' ')), '');
				}),
			});
		// 5. complete movable evals + applied
		const done = evals.filter((e) => clsOf(e) === 'movable' && e.score >= 99.95);
		groups.push({
			cls: 'good',
			title: 'Done on the branch, behaviour-preserving',
			lead: `${done.length ? `${done.map((e) => e.id).join(', ')} at 100. ` : ''}What was built, what it changed and how to keep it there; S-numbers refer to REPORT.md §5.1.`,
			items: APPLIED.map(
				(a) =>
					`<li class="item"><div class="chips">${a.evals.map((id) => chip(id, lookup)).join('')}</div><div><div class="what">${esc(a.what)}</div><div class="detail">${esc(a.detail)}</div><div class="do">${esc(a.do)}</div></div></li>`
			),
		});

		let openState = {};
		try {
			openState = JSON.parse(localStorage.getItem('osui-evals-findings-open') || '{}');
		} catch {
			openState = {};
		}
		document.getElementById('findings').innerHTML = groups
			.map(
				(g, i) =>
					`<details class="group ${g.cls}" data-key="${esc(g.cls)}" ${(openState[g.cls] ?? i === 0) ? 'open' : ''}><summary><div class="top"><h3>${esc(g.title)} <span class="count">${g.items.length}</span></h3><p class="muted">${esc(g.lead)}</p></div></summary><ol>${g.items.join('')}</ol></details>`
			)
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
	const btn = document.getElementById('refresh'),
		txt = document.getElementById('refresh-text'),
		status = document.getElementById('status'),
		badge = document.getElementById('source-badge');
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
	async function getDb() {
		if (!dbPromise)
			dbPromise =
				window.claude && typeof window.claude.use === 'function'
					? window.claude.use('db').catch(() => null)
					: Promise.resolve(null);
		return dbPromise;
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
			if (!data || data.v !== DATA_VERSION || !Array.isArray(data.history) || !Array.isArray(data.suites)) {
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
				setStatus(
					`${newer ? 'Updated' : 'Up to date'}: ${data.latest.label} @ ${data.latest.sha}, generated ${when(data.generated)}. Checked ${new Date().toLocaleTimeString(undefined, { timeStyle: 'short' })}.`,
					'live'
				);
			}
		} catch (e) {
			setStatus(
				`Could not read the dashboard database (${e && e.code ? e.code : 'error'}); showing the last data set.`,
				'warn'
			);
		} finally {
			setLoading(false);
		}
	}
	btn.addEventListener('click', () => refresh(true));

	render();
	refresh(false);
}
