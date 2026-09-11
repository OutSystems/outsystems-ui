import React from 'react';

export type DocsTocItem = {
	id: string;
	label: string;
};

type DocsTocProps = {
	items: DocsTocItem[];
	/** Optional title above the links */
	title?: string;
	className?: string;
	/** Distance from the viewport top used to decide the active section */
	offsetPx?: number;
};

function getScrollRoot(): HTMLElement {
	// Storybook docs iframe scrolls `body` (html is overflow:hidden).
	if (document.body.scrollHeight > document.body.clientHeight + 1) {
		return document.body;
	}
	return (document.scrollingElement as HTMLElement) || document.documentElement;
}

/**
 * Sticky "On this page" nav for docs MDX pages.
 * Hash links alone break Storybook's docs iframe, so clicks scroll inside the
 * preview. Active state uses a scroll-spy (last section past the offset line),
 * which is more stable than IntersectionObserver with tall sections.
 */
export function DocsToc({
	items,
	title = 'On this page',
	className,
	offsetPx = 96,
}: DocsTocProps) {
	const [activeId, setActiveId] = React.useState(items[0]?.id ?? '');
	const lockRef = React.useRef<string | null>(null);
	const unlockTimer = React.useRef<number | null>(null);

	const resolveActive = React.useCallback(() => {
		if (lockRef.current) {
			setActiveId(lockRef.current);
			return;
		}
		let current = items[0]?.id ?? '';
		for (const item of items) {
			const el = document.getElementById(item.id);
			if (!el) continue;
			if (el.getBoundingClientRect().top <= offsetPx) {
				current = item.id;
			}
		}
		setActiveId(current);
	}, [items, offsetPx]);

	React.useEffect(() => {
		const root = getScrollRoot();
		resolveActive();

		const onScroll = () => resolveActive();
		root.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('resize', onScroll);
		return () => {
			root.removeEventListener('scroll', onScroll);
			window.removeEventListener('resize', onScroll);
			if (unlockTimer.current !== null) window.clearTimeout(unlockTimer.current);
		};
	}, [resolveActive]);

	const onNavigate = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
		e.preventDefault();
		const el = document.getElementById(id);
		if (!el) return;

		lockRef.current = id;
		setActiveId(id);
		if (unlockTimer.current !== null) window.clearTimeout(unlockTimer.current);

		el.scrollIntoView({ behavior: 'smooth', block: 'start' });
		try {
			history.replaceState(null, '', `#${id}`);
		} catch {
			/* ignore */
		}

		// Keep the clicked item active until smooth scroll settles
		unlockTimer.current = window.setTimeout(() => {
			lockRef.current = null;
			resolveActive();
		}, 700);
	};

	return (
		<nav className={['toc', className].filter(Boolean).join(' ')} aria-label={title}>
			<b>{title}</b>
			{items.map((item) => (
				<a
					key={item.id}
					href={`#${item.id}`}
					className={activeId === item.id ? 'is-active' : undefined}
					aria-current={activeId === item.id ? 'location' : undefined}
					onClick={(e) => onNavigate(e, item.id)}
				>
					{item.label}
				</a>
			))}
		</nav>
	);
}
