// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Utils.LayoutPrivate {
	export abstract class OnOrientationChange {
		// Set the css classes according orientation!
		private static _onOrientationChange(): void {
			const body = document.body;

			if (body) {
				setTimeout(() => {
					// If it's an ipphoneX, and platform says it's tablet (due to screen resolution), remove the tablet class and add phone one instead
					if (
						OSFramework.Helper.Dom.Styles.ContainsClass(body, OSFramework.GlobalEnum.NotchClasses.IPhoneX)
					) {
						OSFramework.Helper.Dom.Styles.RemoveClass(body, OSFramework.GlobalEnum.DeviceType.tablet);
						OSFramework.Helper.Dom.Styles.AddClass(body, OSFramework.GlobalEnum.DeviceType.phone);
					}

					// Add the desktop class if not phone/tablet
					if (
						OSFramework.Helper.Dom.Styles.ContainsClass(body, OSFramework.GlobalEnum.DeviceType.phone) ===
							false &&
						OSFramework.Helper.Dom.Styles.ContainsClass(body, OSFramework.GlobalEnum.DeviceType.tablet) ===
							false
					) {
						OSFramework.Helper.Dom.Styles.AddClass(body, OSFramework.GlobalEnum.DeviceType.desktop);
					} else if (
						OSFramework.Helper.Dom.Styles.ContainsClass(body, OSFramework.GlobalEnum.DeviceType.desktop) &&
						OSFramework.Helper.Dom.Styles.ContainsClass(body, OSFramework.GlobalEnum.DeviceType.tablet)
					) {
						OSFramework.Helper.Dom.Styles.RemoveClass(body, OSFramework.GlobalEnum.DeviceType.desktop);
					}

					// Update the CSS body variables!
					LayoutPrivate.CssBodyVariables.Set();
				}, 500);
			}
		}

		/**
		 * Function used to set the orientation event
		 */
		public static Set(): void {
			OSFramework.Event.GlobalEventManager.Instance.addHandler(
				OSFramework.Event.Type.OrientationChange,
				this._onOrientationChange
			);
		}

		/**
		 * Function used to unset the orientation event
		 */
		public static UnSet(): void {
			OSFramework.Event.GlobalEventManager.Instance.removeHandler(
				OSFramework.Event.Type.OrientationChange,
				this._onOrientationChange
			);
		}
	}
}
