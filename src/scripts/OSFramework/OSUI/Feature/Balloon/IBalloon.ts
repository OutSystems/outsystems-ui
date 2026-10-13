// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Feature.Balloon {
	/**
	 * Defines the interface for OutSystemsUI Balloon Pattern
	 */
	export interface IBalloon extends Feature.IFeature, Interface.IOpenable {
		/**
		 * Overload the open method.
		 *
		 * @param [isOpenedByApi] True when the open was requested through the API, not by user interaction
		 * @param [arrowKeyPressed] Arrow key that opened the balloon; moves the focus to the first (down) or last (up) focusable element
		 */
		open(
			isOpenedByApi?: boolean,
			arrowKeyPressed?: GlobalEnum.Keycodes.ArrowDown | GlobalEnum.Keycodes.ArrowUp
		): void;

		/**
		 * Method to set the Balloon border shape
		 *
		 * @param [shape] Shape applied to the balloon corners
		 */
		setBalloonShape(shape?: GlobalEnum.ShapeTypes): void;

		/**
		 * Method to update the Balloon position
		 *
		 * @param position Position of the balloon relative to its trigger
		 */
		updatePositionOption(position: GlobalEnum.FloatingPosition): void;
	}
}
