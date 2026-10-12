import React from 'react';
import { DocsCodeBlock } from './DocsCodeBlock';
import { DocsNote } from './DocsNote';
import type { MdBlock, MdTable } from './migration-data';

/*
 * Renders the Markdown blocks that scripts/generate-migration-data.mjs lifts out
 * of the osui-theme-migration skill. Inline markup is the subset the skill files
 * use — `code`, **bold**, *em* / _em_, [links](…) — rendered without any
 * Markdown dependency so the docs bundle stays as it is.
 *
 * The skill's text cross-references its own files and procedure ("see
 * references/recipes.md", "Category H", "Step 2f"). On this page every one of
 * those has a section, so they become in-page links rather than pointers at a
 * repository the reader is not expected to have.
 */

const REPO = 'https://github.com/OutSystems/outsystems-ui';
export const REPO_URL = REPO;
export const SKILL_URL = `${REPO}/blob/dev/.claude/skills/osui-theme-migration/`;
export const GUIDE_URL = `${REPO}/blob/dev/THEME-MIGRATION-GUIDE.md`;

/** Where each skill file is rendered on this page. */
const SECTION_OF_FILE: Record<string, string> = {
	'references/variable-mapping.md': '#retired',
	'references/widget-catalog.md': '#defaults',
	'references/grey-shades.md': '#dark-grey',
	'references/recipes.md': '#recipes',
	'SKILL.md': '#automate',
};

/** The skill's breakage categories and review steps, and the section that covers each. */
const SECTION_OF_REF: Record<string, string> = {
	'Category A': '#retired',
	'Category B': '#api',
	'Category C': '#dark',
	'Category D': '#typography',
	'Category E': '#logical',
	'Category F': '#revalued',
	'Category G': '#renamed',
	'Category H': '#dark-grey',
	'Step 2a': '#api',
	'Step 2b': '#typography',
	'Step 2c': '#logical',
	'Step 2d': '#dark',
	'Step 2e': '#palette',
	'Step 2f': '#dark-grey',
	'Step 2g': '#defaults',
	'Phase 2g': '#defaults',
};

/**
 * `references/x.md#frag` and bare `#frag` links are written for the skill's own
 * files. Map them onto this page; anything unknown falls back to GitHub.
 * `page:#id` is an explicit in-page link the generator may emit.
 */
function resolveHref(href: string, source: string): string {
	if (/^https?:\/\//.test(href)) return href;
	if (href.startsWith('page:')) return href.slice('page:'.length);
	const [file, frag] = href.split('#');
	const target = file === '' ? source : file;
	if (frag && target === 'references/recipes.md') return `#recipe-${frag}`;
	if (frag && target === 'references/grey-shades.md') return `#grey-${frag}`;
	return SECTION_OF_FILE[target] ?? `${SKILL_URL}${href}`;
}

const INLINE =
	/(`[^`]+`)|(\*\*[\s\S]+?\*\*)|(\[[^\]]+\]\([^)]+\))|(\*[^*\s][^*]*?\*)|(?<![\w`])(_[^_\s][^_]*?_)(?![\w`])|(\bCategory [A-H]\b|\bStep 2[a-g]\b|\bPhase 2g\b)/;

export function Inline({ text, source = '' }: { text: string; source?: string }) {
	return <>{renderInline(text, source, 0)}</>;
}

function renderInline(text: string, source: string, depth: number): React.ReactNode[] {
	const out: React.ReactNode[] = [];
	let rest = text;
	let key = 0;
	while (rest.length) {
		const m = depth > 4 ? null : INLINE.exec(rest);
		if (!m) {
			out.push(rest);
			break;
		}
		if (m.index > 0) out.push(rest.slice(0, m.index));
		const [token] = m;
		if (m[1]) {
			out.push(<code key={key++}>{token.slice(1, -1)}</code>);
		} else if (m[2]) {
			out.push(<strong key={key++}>{renderInline(token.slice(2, -2), source, depth + 1)}</strong>);
		} else if (m[3]) {
			const link = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/) as RegExpMatchArray;
			const href = resolveHref(link[2], source);
			const external = /^https?:\/\//.test(href);
			out.push(
				<a
					key={key++}
					href={href}
					target={external ? '_blank' : undefined}
					rel={external ? 'noreferrer' : undefined}
				>
					{renderInline(link[1], source, depth + 1)}
				</a>
			);
		} else if (m[6]) {
			out.push(
				<a key={key++} href={SECTION_OF_REF[token]} className="mg-ref">
					{token}
				</a>
			);
		} else {
			out.push(<em key={key++}>{renderInline(token.slice(1, -1), source, depth + 1)}</em>);
		}
		rest = rest.slice(m.index + token.length);
	}
	return out;
}

/** A pipe table from the skill. `wrap` lets long code cells break instead of forcing a scroll. */
export function MdTableView({
	table,
	source = '',
	wrap = false,
	className,
}: {
	table: MdTable;
	source?: string;
	wrap?: boolean;
	className?: string;
}) {
	const cls = [wrap ? 'mg-table--wrap' : '', className ?? ''].filter(Boolean).join(' ') || undefined;
	return (
		<table className={cls}>
			<thead>
				<tr>
					{table.header.map((h, i) => (
						<th key={i}>
							<Inline text={h} source={source} />
						</th>
					))}
				</tr>
			</thead>
			<tbody>
				{table.rows.map((r, i) => (
					<tr key={i}>
						{r.map((c, j) => (
							<td key={j}>
								<Inline text={c} source={source} />
							</td>
						))}
					</tr>
				))}
			</tbody>
		</table>
	);
}

/** A blockquote from the skill: `> **Warning:** …` becomes an error note, anything else an info note. */
function Quote({ text, source }: { text: string; source: string }) {
	const m = text.match(/^\*\*([^*]+?):?\*\*\s*([\s\S]*)$/);
	const title = m ? m[1].replace(/:$/, '') : 'Note';
	const body = m ? m[2] : text;
	return (
		<DocsNote title={title} variant={/warning|critical|trap/i.test(title) ? 'error' : 'alt'}>
			<p>
				<Inline text={body} source={source} />
			</p>
		</DocsNote>
	);
}

/**
 * Renders a run of blocks. Headings are demoted so a skill `##` lands under the
 * page's own `h2` sections: depth ≤ 3 → h3, deeper → h4.
 */
export function Blocks({
	blocks,
	source = '',
	idPrefix,
	wrapTables = false,
}: {
	blocks: readonly MdBlock[];
	source?: string;
	/** When set, headings get `id="{idPrefix}-{slug}"` so the TOC can target them. */
	idPrefix?: string;
	wrapTables?: boolean;
}) {
	return (
		<>
			{blocks.map((b, i) => {
				switch (b.type) {
					case 'heading': {
						const Tag = b.depth <= 3 ? 'h3' : 'h4';
						const id = idPrefix ? `${idPrefix}-${slug(b.text)}` : undefined;
						return (
							<Tag key={i} id={id}>
								<Inline text={b.text} source={source} />
							</Tag>
						);
					}
					case 'paragraph':
						return (
							<p key={i}>
								<Inline text={b.text} source={source} />
							</p>
						);
					case 'code':
						return <DocsCodeBlock key={i} code={b.code} />;
					case 'list': {
						const Tag = b.ordered ? 'ol' : 'ul';
						return (
							<Tag key={i}>
								{b.items.map((item, j) => (
									<li key={j}>
										<Inline text={item} source={source} />
									</li>
								))}
							</Tag>
						);
					}
					case 'table':
						return <MdTableView key={i} table={b} source={source} wrap={wrapTables} />;
					case 'quote':
						return <Quote key={i} text={b.text} source={source} />;
					default:
						return null;
				}
			})}
		</>
	);
}

export function slug(s: string): string {
	return s
		.toLowerCase()
		.replace(/[`*_"“”]/g, '')
		.replace(/[^\p{L}\p{N}\s-]/gu, '')
		.trim()
		.replace(/\s+/g, '-');
}
