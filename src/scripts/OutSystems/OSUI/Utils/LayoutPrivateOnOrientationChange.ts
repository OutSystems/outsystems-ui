// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Utils.LayoutPrivate {
	export abstract class OnOrientationChange {
		// Set the css classes according orientation!
		private static _onOrientationChange(): void {
			const body = document.body;

			if (body) {
				setTimeout(() => {
					// If it's an iphoneX, and platform says it's tablet (due to screen resolution), remove the tablet class and add phone one instead
					if (
						OSFramework.OSUI.Helper.Dom.Styles.ContainsClass(
							body,
							OSFramework.OSUI.GlobalEnum.NotchClasses.IPhoneX
						)
					) {
						OSFramework.OSUI.Helper.Dom.Styles.RemoveClass(
							body,
							OSFramework.OSUI.GlobalEnum.DeviceType.tablet
						);
						OSFramework.OSUI.Helper.Dom.Styles.AddClass(body, OSFramework.OSUI.GlobalEnum.DeviceType.phone);
					}

					// Add the desktop class if not phone/tablet
					if (
						OSFramework.OSUI.Helper.Dom.Styles.ContainsClass(
							body,
							OSFramework.OSUI.GlobalEnum.DeviceType.phone
						) === false &&
						OSFramework.OSUI.Helper.Dom.Styles.ContainsClass(
							body,
							OSFramework.OSUI.GlobalEnum.DeviceType.tablet
						) === false
					) {
						OSFramework.OSUI.Helper.Dom.Styles.AddClass(
							body,
							OSFramework.OSUI.GlobalEnum.DeviceType.desktop
						);
					} else if (
						OSFramework.OSUI.Helper.Dom.Styles.ContainsClass(
							body,
							OSFramework.OSUI.GlobalEnum.DeviceType.desktop
						) &&
						OSFramework.OSUI.Helper.Dom.Styles.ContainsClass(
							body,
							OSFramework.OSUI.GlobalEnum.DeviceType.tablet
						)
					) {
						OSFramework.OSUI.Helper.Dom.Styles.RemoveClass(
							body,
							OSFramework.OSUI.GlobalEnum.DeviceType.desktop
						);
					}

					// Update the CSS body variables
					LayoutPrivate.CssBodyVariables.Set();
				}, 500);
			}
		}

		/**
		 * Function used to set the orientation event
		 */
		public static Set(): void {
			OSFramework.OSUI.Event.GlobalEventManager.Instance.addHandler(
				OSFramework.OSUI.Event.Type.OrientationChange,
				this._onOrientationChange
			);
		}

		/**
		 * Function used to unset the orientation event
		 */
		public static Unset(): void {
			OSFramework.OSUI.Event.GlobalEventManager.Instance.removeHandler(
				OSFramework.OSUI.Event.Type.OrientationChange,
				this._onOrientationChange
			);
		}
	}
}
