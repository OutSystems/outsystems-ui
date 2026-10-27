import type { Meta, StoryObj } from '@storybook/html-vite';
import { blankSlateEmptyFilesIllustration, blankSlateEmptyProjectsIllustration } from './_helpers/blank-slate-illustrations';
import { renderStatic } from './_helpers/osui';
import { cls, extendedClassArgType } from './_helpers/lowcode';

/**
 * Blank Slate — shipped: `.blank-slate[.large]` > div > `.blank-slate-icon` + `.blank-slate-description` + `.blank-slate-actions`.
 *
 * Icon / Description / Actions are the three Studio placeholders. Demos use richer
 * content inside those slots (illustration, title + lead, one or two buttons).
 */

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

function blankSlateMarkup({
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

const meta: Meta = {
	title: 'Patterns/Content/BlankSlate',
	tags: ['!ui-pending', 'ui-reviewed'],
	parameters: {
		docs: {
			source: { disable: true },
			canvas: { sourceState: 'none' },
		},
	},
};
export default meta;

type Story = StoryObj;

export const BasicUsage: Story = {
	name: 'Basic usage',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				story:
					'First-use empty state — illustration in the Icon placeholder, title and lead in Description, primary action in Actions. <code>FullHeight</code> is False.',
			},
		},
	},
	render: () =>
		renderStatic(
			blankSlateMarkup({
				fullHeight: false,
				...ONBOARDING,
			})
		),
};

export const FullHeight: Story = {
	name: 'Full height',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				story:
					'<code>FullHeight</code> is True — the root gets <code>.large</code> and fills the available height with a bigger illustration.',
			},
		},
	},
	render: () =>
		renderStatic(
			blankSlateMarkup({
				fullHeight: true,
				...ONBOARDING,
				wrapperStyle: FULL_HEIGHT_AREA,
			})
		),
};

export const WithoutActions: Story = {
	name: 'Without actions',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				story:
					'Search with no results — leave the Actions placeholder empty when no call to action is needed.',
			},
		},
	},
	render: () =>
		renderStatic(
			blankSlateMarkup({
				fullHeight: false,
				withActions: false,
				...SEARCH_EMPTY,
			})
		),
};

type BlankSlateArgs = { fullHeight: boolean; extendedClass: string };

/** Playground with Storybook controls — not used on the docs page. */
export const Default: StoryObj<BlankSlateArgs> = {
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
	render: ({ fullHeight, extendedClass }) =>
		renderStatic(
			blankSlateMarkup({
				fullHeight,
				...ONBOARDING,
				extendedClass,
				wrapperStyle: fullHeight ? FULL_HEIGHT_AREA : undefined,
			})
		),
};
