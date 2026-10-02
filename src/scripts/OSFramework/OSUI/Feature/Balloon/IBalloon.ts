// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Feature.Balloon {
	/**
	 * Defines the interface for OutSystemsUI Balloon Pattern
	 */
	export interface IBalloon extends Feature.IFeature, Interface.IOpenable {
		/**
		 * Overload the open method.
		 *
		 * @param [isOpenedByApi]
		 * @param [arrowKeyPressed]
		 */
		open(
			isOpenedByApi?: boolean,
			arrowKeyPressed?: GlobalEnum.Keycodes.ArrowDown | GlobalEnum.Keycodes.ArrowUp
		): void;

		/**
		 * Method to set the Balloon border shape
		 *
		 * @param [shape]
		 */
		setBalloonShape(shape?: GlobalEnum.ShapeTypes): void;

		/**
		 * Method to update the Balloon position
		 *
		 * @param position
		 */
		updatePositionOption(position: GlobalEnum.FloatingPosition): void;
	}
}
