// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Helper {
	export abstract class A11Y {
		/**
		 * Method that will disable the aria-atomic
		 *
		 * @param element Target element to receive the value atributte
		 */
		public static AriaAtomicFalse(element: HTMLElement): void {
			Dom.Attribute.Set(element, Constants.A11YAttributes.Aria.Atomic, Constants.A11YAttributes.States.False);
		}

		/**
		 * Method that will enable the aria-atomic
		 *
		 * @param element Target element to receive the value atributte
		 */
		public static AriaAtomicTrue(element: HTMLElement): void {
			Dom.Attribute.Set(element, Constants.A11YAttributes.Aria.Atomic, Constants.A11YAttributes.States.True);
		}

		/**
		 * Method that will disable the aria-busy
		 *
		 * @param element Target element to receive the value atributte
		 */
		public static AriaBusyFalse(element: HTMLElement): void {
			Dom.Attribute.Set(element, Constants.A11YAttributes.Aria.Busy, Constants.A11YAttributes.States.False);
		}

		/**
		 * Method that will enable the aria-busy
		 *
		 * @param element Target element to receive the value atributte
		 */
		public static AriaBusyTrue(element: HTMLElement): void {
			Dom.Attribute.Set(element, Constants.A11YAttributes.Aria.Busy, Constants.A11YAttributes.States.True);
		}

		/**
		 * Method that will define the aria-controls
		 *
		 * @param element Target element to receive the value atributte
		 * @param targetId Element id that will be related to target element
		 */
		public static AriaControls(element: HTMLElement, targetId: string): void {
			Dom.Attribute.Set(element, Constants.A11YAttributes.Aria.Controls, targetId);
		}

		/**
		 * Method that will define the aria-current
		 *
		 * @param element Target element to receive the value atributte
		 * @param value Value that will be set on aria atributte
		 */
		public static AriaCurrent(element: HTMLElement, value: GlobalEnum.A11YAriaCurrentValues): void {
			Dom.Attribute.Set(element, Constants.A11YAttributes.Aria.Current.prop, value);
		}

		/**
		 * Method that will define the aria-describedby
		 *
		 * @param element Target element to receive the value atributte
		 * @param targetId Element id that will be related to target element
		 */
		public static AriaDescribedBy(element: HTMLElement, targetId: string): void {
			Dom.Attribute.Set(element, Constants.A11YAttributes.Aria.Describedby, targetId);
		}

		/**
		 * Method that will define the aria-disabled
		 *
		 * @param element Target element
		 * @param isDisabled True to set aria-disabled, false to unset it
		 */
		public static AriaDisabled(element: HTMLElement, isDisabled: boolean): void {
			Helper.Dom.Attribute.Set(element, Constants.A11YAttributes.Aria.Disabled, isDisabled);
		}

		/**
		 * Method that will set the aria-disabled to false
		 *
		 * @param element Target element
		 */
		public static AriaDisabledFalse(element: HTMLElement): void {
			Helper.Dom.Attribute.Set(element, Constants.A11YAttributes.Aria.Disabled, false);
		}

		/**
		 * Method that will set the aria-disabled to true
		 *
		 * @param element Target element
		 */
		public static AriaDisabledTrue(element: HTMLElement): void {
			Helper.Dom.Attribute.Set(element, Constants.A11YAttributes.Aria.Disabled, true);
		}

		/**
		 * Method that will set the aria-expanded
		 *
		 * @param element Target element to receive the value atributte
		 * @param value Value set on the aria attribute
		 */
		public static AriaExpanded(element: HTMLElement, value: string): void {
			Dom.Attribute.Set(element, Constants.A11YAttributes.Aria.Expanded, value);
		}

		/**
		 * Method that will enable the aria-expanded
		 *
		 * @param element Target element to receive the value atributte
		 */
		public static AriaExpandedFalse(element: HTMLElement): void {
			Dom.Attribute.Set(element, Constants.A11YAttributes.Aria.Expanded, Constants.A11YAttributes.States.False);
		}

		/**
		 * Method that will enable the aria-expanded
		 *
		 * @param element Target element to receive the value atributte
		 */
		public static AriaExpandedTrue(element: HTMLElement): void {
			Dom.Attribute.Set(element, Constants.A11YAttributes.Aria.Expanded, Constants.A11YAttributes.States.True);
		}

		/**
		 * Method that will toggle the aria-popup
		 *
		 * @param element Target element to receive the value atributte
		 * @param value Value set on the aria attribute
		 */
		public static AriaHasPopup(element: HTMLElement, value: string): void {
			Dom.Attribute.Set(element, Constants.A11YAttributes.Aria.Haspopup.prop, value);
		}

		/**
		 * Method that will disable the aria-popup
		 *
		 * @param element Target element to receive the value atributte
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
		 * @param element Target element to receive the value atributte
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
		 * @param element Target element to receive the value atributte
		 * @param value Value set on the aria attribute
		 */
		public static AriaHidden(element: HTMLElement, value: string): void {
			Dom.Attribute.Set(element, Constants.A11YAttributes.Aria.Hidden, value);
		}

		/**
		 * Method that will disable the aria-hidden
		 *
		 * @param element Target element to receive the value atributte
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
		 * @param element Target element to receive the value atributte
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
		 * @param element Target element to receive the value atributte
		 * @param value Value atributte to be set on target element
		 */
		public static AriaLabel(element: HTMLElement, value: string): void {
			Dom.Attribute.Set(element, Constants.A11YAttributes.Aria.Label, value);
		}

		/**
		 * Method that will define the aria-labelledby
		 *
		 * @param element Target element to receive the value atributte
		 * @param targetId Element id that will be related to target element
		 */
		public static AriaLabelledBy(element: HTMLElement, targetId: string): void {
			Dom.Attribute.Set(element, Constants.A11YAttributes.Aria.Labelledby, targetId);
		}

		/**
		 * Method that will set the aria-live assertive
		 *
		 * @param element Target element to receive the value atributte
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
		 * @param element Target element to receive the value atributte
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
		 * @param element Target element to receive the value atributte
		 */
		public static AriaLivePolite(element: HTMLElement): void {
			Dom.Attribute.Set(
				element,
				Constants.A11YAttributes.AriaLive.AttrName,
				Constants.A11YAttributes.AriaLive.Polite
			);
		}

		/**
		 * Method that will disable the aria-modal
		 *
		 * @param element Target element to receive the value atributte
		 */
		public static AriaModalFalse(element: HTMLElement): void {
			Dom.Attribute.Set(element, Constants.A11YAttributes.Aria.Modal, Constants.A11YAttributes.States.False);
		}

		/**
		 * Method that will enable the aria-modal
		 *
		 * @param element Target element to receive the value atributte
		 */
		public static AriaModalTrue(element: HTMLElement): void {
			Dom.Attribute.Set(element, Constants.A11YAttributes.Aria.Modal, Constants.A11YAttributes.States.True);
		}

		/**
		 * Method that will set the aria-orientation to horizontal
		 *
		 * @param element Target element to receive the value atributte
		 */
		public static AriaOrientationHorizontal(element: HTMLElement): void {
			Dom.Attribute.Set(
				element,
				Constants.A11YAttributes.Aria.Orientation,
				Constants.A11YAttributes.States.Horizontal
			);
		}

		/**
		 * Method that will set the aria-orientation to vertical
		 *
		 * @param element Target element to receive the value atributte
		 */
		public static AriaOrientationVertical(element: HTMLElement): void {
			Dom.Attribute.Set(
				element,
				Constants.A11YAttributes.Aria.Orientation,
				Constants.A11YAttributes.States.Vertical
			);
		}

		/**
		 * Method that will set the aria-selected to false
		 *
		 * @param element Target element to receive the value atributte
		 */
		public static AriaSelectedFalse(element: HTMLElement): void {
			Helper.Dom.Attribute.Set(element, Constants.A11YAttributes.Aria.Selected, false);
		}

		/**
		 * Method that will set the aria-selected to true
		 *
		 * @param element Target element to receive the value atributte
		 */
		public static AriaSelectedTrue(element: HTMLElement): void {
			Helper.Dom.Attribute.Set(element, Constants.A11YAttributes.Aria.Selected, true);
		}

		/**
		 * Method that will set the aria-value max
		 *
		 * @param element Target element to receive the value atributte
		 * @param value Value that will be set on aria atributte
		 */
		public static AriaValueMax(element: HTMLElement, value: number): void {
			Dom.Attribute.Set(element, Constants.A11YAttributes.Aria.ValueMax, value);
		}

		/**
		 * Method that will set the aria-value min
		 *
		 * @param element Target element to receive the value atributte
		 * @param value Value that will be set on aria atributte
		 */
		public static AriaValueMin(element: HTMLElement, value: number): void {
			Dom.Attribute.Set(element, Constants.A11YAttributes.Aria.ValueMin, value);
		}

		/**
		 * Method that will set the aria-multiselectable as True
		 *
		 * @param element Target element to receive the value atributte
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
		 * @param element Target element to receive the value atributte
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
		 * @param element Target element to receive the role atributte
		 */
		public static RoleAlert(element: HTMLElement): void {
			Dom.Attribute.Set(element, Constants.A11YAttributes.Role.AttrName, Constants.A11YAttributes.Role.Alert);
		}

		/**
		 * Method that will set the button role
		 *
		 * @param element Target element to receive the role atributte
		 */
		public static RoleButton(element: HTMLElement): void {
			Dom.Attribute.Set(element, Constants.A11YAttributes.Role.AttrName, Constants.A11YAttributes.Role.Button);
		}

		/**
		 * Method that will set the Complementary role
		 *
		 * @param element Target element
		 */
		public static RoleComplementary(element: HTMLElement): void {
			Dom.Attribute.Set(
				element,
				Constants.A11YAttributes.Role.AttrName,
				Constants.A11YAttributes.Role.Complementary
			);
		}

		/**
		 * Method that will set the Dialog role
		 *
		 * @param element Target element
		 */
		public static RoleDialog(element: HTMLElement): void {
			Dom.Attribute.Set(element, Constants.A11YAttributes.Role.AttrName, Constants.A11YAttributes.Role.Dialog);
		}

		/**
		 * Method that will set the list role
		 *
		 * @param element Target element to receive the role atributte
		 */
		public static RoleList(element: HTMLElement): void {
			Dom.Attribute.Set(element, Constants.A11YAttributes.Role.AttrName, Constants.A11YAttributes.Role.List);
		}

		/**
		 * Method that will set the list box role
		 *
		 * @param element Target element to receive the role atributte
		 */
		public static RoleListbox(element: HTMLElement): void {
			Dom.Attribute.Set(element, Constants.A11YAttributes.Role.AttrName, Constants.A11YAttributes.Role.Listbox);
		}

		/**
		 * Method that will set the listitem role
		 *
		 * @param element Target element to receive the role atributte
		 */
		public static RoleListitem(element: HTMLElement): void {
			Dom.Attribute.Set(element, Constants.A11YAttributes.Role.AttrName, Constants.A11YAttributes.Role.Listitem);
		}

		/**
		 * * Method that will set the menu role
		 *
		 * @param element Target element
		 */
		public static RoleMenu(element: HTMLElement): void {
			Dom.Attribute.Set(element, Constants.A11YAttributes.Role.AttrName, Constants.A11YAttributes.Role.Menu);
		}

		/**
		 * Method that will set the menuitem role
		 *
		 * @param element Target element to receive the role atributte
		 */
		public static RoleMenuItem(element: HTMLElement): void {
			Dom.Attribute.Set(element, Constants.A11YAttributes.Role.AttrName, Constants.A11YAttributes.Role.MenuItem);
		}

		/**
		 * Method that will set the option role
		 *
		 * @param element Target element to receive the role atributte
		 */
		public static RoleOption(element: HTMLElement): void {
			Dom.Attribute.Set(element, Constants.A11YAttributes.Role.AttrName, Constants.A11YAttributes.Role.Option);
		}

		/**
		 * Method that will set the presentation role
		 *
		 * @param element Target element
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
		 * @param element Target element to receive the role atributte
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
		 * @param element Target element to receive the role atributte
		 */
		public static RoleRegion(element: HTMLElement): void {
			Dom.Attribute.Set(element, Constants.A11YAttributes.Role.AttrName, Constants.A11YAttributes.Role.Region);
		}

		/**
		 * Method that will set the search role
		 *
		 * @param element Target element to receive the role atributte
		 */
		public static RoleSearch(element: HTMLElement): void {
			Dom.Attribute.Set(element, Constants.A11YAttributes.Role.AttrName, Constants.A11YAttributes.Role.Search);
		}

		/**
		 * Method that will set the status role
		 *
		 * @param element Target element to receive the role atributte
		 */
		public static RoleStatus(element: HTMLElement): void {
			Dom.Attribute.Set(element, Constants.A11YAttributes.Role.AttrName, Constants.A11YAttributes.Role.Status);
		}

		/**
		 * Method that will set the tab role
		 *
		 * @param element Target element to receive the role atributte
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
		 * @param element Target element to receive the role atributte
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
		 * @param element Target element to receive the role atributte
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
		 * @param element Target element to receive the role atributte
		 */
		public static RoleTooltip(element: HTMLElement): void {
			Dom.Attribute.Set(element, Constants.A11YAttributes.Role.AttrName, Constants.A11YAttributes.Role.Tooltip);
		}

		/**
		 * Method that will change the tabindex on an array of elements
		 *
		 * @param state True to make the elements focusable, false to remove them from the tab order
		 * @param elements Elements whose tabindex is updated
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
		 * @param element Target element to receive the value atributte
		 * @param value Value set on the aria attribute
		 */
		public static TabIndex(element: HTMLElement, value: string): void {
			Dom.Attribute.Set(element, Constants.A11YAttributes.TabIndex, value);
		}

		/**
		 * Method that will enable the tabindex
		 *
		 * @param element Target element to receive the value atributte
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
		 * @param element Target element to receive the value atributte
		 */
		public static TabIndexTrue(element: HTMLElement): void {
			Dom.Attribute.Set(element, Constants.A11YAttributes.TabIndex, Constants.A11YAttributes.States.TabIndexShow);
		}
	}
}
