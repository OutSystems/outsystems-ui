import type { StudioRecipe } from '../studio-recipe';

const ALERT_COPY = {
	success: 'Success! Your changes were saved.',
	info: 'Heads up — this is an informational alert.',
	warning: 'Warning — double-check this before continuing.',
	error: 'Something went wrong. Please try again.',
} as const;

export const ALERT_RECIPES = {
	basicUsage: {
		kind: 'alert',
		groupProps: { AlertType: 'Success' },
		items: [{ content: ALERT_COPY.success }],
	},
	allSeverities: {
		kind: 'alert',
		items: [
			{ props: { AlertType: 'Success' }, content: ALERT_COPY.success },
			{ props: { AlertType: 'Info' }, content: ALERT_COPY.info },
			{ props: { AlertType: 'Warning' }, content: ALERT_COPY.warning },
			{ props: { AlertType: 'Error' }, content: ALERT_COPY.error },
		],
	},
	vivid: {
		kind: 'alert',
		items: [
			{ props: { AlertType: 'Success', ExtendedClass: 'vivid' }, content: `${ALERT_COPY.success} (vivid)` },
			{ props: { AlertType: 'Info', ExtendedClass: 'vivid' }, content: `${ALERT_COPY.info} (vivid)` },
			{ props: { AlertType: 'Warning', ExtendedClass: 'vivid' }, content: `${ALERT_COPY.warning} (vivid)` },
			{ props: { AlertType: 'Error', ExtendedClass: 'vivid' }, content: `${ALERT_COPY.error} (vivid)` },
		],
	},
} satisfies Record<string, StudioRecipe>;
