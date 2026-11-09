import React from 'react';
import { DocsToc } from './DocsToc';
import { GettingStartedArticle } from './GettingStartedArticle';

const TOC_ITEMS = [
	{ id: 'prerequisites', label: 'Prerequisites' },
	{ id: 'steps', label: 'Four steps' },
	{ id: 'patterns-detail', label: 'Working with patterns' },
	{ id: 'technical', label: 'Technical notes' },
];

const HEAD = `
<header class="head">
  <div class="head-in">
    <span class="eyebrow">Overview · Getting Started</span>
    <h1>From empty workspace<br />to <em>a themed app.</em></h1>
    <p class="lede">Four steps in ODC Studio, with no code to write and nothing to install. The same steps apply whether you are building a web app or a mobile app.</p>
  </div>
</header>
`;

function scrollToId(id: string) {
	const el = document.getElementById(id);
	if (!el) return;
	el.scrollIntoView({ behavior: 'smooth', block: 'start' });
	try {
		history.replaceState(null, '', `#${id}`);
	} catch {
		/* ignore */
	}
}

function useGettingStartedEnhancements(rootRef: React.RefObject<HTMLDivElement | null>) {
	React.useEffect(() => {
		const root = rootRef.current;
		if (!root) return;

		const onClick = async (e: Event) => {
			const target = e.target as HTMLElement;

			const btn = target.closest('button[data-copy]') as HTMLButtonElement | null;
			if (btn && root.contains(btn)) {
				const text = btn.getAttribute('data-copy') || '';
				try {
					await navigator.clipboard.writeText(text);
					const prev = btn.textContent;
					btn.textContent = 'Copied';
					window.setTimeout(() => {
						btn.textContent = prev;
					}, 1400);
				} catch {
					/* ignore */
				}
				return;
			}

			// In-page anchors (e.g. step 3 → #patterns-detail) — avoid Storybook iframe navigation
			const anchor = target.closest('a[href^="#"]') as HTMLAnchorElement | null;
			if (anchor && root.contains(anchor)) {
				const id = anchor.getAttribute('href')?.slice(1);
				if (id) {
					e.preventDefault();
					scrollToId(id);
				}
			}
		};
		root.addEventListener('click', onClick);
		return () => root.removeEventListener('click', onClick);
	}, [rootRef]);
}

export function GettingStartedPage() {
	const rootRef = React.useRef<HTMLDivElement>(null);
	useGettingStartedEnhancements(rootRef);

	return (
		<div ref={rootRef} className="osui-getting-started sb-unstyled">
			<div dangerouslySetInnerHTML={{ __html: HEAD }} />
			<div className="docs-inner">
				<div className="cols">
					<GettingStartedArticle />
					<DocsToc items={TOC_ITEMS} />
				</div>
			</div>
		</div>
	);
}
