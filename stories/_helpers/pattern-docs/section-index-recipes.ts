import type { StudioRecipe } from '../studio-recipe';

const SECTIONS = ['Profile', 'Notifications', 'Security', 'Billing', 'Integrations'] as const;

const CONTENT_STEPS = [
	`Drag one Section Index Item per section into the Content placeholder: ${SECTIONS.join(', ')}.`,
	'Drag a Text widget into the Content placeholder of each item and set Text to the section name.',
] as const;

const TARGET_STEPS = [
	'Give each section on the screen a Container (or Section) with a Name — Profile, Notifications, and so on.',
	"Set each item's ScrollToWidgetId to the matching container's Id (for example Profile.Id).",
] as const;

const sectionIndexRecipe = (
	groupProps: { SmoothScrolling: boolean; IsFixed: boolean },
	publishStep: string,
	extraSteps: string[] = []
): StudioRecipe => ({
	kind: 'widget',
	widgetName: 'Section Index',
	groupProps,
	items: [
		{
			placeholders: [
				{ label: 'Content placeholder', steps: [...CONTENT_STEPS] },
				{ label: 'Section Index Item properties', steps: [...TARGET_STEPS, ...extraSteps] },
			],
		},
	],
	publishStep,
});

export const SECTION_INDEX_RECIPES = {
	basicUsage: sectionIndexRecipe(
		{ SmoothScrolling: true, IsFixed: false },
		'Publish the app and click Billing — the page scrolls to that section and the item turns active.'
	),
	fixedPosition: sectionIndexRecipe(
		{ SmoothScrolling: true, IsFixed: true },
		'Publish the app and scroll the screen — the index stays below the header while the sections move past it.',
		[
			'Place the Section Index in a side column (for example the first column of a Columns widget) so it has room to stick.',
		]
	),
	instantScrolling: sectionIndexRecipe(
		{ SmoothScrolling: false, IsFixed: false },
		'Publish the app and click Integrations — the page jumps to the section without animation.'
	),
} satisfies Record<string, StudioRecipe>;
