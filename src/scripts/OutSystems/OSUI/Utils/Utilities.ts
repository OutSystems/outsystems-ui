// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Utils {
	/**
	 * Add a favicon to your web application by providing the icon's URL. This action should be used in the Layout OnReady event or on an OnApplicationStart event.
	 * @param URL
	 */
	export function AddFavicon(URL: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Utilities.FailAddFavicon,
			callback: () => {
				const link = (OSFramework.OSUI.Helper.Dom.TagSelector(document.head, "link[rel*='icon']") ||
					document.createElement('link')) as HTMLLinkElement;
				link.type = 'image/x-icon';
				link.rel = 'shortcut icon';
				link.href = URL;
				document.getElementsByTagName('head')[0].appendChild(link);
			},
		});

		return result;
	}

	/**
	 * Function that exposes if RTL is applied.
	 * @returns
	 */
	// eslint-disable-next-line @typescript-eslint/naming-convention
	export function GetIsRTL(): boolean {
		return OSFramework.OSUI.Helper.Dom.Styles.ContainsClass(document.body, OSFramework.OSUI.Constants.IsRTLClass);
	}

	/**
	 * Action to hint users that the list item has swipe actions available to use, either on the left or right side.
	 * In case of both left and right actions, the default animation is on the left.
	 * This animation will be active when there are left and/or right actions available, based on the animation time parameter.
	 * @param ListId
	 * @param HasLeftAction
	 * @param HasRightAction
	 * @param AnimationTime
	 */
	export function ListItemAnimate(
		ListId: string,
		HasLeftAction: boolean,
		HasRightAction: boolean,
		AnimationTime: number
	): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Utilities.FailListItemAnimate,
			callback: () => {
				let timeoutVar;
				const timeAnimation = AnimationTime / 6;

				const waitListRender = function () {
					const listEl = OSFramework.OSUI.Helper.Dom.GetElementById(ListId);

					if (OSFramework.OSUI.Helper.Dom.Styles.ContainsClass(listEl, 'list-loading') === false) {
						listAnimateItems();
						clearTimeout(timeoutVar);
					} else {
						timeoutVar = setTimeout(waitListRender, 50);
					}
				};

				const listAnimateItems = function () {
					setTimeout(function () {
						const listElement = OSFramework.OSUI.Helper.Dom.GetElementById(ListId)
							.childNodes[1] as HTMLElement;
						const listItemContentLeft = OSFramework.OSUI.Helper.Dom.TagSelector(
							listElement,
							'.active-screen .list-item-left-actions'
						);
						const listItemContentRight = OSFramework.OSUI.Helper.Dom.TagSelector(
							listElement,
							'.active-screen .list-item-right-actions'
						);

						listElement.style.pointerEvents = 'none';

						if (HasLeftAction) {
							OSFramework.OSUI.Helper.Dom.Styles.AddClass(listItemContentLeft, 'has-content-animation');
							OSFramework.OSUI.Helper.Dom.Attribute.Set(
								listItemContentLeft,
								'style',
								'width:75px; transition: all ' + timeAnimation + 'ms !important;'
							);

							setTimeout(function () {
								listItemContentLeft.style.width = '';
								listItemContentLeft.addEventListener(
									'transitionend',
									function () {
										OSFramework.OSUI.Helper.Dom.Styles.RemoveClass(
											listItemContentLeft,
											'has-content-animation'
										);
										OSFramework.OSUI.Helper.Dom.Attribute.Remove(listItemContentLeft, 'style');
										listElement.style.pointerEvents = '';
									},
									false
								);
							}, timeAnimation * 3);
						} else if (HasRightAction) {
							OSFramework.OSUI.Helper.Dom.Styles.AddClass(
								listItemContentRight,
								'has-content-animation-right'
							);
							OSFramework.OSUI.Helper.Dom.Attribute.Set(
								listItemContentRight,
								'style',
								'width:75px; transition: all ' +
									timeAnimation +
									'ms !important; height: ' +
									listElement.offsetHeight +
									'px;'
							);

							setTimeout(function () {
								listItemContentRight.style.width = '';

								listItemContentRight.addEventListener(
									'transitionend',
									function () {
										OSFramework.OSUI.Helper.Dom.Styles.RemoveClass(
											listItemContentRight,
											'has-content-animation-right'
										);
										OSFramework.OSUI.Helper.Dom.Attribute.Remove(listItemContentRight, 'style');
										listElement.style.pointerEvents = '';
									},
									false
								);
							}, timeAnimation * 3);
						}
					}, timeAnimation); // waiting for screen transition ends
				};

				waitListRender();
			},
		});

		return result;
	}

	/**
	 * Action that moves elements on the DOM tree.
	 * Define the WidgetID of the element to be moved and the Target selector that will receive the element.
	 * Example: $actions.MoveElement($parameters.WidgetId, ".active-screen .screen");
	 * @param ElementId
	 * @param TargetSelector
	 * @param TimeoutVal {TimeoutVal=200}
	 */
	export function MoveElement(ElementId: string, TargetSelector: string, TimeoutVal = 200): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Utilities.FailMoveElement,
			callback: () => {
				if (TargetSelector && ElementId) {
					const elementToMove = OSFramework.OSUI.Helper.Dom.GetElementById(ElementId);
					const targetElement = OSFramework.OSUI.Helper.Dom.TagSelector(document.body, TargetSelector);

					if (elementToMove && targetElement) {
						setTimeout(function () {
							OSFramework.OSUI.Helper.Dom.Move(elementToMove, targetElement);
						}, TimeoutVal);
					}
				}
			},
		});

		return result;
	}

	/**
	 * Allows to change the selected state of Cards and List Items.
	 * Set a Widget Id and the Active state to change an element on the screen.
	 * @param ElementId
	 * @param IsActive
	 */
	export function SetActiveElement(ElementId: string, IsActive: boolean): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Utilities.FailSetActiveElement,
			callback: () => {
				const elem = OSFramework.OSUI.Helper.Dom.GetElementById(ElementId);

				if (IsActive) {
					OSFramework.OSUI.Helper.Dom.Styles.AddClass(elem, 'active-element');
				} else {
					OSFramework.OSUI.Helper.Dom.Styles.RemoveClass(elem, 'active-element');
				}
			},
		});

		return result;
	}

	/**
	 * To be used to complement Bulk Actions logic. Drag this action to your checkbox OnChange action.
	 * This will afftect the styles of the checkbox used, and the selected table rows, containing a checked checkbox.
	 * @param TableId
	 * @param RowNumber
	 * @param IsSelected
	 */
	export function SetSelectedTableRow(TableId: string, RowNumber: number, IsSelected: boolean): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Utilities.FailSetSelectedRow,
			callback: () => {
				const tableRow = OSFramework.OSUI.Helper.Dom.TagSelectorAll(document, '#' + TableId + ' .table-row')[
					RowNumber
				] as HTMLElement;
				if (tableRow) {
					if (IsSelected) {
						OSFramework.OSUI.Helper.Dom.Styles.AddClass(tableRow, 'table-row-selected');
					} else {
						OSFramework.OSUI.Helper.Dom.Styles.RemoveClass(tableRow, 'table-row-selected');
					}
				}
			},
		});

		return result;
	}

	/**
	 * Action to be used on the Login screen to enable users to show or hide the password characters.
	 */
	export function ShowPassword(): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Utilities.FailShowPassword,
			callback: () => {
				const inputPassword = OSFramework.OSUI.Helper.Dom.ClassSelector(
					document,
					'login-password'
				) as HTMLInputElement;
				const typeInputPassword = inputPassword.type;

				OSFramework.OSUI.Helper.Dom.Attribute.Set(
					inputPassword,
					'type',
					typeInputPassword === 'password' ? 'text' : 'password'
				);
			},
		});

		return result;
	}
}
