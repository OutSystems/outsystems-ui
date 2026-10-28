import type { PatternDocMeta } from './types';

export const BREADCRUMBS_DOC: PatternDocMeta = {
	name: 'Breadcrumbs',
	category: 'Navigation',
	lede: 'Trail of links showing where the current screen sits in the app hierarchy — a one-click way back to any parent level.',
	overview:
		'Breadcrumbs is a nav landmark whose Content placeholder holds one Breadcrumbs Item per level. Each item has a Title placeholder (a Link for ancestor screens, plain text for the current one) and an Icon placeholder that draws the separator after the title. The last item renders bold in the text colour and leaves its Icon placeholder empty. No JavaScript runs — the pattern is CSS only.',
	stylingSelector: '.breadcrumbs',
	odcUrl: 'https://success.outsystems.com/documentation/outsystems_developer_cloud/building_apps/user_interface/patterns/navigation/breadcrumbs/',
	o11Url: 'https://success.outsystems.com/documentation/11/building_apps/user_interface/patterns/using_mobile_and_reactive_patterns/navigation/breadcrumbs/',
	liveStoryId: 'patterns-navigation-breadcrumbs--basic-usage',
	cssApiSlug: 'patterns-navigation-breadcrumbs',
	whenToUse: [
		'Apps with a hierarchy three or more levels deep (catalogue > category > product, project > folder > file).',
		'Detail screens users reach from several lists, so they can step back to the parent level without the browser history.',
		'Admin and back-office screens where orientation matters more than space.',
	],
	whenNotToUse: [
		'Flat apps with a single level — a Sidebar or Tabs already shows where the user is.',
		'Multi-step flows where going back means undoing a step — use a Wizard instead.',
	],
	anatomy: {
		tree: `<nav class="breadcrumbs" aria-label="breadcrumb">
  <div class="breadcrumbs-content"> <!-- Content placeholder: Breadcrumbs Item blocks -->
    <div class="breadcrumbs-item">
      <div class="title"><a href="…">Products</a></div> <!-- Title placeholder -->
      <div aria-hidden="true"><i class="icon ph ph-caret-right"></i></div> <!-- Icon placeholder (separator) -->
    </div>
    <div class="breadcrumbs-item"> <!-- last item: current screen, plain text, Icon placeholder empty -->
      <div class="title"><span>ThinkBook 14 Gen 6</span></div>
    </div>
  </div>
</nav>`,
	},
	properties: [
		{
			title: 'Breadcrumbs',
			rows: [
				{
					name: 'ExtendedClass',
					type: 'Text',
					description:
						'Extra CSS classes on the Breadcrumbs root. Example: myclass or myclass1 myclass2. OutSystems UI utility classes are supported.',
				},
			],
		},
		{
			title: 'Breadcrumbs Item',
			rows: [
				{
					name: 'ExtendedClass',
					type: 'Text',
					description: 'Extra CSS classes on the Breadcrumbs Item root (.breadcrumbs-item).',
				},
			],
		},
	],
	accessibility: [
		'The root is a nav landmark with aria-label="breadcrumb", so screen-reader users can jump straight to the trail.',
		'Separator icons sit in an aria-hidden container — they are decorative; the link text alone carries the meaning.',
		'Keep the current screen as plain text (not a link). If you must make it a link, add aria-current="page" so it is announced as the current location.',
		'Links rely on the global focus styles; the hover colour change is reinforced by the bold weight on the last item, and the separator mirrors automatically under .is-rtl.',
	],
	related: [
		{ name: 'Section Index', storyId: 'patterns-navigation-sectionindex--docs' },
		{ name: 'Tabs', storyId: 'patterns-navigation-tabs--docs' },
		{ name: 'Sidebar', storyId: 'patterns-navigation-sidebar--docs' },
	],
};
