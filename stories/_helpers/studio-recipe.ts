export type CardVariant = 'basic' | 'sectioned' | 'background' | 'item';

export type StudioPatternKind = 'accordion' | 'alert' | 'blank-slate' | 'card' | 'widget';

export type PlaceholderGroup = { label: string; steps: string[] };

export type StudioRecipeItem = {
	props?: Record<string, string | boolean>;
	title?: string;
	content?: string;
	/** Custom Title-placeholder steps (e.g. multi-widget markup). */
	titleSteps?: string[];
	/** Custom Content-placeholder steps. */
	contentSteps?: string[];
	/** Custom Icon-placeholder steps (Blank Slate). */
	iconSteps?: string[];
	/** Custom Image-placeholder steps (Card Sectioned / Background). */
	imageSteps?: string[];
	/** Custom Actions-placeholder steps (Blank Slate). */
	actionSteps?: string[];
	/** Custom Card Bottom placeholder steps (Card Sectioned). */
	footerSteps?: string[];
	/** Custom Left placeholder steps (Card Item). */
	leftSteps?: string[];
	/** Custom Right placeholder steps (Card Item). */
	rightSteps?: string[];
	/** Secondary line for Card Item center text. */
	subtitle?: string;
	/** Generic placeholder groups (widget kind). */
	placeholders?: PlaceholderGroup[];
};

export type StudioRecipe = {
	kind?: StudioPatternKind;
	cardVariant?: CardVariant;
	widgetName?: string;
	publishStep?: string;
	groupProps?: Record<string, string | boolean>;
	items: StudioRecipeItem[];
};

function formatStudioValue(value: string | boolean): string {
	if (typeof value === 'boolean') {
		return value ? 'True' : 'False';
	}
	return value;
}

function escapeText(value: string): string {
	return value.replace(/"/g, '\\"').replace(/\s+/g, ' ').trim();
}

function stripHtml(value: string): string {
	return value.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
}

const INDENT = '   ';
const SUB = '   ';

function pushPropertyLines(lines: string[], props: Record<string, string | boolean>, indent: string): void {
	for (const [key, value] of Object.entries(props)) {
		lines.push(`${indent}Set ${key} to ${formatStudioValue(value)}`);
	}
}

/** ODC Studio steps + properties for Storybook “Show code” panels. */
export function formatStudioShowCode(recipe: StudioRecipe): string {
	const lines: string[] = [];

	lines.push('1. In ODC Studio, open the Toolbox and search for Accordion.');
	lines.push('2. Drag the Accordion widget into the Main Content area of your screen.');
	lines.push('3. By default, three Accordion Item widgets are included — add or remove items as needed.');
	lines.push('4. Select the Accordion widget. On the Properties tab:');

	if (recipe.groupProps && Object.keys(recipe.groupProps).length > 0) {
		pushPropertyLines(lines, recipe.groupProps, INDENT);
	} else {
		lines.push(`${INDENT}Keep the default property values for this example.`);
	}

	lines.push('5. For each Accordion Item, configure the Properties tab and placeholders:');
	lines.push('');

	recipe.items.forEach((item, index) => {
		lines.push(`Accordion Item ${index + 1}`);

		if (item.props && Object.keys(item.props).length > 0) {
			lines.push(`${INDENT}On the Properties tab:`);
			pushPropertyLines(lines, item.props, INDENT + SUB);
		}

		if (item.titleSteps?.length) {
			lines.push(`${INDENT}Title placeholder:`);
			for (const step of item.titleSteps) {
				lines.push(`${INDENT}${SUB}${step}`);
			}
		} else if (item.title) {
			lines.push(`${INDENT}Title placeholder:`);
			lines.push(`${INDENT}${SUB}Drag a Text widget into the Title placeholder.`);
			lines.push(`${INDENT}${SUB}Set Text to "${escapeText(item.title)}".`);
		}

		if (item.contentSteps?.length) {
			lines.push(`${INDENT}Content placeholder:`);
			for (const step of item.contentSteps) {
				lines.push(`${INDENT}${SUB}${step}`);
			}
		} else if (item.content) {
			lines.push(`${INDENT}Content placeholder:`);
			lines.push(`${INDENT}${SUB}Drag a Text widget into the Content placeholder.`);
			lines.push(`${INDENT}${SUB}Set Text to "${escapeText(stripHtml(item.content))}".`);
		}

		lines.push('');
	});

	lines.push('6. Publish the app and test expand/collapse behaviour in the browser.');

	return lines.join('\n').trimEnd();
}

export function studioShowCodeSource(recipe: StudioRecipe): { code: string; language: string } {
	return {
		code: formatStudioShowCode(recipe),
		language: 'plaintext',
	};
}

/** @deprecated Use studioShowCodeSource */
export const studioRecipeSource = studioShowCodeSource;
