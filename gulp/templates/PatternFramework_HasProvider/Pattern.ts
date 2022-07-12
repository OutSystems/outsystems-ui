// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Patterns.<%= patternNamePC %> {
	export abstract class Abstract<%= patternNamePC %><P, C extends Abstract<%= patternNamePC %>Config>
		extends AbstractPattern<C>
		implements I<%= patternNamePC %>, Interface.IProviderPattern<P>
	{
		private _provider: P;

		constructor(uniqueId: string, configs: C) {
			super(uniqueId, configs);
		}

		public get provider(): P {
			return this._provider;
		}

		public set provider(p: P) {
			this._provider = p;
		}

		// TODO (by CreateNewPattern): Implement abstract methods that all inherit instances should have

		public abstract registerCallback(eventName: string, callback: Callbacks.OSGeneric): void;
	}
}
