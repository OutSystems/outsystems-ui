import type { Meta, StoryObj } from '@storybook/html-vite';
import { cls, styleClassesArgType } from '../_helpers/lowcode';
import { renderStatic } from '../_helpers/osui';

/**
 * Form — the OutSystems platform **widget**, transcribed to static markup
 * (see Widgets/Button for why the Widgets group is static; ADR-0009).
 *
 * Captured from @outsystems/runtime-widgets-js@6.25.4 under React 17:
 *   `form[data-form][action=""][novalidate]` wrapping its children.
 *
 * At runtime the widget also aggregates its children's validation state
 * (`useValidationAggregator`) and always prevents native submit, letting the
 * platform run the OnSubmit action instead — behaviour with no DOM footprint, so
 * nothing is lost by transcribing it.
 *
 * Composed here with Label + Input + Button so the story exercises the real
 * combination: a `mandatory` Input emits `required` and `aria-required="true"`,
 * and the Label emits ` mandatory` in its className.
 *
 * CSS contract: src/scss/03-widgets/_form.scss plus _inputs-and-textareas.scss.
 */
type WidgetArgs = { styleClasses: string };

const meta: Meta<WidgetArgs> = {
	title: 'Widgets/Form',
	args: { styleClasses: '' },
	argTypes: { styleClasses: styleClassesArgType },
};
export default meta;
type Story = StoryObj<WidgetArgs>;

export const Default: Story = {
	render: ({ styleClasses }) =>
		renderStatic(`
			<form data-form="" action="" novalidate="" class="${cls(styleClasses)}">
				<div style="max-width:360px;display:flex;flex-direction:column;gap:8px;">
					<label data-label="" class="" for="form-name">Name</label>
					<span class="input-text">
						<input data-input="" class="form-control" required="" type="text" id="form-name"
							placeholder="Enter your name" aria-required="true" maxlength="100" value="">
					</span>
					<div style="margin-top:8px;">
						<button data-button="" class="btn btn-primary" type="button">Submit</button>
					</div>
				</div>
			</form>`),
};
