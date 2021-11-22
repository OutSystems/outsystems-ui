// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Helper {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	abstract class A11Y {
		/**
		 * Method that will disable the aria-atomic
		 *
		 * @param element
		 * @returns
		 */
		public static AriaAtomicFalse(element: HTMLElement): void {
			Helper.Attribute.Set(element, Constants.A11YAttributes.Aria.Atomic, Constants.A11YAttributes.States.False);
		}

		/**
		 * Method that will enable the aria-atomic
		 *
		 * @param element
		 * @returns
		 */
		public static AriaAtomicTrue(element: HTMLElement): void {
			Helper.Attribute.Set(element, Constants.A11YAttributes.Aria.Atomic, Constants.A11YAttributes.States.True);
		}

		/**
		 * Method that will define the aria-controls
		 *
		 * @param element
		 * @returns
		 */
		public static AriaControls(element: HTMLElement, targetId: string): void {
			Helper.Attribute.Set(element, Constants.A11YAttributes.Aria.Controls, targetId);
		}

		/**
		 * Method that will define the aria-describedby
		 *
		 * @param element
		 * @returns
		 */
		public static AriaDescribedBy(element: HTMLElement, targetId: string): void {
			Helper.Attribute.Set(element, Constants.A11YAttributes.Aria.Describedby, targetId);
		}

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
		 * Method that will define the aria-label
		 *
		 * @param element
		 * @returns
		 */
		public static AriaLabel(element: HTMLElement, value: string): void {
			Helper.Attribute.Set(element, Constants.A11YAttributes.Aria.Label, value);
		}

		/**
		 * Method that will define the aria-labelledby
		 *
		 * @param element
		 * @returns
		 */
		public static AriaLabelledBy(element: HTMLElement, targetId: string): void {
			Helper.Attribute.Set(element, Constants.A11YAttributes.Aria.Labelledby, targetId);
		}

		/**
		 * Method that will set the aria-live assertive
		 *
		 * @param element
		 * @returns
		 */
		public static AriaLiveAssertive(element: HTMLElement): void {
			Helper.Attribute.Set(
				element,
				Constants.A11YAttributes.AriaLive.AttrName,
				Constants.A11YAttributes.AriaLive.Assertive
			);
		}

		/**
		 * Method that will set the aria-live off
		 *
		 * @param element
		 * @returns
		 */
		public static AriaLiveOff(element: HTMLElement): void {
			Helper.Attribute.Set(
				element,
				Constants.A11YAttributes.AriaLive.AttrName,
				Constants.A11YAttributes.AriaLive.Off
			);
		}

		/**
		 * Method that will set the aria-live polite
		 *
		 * @param element
		 * @returns
		 */
		public static AriaLivePolite(element: HTMLElement): void {
			Helper.Attribute.Set(
				element,
				Constants.A11YAttributes.AriaLive.AttrName,
				Constants.A11YAttributes.AriaLive.Polite
			);
		}

		/**
		 * Method that will set the aria-value max
		 *
		 * @param element
		 * @returns
		 */
		public static AriaValueMax(element: HTMLElement, value: string): void {
			Helper.Attribute.Set(element, Constants.A11YAttributes.Aria.ValueMax, value);
		}

		/**
		 * Method that will set the aria-value min
		 *
		 * @param element
		 * @returns
		 */
		public static AriaValueMin(element: HTMLElement, value: string): void {
			Helper.Attribute.Set(element, Constants.A11YAttributes.Aria.ValueMin, value);
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
