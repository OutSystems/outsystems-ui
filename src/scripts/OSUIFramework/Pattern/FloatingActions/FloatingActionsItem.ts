/// <reference path="../AbstractPattern.ts" />

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.FloatingActionsItem {
	export class FloatingActionsItem
		extends AbstractPattern<FloatingActionsItemConfig>
		implements IFloatingActionsItem
	{
		public _setTabIndex(FloatingActionsItem: HTMLElement, value: string) {
			Helper.Attribute.Set(FloatingActionsItem, Constants.AccessibilityAttribute.TabIndex, value);
		}
	}
}
