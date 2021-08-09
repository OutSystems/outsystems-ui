// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.osuiAPI.Patterns {
	/**
	 * Defines the interface for OutSystemsUI Patterns
	 */
	export abstract class AbstractPattern implements IPattern, IBuilder {
		private _isBuilt: boolean;
		private _uniqueId: string;
		protected _widgetId: string;

		constructor(uniqueId: string) {
			this._uniqueId = uniqueId;

			console.log(`AbstractPattern Constructor - '${uniqueId}'`);
		}

		protected finishBuild(): void {
			this._isBuilt = true;
		}

		public get isBuilt(): boolean {
			return this._isBuilt;
		}

		public get uniqueId(): string {
			return this._uniqueId;
		}

		public get widgetId(): string {
			return this._widgetId;
		}

		public abstract build(): void;
	}
}
