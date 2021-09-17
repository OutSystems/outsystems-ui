/// <reference path="../AbstractPattern.ts" />

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.FloatingActionsItem {
	export class FloatingActionsItem
		extends AbstractPattern<FloatingActionsItemConfig>
		implements IFloatingActionsItem
	{
		//Stores the parent's id.
		private _parentId: string;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		constructor(uniqueId: string, configs: any) {
			super(uniqueId, new FloatingActionsItemConfig(configs));
		}

		public build(): void {
			super.build();
			this.finishBuild();
		}

		public dispose(): void {
			super.dispose();
		}

		public getFloatingActionId(): string {
			return this._parentId;
		}

		public setAnimationDelay(value: string): void {
			Helper.Attribute.Set(this._selfElem, 'style', '--delay: ' + value);
		}

		public setTabindex(value: string): void {
			Helper.Attribute.Set(this._selfElem, Constants.AccessibilityAttribute.TabIndex, value);
		}
	}
}
