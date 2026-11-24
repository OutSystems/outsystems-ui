import type { StudioRecipe } from '../studio-recipe';

const PROJECT_ILLUST_STEPS = [
	'Drag an Image widget into the Icon placeholder.',
	'Set the image to an empty-state illustration (e.g. blank-slate-empty-projects.png).',
] as const;

const FILES_ILLUST_STEPS = [
	'Drag an Image widget into the Icon placeholder.',
	'Set the image to a no-results illustration (e.g. blank-slate-empty-files.png).',
] as const;

export const BLANK_SLATE_RECIPES = {
	basicUsage: {
		kind: 'blank-slate',
		groupProps: { FullHeight: false },
		items: [
			{
				iconSteps: [...PROJECT_ILLUST_STEPS],
				contentSteps: [
					'Drag Text widgets into the Description placeholder.',
					'Add a short title (e.g. No projects yet).',
					'Add a supporting line below (e.g. Create a project to organize tasks…).',
				],
				actionSteps: [
					'Drag a Button widget into the Actions placeholder.',
					'Set Label to Create project and add a plus Icon on the button.',
				],
			},
		],
	},
	fullHeight: {
		kind: 'blank-slate',
		groupProps: { FullHeight: true },
		items: [
			{
				iconSteps: [...PROJECT_ILLUST_STEPS],
				contentSteps: [
					'Drag Text widgets into the Description placeholder.',
					'Add a short title and a supporting line.',
				],
				actionSteps: [
					'Drag a Button widget into the Actions placeholder.',
					'Set Label to Create project and add a plus Icon on the button.',
				],
			},
		],
	},
	withoutActions: {
		kind: 'blank-slate',
		groupProps: { FullHeight: false },
		items: [
			{
				iconSteps: [...FILES_ILLUST_STEPS],
				contentSteps: [
					'Drag Text widgets into the Description placeholder.',
					'Set the title to No files found.',
					'Explain why the list is empty (e.g. search returned no matches).',
				],
			},
		],
	},
} satisfies Record<string, StudioRecipe>;
