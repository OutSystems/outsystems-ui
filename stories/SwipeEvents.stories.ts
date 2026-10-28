import type { Meta, StoryObj } from '@storybook/html-vite';
import { cfg, osuiRoot, Patterns, renderPattern, uid, type Register } from './_helpers/osui';

/**
 * SwipeEvents — a gesture utility (no visuals of its own). It attaches touch
 * listeners to the element named by `WidgetId`. Best exercised on a touch
 * device / device-emulation; here we wire it to the demo box and log swipes.
 */
const meta: Meta = {
	title: 'Patterns/Utilities/SwipeEvents',
};
export default meta;

type Story = StoryObj;

/**
 * The block's only input parameter is `WidgetId` (the demo box, wired here), so the
 * playground has no controls — it logs the four swipe events instead.
 */
export const Playground: Story = {
	render: () => {
		const id = uid('swipe');
		const template = `
			<div ${osuiRoot(id)} style="display:flex;align-items:center;justify-content:center;min-height:200px;background:#eef;border-radius:8px;user-select:none;touch-action:none;">
				<span data-output>Swipe inside this box (touch device / emulation)</span>
			</div>`;
		return renderPattern(template, (root, register) => {
			const P = Patterns();
			P.SwipeEventsAPI.Create(id, cfg({ WidgetId: id }));
			P.SwipeEventsAPI.Initialize(id);
			const out = root.querySelector('[data-output]')!;
			['SwipeUp', 'SwipeDown', 'SwipeLeft', 'SwipeRight'].forEach((evt) =>
				P.SwipeEventsAPI.RegisterCallback?.(id, evt, () => (out.textContent = `${evt} 👆`))
			);
			register(() => P.SwipeEventsAPI.Dispose?.(id));
		});
	},
};

const SWIPE_EVENTS = ['SwipeUp', 'SwipeDown', 'SwipeLeft', 'SwipeRight'] as const;
type SwipeEvent = (typeof SWIPE_EVENTS)[number];

const SURFACE_STYLE =
	'display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;min-height:220px;' +
	'background:var(--color-neutral-2, #eef);border:1px dashed var(--color-neutral-5, #ccd);border-radius:8px;' +
	'user-select:none;touch-action:none;text-align:center;';

/**
 * Docs-page wiring, mirroring the low-code block: the Swipe Events block tracks the gesture with
 * the Touch Events block and forwards its `End` offsets to `SwipeEventsAPI.GestureEnd`, which
 * classifies them into one of the four swipe events (10px threshold, 0.3px/ms velocity). The
 * SwipeEvents instance itself only attaches listeners to the `WidgetId` element; the platform
 * owns the gesture tracking.
 */
function initSwipeEvents(targetId: string, register: Register, onSwipe: (evt: SwipeEvent) => void): void {
	const P = Patterns();
	// Both runtimes resolve their own element by the instance id (`name=` attribute), so the
	// instances are keyed by the target element's id — exactly like the Playground. The two
	// APIs keep separate registries, so the same id can back one instance of each.
	const swipeId = targetId;
	const touchId = targetId;
	P.SwipeEventsAPI.Create(swipeId, cfg({ WidgetId: targetId }));
	P.SwipeEventsAPI.Initialize(swipeId);
	SWIPE_EVENTS.forEach((evt) => P.SwipeEventsAPI.RegisterCallback?.(swipeId, evt, () => onSwipe(evt)));
	P.TouchEventsAPI.Create(touchId, cfg({ WidgetId: targetId }));
	P.TouchEventsAPI.Initialize(touchId);
	P.TouchEventsAPI.RegisterCallback?.(
		touchId,
		'End',
		(_x: number, _y: number, offsetX: number, offsetY: number, timeTaken: number) =>
			P.SwipeEventsAPI.GestureEnd(swipeId, offsetX, offsetY, timeTaken)
	);
	register(() => {
		P.TouchEventsAPI.Dispose?.(touchId);
		P.SwipeEventsAPI.Dispose?.(swipeId);
	});
}

const ARROWS: Record<SwipeEvent, string> = { SwipeUp: '↑', SwipeDown: '↓', SwipeLeft: '←', SwipeRight: '→' };

export const BasicUsage: Story = {
	tags: ['docs-example'],
	name: 'Basic usage',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				story: 'The block points at a Container through <code>WidgetId</code>; each gesture on it raises <code>SwipeUp</code>, <code>SwipeDown</code>, <code>SwipeLeft</code> or <code>SwipeRight</code>. The surface shows the last event and keeps a short log. Use a touch device or browser device emulation.',
			},
		},
	},
	render: () => {
		const id = uid('swipe-area');
		const template = `
			<div style="display:grid;gap:12px;max-width:480px;">
				<div ${osuiRoot(id)} style="${SURFACE_STYLE}">
					<span data-arrow style="font-size:40px;line-height:1;" aria-hidden="true">☝</span>
					<strong data-output>Swipe in any direction</strong>
					<span style="font-size:12px;color:var(--color-neutral-7, #667);">Touch device or device emulation</span>
				</div>
				<ol data-log aria-live="polite" style="margin:0;padding-inline-start:20px;font-size:13px;min-height:4.5em;color:var(--color-neutral-8, #445);"></ol>
			</div>`;
		return renderPattern(template, (root, register) => {
			const arrow = root.querySelector('[data-arrow]')!;
			const out = root.querySelector('[data-output]')!;
			const log = root.querySelector('[data-log]')!;
			initSwipeEvents(id, register, (evt) => {
				arrow.textContent = ARROWS[evt];
				out.textContent = `${evt} fired`;
				const entry = document.createElement('li');
				entry.textContent = `${new Date().toLocaleTimeString()} — ${evt}`;
				log.prepend(entry);
				while (log.children.length > 4) log.lastElementChild?.remove();
			});
		});
	},
};

const INBOX = [
	{
		from: 'Maria Lopes',
		subject: 'Q3 budget approved',
		preview: 'Finance signed off this morning — we can start hiring.',
	},
	{
		from: 'Dev Patel',
		subject: 'Release 3.2 notes',
		preview: 'Changelog is in the shared folder, please review by Friday.',
	},
	{ from: 'Ana Ribeiro', subject: 'Design review moved', preview: 'Thursday 15:00 instead of Wednesday, same room.' },
] as const;

export const SwipeToDismiss: Story = {
	tags: ['docs-example'],
	name: 'Swipe to dismiss',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				story: 'One Swipe Events block per list row, each with <code>WidgetId</code> set to that row. <code>SwipeLeft</code> and <code>SwipeRight</code> slide the row out of the list; the other two events are left unhandled.',
			},
		},
	},
	render: () => {
		const rows = INBOX.map((mail) => ({ ...mail, id: uid('swipe-row') }));
		const rowMarkup = rows
			.map(
				(mail) => `
				<div ${osuiRoot(mail.id)} data-row style="display:grid;gap:2px;padding:12px 16px;background:var(--color-neutral-0, #fff);border:1px solid var(--color-neutral-4, #ddd);border-radius:8px;user-select:none;touch-action:pan-y;transition:transform .25s ease, opacity .25s ease;">
					<strong>${mail.from}</strong>
					<span>${mail.subject}</span>
					<span style="font-size:13px;color:var(--color-neutral-7, #667);">${mail.preview}</span>
				</div>`
			)
			.join('');
		const template = `
			<div style="display:grid;gap:8px;max-width:480px;">
				<p style="margin:0;font-size:13px;color:var(--color-neutral-7, #667);">Swipe a message left or right to archive it.</p>
				<div data-list style="display:grid;gap:8px;">${rowMarkup}</div>
				<p data-empty hidden style="margin:0;text-align:center;color:var(--color-neutral-7, #667);">Inbox zero.</p>
				<button type="button" data-reset class="btn" style="justify-self:start;">Restore messages</button>
			</div>`;
		return renderPattern(template, (root, register) => {
			const list = root.querySelector<HTMLElement>('[data-list]')!;
			const empty = root.querySelector<HTMLElement>('[data-empty]')!;
			const initialRows = list.innerHTML;
			const wire = () => {
				rows.forEach(({ id }) => {
					const row = root.querySelector<HTMLElement>(`#${id}`);
					if (!row) return;
					initSwipeEvents(id, register, (evt) => {
						if (evt !== 'SwipeLeft' && evt !== 'SwipeRight') return;
						row.style.transform = `translateX(${evt === 'SwipeLeft' ? '-110%' : '110%'})`;
						row.style.opacity = '0';
						setTimeout(() => {
							row.hidden = true;
							empty.hidden = list.querySelectorAll('[data-row]:not([hidden])').length > 0;
						}, 250);
					});
				});
			};
			wire();
			root.querySelector('[data-reset]')!.addEventListener('click', () => {
				list.innerHTML = initialRows;
				empty.hidden = true;
				wire();
			});
		});
	},
};
