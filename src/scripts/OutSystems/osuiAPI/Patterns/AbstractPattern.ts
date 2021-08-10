// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.osuiAPI.Patterns {
	/**
	 * Defines the Default props and methods for OutSystemsUI Patterns
	 */
	export abstract class AbstractPattern<widgetConfig> implements IPattern {
		private _isBuilt: boolean;
		private _uniqueId: string;
		protected _configs: widgetConfig;
		protected _widgetId: string;

		constructor(uniqueId: string, configs: widgetConfig) {
			this._uniqueId = uniqueId;
			this._configs = configs;

			// console.log(`AbstractPattern Constructor - '${uniqueId}'`);
		}

		protected finishBuild(): void {
			this._isBuilt = true;
		}

		public get isBuilt(): boolean {
			return this._isBuilt;
		}

		public get configs(): widgetConfig {
			return this._configs;
		}

		public get uniqueId(): string {
			return this._uniqueId;
		}

		public get widgetId(): string {
			return this._widgetId;
		}

		public equalsToID(widgetId: string): boolean {
			return widgetId === this._uniqueId || widgetId === this._widgetId;
		}

		public abstract build(): void;
	}
}
