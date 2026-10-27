import React from 'react';
import { ACCORDION_DOC } from './accordion-data';
import { PatternDocPage } from './PatternDocPage';

/** Accordion docs body — pass `preview` / `examples` from MDX (Canvas must live in MDX for Storybook story resolution). */
export function AccordionDocPage({
	preview,
	examples,
}: {
	preview?: React.ReactNode;
	examples?: React.ReactNode;
}) {
	return <PatternDocPage meta={ACCORDION_DOC} preview={preview} examples={examples} />;
}
