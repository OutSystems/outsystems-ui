import React from 'react';
import type { CardVariant, StudioRecipe, StudioRecipeItem } from '../studio-recipe';

function formatStudioValue(value: string | boolean | number): string {
	if (typeof value === 'boolean') {
		return value ? 'True' : 'False';
	}
	return String(value);
}

function escapeText(value: string): string {
	return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\s+/g, ' ').trim();
}

function stripHtml(value: string): string {
	return value
		.replace(/<[^>]+>/g, ' ')
		.replace(/&nbsp;/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();
}

function PropertyList({ props }: { props: Record<string, string | boolean | number> }) {
	return (
		<ul className="pd-howto__bullets">
			{Object.entries(props).map(([key, value]) => (
				<li key={key}>
					Set <code>{key}</code> to <code>{formatStudioValue(value)}</code>
				</li>
			))}
		</ul>
	);
}

function PlaceholderSteps({ label, steps }: { label: string; steps: string[] }) {
	return (
		<div className="pd-howto__placeholder">
			<b>{label}</b>
			<ul className="pd-howto__bullets">
				{steps.map((step) => (
					<li key={step}>{step}</li>
				))}
			</ul>
		</div>
	);
}

function AccordionItemBlock({ item, index }: { item: StudioRecipeItem; index: number }) {
	const titleSteps =
		item.titleSteps ??
		(item.title
			? ['Drag a Text widget into the Title placeholder.', `Set Text to "${escapeText(item.title)}".`]
			: undefined);

	const contentSteps =
		item.contentSteps ??
		(item.content
			? [
					'Drag a Text widget into the Content placeholder.',
					`Set Text to "${escapeText(stripHtml(item.content))}".`,
				]
			: undefined);

	return (
		<div className="pd-howto__item">
			<b>Accordion Item {index + 1}</b>
			{item.props && Object.keys(item.props).length > 0 ? (
				<>
					<p className="pd-howto__label">On the Properties tab:</p>
					<PropertyList props={item.props} />
				</>
			) : null}
			{titleSteps ? <PlaceholderSteps label="Title placeholder" steps={titleSteps} /> : null}
			{contentSteps ? <PlaceholderSteps label="Content placeholder" steps={contentSteps} /> : null}
		</div>
	);
}

function AlertItemBlock({ item, index }: { item: StudioRecipeItem; index: number }) {
	const messageSteps =
		item.contentSteps ??
		(item.content
			? [
					'Drag a Text widget into the Message placeholder.',
					`Set Text to "${escapeText(stripHtml(item.content))}".`,
				]
			: undefined);

	return (
		<div className="pd-howto__item">
			<b>Alert {index + 1}</b>
			{item.props && Object.keys(item.props).length > 0 ? (
				<>
					<p className="pd-howto__label">On the Properties tab:</p>
					<PropertyList props={item.props} />
				</>
			) : null}
			{messageSteps ? <PlaceholderSteps label="Message placeholder" steps={messageSteps} /> : null}
		</div>
	);
}

function Step({ n, children }: { n: number; children: React.ReactNode }) {
	return (
		<div className="pd-howto__step">
			<span className="pd-howto__n" aria-hidden="true">
				{n}
			</span>
			<div className="pd-howto__step-body">{children}</div>
		</div>
	);
}

function AccordionHowTo({ recipe }: { recipe: StudioRecipe }) {
	return (
		<details className="pd-howto">
			<summary className="pd-howto__summary">
				How to implement
				<svg
					className="pd-howto__chevron"
					width="14"
					height="14"
					viewBox="0 0 24 24"
					fill="none"
					aria-hidden="true"
				>
					<path
						d="m6 9 6 6 6-6"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			</summary>
			<div className="pd-howto__body">
				<div className="pd-howto__steps">
					<Step n={1}>
						<p className="pd-howto__lead">In ODC Studio, open the Toolbox and search for Accordion.</p>
					</Step>
					<Step n={2}>
						<p className="pd-howto__lead">
							Drag the Accordion widget into the Main Content area of your screen.
						</p>
					</Step>
					<Step n={3}>
						<p className="pd-howto__lead">
							By default, three Accordion Item widgets are included — add or remove items as needed.
						</p>
					</Step>
					<Step n={4}>
						<p className="pd-howto__lead">Select the Accordion widget. On the Properties tab:</p>
						{recipe.groupProps && Object.keys(recipe.groupProps).length > 0 ? (
							<PropertyList props={recipe.groupProps} />
						) : (
							<p className="pd-howto__hint">Keep the default property values for this example.</p>
						)}
					</Step>
					<Step n={5}>
						<p className="pd-howto__lead">
							For each Accordion Item, configure the Properties tab and placeholders:
						</p>
						<div className="pd-howto__items">
							{recipe.items.map((item, index) => (
								<AccordionItemBlock key={index} item={item} index={index} />
							))}
						</div>
					</Step>
					<Step n={6}>
						<p className="pd-howto__lead">
							Publish the app and test expand/collapse behaviour in the browser.
						</p>
					</Step>
				</div>
			</div>
		</details>
	);
}

function AlertHowTo({ recipe }: { recipe: StudioRecipe }) {
	const multiple = recipe.items.length > 1;

	return (
		<details className="pd-howto">
			<summary className="pd-howto__summary">
				How to implement
				<svg
					className="pd-howto__chevron"
					width="14"
					height="14"
					viewBox="0 0 24 24"
					fill="none"
					aria-hidden="true"
				>
					<path
						d="m6 9 6 6 6-6"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			</summary>
			<div className="pd-howto__body">
				<div className="pd-howto__steps">
					<Step n={1}>
						<p className="pd-howto__lead">In ODC Studio, open the Toolbox and search for Alert.</p>
					</Step>
					<Step n={2}>
						<p className="pd-howto__lead">
							{multiple
								? 'Drag one Alert widget per severity into the Main Content area of your screen.'
								: 'Drag the Alert widget into the Main Content area of your screen.'}
						</p>
					</Step>
					{multiple ? (
						<Step n={3}>
							<p className="pd-howto__lead">
								For each Alert, configure the Properties tab and Message placeholder:
							</p>
							<div className="pd-howto__items">
								{recipe.items.map((item, index) => (
									<AlertItemBlock key={index} item={item} index={index} />
								))}
							</div>
						</Step>
					) : (
						<>
							<Step n={3}>
								<p className="pd-howto__lead">Select the Alert widget. On the Properties tab:</p>
								{recipe.groupProps && Object.keys(recipe.groupProps).length > 0 ? (
									<PropertyList props={recipe.groupProps} />
								) : (
									<p className="pd-howto__hint">Keep the default property values for this example.</p>
								)}
							</Step>
							<Step n={4}>
								{recipe.items[0]?.content ? (
									<PlaceholderSteps
										label="Message placeholder"
										steps={[
											'Drag a Text widget into the Message placeholder.',
											`Set Text to "${escapeText(stripHtml(recipe.items[0].content))}".`,
										]}
									/>
								) : null}
							</Step>
						</>
					)}
					<Step n={multiple ? 4 : 5}>
						<p className="pd-howto__lead">Publish the app and verify the alert message in the browser.</p>
					</Step>
				</div>
			</div>
		</details>
	);
}

function BlankSlatePlaceholders({ item }: { item: StudioRecipeItem }) {
	const iconSteps = item.iconSteps ?? [
		'Drag an Icon widget into the Icon placeholder.',
		'Choose an icon that matches the empty state.',
	];
	const descriptionSteps =
		item.contentSteps ??
		(item.content
			? [
					'Drag a Text widget into the Description placeholder.',
					`Set Text to "${escapeText(stripHtml(item.content))}".`,
				]
			: undefined);

	return (
		<>
			<PlaceholderSteps label="Icon placeholder" steps={iconSteps} />
			{descriptionSteps ? <PlaceholderSteps label="Description placeholder" steps={descriptionSteps} /> : null}
			{item.actionSteps?.length ? (
				<PlaceholderSteps label="Actions placeholder" steps={item.actionSteps} />
			) : null}
		</>
	);
}

function BlankSlateHowTo({ recipe }: { recipe: StudioRecipe }) {
	const item = recipe.items[0];

	return (
		<details className="pd-howto">
			<summary className="pd-howto__summary">
				How to implement
				<svg
					className="pd-howto__chevron"
					width="14"
					height="14"
					viewBox="0 0 24 24"
					fill="none"
					aria-hidden="true"
				>
					<path
						d="m6 9 6 6 6-6"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			</summary>
			<div className="pd-howto__body">
				<div className="pd-howto__steps">
					<Step n={1}>
						<p className="pd-howto__lead">In ODC Studio, open the Toolbox and search for Blank Slate.</p>
					</Step>
					<Step n={2}>
						<p className="pd-howto__lead">
							Drag the Blank Slate widget into the Main Content area of your screen.
						</p>
					</Step>
					<Step n={3}>
						<p className="pd-howto__lead">Select the Blank Slate widget. On the Properties tab:</p>
						{recipe.groupProps && Object.keys(recipe.groupProps).length > 0 ? (
							<PropertyList props={recipe.groupProps} />
						) : (
							<p className="pd-howto__hint">Keep the default property values for this example.</p>
						)}
					</Step>
					<Step n={4}>
						<p className="pd-howto__lead">Configure the placeholders:</p>
						{item ? <BlankSlatePlaceholders item={item} /> : null}
					</Step>
					<Step n={5}>
						<p className="pd-howto__lead">Publish the app and verify the empty state in the browser.</p>
					</Step>
				</div>
			</div>
		</details>
	);
}

function CardHowTo({ recipe }: { recipe: StudioRecipe }) {
	const variant = recipe.cardVariant ?? 'basic';
	const item = recipe.items[0];
	const widgetName =
		variant === 'sectioned'
			? 'Card Sectioned'
			: variant === 'background'
				? 'Card Background'
				: variant === 'item'
					? 'Card Item'
					: 'Card';

	return (
		<details className="pd-howto">
			<summary className="pd-howto__summary">
				How to implement
				<svg
					className="pd-howto__chevron"
					width="14"
					height="14"
					viewBox="0 0 24 24"
					fill="none"
					aria-hidden="true"
				>
					<path
						d="m6 9 6 6 6-6"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			</summary>
			<div className="pd-howto__body">
				<div className="pd-howto__steps">
					<Step n={1}>
						<p className="pd-howto__lead">In ODC Studio, open the Toolbox and search for {widgetName}.</p>
					</Step>
					<Step n={2}>
						<p className="pd-howto__lead">
							Drag the {widgetName} widget into the Main Content area of your screen.
						</p>
					</Step>
					<Step n={3}>
						<p className="pd-howto__lead">Select the {widgetName} widget. On the Properties tab:</p>
						{recipe.groupProps && Object.keys(recipe.groupProps).length > 0 ? (
							<PropertyList props={recipe.groupProps} />
						) : (
							<p className="pd-howto__hint">Keep the default property values for this example.</p>
						)}
					</Step>
					<Step n={4}>
						<p className="pd-howto__lead">Configure the placeholders:</p>
						{item ? <CardPlaceholders item={item} variant={variant} /> : null}
					</Step>
					<Step n={5}>
						<p className="pd-howto__lead">Publish the app and verify the card layout in the browser.</p>
					</Step>
				</div>
			</div>
		</details>
	);
}

function CardPlaceholders({ item, variant }: { item: StudioRecipeItem; variant: CardVariant }) {
	if (variant === 'basic') {
		const contentSteps =
			item.contentSteps ??
			(item.content
				? [
						'Drag a Text widget into the Content placeholder.',
						`Set Text to "${escapeText(stripHtml(item.content))}".`,
					]
				: undefined);

		return contentSteps ? <PlaceholderSteps label="Content placeholder" steps={contentSteps} /> : null;
	}

	if (variant === 'sectioned') {
		const imageSteps = item.imageSteps ?? [
			'Drag an Image widget into the Image placeholder.',
			'Set the image to your product or illustration asset.',
		];
		const titleSteps =
			item.titleSteps ??
			(item.title
				? ['Drag a Text widget into the Title placeholder.', `Set Text to "${escapeText(item.title)}".`]
				: undefined);
		const contentSteps =
			item.contentSteps ??
			(item.content
				? [
						'Drag a Text widget into the Content placeholder.',
						`Set Text to "${escapeText(stripHtml(item.content))}".`,
					]
				: undefined);
		const footerSteps = item.footerSteps ?? [
			'Drag a Link widget into the Card Bottom placeholder.',
			'Set Text to Simulate Loan.',
		];

		return (
			<>
				{imageSteps ? <PlaceholderSteps label="Image placeholder" steps={imageSteps} /> : null}
				{titleSteps ? <PlaceholderSteps label="Title placeholder" steps={titleSteps} /> : null}
				{contentSteps ? <PlaceholderSteps label="Content placeholder" steps={contentSteps} /> : null}
				<PlaceholderSteps label="Card Bottom placeholder" steps={footerSteps} />
			</>
		);
	}

	if (variant === 'background') {
		const contentSteps = item.contentSteps ?? [
			'Drag widgets into the Content placeholder.',
			'Add a heading such as "Take control with a plan made for you".',
		];
		const imageSteps = item.imageSteps ?? [
			'Drag an Image widget into the Image placeholder.',
			'Set a background image or illustration.',
		];

		return (
			<>
				<PlaceholderSteps label="Content placeholder" steps={contentSteps} />
				<PlaceholderSteps label="Image placeholder" steps={imageSteps} />
			</>
		);
	}

	const leftSteps = item.leftSteps ?? ['Drag an Avatar widget into the Left placeholder.', 'Set initials to JD.'];
	const titleSteps =
		item.titleSteps ??
		(item.title
			? [
					'Drag a Text widget into the Center placeholder for the title.',
					`Set Text to "${escapeText(item.title)}".`,
				]
			: undefined);
	const subtitleSteps =
		item.contentSteps ??
		(item.subtitle
			? [
					'Drag a Text widget into the Center placeholder for the subtitle.',
					`Set Text to "${escapeText(item.subtitle)}".`,
				]
			: undefined);
	const rightSteps = item.rightSteps ?? ['Drag a Badge widget into the Right placeholder.', 'Set the value to 3.'];

	return (
		<>
			<PlaceholderSteps label="Left placeholder" steps={leftSteps} />
			{titleSteps ? <PlaceholderSteps label="Center placeholder (title)" steps={titleSteps} /> : null}
			{subtitleSteps ? <PlaceholderSteps label="Center placeholder (subtitle)" steps={subtitleSteps} /> : null}
			<PlaceholderSteps label="Right placeholder" steps={rightSteps} />
		</>
	);
}

function WidgetHowTo({ recipe }: { recipe: StudioRecipe }) {
	const widgetName = recipe.widgetName ?? 'Widget';
	const item = recipe.items[0];

	return (
		<details className="pd-howto">
			<summary className="pd-howto__summary">
				How to implement
				<svg
					className="pd-howto__chevron"
					width="14"
					height="14"
					viewBox="0 0 24 24"
					fill="none"
					aria-hidden="true"
				>
					<path
						d="m6 9 6 6 6-6"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			</summary>
			<div className="pd-howto__body">
				<div className="pd-howto__steps">
					<Step n={1}>
						<p className="pd-howto__lead">In ODC Studio, open the Toolbox and search for {widgetName}.</p>
					</Step>
					<Step n={2}>
						<p className="pd-howto__lead">
							Drag the {widgetName} widget into the Main Content area of your screen.
						</p>
					</Step>
					<Step n={3}>
						<p className="pd-howto__lead">Select the {widgetName} widget. On the Properties tab:</p>
						{recipe.groupProps && Object.keys(recipe.groupProps).length > 0 ? (
							<PropertyList props={recipe.groupProps} />
						) : (
							<p className="pd-howto__hint">Keep the default property values for this example.</p>
						)}
					</Step>
					<Step n={4}>
						<p className="pd-howto__lead">Configure the placeholders:</p>
						{item ? <WidgetPlaceholders item={item} /> : null}
					</Step>
					<Step n={5}>
						<p className="pd-howto__lead">
							{recipe.publishStep ?? 'Publish the app and verify the pattern in the browser.'}
						</p>
					</Step>
				</div>
			</div>
		</details>
	);
}

function WidgetPlaceholders({ item }: { item: StudioRecipeItem }) {
	if (item.placeholders?.length) {
		return (
			<>
				{item.placeholders.map((group) => (
					<PlaceholderSteps key={group.label} label={group.label} steps={group.steps} />
				))}
			</>
		);
	}

	const contentSteps =
		item.contentSteps ??
		(item.content
			? [
					'Drag a Text widget into the Content placeholder.',
					`Set Text to "${escapeText(stripHtml(item.content))}".`,
				]
			: undefined);

	return contentSteps ? <PlaceholderSteps label="Content placeholder" steps={contentSteps} /> : null;
}

/** Collapsible ODC Studio steps — one “How to implement” panel per example. */
export function StudioHowTo({ recipe }: { recipe: StudioRecipe }) {
	if (recipe.kind === 'alert') {
		return <AlertHowTo recipe={recipe} />;
	}
	if (recipe.kind === 'blank-slate') {
		return <BlankSlateHowTo recipe={recipe} />;
	}
	if (recipe.kind === 'card') {
		return <CardHowTo recipe={recipe} />;
	}
	if (recipe.kind === 'widget') {
		return <WidgetHowTo recipe={recipe} />;
	}
	return <AccordionHowTo recipe={recipe} />;
}
