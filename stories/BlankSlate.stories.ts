import type { Meta, StoryObj } from '@storybook/html-vite';
import {
	blankSlateEmptyFilesIllustration,
	blankSlateEmptyProjectsIllustration,
} from './_helpers/blank-slate-illustrations';
import { renderStatic } from './_helpers/osui';
import { cls, extendedClassArgType } from './_helpers/lowcode';
import { labeledBoard } from './_helpers/showcase';

/**
 * Blank Slate — shipped: `.blank-slate[.large]` > div > `.blank-slate-icon` + `.blank-slate-description` + `.blank-slate-actions`.
 *
 * Controls mirror the low-code input parameters of the `BlankSlate` block:
 *   FullHeight    → when True adds `.large` to root (sets height:100% and larger icon size)
 *   ExtendedClass → extra classes on the root
 * Class mappings from src/scss/04-patterns/02-content/_blank-slate.scss.
 */
// ─── Docs-page demos (ported from the docs stories) ─────────────────────────
// Icon / Description / Actions are the three Studio placeholders. Demos use richer
// content inside those slots (illustration, title + lead, one or two buttons).

type BlankSlateAction = { label: string; variant?: 'primary' | 'secondary'; icon?: string };

type BlankSlateOptions = {
	fullHeight?: boolean;
	title: string;
	description: string;
	withActions?: boolean;
	actions?: BlankSlateAction[];
	illustration?: string;
	wrapperStyle?: string;
	extendedClass?: string;
};

function descriptionMarkup(title: string, description: string): string {
	return `<div class="sb-blank-slate-title">${title}</div>
		<p class="sb-blank-slate-lead">${description}</p>`;
}

function actionsMarkup(actions: BlankSlateAction[]): string {
	const buttons = actions
		.map(({ label, variant, icon }) => {
			const btnClass = variant === 'primary' ? 'btn btn-primary' : 'btn';
			const iconMarkup = icon ? `<i class="icon ph ${icon}" aria-hidden="true"></i>` : '';
			return `<button data-button class="${btnClass}" type="button">${iconMarkup}<span>${label}</span></button>`;
		})
		.join('');
	return `<div class="blank-slate-actions sb-blank-slate-actions">${buttons}</div>`;
}

function blankSlateMarkupDoc({
	fullHeight = false,
	title,
	description,
	withActions = true,
	actions = [{ label: 'Create project', variant: 'primary' }],
	illustration = blankSlateEmptyProjectsIllustration(),
	wrapperStyle,
	extendedClass,
}: BlankSlateOptions): string {
	const actionsBlock = withActions ? actionsMarkup(actions) : '';

	const slate = `
		<div class="${cls('blank-slate', fullHeight && 'large', extendedClass)}">
			<div>
				<div class="blank-slate-icon sb-blank-slate-illust">${illustration}</div>
				<div class="blank-slate-description">${descriptionMarkup(title, description)}</div>
				${actionsBlock}
			</div>
		</div>`;

	const resolvedWrapperStyle =
		wrapperStyle ?? (fullHeight ? 'height:360px;width:100%;box-sizing:border-box' : undefined);

	return resolvedWrapperStyle ? `<div style="${resolvedWrapperStyle}">${slate}</div>` : slate;
}

const FULL_HEIGHT_AREA =
	'height:360px;width:100%;box-sizing:border-box;border:1px solid var(--color-border);border-radius:8px;overflow:hidden;background:var(--color-background-surface);';

const ONBOARDING = {
	title: 'No projects yet',
	description: 'Create a project to organize tasks, files, and conversations in one place.',
	actions: [{ label: 'Create project', variant: 'primary' as const, icon: 'ph-plus' }],
	illustration: blankSlateEmptyProjectsIllustration(),
};

const SEARCH_EMPTY = {
	title: 'No files found',
	description: 'Your search did not match any projects. Try different keywords or clear the search.',
	illustration: blankSlateEmptyFilesIllustration(),
};

type Story = StoryObj;

const meta: Meta = { title: 'Patterns/Content/BlankSlate' };
export default meta;

type BlankSlateArgs = { fullHeight: boolean; extendedClass: string };

function blankSlateMarkup({ fullHeight, extendedClass }: BlankSlateArgs): string {
	return `
		<div class="${cls('blank-slate', fullHeight && 'large', extendedClass)}" style="max-width:420px;text-align:center;">
			<div>
				<div class="blank-slate-icon"><i class="icon ph ph-tray"></i></div>
				<div class="blank-slate-description">No records have been added yet.</div>
				<div class="blank-slate-actions"><button class="btn btn-primary"><span>Create item</span></button></div>
			</div>
		</div>`;
}

export const Playground: StoryObj<BlankSlateArgs> = {
	args: { fullHeight: true, extendedClass: '' },
	argTypes: {
		fullHeight: {
			name: 'FullHeight',
			control: 'boolean',
			description:
				'When True, displays a larger BlankSlate taking full page height. Maps to `.large` on the root element.',
		},
		extendedClass: extendedClassArgType,
	},
	render: (args) => renderStatic(blankSlateMarkup(args)),
};

export const BasicUsage: Story = {
	tags: ['docs-example'],
	name: 'Basic usage',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				story: 'First-use empty state — illustration in the Icon placeholder, title and lead in Description, primary action in Actions. <code>FullHeight</code> is False.',
			},
		},
	},
	render: () =>
		renderStatic(
			blankSlateMarkupDoc({
				fullHeight: false,
				...ONBOARDING,
			})
		),
};

export const FullHeight: Story = {
	tags: ['docs-example'],
	name: 'Full height',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				story: '<code>FullHeight</code> is True — the root gets <code>.large</code> and fills the available height with a bigger illustration.',
			},
		},
	},
	render: () =>
		renderStatic(
			blankSlateMarkupDoc({
				fullHeight: true,
				...ONBOARDING,
				wrapperStyle: FULL_HEIGHT_AREA,
			})
		),
};

export const WithoutActions: Story = {
	tags: ['docs-example'],
	name: 'Without actions',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				story: 'Search with no results — leave the Actions placeholder empty when no call to action is needed.',
			},
		},
	},
	render: () =>
		renderStatic(
			blankSlateMarkupDoc({
				fullHeight: false,
				withActions: false,
				...SEARCH_EMPTY,
			})
		),
};

/** Compact (FullHeight off) next to the `.large` full-height variant. */
export const Sizes: StoryObj = {
	parameters: { controls: { disable: true } },
	render: () =>
		renderStatic(
			labeledBoard(
				[
					{ label: 'default', html: blankSlateMarkup({ fullHeight: false, extendedClass: '' }) },
					{ label: 'large (FullHeight)', html: blankSlateMarkup({ fullHeight: true, extendedClass: '' }) },
				],
				{ direction: 'row', gap: 48 }
			).outerHTML
		),
};
