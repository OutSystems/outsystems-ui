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
						OSUIFramework.Helper.Dom.Styles.ContainsClass(
							body,
							OSUIFramework.GlobalEnum.NotchClasses.IPhoneX
						)
					) {
						OSUIFramework.Helper.Dom.Styles.RemoveClass(body, OSUIFramework.GlobalEnum.DeviceType.tablet);
						OSUIFramework.Helper.Dom.Styles.AddClass(body, OSUIFramework.GlobalEnum.DeviceType.phone);
					}

					// Add the desktop class if not phone/tablet
					if (
						OSUIFramework.Helper.Dom.Styles.ContainsClass(
							body,
							OSUIFramework.GlobalEnum.DeviceType.phone
						) === false &&
						OSUIFramework.Helper.Dom.Styles.ContainsClass(
							body,
							OSUIFramework.GlobalEnum.DeviceType.tablet
						) === false
					) {
						OSUIFramework.Helper.Dom.Styles.AddClass(body, OSUIFramework.GlobalEnum.DeviceType.desktop);
					} else if (
						OSUIFramework.Helper.Dom.Styles.ContainsClass(
							body,
							OSUIFramework.GlobalEnum.DeviceType.desktop
						) &&
						OSUIFramework.Helper.Dom.Styles.ContainsClass(body, OSUIFramework.GlobalEnum.DeviceType.tablet)
					) {
						OSUIFramework.Helper.Dom.Styles.RemoveClass(body, OSUIFramework.GlobalEnum.DeviceType.desktop);
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
			OSUIFramework.Event.GlobalEventManager.Instance.addHandler(
				OSUIFramework.Event.Type.OrientationChange,
				this._onOrientationChange
			);
		}

		/**
		 * Function used to unset the orientation event
		 */
		public static UnSet(): void {
			OSUIFramework.Event.GlobalEventManager.Instance.removeHandler(
				OSUIFramework.Event.Type.OrientationChange,
				this._onOrientationChange
			);
		}
	}
}
