// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.FloatingActionsItem {
	export class FloatingActionsItem
		extends AbstractPattern<FloatingActionsItemConfig>
		implements IFloatingActionsItem
	{
		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		constructor(uniqueId: string, configs: any) {
			super(uniqueId, new FloatingActionsItemConfig(configs));
		}

		public build(): void {
			super.build();
			super.finishBuild();
		}

		public dispose(): void {
			super.dispose();
		}

		public setAnimationDelay(value: number): void {
			Helper.Attribute.Set(this._selfElem, 'style', '--delay: ' + value.toString());
		}

		public setTabindex(value: string): void {
			Helper.Attribute.Set(this._selfElem, Constants.AccessibilityAttribute.TabIndex, value);
		}
	}
}
