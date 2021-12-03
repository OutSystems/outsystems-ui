// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.FloatingActionsItem {
	export class FloatingActionsItem
		extends AbstractPattern<FloatingActionsItemConfig>
		implements IFloatingActionsItem
	{
		private _floatingParent: Patterns.FloatingActions.IFloatingActions;
		constructor(uniqueId: string, configs: JSON, floatingParent: Patterns.FloatingActions.IFloatingActions) {
			super(uniqueId, new FloatingActionsItemConfig(configs));
			this._floatingParent = floatingParent;
		}

		public build(): void {
			super.build();
			super.finishBuild();
		}

		public dispose(): void {
			super.dispose();
			this._floatingParent?.removeFloatingActionItem(this.uniqueId);
		}

		public setAnimationDelay(value: number): void {
			Helper.Attribute.Set(this._selfElem, 'style', '--delay: ' + value.toString());
		}

		public setTabindex(value: string): void {
			Helper.Attribute.Set(this._selfElem, Constants.A11YAttributes.TabIndex, value);
		}
	}
}
