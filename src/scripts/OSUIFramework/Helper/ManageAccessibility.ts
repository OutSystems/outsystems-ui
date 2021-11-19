// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Helper {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	abstract class A11Y {
		/**
		 * Method that will enable the aria-expanded
		 *
		 * @param element
		 * @returns
		 */
		public static AriaExpandedFalse(element: HTMLElement): void {
			Helper.Attribute.Set(
				element,
				Constants.A11YAttributes.Aria.Expanded,
				Constants.A11YAttributes.States.False
			);
		}

		/**
		 * Method that will enable the aria-expanded
		 *
		 * @param element
		 * @returns
		 */
		public static AriaExpandedTrue(element: HTMLElement): void {
			Helper.Attribute.Set(element, Constants.A11YAttributes.Aria.Expanded, Constants.A11YAttributes.States.True);
		}

		/**
		 * Method that will enable the aria-hidden
		 *
		 * @param element
		 * @returns
		 */
		public static AriaHiddenFalse(element: HTMLElement): void {
			Helper.Attribute.Set(element, Constants.A11YAttributes.Aria.Hidden, Constants.A11YAttributes.States.False);
		}

		/**
		 * Method that will enable the aria-hidden
		 *
		 * @param element
		 * @returns
		 */
		public static AriaHiddenTrue(element: HTMLElement): void {
			Helper.Attribute.Set(element, Constants.A11YAttributes.Aria.Hidden, Constants.A11YAttributes.States.True);
		}

		/**
		 * Method that will set the alert role
		 *
		 * @param element
		 * @returns
		 */
		public static RoleAlert(element: HTMLElement): void {
			Helper.Attribute.Set(element, Constants.A11YAttributes.Role.AttrName, Constants.A11YAttributes.Role.Alert);
		}

		/**
		 * Method that will set the button role
		 *
		 * @param element
		 * @returns
		 */
		public static RoleButton(element: HTMLElement): void {
			Helper.Attribute.Set(element, Constants.A11YAttributes.Role.AttrName, Constants.A11YAttributes.Role.Button);
		}

		/**
		 * Method that will set the button role
		 *
		 * @param element
		 * @returns
		 */
		public static RoleMenuItem(element: HTMLElement): void {
			Helper.Attribute.Set(
				element,
				Constants.A11YAttributes.Role.AttrName,
				Constants.A11YAttributes.Role.MenuItem
			);
		}

		/**
		 * Method that will set the progressbar role
		 *
		 * @param element
		 * @returns
		 */
		public static RoleProgressBar(element: HTMLElement): void {
			Helper.Attribute.Set(
				element,
				Constants.A11YAttributes.Role.AttrName,
				Constants.A11YAttributes.Role.Progressbar
			);
		}

		/**
		 * Method that will set the search role
		 *
		 * @param element
		 * @returns
		 */
		public static RoleSearch(element: HTMLElement): void {
			Helper.Attribute.Set(element, Constants.A11YAttributes.Role.AttrName, Constants.A11YAttributes.Role.Search);
		}

		/**
		 * Method that will set the tooltip role
		 *
		 * @param element
		 * @returns
		 */
		public static RoleTooltip(element: HTMLElement): void {
			Helper.Attribute.Set(
				element,
				Constants.A11YAttributes.Role.AttrName,
				Constants.A11YAttributes.Role.Tooltip
			);
		}

		/**
		 * Method that will enable the tabindex
		 *
		 * @param element
		 * @returns
		 */
		public static TabIndexFalse(element: HTMLElement): void {
			Helper.Attribute.Set(
				element,
				Constants.A11YAttributes.TabIndex,
				Constants.A11YAttributes.States.TabIndexShow
			);
		}

		/**
		 * Method that will disable the tabindex
		 *
		 * @param element
		 * @returns
		 */
		public static TabIndexTrue(element: HTMLElement): void {
			Helper.Attribute.Set(
				element,
				Constants.A11YAttributes.TabIndex,
				Constants.A11YAttributes.States.TabIndexHidden
			);
		}
	}
}
/*

Helper.Attribute.Set(
				this._notificationContent,
				Constants.A11YAttributes.Role.AttrName,
				Constants.A11YAttributes.Role.Alert
			);
 
*/
