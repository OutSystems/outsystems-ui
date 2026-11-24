import type { StudioRecipe } from '../studio-recipe';

const BASIC_FAQ = [
	{
		title: 'How long does delivery take?',
		body: 'Standard shipping arrives in 3–5 business days. Express orders placed before 2 p.m. ship the same day and usually arrive within 48 hours.',
	},
	{
		title: 'What is your return policy?',
		body: 'You can return unused items within 30 days of delivery. Start a return from your order history — a prepaid label is generated automatically and refunds are issued within 5 business days of receipt.',
	},
	{
		title: 'Can I change my delivery address?',
		body: 'Yes, while the order is still processing. Open the order detail page and choose Change address. Once the parcel ships, contact the carrier directly using the tracking link in your confirmation email.',
	},
] as const;

const DISABLED_ACTIONS = [
	{
		title: 'Download annual statement',
		body: 'PDF export of your yearly billing summary, ready for accounting.',
	},
	{
		title: 'Transfer workspace ownership',
		body: 'Hand off admin rights to another member. Requires two-factor authentication.',
	},
	{
		title: 'Close account',
		body: 'Permanently delete the workspace and all associated data after a 14-day grace period.',
	},
] as const;

const EMPLOYEE_TITLE_STEPS = [
	'Drag an Image widget (or Avatar) into the Title placeholder and set the image.',
	'Drag Text widgets for employee name, role, and department.',
	'Drag a Tag widget for employment status.',
] as const;

const EMPLOYEE_CONTENT = [
	'carlton.turner@example.com · +351 912 000 101. Data analyst in the Analytics team.',
	'diana.rossi@example.com · +351 912 000 202. Software engineer on the Payments team.',
	'evelyn.chen@example.com · +351 912 000 303. Project manager for the Product organisation.',
] as const;

export const ACCORDION_RECIPES = {
	basicUsage: {
		kind: 'accordion',
		groupProps: { MultipleItems: false },
		items: BASIC_FAQ.map((item) => ({
			title: item.title,
			content: item.body,
		})),
	},
	plusMinusIcon: {
		kind: 'accordion',
		groupProps: { MultipleItems: false },
		items: BASIC_FAQ.map((item) => ({
			props: { Icon: 'PlusMinus', IconPosition: 'Right' },
			title: item.title,
			content: item.body,
		})),
	},
	multipleExpand: {
		kind: 'accordion',
		groupProps: { MultipleItems: true },
		items: BASIC_FAQ.map((item, index) => ({
			props: index < 2 ? { StartsExpanded: true } : undefined,
			title: item.title,
			content: item.body,
		})),
	},
	disabledItems: {
		kind: 'accordion',
		items: DISABLED_ACTIONS.map((item) => ({
			props: { IsDisabled: true },
			title: item.title,
			content: item.body,
		})),
	},
	customTitleMarkup: {
		kind: 'accordion',
		items: EMPLOYEE_CONTENT.map((content, index) => ({
			titleSteps: [...EMPLOYEE_TITLE_STEPS],
			content,
		})),
	},
} satisfies Record<string, StudioRecipe>;
