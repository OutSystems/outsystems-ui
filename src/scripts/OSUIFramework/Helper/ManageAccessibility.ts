// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Helper {
	export abstract class A11Y {
		/**
		 * Method that will disable the aria-atomic
		 *
		 * @param {HTMLElement} element Target element to receive the value atributte
		 * @returns
		 */
		public static AriaAtomicFalse(element: HTMLElement): void {
			Dom.Attribute.Set(element, Constants.A11YAttributes.Aria.Atomic, Constants.A11YAttributes.States.False);
		}

		/**
		 * Method that will enable the aria-atomic
		 *
		 * @param {HTMLElement} element Target element to receive the value atributte
		 * @returns
		 */
		public static AriaAtomicTrue(element: HTMLElement): void {
			Dom.Attribute.Set(element, Constants.A11YAttributes.Aria.Atomic, Constants.A11YAttributes.States.True);
		}

		/**
		 * Method that will define the aria-controls
		 *
		 * @param {HTMLElement} element Target element to receive the value atributte
		 * @param {string} targetId Element id that will be related to target element
		 * @returns
		 */
		public static AriaControls(element: HTMLElement, targetId: string): void {
			Dom.Attribute.Set(element, Constants.A11YAttributes.Aria.Controls, targetId);
		}

		/**
		 * Method that will define the aria-describedby
		 *
		 * @param {HTMLElement} element Target element to receive the value atributte
		 * @param {string} targetId Element id that will be related to target element
		 * @returns
		 */
		public static AriaDescribedBy(element: HTMLElement, targetId: string): void {
			Dom.Attribute.Set(element, Constants.A11YAttributes.Aria.Describedby, targetId);
		}

		/**
		 * Method that will set the aria-expanded
		 *
		 * @param {HTMLElement} element Target element to receive the value atributte
		 * @returns
		 */
		public static AriaExpanded(element: HTMLElement, value: string): void {
			Dom.Attribute.Set(element, Constants.A11YAttributes.Aria.Expanded, value);
		}

		/**
		 * Method that will enable the aria-expanded
		 *
		 * @param {HTMLElement} element Target element to receive the value atributte
		 * @returns
		 */
		public static AriaExpandedFalse(element: HTMLElement): void {
			Dom.Attribute.Set(element, Constants.A11YAttributes.Aria.Expanded, Constants.A11YAttributes.States.False);
		}

		/**
		 * Method that will enable the aria-expanded
		 *
		 * @param {HTMLElement} element Target element to receive the value atributte
		 * @returns
		 */
		public static AriaExpandedTrue(element: HTMLElement): void {
			Dom.Attribute.Set(element, Constants.A11YAttributes.Aria.Expanded, Constants.A11YAttributes.States.True);
		}

		/**
		 * Method that will set the aria-hidden
		 *
		 * @param {HTMLElement} element Target element to receive the value atributte
		 * @returns
		 */
		public static AriaHidden(element: HTMLElement, value: string): void {
			Dom.Attribute.Set(element, Constants.A11YAttributes.Aria.Hidden, value);
		}

		/**
		 * Method that will disable the aria-popup
		 *
		 * @param {HTMLElement} element Target element to receive the value atributte
		 * @returns
		 */
		public static AriaHasPopupFalse(element: HTMLElement): void {
			Dom.Attribute.Set(element, Constants.A11YAttributes.Aria.Haspopup, Constants.A11YAttributes.States.False);
		}

		/**
		 * Method that will enable the aria-popup
		 *
		 * @param {HTMLElement} element Target element to receive the value atributte
		 * @returns
		 */
		public static AriaHasPopupTrue(element: HTMLElement): void {
			Dom.Attribute.Set(element, Constants.A11YAttributes.Aria.Haspopup, Constants.A11YAttributes.States.True);
		}

		/**
		 * Method that will disable the aria-hidden
		 *
		 * @param {HTMLElement} element Target element to receive the value atributte
		 * @returns
		 */
		public static AriaHiddenFalse(element: HTMLElement): void {
			Dom.Attribute.Set(element, Constants.A11YAttributes.Aria.Hidden, Constants.A11YAttributes.States.False);
		}

		/**
		 * Method that will enable the aria-hidden
		 *
		 * @param {HTMLElement} element Target element to receive the value atributte
		 * @returns
		 */
		public static AriaHiddenTrue(element: HTMLElement): void {
			Dom.Attribute.Set(element, Constants.A11YAttributes.Aria.Hidden, Constants.A11YAttributes.States.True);
		}

		/**
		 * Method that will define the aria-label
		 *
		 * @param {HTMLElement} element Target element to receive the value atributte
		 * @param {string} value Value atributte to be set on target element
		 * @returns
		 */
		public static AriaLabel(element: HTMLElement, value: string): void {
			Dom.Attribute.Set(element, Constants.A11YAttributes.Aria.Label, value);
		}

		/**
		 * Method that will define the aria-labelledby
		 *
		 * @param {HTMLElement} element Target element to receive the value atributte
		 * @param {string} targetId Element id that will be related to target element
		 * @returns
		 */
		public static AriaLabelledBy(element: HTMLElement, targetId: string): void {
			Dom.Attribute.Set(element, Constants.A11YAttributes.Aria.Labelledby, targetId);
		}

		/**
		 * Method that will set the aria-live assertive
		 *
		 * @param {HTMLElement} element Target element to receive the value atributte
		 * @returns
		 */
		public static AriaLiveAssertive(element: HTMLElement): void {
			Dom.Attribute.Set(
				element,
				Constants.A11YAttributes.AriaLive.AttrName,
				Constants.A11YAttributes.AriaLive.Assertive
			);
		}

		/**
		 * Method that will set the aria-live off
		 *
		 * @param {HTMLElement} element Target element to receive the value atributte
		 * @returns
		 */
		public static AriaLiveOff(element: HTMLElement): void {
			Dom.Attribute.Set(
				element,
				Constants.A11YAttributes.AriaLive.AttrName,
				Constants.A11YAttributes.AriaLive.Off
			);
		}

		/**
		 * Method that will set the aria-live polite
		 *
		 * @param {HTMLElement} element Target element to receive the value atributte
		 * @returns
		 */
		public static AriaLivePolite(element: HTMLElement): void {
			Dom.Attribute.Set(
				element,
				Constants.A11YAttributes.AriaLive.AttrName,
				Constants.A11YAttributes.AriaLive.Polite
			);
		}

		/**
		 * Method that will set the aria-selected to false
		 *
		 * @static
		 * @param {HTMLElement} element Target element to receive the value atributte
		 * @memberof A11Y
		 */
		public static AriaSelectedFalse(element: HTMLElement): void {
			Helper.Attribute.Set(element, Constants.A11YAttributes.Aria.Selected, false);
		}

		/**
		 * Method that will set the aria-selected to true
		 *
		 * @static
		 * @param {HTMLElement} element Target element to receive the value atributte
		 * @memberof A11Y
		 */
		public static AriaSelectedTrue(element: HTMLElement): void {
			Helper.Attribute.Set(element, Constants.A11YAttributes.Aria.Selected, true);
		}

		/**
		 * Method that will set the aria-value max
		 *
		 * @param {HTMLElement} element Target element to receive the value atributte
		 * @param {number} value Value that will be set on aria atributte
		 * @returns
		 */
		public static AriaValueMax(element: HTMLElement, value: number): void {
			Dom.Attribute.Set(element, Constants.A11YAttributes.Aria.ValueMax, value);
		}

		/**
		 * Method that will set the aria-value min
		 *
		 * @param {HTMLElement} element Target element to receive the value atributte
		 * @param {number} value Value that will be set on aria atributte
		 * @returns
		 */
		public static AriaValueMin(element: HTMLElement, value: number): void {
			Dom.Attribute.Set(element, Constants.A11YAttributes.Aria.ValueMin, value);
		}

		/**
		 * Method that will set the alert role
		 *
		 * @param {HTMLElement} element Target element to receive the role atributte
		 * @returns
		 */
		public static RoleAlert(element: HTMLElement): void {
			Dom.Attribute.Set(element, Constants.A11YAttributes.Role.AttrName, Constants.A11YAttributes.Role.Alert);
		}

		/**
		 * Method that will set the button role
		 *
		 * @param {HTMLElement} element Target element to receive the role atributte
		 * @returns
		 */
		public static RoleButton(element: HTMLElement): void {
			Dom.Attribute.Set(element, Constants.A11YAttributes.Role.AttrName, Constants.A11YAttributes.Role.Button);
		}

		/**
		 * Method that will set the Complementary role
		 *
		 * @static
		 * @param {HTMLElement} element
		 * @memberof A11Y
		 */
		public static RoleComplementary(element: HTMLElement): void {
			Dom.Attribute.Set(
				element,
				Constants.A11YAttributes.Role.AttrName,
				Constants.A11YAttributes.Role.Complementary
			);
		}

		/**
		 * Method that will set the button role
		 *
		 * @param {HTMLElement} element Target element to receive the role atributte
		 * @returns
		 */
		public static RoleMenuItem(element: HTMLElement): void {
			Dom.Attribute.Set(element, Constants.A11YAttributes.Role.AttrName, Constants.A11YAttributes.Role.MenuItem);
		}

		/**
		 * Method that will set the progressbar role
		 *
		 * @param {HTMLElement} element Target element to receive the role atributte
		 * @returns
		 */
		public static RoleProgressBar(element: HTMLElement): void {
			Dom.Attribute.Set(
				element,
				Constants.A11YAttributes.Role.AttrName,
				Constants.A11YAttributes.Role.Progressbar
			);
		}

		/**
		 * Method that will set the search role
		 *
		 * @param {HTMLElement} element Target element to receive the role atributte
		 * @returns
		 */
		public static RoleSearch(element: HTMLElement): void {
			Dom.Attribute.Set(element, Constants.A11YAttributes.Role.AttrName, Constants.A11YAttributes.Role.Search);
		}

		/**
		 * Method that will set the tab role
		 *
		 * @static
		 * @param {HTMLElement} element Target element to receive the role atributte
		 * @memberof A11Y
		 */
		public static RoleTab(element: HTMLElement): void {
			Helper.Attribute.Set(element, Constants.A11YAttributes.Role.AttrName, Constants.A11YAttributes.Role.Tab);
		}

		/**
		 * Method that will set the tabpanel role
		 *
		 * @static
		 * @param {HTMLElement} element Target element to receive the role atributte
		 * @memberof A11Y
		 */
		public static RoleTabPanel(element: HTMLElement): void {
			Helper.Attribute.Set(
				element,
				Constants.A11YAttributes.Role.AttrName,
				Constants.A11YAttributes.Role.TabPanel
			);
		}

		/**
		 * Method that will set the tooltip role
		 *
		 * @param {HTMLElement} element Target element to receive the role atributte
		 * @returns
		 */
		public static RoleTooltip(element: HTMLElement): void {
			Dom.Attribute.Set(element, Constants.A11YAttributes.Role.AttrName, Constants.A11YAttributes.Role.Tooltip);
		}

		/**
		 * Method that will set the tabindex
		 *
		 * @param {HTMLElement} element Target element to receive the value atributte
		 * @returns
		 */
		public static TabIndex(element: HTMLElement, value: string): void {
			Dom.Attribute.Set(element, Constants.A11YAttributes.TabIndex, value);
		}

		/**
		 * Method that will enable the tabindex
		 *
		 * @param {HTMLElement} element Target element to receive the value atributte
		 * @returns
		 */
		public static TabIndexFalse(element: HTMLElement): void {
			Dom.Attribute.Set(
				element,
				Constants.A11YAttributes.TabIndex,
				Constants.A11YAttributes.States.TabIndexHidden
			);
		}

		/**
		 * Method that will disable the tabindex
		 *
		 * @param {HTMLElement} element Target element to receive the value atributte
		 * @returns
		 */
		public static TabIndexTrue(element: HTMLElement): void {
			Dom.Attribute.Set(element, Constants.A11YAttributes.TabIndex, Constants.A11YAttributes.States.TabIndexShow);
		}
	}
}
