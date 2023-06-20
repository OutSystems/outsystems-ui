// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Feature.Balloon {
	/**
	 * Defines the interface for OutSystemsUI Balloon Pattern
	 *
	 * @export
	 * @interface IBalloon
	 * @extends {Feature.IFeature}
	 * @extends {Interface.IOpenable}
	 */
	export interface IBalloon extends Feature.IFeature, Interface.IOpenable {
		/**
		 * Method to set the Balloon border shape
		 *
		 * @param {GlobalEnum.ShapeTypes} [shape]
		 * @memberof IBalloon
		 */
		setBalloonShape(shape?: GlobalEnum.ShapeTypes): void;

		/**
		 * Method to update the Balloon position
		 *
		 * @param {GlobalEnum.FloatingPosition} position
		 * @memberof IBalloon
		 */
		updatePositionOption(position: GlobalEnum.FloatingPosition): void;
	}
}
