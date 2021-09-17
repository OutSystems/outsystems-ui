/// <reference path="../AbstractPattern.ts" />

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.FloatingActions {
	export class FloatingActions extends AbstractPattern<FloatingActionsConfig> implements IFloatingActions {
		// Stores the bottom bar HTML element
		private _bottomBar: HTMLElement;
		// Store the close method with bind(this)
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		private _closeMethod: any;
		// Store the click event with bind(this)
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		private _eventToggleClick: any;
		// Store the keyboard event with bind(this)
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		private _eventkeyboard: any;
		// First Floating Action Item
		private _firstButton: HTMLElement;
		// Stores the HTML element of the pattern
		private _floatingActions: HTMLElement;
		// Stores the Floating Action button HTML element
		private _floatingActionsButton: HTMLElement;
		// Stores the HTML wrapper on Items of the pattern
		private _floatingActionsItem: HTMLElement;
		// Stores the Items present in the pattern
		private _floatingActionsItems: Array<HTMLElement>;
		// Stores the items of this specific Floating Action
		private _indexArray = [];
		// Boolean to tell if the pattern is inside the Bottom Bar or not
		private _insideBottomBar: boolean;
		//Booelan to tell if the pattern is in the state 'open'
		private _isOpen: boolean;
		// Last Floating Action Item
		private _lastButton: HTMLElement;
		// Callback function to trigger the click event
		private _onClick: Callbacks.OSGeneric;
		// Store the open method with bind(this)
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		private _openMethod: any;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		constructor(uniqueId: string, configs: any) {
			super(uniqueId, new FloatingActionsConfig(configs));
			this._eventToggleClick = this._toggleClick.bind(this);
			this._eventkeyboard = this._onButtonKeypress.bind(this);
			this._openMethod = this.open.bind(this);
			this._closeMethod = this.close.bind(this);
		}

		// Checks in the Floating Actions Pattern is inside the Bottom Bar and applies a fix for iOS devices
		private _checkIfInsideBottomBar(): void {
			this._bottomBar = document.querySelector(
				Constants.Dot + Enum.CssClasses.ActiveScreen + ' ' + Constants.Dot + Enum.CssClasses.BottomBar
			);

			// Inside Bottom Bar and IOS fix
			if (this._bottomBar && this._floatingActions) {
				this._insideBottomBar = this._bottomBar.contains(this._floatingActions);
				if (this._insideBottomBar) {
					Helper.Style.AddClass(this._floatingActions, Enum.CssClasses.BottomBarExists);
				}
			}

			if (!this._insideBottomBar && this._floatingActions) {
				if (this._bottomBar) {
					this._insideBottomBar = true;
					Helper.Style.AddClass(this._floatingActions, Enum.CssClasses.BottomBarExists);
				}
			}
		}

		// Accessibility - Exception for clicking Esc on items wrapper
		private _handleEscException(e: KeyboardEvent): void {
			if (e.key === GlobalEnum.Keycodes.Escape) {
				if (this.configs.IsHover) {
					this._floatingActionsButton.removeEventListener('focus', this._eventToggleClick);
				}

				this._toggleClick();

				if (this.configs.IsHover) {
					this._floatingActionsButton.addEventListener('focus', this._eventToggleClick);
				}
			}

			this._setFocusTrap(e);
		}

		// Accessibility - Sets keyboard interaction
		private _onButtonKeypress(e: KeyboardEvent): void {
			//If ESC is pressed then close the floatiing action items
			if (
				e.key === GlobalEnum.Keycodes.Escape &&
				Helper.Style.ContainsClass(this._floatingActions, Enum.CssClasses.Open)
			) {
				this._toggleClick();
			}

			//If ENTER or SPACE toggle floating action items
			if (e.key === GlobalEnum.Keycodes.Enter || e.key === GlobalEnum.Keycodes.Space) {
				this._toggleClick();
			}

			this._setFocusTrap(e);
		}

		// Accessibility - sets the aria labels that depend on the opened/closed state
		private _setAccessibility(): void {
			//Toggles accessibility 'aria-hidden' property on Floating Actions Items' container & 'aria-expanded' on Floating Actions Button
			if (this._isOpen) {
				Helper.Attribute.Set(this._floatingActionsItem, Constants.AccessibilityAttribute.Aria.Hidden, 'false');
				Helper.Attribute.Set(
					this._floatingActionsButton,
					Constants.AccessibilityAttribute.Aria.Expanded,
					'true'
				);
			} else {
				Helper.Attribute.Set(this._floatingActionsItem, Constants.AccessibilityAttribute.Aria.Hidden, 'true');
				Helper.Attribute.Set(
					this._floatingActionsButton,
					Constants.AccessibilityAttribute.Aria.Expanded,
					'false'
				);
			}
		}

		/*  Sets classes that depend on the open/closed state
		 * Toggles the open class on Floating Actions & Floating Actions' Overlay */
		private _setClasses() {
			const floatingOverlay: HTMLElement = document.querySelector(
				Constants.Dot + Enum.CssClasses.FloatingOverlay
			);

			if (this._isOpen) {
				Helper.Style.AddClass(this._floatingActions, Enum.CssClasses.Open);
				Helper.Style.AddClass(floatingOverlay, Enum.CssClasses.Open);
			} else {
				Helper.Style.RemoveClass(this._floatingActions, Enum.CssClasses.Open);
				Helper.Style.RemoveClass(floatingOverlay, Enum.CssClasses.Open);
			}
		}

		// Accessibility - Traps the focus on the floating action items when navigating with the keyboard
		private _setFocusTrap(e: KeyboardEvent): void {
			if (this._floatingActionsItems.length > 0) {
				const isShiftKey = e.shiftKey;

				// Focus trap to circle all buttons inside
				if (isShiftKey) {
					if (document.activeElement === this._firstButton) {
						this._lastButton.focus();
						e.preventDefault();
					}
				} else if (document.activeElement === this._lastButton) {
					this._firstButton.focus();
					e.preventDefault();
				}
			}
		}

		// Set the IsExpanded option
		private _setIsExpanded(IsExpanded: boolean): void {
			this._configs.IsExpanded = IsExpanded;

			this._setUpEvents();
		}

		// Set the IsHover option
		private _setIsHover(IsHover: boolean): void {
			this._configs.IsHover = IsHover;

			this._setUpEvents();
		}

		// Accessibility - Set tabindex values
		private _setTabIndex(value: string): void {
			this._floatingActionsItems = [...this._floatingActionsItems];
			this._floatingActionsItems.forEach((item) => {
				Helper.Attribute.Set(item, Constants.AccessibilityAttribute.TabIndex, value);
			});
		}

		// Method to manage the events on Floating Actions
		private _setUpEvents(): void {
			if (this.configs.IsHover) {
				if (this.configs.IsExpanded) {
					this._floatingActions.addEventListener(GlobalEnum.HTMLEvent.MouseLeave, this._eventToggleClick);
				} else {
					this._floatingActionsButton.addEventListener(
						GlobalEnum.HTMLEvent.MouseEnter,
						this._eventToggleClick
					);
				}

				this._floatingActionsButton.removeEventListener(GlobalEnum.HTMLEvent.Focus, this._eventToggleClick);
				this._floatingActionsButton.removeEventListener(GlobalEnum.HTMLEvent.Click, this._eventToggleClick);
			} else {
				this._floatingActionsButton.addEventListener(GlobalEnum.HTMLEvent.Click, this._eventToggleClick);
				this._floatingActionsButton.addEventListener(GlobalEnum.HTMLEvent.keyDown, this._eventkeyboard);
				this._floatingActionsButton.removeEventListener(
					GlobalEnum.HTMLEvent.MouseEnter,
					this._eventToggleClick
				);
				this._floatingActionsButton.removeEventListener(
					GlobalEnum.HTMLEvent.MouseLeave,
					this._eventToggleClick
				);
			}

			// Exception for clicking Esc on items wrapper
			this._floatingActionsItem.addEventListener(
				GlobalEnum.HTMLEvent.keyDown,
				this._handleEscException.bind(this)
			);
		}

		// Sets up the Floating Action elements on first render
		private _setUpFloatingActions(): void {
			this._floatingActions = this._selfElem;

			//this._floatingActions = document.getElementById($parameters.FloatingId);
			this._floatingActionsButton = this._floatingActions.querySelector(
				Constants.Dot + Enum.CssClasses.FloatingActionsButton
			);
			this._floatingActionsItem = this._floatingActions.querySelector(
				Constants.Dot + Enum.CssClasses.FloatingActionsItems
			);
			this._floatingActionsItems = Array.from(
				this._floatingActions.querySelectorAll(Constants.Dot + Enum.CssClasses.FloatingActionItem)
			);
			this._firstButton = this._floatingActionsItems[0];
			this._lastButton = this._floatingActionsItems[this._floatingActionsItems.length - 1];
		}

		// Sets up floating action items on first render
		private _setUpFloatingItems(): void {
			// Check if there are FloatingActionsItems
			if (this._floatingActionsItems.length > 0) {
				// Push every floating-item index into a empty array
				for (let i = 0; i < this._floatingActionsItems.length; i++) {
					this._indexArray.push(i);
				}

				// reverse order of array for css animation
				this._indexArray.reverse();

				// set var --delay on style with each items index, to perform sequential css animation
				for (let i = 0; i < this._floatingActionsItems.length; i++) {
					Helper.Attribute.Set(
						this._floatingActionsItems[i],
						'style',
						'--delay: ' + (this._indexArray[i] + 1)
					);
				}
			}
		}

		// Method to toggle between classes
		private _toggleClick(): void {
			this._isOpen ? this.close() : this.open();
		}

		// Method that triggers the toggle event on the platform
		private _triggerOnClickEvent(): void {
			if (this._onClick !== undefined) {
				setTimeout(() => {
					this._onClick(this.widgetId);
				}, 0);
			}
		}

		public build(): void {
			super.build();

			this._setUpFloatingActions();

			this._setUpFloatingItems();

			this._setClasses();

			this._checkIfInsideBottomBar();

			this._setAccessibility();

			this._setUpEvents();

			this.finishBuild();
		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		public changeProperty(propertyName: string, propertyValue: any): void {
			// Check which property changed and call respective method to update it
			switch (propertyName) {
				case Enum.Properties.IsHover:
					this._setIsHover(propertyValue);

					break;
				case Enum.Properties.IsExpanded:
					this._setIsExpanded(propertyValue);
					break;
				default:
					super.changeProperty(propertyName, propertyValue);
					break;
			}
		}

		public close(): void {
			this._isOpen = false;

			this._floatingActionsButton.focus();
			this._setTabIndex('-1');

			if (this.configs.IsHover) {
				this._floatingActionsButton.removeEventListener(GlobalEnum.HTMLEvent.Focus, this._closeMethod);

				//Handle event listeners
				this._floatingActions.removeEventListener(GlobalEnum.HTMLEvent.MouseLeave, this._closeMethod);
				this._floatingActionsButton.addEventListener(GlobalEnum.HTMLEvent.MouseEnter, this._openMethod);
				this._floatingActionsButton.addEventListener(GlobalEnum.HTMLEvent.Focus, this._openMethod);
			}

			this._setAccessibility();
			this._setClasses();
			this._triggerOnClickEvent();
		}

		public dispose(): void {
			super.dispose();

			if (this.configs.IsHover) {
				this._floatingActionsButton.removeEventListener(
					GlobalEnum.HTMLEvent.MouseLeave,
					this._eventToggleClick
				);
				this._floatingActions.removeEventListener(GlobalEnum.HTMLEvent.MouseLeave, this._eventToggleClick);
			} else {
				this._floatingActionsButton.removeEventListener(GlobalEnum.HTMLEvent.Click, this._eventToggleClick);
			}

			// Removes keyboard events
			this._floatingActionsButton.removeEventListener(GlobalEnum.HTMLEvent.keyDown, this._eventkeyboard);
		}

		public open(): void {
			const firstItem = this._floatingActionsItems[0];
			this._isOpen = true;

			this._setTabIndex('0');

			if (firstItem) {
				firstItem.focus();
			}

			if (this.configs.IsHover) {
				this._floatingActionsButton.removeEventListener(GlobalEnum.HTMLEvent.Focus, this._openMethod);

				//Handle event listeners
				this._floatingActions.addEventListener(GlobalEnum.HTMLEvent.MouseLeave, this._closeMethod);
				this._floatingActionsButton.removeEventListener(GlobalEnum.HTMLEvent.MouseEnter, this._openMethod);
			}

			this._setAccessibility();
			this._setClasses();
			this._triggerOnClickEvent();
		}

		public registerCallback(callback: Callbacks.OSGeneric): void {
			this._onClick = callback;
		}
	}
}
