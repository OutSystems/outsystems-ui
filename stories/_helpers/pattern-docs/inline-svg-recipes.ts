import type { StudioRecipe } from '../studio-recipe';

const STAR_SVG =
	'<svg viewBox="0 0 24 24" width="64" height="64"><path fill="currentColor" d="M12 2l2.9 6.3 6.9.7-5.2 4.6 1.5 6.8L12 17.8 5.9 20.4l1.5-6.8L2.2 9l6.9-.7z"/></svg>';

const CLOUD_UPLOAD_SVG =
	'<svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M7 18a4.5 4.5 0 0 1-.6-8.96A6 6 0 0 1 18 9.5a4 4 0 0 1-.5 8"/><path d="M12 12v9"/><path d="m8.5 15.5 3.5-3.5 3.5 3.5"/></svg>';

export const INLINE_SVG_RECIPES = {
	basicUsage: {
		kind: 'widget',
		widgetName: 'Inline SVG',
		groupProps: { SVGCode: STAR_SVG },
		items: [
			{
				placeholders: [
					{
						label: 'No placeholders',
						steps: [
							'Inline SVG has no placeholders — the whole drawing comes from the SVGCode text. Paste the markup as a Text literal (escape any double quotes) or bind it to a Text variable.',
							'Use fill="currentColor" in the markup so the icon follows the surrounding text colour.',
						],
					},
				],
			},
		],
		publishStep:
			'Publish the app and confirm the star renders inline (inspect it: a real <svg> element, not an image).',
	},
	themedColors: {
		kind: 'widget',
		widgetName: 'Inline SVG',
		groupProps: { SVGCode: CLOUD_UPLOAD_SVG },
		items: [
			{
				placeholders: [
					{
						label: 'No placeholders',
						steps: [
							'Drag four Inline SVG widgets side by side (a Columns widget works well) and paste the same SVGCode into each.',
							'Set ExtendedClass to "text-primary", "text-success", "text-error" and "text-neutral-6" respectively — the stroke="currentColor" markup picks up each colour.',
						],
					},
				],
			},
		],
		publishStep: 'Publish the app and confirm each icon takes the colour of its utility class.',
	},
} satisfies Record<string, StudioRecipe>;
