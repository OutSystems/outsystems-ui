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
		// Store the callback to be used on the OnClick event
		private _onClick: Callbacks.OSGeneric;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		constructor(uniqueId: string, configs: any) {
			super(uniqueId, new FloatingActionsConfig(configs));
		}

		// Add Pattern Events
		private _addEvents(): void {
			/*this._inputElem.addEventListener(GlobalEnum.HTMLEvent.Blur, this._eventOnBlur);
			this._inputElem.addEventListener(GlobalEnum.HTMLEvent.Focus, this._eventOnFocus);
			this._inputElem.addEventListener(GlobalEnum.HTMLEvent.AnimationStart, this._eventOnAnimationStart);*/
			this._floatingActionsButton.removeEventListener(
				GlobalEnum.HTMLEvent.MouseEnter,
				this.toggleClick.bind(this)
			);
			this._floatingActions.addEventListener(GlobalEnum.HTMLEvent.MouseLeave, this.toggleClick.bind(this));
		}
		private _checkIfInsideBottomBar(): void {
			console.log('Bottom bar');
			// Inside Bottom Bar and IOS fix
			if (this._bottomBar && this._floatingActions) {
				this._insideBottomBar = this._bottomBar.contains(this._floatingActions);
			}

			if (!this._insideBottomBar && this._floatingActions) {
				const layout = document.querySelector('.layout');

				if (layout) {
					const nativeLayout = layout.classList.contains('layout-native');

					if (nativeLayout) {
						// new native layouts
						//$actions.MoveElement($parameters.FloatingId, '.active-screen .main');
					} else {
						// Old native layouts
						//$actions.MoveElement($parameters.FloatingId, '.active-screen .screen');
					}
				}

				if (this._bottomBar) {
					this._insideBottomBar = true;
				}
			}
		}

		private _manageFloatingActionsEvent(): void {
			//
		}

		// Set keyboard interaction - Accessibility
		private _onButtonKeypress(e: KeyboardEvent): void {
			//If esc, Close Items
			if (e.key === GlobalEnum.Keycodes.Tab && this._floatingActions.classList.contains('is--open')) {
				this.toggleClick();
			}

			//If enter or space toggle Items
			if (e.key === GlobalEnum.Keycodes.Enter || e.key === GlobalEnum.Keycodes.Space) {
				this.toggleClick();
			}

			this._setFocusTrap(e);
		}

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

		// Accessibility SetTabIndex values
		private _setTabIndex(value: string): void {
			this._floatingActionsItems = [].slice.call(this._floatingActionsItems);
			this._floatingActionsItems.forEach((item) => {
				Helper.Attribute.Set(item, 'tabindex', value);
			});
		}

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
			console.log(this._floatingActionsItems);
		}

		private _setUpFloatingItems(): void {
			console.log('floating items');
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
					this._floatingActionsItems[i].setAttribute('style', '--delay: ' + (this._indexArray[i] + 1));
				}
			}
		}

		// Method to toggle a11y attributes and focus
		private _toggleAttributesAndFocus(): void {
			let firstItem;
			if (this._isOpen) {
				this._setTabIndex('0');
				firstItem = this._floatingActionsItem;

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
		}

		// Method to manage the events on Floating Actions

		public build(): void {
			super.build();
			this._setUpFloatingActions();
			this._setUpFloatingItems();
			this._checkIfInsideBottomBar();
			this._toggleAttributesAndFocus();
			this.finishBuild();
		}

		// Set callbacks for the onSelect click event
		public registerCallback(callback: Callbacks.OSGeneric): void {
			this._onClick = callback;
		}

		public toggleClick(): void {
			this._toggleAttributesAndFocus();
		}
	}
}
