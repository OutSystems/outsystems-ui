/// <reference path="../AbstractPattern.ts" />

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.FloatingActions {
	export class FloatingActions extends AbstractPattern<FloatingActionsConfig> implements IFloatingActions {
		// Stores the bottom bar HTML element
		private _bottomBar: HTMLElement;
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

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		constructor(uniqueId: string, configs: any) {
			super(uniqueId, new FloatingActionsConfig(configs));
		}

		// Inside Bottom Bar and IOS fix
		// Checks in the Floating Actions Pattern is inside the Bottom Bar
		private _checkIfInsideBottomBar(): void {
			// Inside Bottom Bar and IOS fix
			if (this._bottomBar && this._floatingActions) {
				this._insideBottomBar = this._bottomBar.contains(this._floatingActions);
				if (this._insideBottomBar) {
					Helper.Style.AddClass(this._floatingActions, Enum.CssClasses.BottomBarExists);
				}
			}

			if (!this._insideBottomBar && this._floatingActions) {
				const layout = document.querySelector('.layout');

				if (layout) {
					const nativeLayout = layout.classList.contains('layout-native');

					if (nativeLayout) {
						// new native layouts
						Helper.MoveElement(this._selfElem, '.active-screen .main');
					} else {
						// Old native layouts
						Helper.MoveElement(this._selfElem, '.active-screen .screen');
					}
				}

				if (this._bottomBar) {
					this._insideBottomBar = true;
					Helper.Style.AddClass(this._floatingActions, Enum.CssClasses.BottomBarExists);
				}
			}
		}

		private _escException(e: KeyboardEvent): void {
			if (e.key === GlobalEnum.Keycodes.Escape) {
				if (this.configs.IsHover) {
					this._floatingActionsButton.removeEventListener('focus', this.toggleClick.bind(this));
				}

				this.toggleClick();

				if (this.configs.IsHover) {
					this._floatingActionsButton.addEventListener('focus', this.toggleClick.bind(this));
				}
			}

			this._setFocusTrap(e);
		}

		// Sets keyboard interaction - Accessibility
		private _onButtonKeypress(e: KeyboardEvent): void {
			//If ESC is pressed then close the floatiing action items
			if (
				e.key === GlobalEnum.Keycodes.Escape &&
				Helper.Style.ContainsClass(this._floatingActions, Enum.CssClasses.Open)
			) {
				this.toggleClick();
			}

			//If ENTER or SPACE toggle floating action items
			if (e.key === GlobalEnum.Keycodes.Enter || e.key === GlobalEnum.Keycodes.Space) {
				this.toggleClick();
			}

			this._setFocusTrap(e);
		}

		// Accessibility - sets the aria labels that depend on the opened/closed state
		private _setAccessibility(): void {
			const floatingOverlay: HTMLElement = document.querySelector(
				Constants.Dot + Enum.CssClasses.FloatingOverlay
			);

			//Toggles the open class on Floating Actions
			this._isOpen
				? Helper.Style.AddClass(this._floatingActions, Enum.CssClasses.Open)
				: Helper.Style.RemoveClass(this._floatingActions, Enum.CssClasses.Open);

			//Toggles the open class on Floating Actions' Overlay
			this._isOpen
				? Helper.Style.AddClass(floatingOverlay, Enum.CssClasses.Open)
				: Helper.Style.RemoveClass(floatingOverlay, Enum.CssClasses.Open);

			//Toggles accessibility property on Floating Actions Items' container
			this._isOpen
				? Helper.Attribute.Set(this._floatingActionsItem, Constants.AccessibilityAttribute.Aria.Hidden, 'false')
				: Helper.Attribute.Set(this._floatingActionsItem, Constants.AccessibilityAttribute.Aria.Hidden, 'true');

			//Toggles accessibility property 'aria-expanded' on Floating Actions Button
			this._isOpen
				? Helper.Attribute.Set(
						this._floatingActionsButton,
						Constants.AccessibilityAttribute.Aria.Expanded,
						'true'
				  )
				: Helper.Attribute.Set(
						this._floatingActionsButton,
						Constants.AccessibilityAttribute.Aria.Expanded,
						'false'
				  );
		}

		// Traps the focus on the floating action items when navigating with the keyboard
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

		// Accessibility - Set tabindex values
		private _setTabIndex(value: string): void {
			this._floatingActionsItems = [].slice.call(this._floatingActionsItems);
			//TODO call FloatingActionItem method
			this._floatingActionsItems.forEach((item) => {
				Helper.Attribute.Set(item, Constants.AccessibilityAttribute.TabIndex, value);
			});
		}

		// Method to manage the events on Floating Actions
		private _setUpEvents(): void {
			if (this.configs.IsHover) {
				if (this.configs.IsExpanded) {
					this._floatingActions.addEventListener(
						GlobalEnum.HTMLEvent.MouseLeave,
						this.toggleClick.bind(this)
					);
				} else {
					this._floatingActionsButton.addEventListener(
						GlobalEnum.HTMLEvent.MouseEnter,
						this.toggleClick.bind(this)
					);
				}

				this._floatingActionsButton.removeEventListener(
					GlobalEnum.HTMLEvent.Focus,
					this.toggleClick.bind(this)
				);
			} else {
				this._floatingActionsButton.addEventListener(GlobalEnum.HTMLEvent.Click, this.toggleClick.bind(this));
				this._floatingActionsButton.addEventListener(
					GlobalEnum.HTMLEvent.keyDown,
					this._onButtonKeypress.bind(this)
				);
			}

			// Exception for clicking Esc on items wrapper
			this._floatingActionsItem.addEventListener(GlobalEnum.HTMLEvent.keyDown, this._escException.bind(this));
		}

		// Sets up the Floating Action elements on first render
		private _setUpFloatingActions(): void {
			this._floatingActions = this._selfElem;
			this._bottomBar = document.querySelector(
				Constants.Dot + Enum.CssClasses.ActiveScreen + ' ' + Constants.Dot + Enum.CssClasses.BottomBar
			);
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
					//TODO FloatingActionItem method
					Helper.Attribute.Set(
						this._floatingActionsItems[i],
						'style',
						'--delay: ' + (this._indexArray[i] + 1)
					);
				}
			}
		}

		// Method that triggers the toggle event
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
			this._checkIfInsideBottomBar();
			this._setAccessibility();
			this._setUpEvents();
			this.finishBuild();
		}

		public dispose(): void {
			if (this.configs.IsHover) {
				this._floatingActionsButton.removeEventListener(GlobalEnum.HTMLEvent.MouseLeave, this.toggleClick);
				this._floatingActions.removeEventListener(GlobalEnum.HTMLEvent.MouseLeave, this.toggleClick);
			} else {
				this._floatingActionsButton.removeEventListener(GlobalEnum.HTMLEvent.Click, this.toggleClick);
			}
		}

		public registerCallback(callback: Callbacks.OSGeneric): void {
			this._onClick = callback;
		}

		public toggleClick(): void {
			let firstItem;

			this._isOpen = !this._isOpen;
			if (this._isOpen) {
				this._setTabIndex('0');
				firstItem = this._floatingActionsItems[0];

				if (firstItem) {
					firstItem.focus();
				}
			} else {
				this._floatingActionsButton.focus();
				this._setTabIndex('-1');
			}

			if (this.configs.IsHover) {
				this._floatingActionsButton.removeEventListener(
					GlobalEnum.HTMLEvent.Focus,
					this.toggleClick.bind(this)
				);

				//Handle event listeners
				if (this._isOpen) {
					this._floatingActionsButton.removeEventListener(
						GlobalEnum.HTMLEvent.MouseEnter,
						this.toggleClick.bind(this)
					);
					this._floatingActions.addEventListener(
						GlobalEnum.HTMLEvent.MouseLeave,
						this.toggleClick.bind(this)
					);
				} else {
					this._floatingActionsButton.addEventListener(
						GlobalEnum.HTMLEvent.MouseEnter,
						this.toggleClick.bind(this)
					);
					this._floatingActions.removeEventListener(
						GlobalEnum.HTMLEvent.MouseLeave,
						this.toggleClick.bind(this)
					);
					this._floatingActionsButton.addEventListener(
						GlobalEnum.HTMLEvent.Focus,
						this.toggleClick.bind(this)
					);
				}
			}
			this._setAccessibility();
			this._triggerOnClickEvent();
		}
	}
}
