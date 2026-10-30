import type { StudioRecipe } from '../studio-recipe';

export const TOUCH_EVENTS_RECIPES = {
	basicUsage: {
		kind: 'widget',
		widgetName: 'Touch Events',
		groupProps: { WidgetId: 'TouchArea.Id', PreventDefaults: true },
		publishStep:
			'Publish the app and touch-and-drag inside the container on a phone or in browser device emulation.',
		items: [
			{
				placeholders: [
					{
						label: 'Target widget',
						steps: [
							'Drag a Container onto the screen and name it TouchArea; give it a minimum height so there is room to drag.',
							'Below it, drag three Text widgets bound to local Text variables StartInfo, MoveInfo and EndInfo.',
						],
					},
					{
						label: 'Start / Move / End events',
						steps: [
							'On the Touch Events block, create a handler for each of the three events.',
							'In Start, assign StartInfo the X and Y parameters; in Move, assign MoveInfo the X, Y, OffsetX and OffsetY parameters; in End, assign EndInfo the same plus TimeTaken.',
						],
					},
				],
			},
		],
	},
	dragAHandle: {
		kind: 'widget',
		widgetName: 'Touch Events',
		groupProps: { WidgetId: 'DragHandle.Id', PreventDefaults: true },
		publishStep: 'Publish the app and drag the handle on a phone or in browser device emulation.',
		items: [
			{
				placeholders: [
					{
						label: 'Target widget',
						steps: [
							'Drag a Container onto the screen and name it DragHandle; style it as a round 64px handle and set its Style to position: absolute inside a relative parent.',
							'Add a local Text variable HandleTransform and bind it to the Container Style as "transform: " + HandleTransform.',
						],
					},
					{
						label: 'Move / End events',
						steps: [
							'In the Move handler, assign HandleTransform the value "translate(" + OffsetX + "px, " + OffsetY + "px)".',
							'In the End handler, assign HandleTransform an empty Text so the handle snaps back.',
						],
					},
				],
			},
		],
	},
} satisfies Record<string, StudioRecipe>;
