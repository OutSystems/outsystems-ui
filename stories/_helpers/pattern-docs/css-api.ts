import { CSS_API_MANIFEST } from '../css-api-manifest';

export type CssApiPropertyRow = {
	name: string;
	default: string;
	kind: string;
};

export function cssApiPropertiesForSlug(slug: string): CssApiPropertyRow[] {
	for (const category of CSS_API_MANIFEST.categories) {
		const component = category.components.find((c) => c.slug === slug);
		if (!component) continue;
		return component.variants.flatMap((variant) =>
			variant.properties.map((p) => ({
				name: p.name,
				default: p.default,
				kind: p.kind,
			})),
		);
	}
	return [];
}

export function cssApiLinkForSlug(slug: string): string {
	return `?path=/docs/design-system-css-api-reference--docs#${slug}`;
}
