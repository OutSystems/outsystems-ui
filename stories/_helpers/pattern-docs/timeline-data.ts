import type { PatternDocMeta } from './types';

export const TIMELINE_DOC: PatternDocMeta = {
	name: 'Timeline',
	category: 'Navigation',
	lede: 'A vertical sequence of dated events joined by a connector line — order tracking, case history, audit trails, or any story that reads top to bottom.',
	overview:
		'Timeline is CSS-only and built from Timeline Item blocks stacked inside a container. Each item has Left and Right placeholders for dates or metadata, an Icon placeholder that paints a coloured marker (or an 8px dot when empty), and Title and Content placeholders for the event text. The connector between markers is drawn by the item itself and hidden on the last one.',
	stylingSelector: '.timeline-item',
	odcUrl: 'https://success.outsystems.com/documentation/outsystems_developer_cloud/building_apps/user_interface/patterns/navigation/timeline_item/',
	o11Url: 'https://success.outsystems.com/documentation/11/building_apps/user_interface/patterns/using_mobile_and_reactive_patterns/navigation/timeline_item/',
	liveStoryId: 'patterns-navigation-timeline--basic-usage',
	cssApiSlug: 'patterns-navigation-timeline',
	whenToUse: [
		'Shipment, ticket or approval histories where the order of events matters more than their detail.',
		'Activity feeds and audit logs that show who did what and when.',
		'Roadmaps or milestones that users read in sequence rather than filter or sort.',
	],
	whenNotToUse: [
		'A process the user still has to complete step by step — use the Wizard pattern.',
		'Large event sets users need to search, sort or paginate — use a Table or List with Pagination.',
	],
	anatomy: {
		tree: `<div role="list"> <!-- Container with role="list" (one per timeline) -->
  <div data-block="Navigation.TimelineItem">
    <div class="timeline-item" role="listitem"> <!-- is-active when IsActive = True -->
      <div class="timeline-left">
        <!-- Left placeholder -->
      </div>
      <div class="timeline-icon">
        <div class="timeline-icon-line"></div> <!-- connector, hidden on the last item -->
        <div class="timeline-icon-container background-primary"> <!-- Color → background-{value}; :empty → 8px dot -->
          <!-- Icon placeholder -->
        </div>
      </div>
      <div class="timeline-content">
        <!-- Title placeholder -->
        <div class="timeline-content-inner">
          <!-- Content placeholder -->
        </div>
      </div>
      <div class="timeline-right">
        <!-- Right placeholder -->
      </div>
    </div>
  </div>
</div>`,
	},
	properties: [
		{
			title: 'Timeline Item',
			rows: [
				{
					name: 'IsActive',
					type: 'Boolean',
					defaultValue: 'False',
					description:
						'Marks the item as the current event, adding is-active to the item root as a styling hook.',
				},
				{
					name: 'Color',
					type: 'Color',
					defaultValue: 'Primary',
					description:
						'Colour of the icon marker — any Color entity value (Entities.Color.Primary, Success, Red, Neutral5 …), applied as a background-{value} utility class.',
				},
				{
					name: 'ExtendedClass',
					type: 'Text',
					defaultValue: '""',
					description:
						'Extra CSS classes on the item root. Example: myclass or myclass1 myclass2. OutSystems UI utility classes are supported.',
				},
			],
		},
	],
	accessibility: [
		'Set role="list" on the container that wraps the Timeline Items — each item already renders with role="listitem", so screen readers announce the count and position of events.',
		'The marker icon is decorative: put the meaning in the Title placeholder, not in the icon or its colour alone.',
		'Keep the date in the Left or Right placeholder as text (not an icon) so it is read in sequence with the title.',
		'Colour contrast of the marker is set by the background-{value} class; neutral or light colours such as Neutral1 may need a darker icon colour via ExtendedClass.',
	],
	related: [
		{ name: 'Wizard', storyId: 'patterns-navigation-wizard--docs' },
		{ name: 'List Item Content', storyId: 'patterns-content-list-item-content--docs' },
		{ name: 'Icon Badge', storyId: 'patterns-numbers-iconbadge--docs' },
	],
};
