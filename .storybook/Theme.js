import { create } from 'storybook/theming';

const brandBase = {
	fontBase: '"Inter", sans-serif',
	brandTitle: '',
	brandUrl: 'https://github.com/OutSystems/outsystems-ui',
	brandTarget: '_self',
	colorPrimary: '#6986f2',
	appBorderRadius: 4,
};

export const lightTheme = create({
	base: 'light',
	...brandBase,
	// Globals toolbar — dark labels on light chrome
	colorSecondary: '#242424',
	brandImage: './assets/logo_outsystems-ui.svg',
	appBg: '#ffffff',
	appContentBg: '#ffffff',
	appPreviewBg: '#ffffff',
	textColor: '#242424',
	textMutedColor: '#6b6b6b',
	barTextColor: '#242424',
	inputBg: '#ffffff',
	inputBorder: '#e8e8e8',
});

export const darkTheme = create({
	base: 'dark',
	...brandBase,
	// Globals toolbar labels — must stay light on dark chrome (sidebar selected
	// state is overridden in manager-head.html, not via this token).
	colorSecondary: '#c8c8c8',
	brandImage: './assets/logo_outsystems-ui-dark.png',
	appBg: '#141414',
	appContentBg: '#141414',
	appPreviewBg: '#141414',
	appBorderColor: '#333333',
	barBg: '#1c1c1c',
	barTextColor: '#ededed',
	barSelectedColor: '#6986f2',
	barHoverColor: '#2a2a2a',
	textColor: '#ededed',
	textMutedColor: '#9a9a9a',
	textInverseColor: '#141414',
	inputBg: '#242424',
	inputBorder: '#333333',
	inputTextColor: '#ededed',
	buttonBg: '#242424',
	buttonBorder: '#333333',
});

export default lightTheme;
