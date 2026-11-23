import React from 'react';
import LLMS_TXT from '../../docs-ai/llms.txt?raw';
import { DocsCodeBlock } from './DocsCodeBlock';
import { Inline, REPO_URL } from './DocsMarkdown';
import { DocsNote } from './DocsNote';
import { DocsToc } from './DocsToc';

/*
 * Audience: a developer who wants an AI assistant (Claude, ChatGPT, Copilot,
 * Cursor, …) to write code against OutSystems UI, with this Storybook open.
 *
 * Every list, count and file description on this page is parsed from
 * docs-ai/llms.txt, which `npm run docs:ai` generates from the source. The
 * files themselves are served at the root of this Storybook (see the
 * `staticDirs` entry for docs-ai in .storybook/main.ts), so the URLs below are
 * the ones an assistant fetches. Only the prose is hand-written — keep counts
 * and file facts out of it, and fix a wrong fact in the generator, not here.
 */

type Section = { title: string; body: string[] };

function parseLlms(text: string) {
	const lines = text.split('\n');
	const sections: Section[] = [];
	const head: string[] = [];
	for (const line of lines) {
		const m = /^## (.+)$/.exec(line);
		if (m) sections.push({ title: m[1], body: [] });
		else if (sections.length) sections[sections.length - 1].body.push(line);
		else head.push(line);
	}
	const section = (prefix: string) => sections.find((s) => s.title.startsWith(prefix))?.body ?? [];
	const bullets = (body: string[]) => body.filter((l) => l.startsWith('- ')).map((l) => l.slice(2));

	const components = bullets(section('Components')).map((l) => {
		const [name, rest = ''] = l.split(/:\s(.*)/s);
		const n = (re: RegExp) => Number(re.exec(rest)?.[1] ?? 0);
		return { name, props: n(/(\d+) props/), events: n(/(\d+) events/), api: n(/(\d+) API functions/) };
	});
	const producers = bullets(section('Producers')).map((l) => {
		const i = l.indexOf(': ');
		return { label: l.slice(0, i), text: l.slice(i + 2) };
	});
	const files = bullets(section('Read next')).map((l) => {
		const i = l.indexOf(' — ');
		return { file: l.slice(0, i), text: l.slice(i + 3) };
	});
	const gotchas = section('Gotchas')
		.filter((l) => /^\d+\.\s/.test(l))
		.map((l) => {
			const text = l.replace(/^\d+\.\s/, '');
			const runtimeOnly = text.startsWith('[runtime-only] ');
			return { runtimeOnly, text: runtimeOnly ? text.slice('[runtime-only] '.length) : text };
		});

	return {
		summary: head.find((l) => l.startsWith('> '))?.slice(2) ?? '',
		components,
		producers,
		files,
		gotchas,
	};
}

const L = parseLlms(LLMS_TXT);

const LINK = {
	gettingStarted: '?path=/docs/getting-started--docs',
	migration: '?path=/docs/migration--docs',
	apiReference: '?path=/docs/design-system-css-api-reference--docs',
	agentsMd: `${REPO_URL}/blob/dev/AGENTS.md`,
	docsAi: `${REPO_URL}/tree/dev/docs-ai`,
	generator: `${REPO_URL}/blob/dev/scripts/docs-ai-generator/README.md`,
};

const TOC_ITEMS = [
	{ id: 'quick-start', label: 'Quick start' },
	{ id: 'files', label: 'The files' },
	{ id: 'producers', label: 'Which ones to load' },
	{ id: 'gotchas', label: 'Gotchas' },
	{ id: 'patterns', label: 'Patterns covered' },
	{ id: 'full', label: 'llms.txt in full' },
	{ id: 'clone', label: 'From a clone' },
];

const CODE_REGEN = `npm run docs:ai          // regenerate docs-ai/ from the source
npm run docs:ai:check    // fail when the committed copy is stale
npm run docs:check       // every generated file — the PR build runs this`;

/** A file name links to the copy this Storybook serves; a templated one (`<Name>`) stays plain. */
function FileLink({ file }: { file: string }) {
	if (file.includes('<')) return <code>{file}</code>;
	return (
		<a href={file} target="_blank" rel="noreferrer">
			<code>{file}</code>
		</a>
	);
}

/** Absolute URL of a file served at the Storybook root, resolved from this (iframe) document. */
function useServedUrl(file: string): string {
	return React.useMemo(() => {
		try {
			return new URL(file, window.location.href).href;
		} catch {
			return file;
		}
	}, [file]);
}

export function LlmsPage() {
	const llmsUrl = useServedUrl('llms.txt');
	const totalApi = L.components.reduce((n, c) => n + c.api, 0);
	const prompt = `Read ${llmsUrl} and load the cards it points to for the patterns you use.
Then build a settings screen with Tabs (Profile, Notifications), a Card per tab,
and a DatePicker for the birth date. Follow the gotchas in llms.txt.`;

	return (
		<div className="osui-css-architecture osui-migration osui-llms sb-unstyled">
			<header className="ca-head">
				<div className="ca-head-in">
					<span className="ca-eyebrow">AI &amp; LLMs</span>
					<h1>llms.txt</h1>
					<p className="ca-lede">
						OutSystems UI documents itself for AI assistants too. <code>llms.txt</code> is a short index —
						what the library is, the rules a model must not get wrong, and which file to read next — and it
						links a set of focused companions: one card per pattern, the utility-class grammar, the theme
						tokens, and the OutSystems UI blocks. Give an assistant the URL and it reads only the parts it
						needs, instead of guessing from training data or from the compiled typings.
					</p>
					<div className="mg-stats">
						<div className="mg-stat mg-stat--new">
							<div className="mg-stat-n">{L.components.length}</div>
							<div className="mg-stat-label">patterns, one card each</div>
						</div>
						<div className="mg-stat mg-stat--new">
							<div className="mg-stat-n">{totalApi}</div>
							<div className="mg-stat-label">API functions documented</div>
						</div>
						<div className="mg-stat mg-stat--new">
							<div className="mg-stat-n">{L.files.length + 1}</div>
							<div className="mg-stat-label">files, linked from llms.txt</div>
						</div>
						<div className="mg-stat mg-stat--warn">
							<div className="mg-stat-n">{L.gotchas.length}</div>
							<div className="mg-stat-label">gotchas to read first</div>
						</div>
					</div>
				</div>
			</header>
			<div className="ca-inner">
				<div className="cols">
					<article className="ca-body">
						<h2 id="quick-start">Quick start</h2>
						<p>
							Every file on this page is served next to this Storybook. Paste the index URL into a chat
							with Claude, ChatGPT, Copilot or any assistant that can fetch a web page, or add it to your
							editor&apos;s documentation sources (Cursor <em>@Docs</em>, a Claude project, a Copilot
							instruction file):
						</p>
						<div data-chromatic="ignore">
							<DocsCodeBlock code={llmsUrl} plain />
						</div>
						<p>
							Then ask for what you want built. Naming the index in the prompt is enough: it tells the
							model which card to load for each pattern, so it does not pull the whole set into its
							context.
						</p>
						<div data-chromatic="ignore">
							<DocsCodeBlock code={prompt} plain />
						</div>
						<DocsNote title="An assistant that cannot fetch URLs">
							<p>
								Open <a href="llms.txt">llms.txt</a> and the cards you need, and paste their text into
								the conversation, or attach the files. <a href="#full">The whole index</a> is also at
								the end of this page with a Copy button.
							</p>
						</DocsNote>

						<h2 id="files">The files</h2>
						<p>
							Start from the index; each companion is self-contained, so a model loads one when the task
							calls for it. The <code>.json</code> files carry the same data as the matching text file,
							for tools rather than for reading.
						</p>
						<table className="mg-table--wrap">
							<thead>
								<tr>
									<th>File</th>
									<th>What it holds</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>
										<FileLink file="llms.txt" />
									</td>
									<td>
										The index: <Inline text={L.summary.split('. ')[0] + '.'} /> Plus the gotchas and
										the reading order.
									</td>
								</tr>
								{L.files.map((f) => (
									<tr key={f.file}>
										<td>
											<FileLink file={f.file} />
										</td>
										<td>
											<Inline text={f.text} />
										</td>
									</tr>
								))}
							</tbody>
						</table>

						<h2 id="producers">Which ones to load</h2>
						<p>
							It depends on what the assistant writes. Code that runs in the browser against the compiled
							bundle needs the pattern cards; a model producing OutSystems modules composes blocks and
							never emits a pattern&apos;s markup. Lines in the files marked{' '}
							<span className="mg-pill mg-pill--tip">runtime-only</span> concern the browser runtime
							alone.
						</p>
						<table className="mg-table--wrap">
							<thead>
								<tr>
									<th>If the assistant writes…</th>
									<th>It reads</th>
								</tr>
							</thead>
							<tbody>
								{L.producers.map((p) => (
									<tr key={p.label}>
										<td>
											<strong>
												<Inline text={p.label} />
											</strong>
										</td>
										<td>
											<Inline text={p.text} />
										</td>
									</tr>
								))}
							</tbody>
						</table>

						<h2 id="gotchas">Gotchas</h2>
						<p>
							The rules a model gets wrong most often when it writes OutSystems UI code from memory. They
							are at the top of the index so that every assistant reads them before it writes anything;
							they are worth a read for people too.
						</p>
						<ol>
							{L.gotchas.map((g, i) => (
								<li key={i}>
									{g.runtimeOnly ? <span className="mg-pill mg-pill--tip">runtime-only</span> : null}
									<Inline text={g.text} />
								</li>
							))}
						</ol>
						<p>
							Styling follows the same contract people use: override the theme roles and the{' '}
							<code>--osui-*</code> properties listed on the{' '}
							<a href={LINK.apiReference}>CSS API Reference</a>. To migrate an app&apos;s existing custom
							CSS with an assistant, use the guide on the <a href={LINK.migration}>Migration</a> page
							instead.
						</p>

						<h2 id="patterns">Patterns covered</h2>
						<p>
							Each of these has a card in{' '}
							<a href="llms-components.txt" target="_blank" rel="noreferrer">
								<code>llms-components.txt</code>
							</a>{' '}
							with its lifecycle, typed props and their defaults, events, API signatures, CSS classes and
							a markup skeleton, and a JSON Schema of its configs under <code>schema/configs/</code>.
						</p>
						<table>
							<thead>
								<tr>
									<th>Pattern</th>
									<th>Props</th>
									<th>Events</th>
									<th>API functions</th>
									<th>Configs schema</th>
								</tr>
							</thead>
							<tbody>
								{L.components.map((c) => (
									<tr key={c.name}>
										<td>
											<strong>{c.name}</strong>
										</td>
										<td>{c.props}</td>
										<td>{c.events}</td>
										<td>{c.api}</td>
										<td>
											<FileLink file={`schema/configs/${c.name}.schema.json`} />
										</td>
									</tr>
								))}
							</tbody>
						</table>

						<h2 id="full">llms.txt in full</h2>
						<p>
							The file as it is served, regenerated with every release. Copy it into a conversation when
							the assistant cannot fetch the URL.
						</p>
						<div className="ll-full">
							<DocsCodeBlock code={LLMS_TXT} plain />
						</div>

						<h2 id="clone">From a clone of the repository</h2>
						<p>
							Coding agents that work in{' '}
							<a href={REPO_URL} target="_blank" rel="noreferrer">
								the OutSystems UI repository
							</a>{' '}
							— Claude Code, Codex, Copilot, Cursor — find the same files under{' '}
							<a href={LINK.docsAi} target="_blank" rel="noreferrer">
								<code>docs-ai/</code>
							</a>
							, and{' '}
							<a href={LINK.agentsMd} target="_blank" rel="noreferrer">
								<code>AGENTS.md</code>
							</a>{' '}
							at the root points them there before anything else.
						</p>
						<p>
							The files are generated from the source — the TSDoc comments, the config classes, the
							stories and the SCSS — so they change with the code and are never edited by hand. A change
							to a pattern is followed by a regeneration, and the pull-request build fails while the
							committed copy is stale. The generators are described in{' '}
							<a href={LINK.generator} target="_blank" rel="noreferrer">
								<code>scripts/docs-ai-generator/README.md</code>
							</a>
							.
						</p>
						<DocsCodeBlock code={CODE_REGEN} />
					</article>
					<DocsToc items={TOC_ITEMS} />
				</div>
			</div>
		</div>
	);
}
