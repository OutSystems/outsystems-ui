// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.FloatingActions {
	export class FloatingActions extends AbstractPattern<FloatingActionsConfig> implements IFloatingActions {
		// Stores the bottom bar HTML element
		private _bottomBar: HTMLElement;
		// Store the close method with bind(this)
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		private _closeMethod: any;
		// Stores the Esc exception function handler.
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		private _escException: any;
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
		// Stores (if any) links from Floating Action Items
		private _floatingAllLinks: HTMLAnchorElement[];
		// Stores the items of this specific Floating Action
		private _floatingItems: Map<string, OSUIFramework.Patterns.FloatingActionsItem.IFloatingActionsItem>;
		// Store the stopPropagation method
		// eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/no-explicit-any
		private _iOSStopPropagation: any;
		// Boolean to tell if the pattern is inside the Bottom Bar or not
		private _insideBottomBar: boolean;
		//Boolean to flag if it's an iOS operated device
		// eslint-disable-next-line @typescript-eslint/naming-convention
		private _isIOS: boolean;
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
			this._floatingItems = new Map<string, OSUIFramework.Patterns.FloatingActionsItem.IFloatingActionsItem>();
			this._eventToggleClick = this._toggleClick.bind(this);
			this._eventkeyboard = this._onButtonKeypress.bind(this);
			this._escException = this._handleEscException.bind(this);
			this._openMethod = this.open.bind(this);
			this._closeMethod = this.close.bind(this);
			this._isOpen = configs.IsExpanded;
			this._iOSStopPropagation = (e) => {
				e.stopPropagation();
			};
		}

		// Checks in the Floating Actions Pattern is inside the Bottom Bar and applies a fix for iOS devices
		private _checkIfInsideBottomBar(): void {
			const bottomBar: HTMLElement = this._floatingActions.closest(
				Constants.Dot + Enum.CssClasses.ActiveScreen + ' ' + Constants.Dot + Enum.CssClasses.BottomBar
			);
			this._bottomBar = document.querySelector(
				Constants.Dot + Enum.CssClasses.ActiveScreen + ' ' + Constants.Dot + Enum.CssClasses.BottomBar
			);
			// Inside Bottom Bar and IOS fix
			if (this._bottomBar && this._floatingActions) {
				this._insideBottomBar = bottomBar === undefined;
			}

			// Not inside the bottom bar BUT there is a bottom bar in the screen, they cannot overlap
			if (!this._insideBottomBar && this._floatingActions) {
				if (this._bottomBar) {
					this._insideBottomBar = true;
					Helper.Dom.Styles.AddClass(this._floatingActions, Enum.CssClasses.BottomBarExists);
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
				Helper.Dom.Styles.ContainsClass(this._floatingActions, Enum.CssClasses.Open)
			) {
				this._toggleClick();
			}

			//If ENTER or SPACE toggle floating action items
			if (e.key === GlobalEnum.Keycodes.Enter || e.key === GlobalEnum.Keycodes.Space) {
				this._toggleClick();
			}

			this._setFocusTrap(e);
		}
		// Recalculates the position of the floating Action items in case a new item was added dynamically
		private _refreshFloatingActionItems(): void {
			// eslint-disable-next-line prefer-const
			let floatingItemIds = [];
			this._floatingActionsItems.forEach((item) => {
				if (this._floatingItems.has(item.getAttribute('name'))) floatingItemIds.push(item.getAttribute('name'));
			});

			//Animation starts from the bottom to the top
			floatingItemIds.reverse();

			floatingItemIds.forEach((name, index) => {
				const floatingActionItem = this._floatingItems.get(name);
				if (floatingActionItem) floatingActionItem.setAnimationDelay(index + 1);
			});
		}

		// Accessibility - sets the aria labels that depend on the opened/closed state
		private _setAccessibility(): void {
			//Toggles accessibility 'aria-hidden' property on Floating Actions Items' container & 'aria-expanded' on Floating Actions Button
			if (this._floatingActionsItem)
				Helper.Dom.Attribute.Set(
					this._floatingActionsItem,
					Constants.A11YAttributes.Aria.Hidden,
					(!this._isOpen).toString()
				);
			Helper.Dom.Attribute.Set(
				this._floatingActionsButton,
				Constants.A11YAttributes.Aria.Expanded,
				this._isOpen.toString()
			);

			this._floatingAllLinks = [...this._floatingActions.querySelectorAll(GlobalEnum.HTMLElement.Link)];

			if (this._floatingAllLinks.length > 0) {
				this._floatingAllLinks.forEach((item: HTMLElement) => {
					Helper.Dom.Attribute.Set(
						item,
						Constants.A11YAttributes.TabIndex,
						this._isOpen
							? Constants.A11YAttributes.States.TabIndexShow
							: Constants.A11YAttributes.States.TabIndexHidden
					);
				});
			}
		}

		/*  Sets classes that depend on the open/closed state
		 * Toggles the open class on Floating Actions & Floating Actions' Overlay */
		private _setClasses() {
			const floatingOverlay: HTMLElement = document.querySelector(
				Constants.Dot + Enum.CssClasses.FloatingOverlay
			);

			if (this._isOpen) {
				Helper.Dom.Styles.AddClass(this._floatingActions, Enum.CssClasses.Open);
				Helper.Dom.Styles.AddClass(floatingOverlay, Enum.CssClasses.Open);
			} else {
				Helper.Dom.Styles.RemoveClass(this._floatingActions, Enum.CssClasses.Open);
				Helper.Dom.Styles.RemoveClass(floatingOverlay, Enum.CssClasses.Open);
			}
		}

		// Accessibility - Traps the focus on the floating action items when navigating with the keyboard
		private _setFocusTrap(e: KeyboardEvent): void {
			const isShiftKey = e.shiftKey;
			const isTabKey = e.key === GlobalEnum.Keycodes.Tab;

			// Focus trap to circle all buttons inside
			if (isShiftKey && isTabKey) {
				if (document.activeElement === this._floatingActionsButton) {
					const link = this._lastButton.querySelector('a');
					if (link) {
						link.focus();
					} else {
						this._lastButton.focus();
					}
					e.preventDefault();
				} else if (document.activeElement === this._firstButton) {
					this._floatingActionsButton.focus();
					e.preventDefault();
				}
			} else if (isTabKey) {
				if (document.activeElement === this._floatingActionsButton) {
					this._firstButton.focus();
					e.preventDefault();
				}
			}
		}

		// Set the IsExpanded option
		private _setIsExpanded(IsExpanded: boolean): void {
			this._configs.IsExpanded = IsExpanded;
			this._isOpen = IsExpanded;

			this._setClasses();
			this._setUpEvents();
		}

		// Set the IsHover option
		private _setIsHover(IsHover: boolean): void {
			this._configs.IsHover = IsHover;

			this._setUpEvents();
		}

		// Accessibility - Set tabindex values
		private _setTabIndex(value: string): void {
			this._floatingItems.forEach((item: FloatingActionsItem.IFloatingActionsItem) => {
				item.setTabindex(value);
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

				this._floatingActionsButton.addEventListener(GlobalEnum.HTMLEvent.Focus, this._eventToggleClick);
				this._floatingActionsButton.removeEventListener(GlobalEnum.HTMLEvent.Click, this._eventToggleClick);
			} else {
				// Set variables based on device detection classes
				this._isIOS = !!document.querySelector(Constants.Dot + GlobalEnum.MobileOS.IOS);

				// Set event type based on device
				if (this._isIOS) {
					this._floatingActionsItem.addEventListener(
						GlobalEnum.HTMLEvent.TouchStart,
						this._iOSStopPropagation
					);
				}
				this._floatingActionsButton.addEventListener(GlobalEnum.HTMLEvent.Click, this._eventToggleClick);
				this._floatingActionsButton.addEventListener(GlobalEnum.HTMLEvent.keyDown, this._eventkeyboard);
				this._floatingActionsButton.removeEventListener(GlobalEnum.HTMLEvent.Focus, this._eventToggleClick);
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
			this._floatingActionsItem.addEventListener(GlobalEnum.HTMLEvent.keyDown, this._escException);
		}

		// Sets up the Floating Action Items elements
		private _setUpFloatingActions(): void {
			this._floatingActionsButton = this._floatingActions.querySelector(
				Constants.Dot + Enum.CssClasses.FloatingActionsButton
			);
			this._floatingActionsItem = this._floatingActions.querySelector(
				Constants.Dot + Enum.CssClasses.FloatingActionsItems
			);
			this._floatingActionsItems = <HTMLElement[]>[
				...this._floatingActions.querySelectorAll(Constants.Dot + Enum.CssClasses.FloatingActionItem),
			];
			this._firstButton = this._floatingActionsItems[0];
			this._lastButton = this._floatingActionsItems[this._floatingActionsItems.length - 1];

			if (this._isOpen) {
				this._setTabIndex('0');
			}

			this._refreshFloatingActionItems();
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

		public addFloatingActionItem(
			uniqueId: string,
			floatingActionItem: FloatingActionsItem.IFloatingActionsItem
		): void {
			this._floatingItems.set(uniqueId, floatingActionItem);
			//In case this is being setup by the items before it's the floating actions itself
			if (this.isBuilt) {
				this._setUpFloatingActions();
			}
		}

		public build(): void {
			super.build();
			this._floatingActions = this._selfElem;
			this._setUpFloatingActions();
			this._setClasses();
			this._checkIfInsideBottomBar();
			this._setAccessibility();
			this._setUpEvents();

			super.finishBuild();
		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		public changeProperty(propertyName: string, propertyValue: any): void {
			// Check which property changed and call respective method to update it
			switch (propertyName) {
				case Enum.Properties.IsHover:
					//Casting to boolean
					this._setIsHover(propertyValue.toLowerCase() === 'true');
					break;
				case Enum.Properties.IsExpanded:
					// Casting to boolean
					this._setIsExpanded(propertyValue.toLowerCase() === 'true');
					break;
				default:
					super.changeProperty(propertyName, propertyValue);
					break;
			}
		}

		public close(): void {
			this._isOpen = false;

			this._floatingActionsButton.focus();
			this._setTabIndex(Constants.A11YAttributes.States.TabIndexHidden);

			if (this.configs.IsHover) {
				this._floatingActionsButton.removeEventListener(GlobalEnum.HTMLEvent.Focus, this._eventToggleClick);

				//Handle event listeners
				this._floatingActions.removeEventListener(GlobalEnum.HTMLEvent.MouseLeave, this._eventToggleClick);
				this._floatingActionsButton.addEventListener(GlobalEnum.HTMLEvent.MouseEnter, this._eventToggleClick);
				this._floatingActionsButton.addEventListener(GlobalEnum.HTMLEvent.Focus, this._eventToggleClick);
			}

			this._setAccessibility();
			this._setClasses();
			this._triggerOnClickEvent();
		}

		public dispose(): void {
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
			this._floatingActionsItem.removeEventListener(GlobalEnum.HTMLEvent.keyDown, this._escException);

			// Removes events based on device
			if (this._isIOS) {
				this._floatingActionsItem.removeEventListener(
					GlobalEnum.HTMLEvent.TouchStart,
					this._iOSStopPropagation
				);
			}
			super.dispose();
		}

		public open(): void {
			const firstItem = this._firstButton;
			this._isOpen = true;

			this._setTabIndex(Constants.A11YAttributes.States.TabIndexShow);

			if (firstItem) {
				firstItem.focus();
			}

			if (this.configs.IsHover) {
				this._floatingActionsButton.removeEventListener(GlobalEnum.HTMLEvent.Focus, this._eventToggleClick);

				//Handle event listeners
				this._floatingActions.addEventListener(GlobalEnum.HTMLEvent.MouseLeave, this._eventToggleClick);
				this._floatingActionsButton.removeEventListener(
					GlobalEnum.HTMLEvent.MouseEnter,
					this._eventToggleClick
				);
			}

			this._setAccessibility();
			this._setClasses();
			this._triggerOnClickEvent();
		}

		public registerCallback(callback: Callbacks.OSGeneric): void {
			this._onClick = callback;
		}

		public removeFloatingActionItem(floatingActionItemId: string): void {
			this._floatingItems.delete(floatingActionItemId);
			this._refreshFloatingActionItems();
		}
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		public get floatingActionItems(): Map<string, OSUIFramework.Patterns.FloatingActionsItem.IFloatingActionsItem> {
			return this._floatingItems;
		}
	}
}
