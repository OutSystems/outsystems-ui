import type { Meta, StoryObj } from '@storybook/html-vite';
import { RadioGroup, RadioButton } from '@outsystems/runtime-widgets-js';
import { createElement, createVariable, DataTypes, mountTree, widgetBaseProps } from '../_helpers/widget';

const meta: Meta = { title: 'Widgets/RadioGroup' };
export default meta;
type Story = StoryObj;

const radio = (value: string, label: string, selected: boolean) =>
	createElement(RadioButton as never, {
		...widgetBaseProps('radio-button'),
		value,
		// OUI styles the radio via the `.radio-button` CLASS (not a data-attr like
		// checkbox/switch); the widget puts `style` onto the input's className.
		style: 'radio-button',
		isSelected: selected,
		enabled: true,
		groupName: 'radiogroup',
		tabIndex: -1,
		updateValueInParent: () => {},
		getFocusableElementId: () => '',
		key: value,
	}, label);

export const Default: Story = {
	render: () =>
		mountTree(
			createElement(RadioGroup as never, {
				...widgetBaseProps('radio-group'),
				variable: createVariable(DataTypes.DataTypes.Text, 'two'),
				enabled: true,
				mandatory: false,
				style: 'radio-group',
				onChange: () => {},
			}, [radio('one', 'Option one', false), radio('two', 'Option two', true), radio('three', 'Option three', false)])
		),
};
