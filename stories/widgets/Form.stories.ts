import type { Meta, StoryObj } from '@storybook/html-vite';
import { Form, Input, Label, Button } from '@outsystems/runtime-widgets-js';
import { createElement, createVariable, DataTypes, mountTree, widgetBaseProps } from '../_helpers/widget';

/**
 * Platform Form widget — renders `<form data-form novalidate>` around its
 * children and aggregates their validation state (useValidationAggregator).
 * Submit is always prevented; the platform triggers the OnSubmit action.
 */
const meta: Meta = { title: 'Widgets/Form' };
export default meta;
type Story = StoryObj;

export const Default: Story = {
	render: () =>
		mountTree(
			createElement(
				Form as never,
				{ ...widgetBaseProps('form'), style: '' },
				createElement(
					'div',
					{ style: { maxWidth: '360px', display: 'flex', flexDirection: 'column', gap: '8px' } },
					[
						createElement(
							Label as never,
							{ ...widgetBaseProps('label'), key: 'l', inputWidgetId: '', style: '' },
							'Name'
						),
						createElement(Input as never, {
							...widgetBaseProps('input'),
							key: 'i',
							variable: createVariable(DataTypes.DataTypes.Text, ''),
							inputType: 0,
							prompt: 'Enter your name',
							maxLength: 100,
							mandatory: true,
							enabled: true,
							style: 'form-control',
							onChange: () => {},
						}),
						createElement(
							'div',
							{ key: 'b', style: { marginTop: '8px' } },
							createElement(
								Button as never,
								{ ...widgetBaseProps('button'), style: 'btn btn-primary', onClick: () => {} },
								'Submit'
							)
						),
					]
				)
			)
		),
};
