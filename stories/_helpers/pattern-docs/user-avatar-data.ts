import type { PatternDocMeta } from './types';

export const USER_AVATAR_DOC: PatternDocMeta = {
	name: 'User Avatar',
	category: 'Content',
	lede: 'Avatar with photo or initials — sized and shaped for lists, headers, and chat.',
	overview:
		'User Avatar shows an image when Image is set; otherwise it derives initials from Name. Color, Size, Shape, and IsLight follow the same conventions as Tag.',
	stylingSelector: '.avatar',
	odcUrl:
		'https://success.outsystems.com/documentation/outsystems_developer_cloud/building_apps/user_interface/patterns/content/user_avatar/',
	o11Url:
		'https://success.outsystems.com/documentation/11/building_apps/user_interface/patterns/using_mobile_and_reactive_patterns/content/user_avatar/',
	liveStoryId: 'patterns-content-useravatar--initials',
	cssApiSlug: 'patterns-content-user-avatar',
	whenToUse: [
		'Representing a person in a list row or chat message.',
		'Profile headers when a photo may be missing.',
		'Compact identity markers in tables.',
	],
	whenNotToUse: [
		'Decorative icons without a person — use Icon.',
		'Large hero imagery — use Image widget or Card Background.',
	],
	anatomy: {
		tree: `<div class="avatar avatar-medium border-radius-rounded background-primary" role="img" aria-label="user initials, JD">
  <span class="OSFillParent">JD</span>
</div>`,
	},
	properties: [
		{
			title: 'User Avatar',
			rows: [
				{ name: 'Name', type: 'Text', description: 'Used for initials and aria-label when no image is set.' },
				{ name: 'Image', type: 'Text', description: 'Image URL — when set, shows photo instead of initials.' },
				{ name: 'Color', type: 'Color', defaultValue: 'Primary', description: 'Background colour for initials.' },
				{ name: 'Size', type: 'AvatarSize', description: 'small, medium, or default size.' },
				{ name: 'Shape', type: 'AvatarShape', description: 'Border radius variant.' },
				{ name: 'IsLight', type: 'Boolean', defaultValue: 'False', description: 'Light background variant.' },
				{ name: 'ExtendedClass', type: 'Text', description: 'Extra CSS classes on the root.' },
			],
		},
	],
	accessibility: [
		'Use role="img" with aria-label including user initials or name.',
		'Photos need meaningful alt text derived from Name.',
	],
	related: [
		{ name: 'Chat Message', storyId: 'patterns-content-chatmessage--docs' },
		{ name: 'List Item Content', storyId: 'patterns-content-list-item-content--docs' },
		{ name: 'Tag', storyId: 'patterns-content-tag--docs' },
	],
};
