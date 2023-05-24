// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Feature {
	/**
	 * Defines the interface for OutSystemsUI Features
	 */
	export interface IFeature extends Interface.IBuilder, Interface.IDisposable {
		isBuilt: boolean;
	}
}
