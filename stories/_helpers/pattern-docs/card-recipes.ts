import type { StudioRecipe } from '../studio-recipe';

const BASIC_COPY = 'A simple card surface with border, radius, and padding.';

export const CARD_RECIPES = {
	basicUsage: {
		kind: 'card',
		cardVariant: 'basic',
		groupProps: { UsePadding: true },
		items: [{ content: BASIC_COPY }],
	},
	sectioned: {
		kind: 'card',
		cardVariant: 'sectioned',
		groupProps: { UsePadding: true, IsVertical: true, ImagePadding: false },
		items: [
			{
				title: 'Karra Loft',
				titleSteps: [
					'Drag Text widgets into the Title placeholder for the property name and location.',
					'Add the property price beside the title.',
				],
				contentSteps: [
					'Add a Separator (horizontal) in the Content placeholder.',
					'Compose the feature icons (bedrooms, bathrooms, area, parking) below the separator.',
				],
				imageSteps: [
					'Drag an Image widget into the Image placeholder.',
					'Leave ImagePadding False so the photo stays full-bleed while content keeps UsePadding.',
				],
			},
		],
	},
	sectionedWithPadding: {
		kind: 'card',
		cardVariant: 'sectioned',
		groupProps: { UsePadding: true, IsVertical: true, ImagePadding: true },
		items: [
			{
				title: 'Maya Chen',
				titleSteps: [
					'Drag Text into the Title placeholder for the name.',
				],
				contentSteps: ['Add a short bio in the Content placeholder.'],
				imageSteps: [
					'Drag an Image widget into the Image placeholder.',
					'Keep ImagePadding True so the photo sits inset with the card padding.',
				],
				footerSteps: [
					'In the Card Bottom placeholder, compose profile stats and an OS UI Button (Secondary).',
				],
			},
		],
	},
	sectionedHorizontal: {
		kind: 'card',
		cardVariant: 'sectioned',
		groupProps: { UsePadding: true, IsVertical: false, ImagePadding: false },
		items: [
			{
				title: 'Five places worth the detour this summer',
				titleSteps: ['Drag Text into the Title placeholder for the article headline.'],
				contentSteps: [
					'Add a Separator (horizontal) in the Content placeholder between the title and the author row.',
				],
				imageSteps: [
					'Drag an Image widget into the Image placeholder.',
					'Set IsVertical to False and leave ImagePadding False so the photo stays full-bleed beside the copy.',
					'Set --card-sectioned-gap to 0px on the Card Sectioned (Style Classes or theme CSS) so the image sits flush against the content.',
				],
				footerSteps: [
					'In the Card Bottom placeholder, compose an author avatar, name, date, and category label.',
				],
			},
		],
	},
	background: {
		kind: 'card',
		cardVariant: 'background',
		groupProps: { Color: 'Primary' },
		items: [
			{
				contentSteps: [
					'Compose the title, subtitle, metric, and trend row in the Content placeholder.',
				],
				imageSteps: [
					'Fill the Image placeholder with a palette colour from the theme, or add an image asset.',
				],
			},
		],
	},
	backgroundImage: {
		kind: 'card',
		cardVariant: 'background',
		groupProps: { Color: 'Red', MinHeight: 200 },
		items: [
			{
				content: 'Summer Nights Live',
				contentSteps: ['Add the event title and date or venue in the Content placeholder.'],
				imageSteps: [
					'Drag an Image widget into the Image placeholder.',
					'Set the image to a full-bleed concert or event photo.',
				],
			},
		],
	},
	detailItem: {
		kind: 'card',
		cardVariant: 'item',
		items: [
			{
				title: 'Jane Doe',
				subtitle: 'Product designer · Design',
				leftSteps: [
					'Drag an Avatar widget into the Left placeholder.',
					'Set Size to Medium, Shape to Circle, and Color to Indigo.',
					'Set the initials to JD.',
				],
				rightSteps: [
					'Drag a Tag widget into the Right placeholder.',
					'Set Text to "Active", Color to Green, Size to Small, and IsLight to True.',
				],
			},
		],
	},
	metricItem: {
		kind: 'card',
		cardVariant: 'item',
		items: [
			{
				title: 'Tickets sold',
				subtitle: 'Summer Nights Live',
				leftSteps: [
					'Drag a Container into the Left placeholder and place an Icon inside.',
					'Style the container as a rounded tile (for example with background-violet-lightest).',
					'Set the Icon to ticket.',
				],
				rightSteps: [
					'Compose a Text widget in the Right placeholder.',
					'Set the text to "1,240" and right-align it.',
				],
			},
		],
	},
	composition: {
		kind: 'card',
		cardVariant: 'basic',
		groupProps: { UsePadding: true },
		items: [
			{
				contentSteps: [
					'Add a Card and compose the header, highlighted row, summary lines, and action button in the Content placeholder.',
				],
			},
		],
	},
} satisfies Record<string, StudioRecipe>;
