// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Utils.LayoutPrivate {
	/**
	 * Class used to set A11Y attributes to layout elements
	 *
	 * @export
	 * @abstract
	 * @class SetA11Y
	 */
	export abstract class SetA11Y {
		/**
		 * Method used to set the A11Y attributes to the layout elements
		 *
		 * @returns
		 * @memberof OutSystems.OSUI.Utils.LayoutPrivate.SetA11Y
		 */
		private static _setA11Y(): void {
			// Get Main Html Element reference
			const mainContentElem = OSFramework.OSUI.Helper.Dom.ClassSelector(
				document,
				OSFramework.OSUI.GlobalEnum.CssClassElements.MainContent
			);

			if (mainContentElem) {
				const hasMainElemRoleAttr = OSFramework.OSUI.Helper.Dom.Attribute.Has(
					mainContentElem,
					OSFramework.OSUI.Constants.A11YAttributes.Role.AttrName
				);

				// Set Role to Main Html Element
				if (!hasMainElemRoleAttr) {
					OSFramework.OSUI.Helper.Dom.Attribute.Set(
						mainContentElem,
						OSFramework.OSUI.Constants.A11YAttributes.Role.AttrName,
						OSFramework.OSUI.Constants.A11YAttributes.Role.Main
					);
				}
			} else {
				console.warn('Main content element not found, skipping A11Y attributes set');
			}

			// Check if the window resize event has the handler setted already
			const hasResizeEvtHandlerSet =
				OSFramework.OSUI.Event.DOMEvents.Listeners.GlobalListenerManager.Instance.hasHandler(
					OSFramework.OSUI.Event.DOMEvents.Listeners.Type.WindowResize,
					this._setMenuA11Y
				);

			// If the handler is not setted and the layout is not LayoutSide, add the resize event handler in order to update the A11Y attributes when the layout is resized
			if (!hasResizeEvtHandlerSet && !OutSystems.OSUI.Utils.DeviceDetection.CheckIsLayoutSide()) {
				OSFramework.OSUI.Event.DOMEvents.Listeners.GlobalListenerManager.Instance.addHandler(
					OSFramework.OSUI.Event.DOMEvents.Listeners.Type.WindowResize,
					this._setMenuA11Y
				);
			}

			// Set the A11Y attributes to the menu elements
			this._setMenuA11Y();
		}

		/**
		 * Method used to set the A11Y attributes to the menu elements
		 *
		 * @returns
		 * @memberof OutSystems.OSUI.Utils.LayoutPrivate.SetA11Y
		 */
		private static _setMenuA11Y(): void {
			// Get Menu Html Element reference
			const menuElem = OSFramework.OSUI.Helper.Dom.ClassSelector(
				document,
				OSFramework.OSUI.GlobalEnum.CssClassElements.MenuLinks
			);

			// Get the orientation value based on the device type
			const orientationValue =
				OSFramework.OSUI.Helper.DeviceInfo.IsDesktop &&
				!OutSystems.OSUI.Utils.DeviceDetection.CheckIsLayoutSide()
					? OSFramework.OSUI.Constants.A11YAttributes.States.Horizontal
					: OSFramework.OSUI.Constants.A11YAttributes.States.Vertical;

			if (menuElem) {
				if (orientationValue === OSFramework.OSUI.Constants.A11YAttributes.States.Horizontal) {
					OSFramework.OSUI.Helper.A11Y.AriaOrientationHorizontal(menuElem);
				} else {
					OSFramework.OSUI.Helper.A11Y.AriaOrientationVertical(menuElem);
				}
			}
		}

		/**
		 * Function used to add A11Y attributes to layout elements
		 *
		 * @returns
		 * @memberof OutSystems.OSUI.Utils.LayoutPrivate.SetA11Y
		 */
		public static Set(): void {
			this._setA11Y();
		}
	}
}
