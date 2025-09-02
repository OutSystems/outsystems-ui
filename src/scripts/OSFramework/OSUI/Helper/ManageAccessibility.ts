// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Helper {
	export abstract class A11Y {
		/**
		 * Method that will disable the aria-atomic
		 *
		 * @param {HTMLElement} element Target element to receive the value atributte
		 * @returns
		 * @memberof OSFramework.Helper.A11Y
		 */
		public static AriaAtomicFalse(element: HTMLElement): void {
			Dom.Attribute.Set(element, Constants.A11YAttributes.Aria.Atomic, Constants.A11YAttributes.States.False);
		}

		/**
		 * Method that will enable the aria-atomic
		 *
		 * @param {HTMLElement} element Target element to receive the value atributte
		 * @returns
		 * @memberof OSFramework.Helper.A11Y
		 */
		public static AriaAtomicTrue(element: HTMLElement): void {
			Dom.Attribute.Set(element, Constants.A11YAttributes.Aria.Atomic, Constants.A11YAttributes.States.True);
		}

		/**
		 * Method that will disable the aria-busy
		 *
		 * @param {HTMLElement} element Target element to receive the value atributte
		 * @returns
		 * @memberof OSFramework.Helper.A11Y
		 */
		public static AriaBusyFalse(element: HTMLElement): void {
			Dom.Attribute.Set(element, Constants.A11YAttributes.Aria.Busy, Constants.A11YAttributes.States.False);
		}

		/**
		 * Method that will enable the aria-busy
		 *
		 * @param {HTMLElement} element Target element to receive the value atributte
		 * @returns
		 * @memberof OSFramework.Helper.A11Y
		 */
		public static AriaBusyTrue(element: HTMLElement): void {
			Dom.Attribute.Set(element, Constants.A11YAttributes.Aria.Busy, Constants.A11YAttributes.States.True);
		}

		/**
		 * Method that will define the aria-controls
		 *
		 * @param {HTMLElement} element Target element to receive the value atributte
		 * @param {string} targetId Element id that will be related to target element
		 * @returns
		 * @memberof OSFramework.Helper.A11Y
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
		 * @memberof OSFramework.Helper.A11Y
		 */
		public static AriaDescribedBy(element: HTMLElement, targetId: string): void {
			Dom.Attribute.Set(element, Constants.A11YAttributes.Aria.Describedby, targetId);
		}

		/**
		 * Method that will define the aria-disabled
		 *
		 * @static
		 * @param {HTMLElement} element
		 * @param {boolean} isDisabled
		 * @memberof OSFramework.Helper.A11Y
		 */
		public static AriaDisabled(element: HTMLElement, isDisabled: boolean): void {
			Helper.Dom.Attribute.Set(element, Constants.A11YAttributes.Aria.Disabled, isDisabled);
		}

		/**
		 * Method that will set the aria-disabled to false
		 *
		 * @static
		 * @param {HTMLElement} element
		 * @memberof OSFramework.Helper.A11Y
		 */
		public static AriaDisabledFalse(element: HTMLElement): void {
			Helper.Dom.Attribute.Set(element, Constants.A11YAttributes.Aria.Disabled, false);
		}

		/**
		 * Method that will set the aria-disabled to true
		 *
		 * @static
		 * @param {HTMLElement} element
		 * @memberof OSFramework.Helper.A11Y
		 */
		public static AriaDisabledTrue(element: HTMLElement): void {
			Helper.Dom.Attribute.Set(element, Constants.A11YAttributes.Aria.Disabled, true);
		}

		/**
		 * Method that will set the aria-expanded
		 *
		 * @param {HTMLElement} element Target element to receive the value atributte
		 * @returns
		 * @memberof OSFramework.Helper.A11Y
		 */
		public static AriaExpanded(element: HTMLElement, value: string): void {
			Dom.Attribute.Set(element, Constants.A11YAttributes.Aria.Expanded, value);
		}

		/**
		 * Method that will enable the aria-expanded
		 *
		 * @param {HTMLElement} element Target element to receive the value atributte
		 * @returns
		 * @memberof OSFramework.Helper.A11Y
		 */
		public static AriaExpandedFalse(element: HTMLElement): void {
			Dom.Attribute.Set(element, Constants.A11YAttributes.Aria.Expanded, Constants.A11YAttributes.States.False);
		}

		/**
		 * Method that will enable the aria-expanded
		 *
		 * @param {HTMLElement} element Target element to receive the value atributte
		 * @returns
		 * @memberof OSFramework.Helper.A11Y
		 */
		public static AriaExpandedTrue(element: HTMLElement): void {
			Dom.Attribute.Set(element, Constants.A11YAttributes.Aria.Expanded, Constants.A11YAttributes.States.True);
		}

		/**
		 * Method that will toggle the aria-popup
		 *
		 * @param {HTMLElement} element Target element to receive the value atributte
		 * @returns
		 * @memberof OSFramework.Helper.A11Y
		 */
		public static AriaHasPopup(element: HTMLElement, value: string): void {
			Dom.Attribute.Set(element, Constants.A11YAttributes.Aria.Haspopup.prop, value);
		}

		/**
		 * Method that will disable the aria-popup
		 *
		 * @param {HTMLElement} element Target element to receive the value atributte
		 * @returns
		 * @memberof OSFramework.Helper.A11Y
		 */
		public static AriaHasPopupFalse(element: HTMLElement): void {
			Dom.Attribute.Set(
				element,
				Constants.A11YAttributes.Aria.Haspopup.prop,
				Constants.A11YAttributes.Aria.Haspopup.value.False
			);
		}

		/**
		 * Method that will enable the aria-popup
		 *
		 * @param {HTMLElement} element Target element to receive the value atributte
		 * @returns
		 * @memberof OSFramework.Helper.A11Y
		 */
		public static AriaHasPopupTrue(element: HTMLElement): void {
			Dom.Attribute.Set(
				element,
				Constants.A11YAttributes.Aria.Haspopup.prop,
				Constants.A11YAttributes.Aria.Haspopup.value.True
			);
		}

		/**
		 * Method that will set the aria-hidden
		 *
		 * @param {HTMLElement} element Target element to receive the value atributte
		 * @returns
		 * @memberof OSFramework.Helper.A11Y
		 */
		public static AriaHidden(element: HTMLElement, value: string): void {
			Dom.Attribute.Set(element, Constants.A11YAttributes.Aria.Hidden, value);
		}

		/**
		 * Method that will disable the aria-hidden
		 *
		 * @param {HTMLElement} element Target element to receive the value atributte
		 * @returns
		 * @memberof OSFramework.Helper.A11Y
		 */
		public static AriaHiddenFalse(element: HTMLElement): void {
			Dom.Attribute.Set(element, Constants.A11YAttributes.Aria.Hidden, Constants.A11YAttributes.States.False);
			/**
			 * In order to ensure elements inside of the given element are focusable, we must remove the inert attribute
			 * This attribute should also be managed in the same contexts where aria-hidden is also being managed, that's why
			 * it's also being removed here.
			 */
			Dom.Attribute.Remove(element, GlobalEnum.HTMLAttributes.Inert);
		}

		/**
		 * Method that will enable the aria-hidden
		 *
		 * @param {HTMLElement} element Target element to receive the value atributte
		 * @returns
		 * @memberof OSFramework.Helper.A11Y
		 */
		public static AriaHiddenTrue(element: HTMLElement): void {
			Dom.Attribute.Set(element, Constants.A11YAttributes.Aria.Hidden, Constants.A11YAttributes.States.True);

			// Inert attr can't be added to elements that will have focus event...
			if (
				element.classList.contains(GlobalEnum.FocusTrapClasses.FocusTrapTop) === false &&
				element.classList.contains(GlobalEnum.FocusTrapClasses.FocusTrapBottom) === false
			) {
				/**
				 * In order to ensure any other element inside of the given element is not focusable, we set the inert attribute
				 * This attribute should also be managed in the same contexts where aria-hidden is also being managed, that's why
				 * it's also being set here.
				 */
				Dom.Attribute.Set(element, GlobalEnum.HTMLAttributes.Inert, Constants.EmptyString);
			}
		}

		/**
		 * Method that will define the aria-label
		 *
		 * @param {HTMLElement} element Target element to receive the value atributte
		 * @param {string} value Value atributte to be set on target element
		 * @returns
		 * @memberof OSFramework.Helper.A11Y
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
		 * @memberof OSFramework.Helper.A11Y
		 */
		public static AriaLabelledBy(element: HTMLElement, targetId: string): void {
			Dom.Attribute.Set(element, Constants.A11YAttributes.Aria.Labelledby, targetId);
		}

		/**
		 * Method that will set the aria-live assertive
		 *
		 * @param {HTMLElement} element Target element to receive the value atributte
		 * @returns
		 * @memberof OSFramework.Helper.A11Y
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
		 * @memberof OSFramework.Helper.A11Y
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
		 * @memberof OSFramework.Helper.A11Y
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
		 * @memberof OSFramework.Helper.A11Y
		 */
		public static AriaSelectedFalse(element: HTMLElement): void {
			Helper.Dom.Attribute.Set(element, Constants.A11YAttributes.Aria.Selected, false);
		}

		/**
		 * Method that will set the aria-selected to true
		 *
		 * @static
		 * @param {HTMLElement} element Target element to receive the value atributte
		 * @memberof OSFramework.Helper.A11Y
		 */
		public static AriaSelectedTrue(element: HTMLElement): void {
			Helper.Dom.Attribute.Set(element, Constants.A11YAttributes.Aria.Selected, true);
		}

		/**
		 * Method that will set the aria-value max
		 *
		 * @param {HTMLElement} element Target element to receive the value atributte
		 * @param {number} value Value that will be set on aria atributte
		 * @returns
		 * @memberof OSFramework.Helper.A11Y
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
		 * @memberof OSFramework.Helper.A11Y
		 */
		public static AriaValueMin(element: HTMLElement, value: number): void {
			Dom.Attribute.Set(element, Constants.A11YAttributes.Aria.ValueMin, value);
		}

		/**
		 * Method that will set the aria-multiselectable as True
		 *
		 * @param {HTMLElement} element Target element to receive the value atributte
		 * @returns
		 * @memberof OSFramework.Helper.A11Y
		 */
		public static MultiselectableFalse(element: HTMLElement): void {
			Dom.Attribute.Set(
				element,
				Constants.A11YAttributes.Aria.Multiselectable,
				Constants.A11YAttributes.States.False
			);
		}

		/**
		 * Method that will set the aria-multiselectable as False
		 *
		 * @param {HTMLElement} element Target element to receive the value atributte
		 * @returns
		 * @memberof OSFramework.Helper.A11Y
		 */
		public static MultiselectableTrue(element: HTMLElement): void {
			Dom.Attribute.Set(
				element,
				Constants.A11YAttributes.Aria.Multiselectable,
				Constants.A11YAttributes.States.True
			);
		}

		/**
		 * Method that will set the alert role
		 *
		 * @param {HTMLElement} element Target element to receive the role atributte
		 * @returns
		 * @memberof OSFramework.Helper.A11Y
		 */
		public static RoleAlert(element: HTMLElement): void {
			Dom.Attribute.Set(element, Constants.A11YAttributes.Role.AttrName, Constants.A11YAttributes.Role.Alert);
		}

		/**
		 * Method that will set the button role
		 *
		 * @param {HTMLElement} element Target element to receive the role atributte
		 * @returns
		 * @memberof OSFramework.Helper.A11Y
		 */
		public static RoleButton(element: HTMLElement): void {
			Dom.Attribute.Set(element, Constants.A11YAttributes.Role.AttrName, Constants.A11YAttributes.Role.Button);
		}

		/**
		 * Method that will set the Complementary role
		 *
		 * @static
		 * @param {HTMLElement} element
		 * @memberof OSFramework.Helper.A11Y
		 */
		public static RoleComplementary(element: HTMLElement): void {
			Dom.Attribute.Set(
				element,
				Constants.A11YAttributes.Role.AttrName,
				Constants.A11YAttributes.Role.Complementary
			);
		}

		/**
		 * Method that will set the list box role
		 *
		 * @param {HTMLElement} element Target element to receive the role atributte
		 * @returns
		 * @memberof OSFramework.Helper.A11Y
		 */
		public static RoleListbox(element: HTMLElement): void {
			Dom.Attribute.Set(element, Constants.A11YAttributes.Role.AttrName, Constants.A11YAttributes.Role.Listbox);
		}

		/**
		 * * Method that will set the menu role
		 *
		 * @static
		 * @param {HTMLElement} element
		 * @memberof A11Y
		 */
		public static RoleMenu(element: HTMLElement): void {
			Dom.Attribute.Set(element, Constants.A11YAttributes.Role.AttrName, Constants.A11YAttributes.Role.Menu);
		}

		/**
		 * Method that will set the menuitem role
		 *
		 * @param {HTMLElement} element Target element to receive the role atributte
		 * @returns
		 * @memberof OSFramework.Helper.A11Y
		 */
		public static RoleMenuItem(element: HTMLElement): void {
			Dom.Attribute.Set(element, Constants.A11YAttributes.Role.AttrName, Constants.A11YAttributes.Role.MenuItem);
		}

		/**
		 * Method that will set the option role
		 *
		 * @param {HTMLElement} element Target element to receive the role atributte
		 * @returns
		 * @memberof OSFramework.Helper.A11Y
		 */
		public static RoleOption(element: HTMLElement): void {
			Dom.Attribute.Set(element, Constants.A11YAttributes.Role.AttrName, Constants.A11YAttributes.Role.Option);
		}

		/**
		 * Method that will set the presentation role
		 *
		 * @static
		 * @param {HTMLElement} element
		 * @memberof A11Y
		 */
		public static RolePresentation(element: HTMLElement): void {
			Dom.Attribute.Set(
				element,
				Constants.A11YAttributes.Role.AttrName,
				Constants.A11YAttributes.Role.Presentation
			);
		}

		/**
		 * Method that will set the progressbar role
		 *
		 * @param {HTMLElement} element Target element to receive the role atributte
		 * @returns
		 * @memberof OSFramework.Helper.A11Y
		 */
		public static RoleProgressBar(element: HTMLElement): void {
			Dom.Attribute.Set(
				element,
				Constants.A11YAttributes.Role.AttrName,
				Constants.A11YAttributes.Role.Progressbar
			);
		}

		/**
		 * Method that will set the region role
		 *
		 * @param {HTMLElement} element Target element to receive the role atributte
		 * @returns
		 * @memberof OSFramework.Helper.A11Y
		 */
		public static RoleRegion(element: HTMLElement): void {
			Dom.Attribute.Set(element, Constants.A11YAttributes.Role.AttrName, Constants.A11YAttributes.Role.Region);
		}

		/**
		 * Method that will set the search role
		 *
		 * @param {HTMLElement} element Target element to receive the role atributte
		 * @returns
		 * @memberof OSFramework.Helper.A11Y
		 */
		public static RoleSearch(element: HTMLElement): void {
			Dom.Attribute.Set(element, Constants.A11YAttributes.Role.AttrName, Constants.A11YAttributes.Role.Search);
		}

		/**
		 * Method that will set the tab role
		 *
		 * @static
		 * @param {HTMLElement} element Target element to receive the role atributte
		 * @memberof OSFramework.Helper.A11Y
		 */
		public static RoleTab(element: HTMLElement): void {
			Helper.Dom.Attribute.Set(
				element,
				Constants.A11YAttributes.Role.AttrName,
				Constants.A11YAttributes.Role.Tab
			);
		}

		/**
		 * Method that will set the tablist role
		 *
		 * @static
		 * @param {HTMLElement} element Target element to receive the role atributte
		 * @memberof OSFramework.Helper.A11Y
		 */
		public static RoleTabList(element: HTMLElement): void {
			Helper.Dom.Attribute.Set(
				element,
				Constants.A11YAttributes.Role.AttrName,
				Constants.A11YAttributes.Role.TabList
			);
		}

		/**
		 * Method that will set the tabpanel role
		 *
		 * @static
		 * @param {HTMLElement} element Target element to receive the role atributte
		 * @memberof OSFramework.Helper.A11Y
		 */
		public static RoleTabPanel(element: HTMLElement): void {
			Helper.Dom.Attribute.Set(
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
		 * @memberof OSFramework.Helper.A11Y
		 */
		public static RoleTooltip(element: HTMLElement): void {
			Dom.Attribute.Set(element, Constants.A11YAttributes.Role.AttrName, Constants.A11YAttributes.Role.Tooltip);
		}

		/**
		 * Method that will change the tabindex on an array of elements
		 *
		 * @param {boolean} state
		 * @param {HTMLElement[]} elements
		 * @returns
		 * @memberof OSFramework.Helper.A11Y
		 */
		public static SetElementsTabIndex(state: boolean, elements: HTMLElement[]): void {
			const tabIndexValue = state
				? Constants.A11YAttributes.States.TabIndexShow
				: Constants.A11YAttributes.States.TabIndexHidden;

			// On each element, toggle the tabindex value
			for (const item of elements) {
				Helper.A11Y.TabIndex(item, tabIndexValue);
			}
		}

		/**
		 * Method that will set the tabindex
		 *
		 * @param {HTMLElement} element Target element to receive the value atributte
		 * @returns
		 * @memberof OSFramework.Helper.A11Y
		 */
		public static TabIndex(element: HTMLElement, value: string): void {
			Dom.Attribute.Set(element, Constants.A11YAttributes.TabIndex, value);
		}

		/**
		 * Method that will enable the tabindex
		 *
		 * @param {HTMLElement} element Target element to receive the value atributte
		 * @returns
		 * @memberof OSFramework.Helper.A11Y
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
		 * @memberof OSFramework.Helper.A11Y
		 */
		public static TabIndexTrue(element: HTMLElement): void {
			Dom.Attribute.Set(element, Constants.A11YAttributes.TabIndex, Constants.A11YAttributes.States.TabIndexShow);
		}
	}
}
