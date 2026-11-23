/**
 * Demo icons that follow the Storybook `iconLibrary` toolbar.
 *
 * The toolbar only remaps OUI `--osui-icon-*` pseudo-elements. Platform Icon
 * widgets hardcode `fa fa-*` or `ph ph-*` and do not swap. For composed demos we
 * emit both glyphs and let `.storybook/demo-icons.scss` show the active library
 * under `html.iconLibrary-phosphor`.
 */
export function demoIcon(faName: string, phName = faName, extraClass = ''): string {
	const extra = extraClass ? ` ${extraClass}` : '';
	return (
		`<i class="fa fa-${faName} osui-demo-icon osui-demo-icon--fa${extra}" aria-hidden="true"></i>` +
		`<i class="ph ph-${phName} osui-demo-icon osui-demo-icon--ph${extra}" aria-hidden="true"></i>`
	);
}
