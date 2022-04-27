// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Utils {
	/**
	 * Add a favicon to your web application by providing the icon's URL. This action should be used in the Layout OnReady event or on an OnApplicationStart event.
	 * @param URL
	 */
	export function AddFavicon(URL: string): void {
		const link = (OSUIFramework.Helper.Dom.TagSelector(document.head, "link[rel*='icon']") ||
			document.createElement('link')) as HTMLLinkElement;
		link.type = 'image/x-icon';
		link.rel = 'shortcut icon';
		link.href = URL;
		document.getElementsByTagName('head')[0].appendChild(link);
	}

	/**
	 * Function that exposes if RTL is applied.
	 * @returns
	 */
	// eslint-disable-next-line @typescript-eslint/naming-convention
	export function GetIsRTL(): boolean {
		return OSUIFramework.Helper.Dom.Styles.ContainsClass(document.body, OSUIFramework.Constants.IsRTLClass);
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
	): void {
		let timeoutVar;
		const timeAnimation = AnimationTime / 6;

		const waitListRender = function () {
			const listEl = OSUIFramework.Helper.Dom.GetElementById(ListId);

			if (OSUIFramework.Helper.Dom.Styles.ContainsClass(listEl, 'list-loading') === false) {
				listAnimateItems();
				clearTimeout(timeoutVar);
			} else {
				timeoutVar = setTimeout(waitListRender, 50);
			}
		};

		const listAnimateItems = function () {
			setTimeout(function () {
				const listElement = OSUIFramework.Helper.Dom.GetElementById(ListId).childNodes[1] as HTMLElement;
				const listItemContentLeft = OSUIFramework.Helper.Dom.TagSelector(
					listElement,
					'.active-screen .list-item-left-actions'
				);
				const listItemContentRight = OSUIFramework.Helper.Dom.TagSelector(
					listElement,
					'.active-screen .list-item-right-actions'
				);

				listElement.style.pointerEvents = 'none';

				if (HasLeftAction) {
					OSUIFramework.Helper.Dom.Styles.AddClass(listItemContentLeft, 'has-content-animation');
					OSUIFramework.Helper.Dom.Attribute.Set(
						listItemContentLeft,
						'style',
						'width:75px; transition: all ' + timeAnimation + 'ms !important;'
					);

					setTimeout(function () {
						listItemContentLeft.style.width = '';
						listItemContentLeft.addEventListener(
							'transitionend',
							function () {
								OSUIFramework.Helper.Dom.Styles.RemoveClass(
									listItemContentLeft,
									'has-content-animation'
								);
								OSUIFramework.Helper.Dom.Attribute.Remove(listItemContentLeft, 'style');
								listElement.style.pointerEvents = '';
							},
							false
						);
					}, timeAnimation * 3);
				} else if (HasRightAction) {
					OSUIFramework.Helper.Dom.Styles.AddClass(listItemContentRight, 'has-content-animation-right');
					OSUIFramework.Helper.Dom.Attribute.Set(
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
								OSUIFramework.Helper.Dom.Styles.RemoveClass(
									listItemContentRight,
									'has-content-animation-right'
								);
								OSUIFramework.Helper.Dom.Attribute.Remove(listItemContentRight, 'style');
								listElement.style.pointerEvents = '';
							},
							false
						);
					}, timeAnimation * 3);
				}
			}, timeAnimation); // waiting for screen transition ends
		};

		waitListRender();
	}

	/**
	 * Action that moves elements on the DOM tree.
	 * Define the WidgetID of the element to be moved and the Target selector that will receive the element.
	 * Example: $actions.MoveElement($parameters.WidgetId, ".active-screen .screen");
	 * @param ElementId
	 * @param TargetSelector
	 */
	export function MoveElement(ElementId: string, TargetSelector: string): void {
		if (TargetSelector && ElementId) {
			const elementToMove = OSUIFramework.Helper.Dom.GetElementById(ElementId);
			const targetElement = OSUIFramework.Helper.Dom.TagSelector(document.body, TargetSelector);

			if (elementToMove && targetElement) {
				setTimeout(function () {
					OSUIFramework.Helper.Dom.Move(elementToMove, targetElement);
				}, 200);
			}
		}
	}

	/**
	 * Allows to change the selected state of Cards and List Items.
	 * Set a Widget Id and the Active state to change an element on the screen.
	 * @param ElementId
	 * @param IsActive
	 */
	export function SetActiveElement(ElementId: string, IsActive: boolean): void {
		const elem = OSUIFramework.Helper.Dom.GetElementById(ElementId);

		if (IsActive) {
			OSUIFramework.Helper.Dom.Styles.AddClass(elem, 'active-element');
		} else {
			OSUIFramework.Helper.Dom.Styles.RemoveClass(elem, 'active-element');
		}
	}

	/**
	 * To be used to complement Bulk Actions logic. Drag this action to your checkbox OnChange action.
	 * This will afftect the styles of the checkbox used, and the selected table rows, containing a checked checkbox.
	 * @param TableId
	 * @param RowNumber
	 * @param IsSelected
	 */
	export function SetSelectedTableRow(TableId: string, RowNumber: number, IsSelected: boolean): void {
		const tableRow = OSUIFramework.Helper.Dom.TagSelectorAll(document, '#' + TableId + ' .table-row')[
			RowNumber
		] as HTMLElement;
		if (tableRow) {
			if (IsSelected) {
				OSUIFramework.Helper.Dom.Styles.AddClass(tableRow, 'table-row-selected');
			} else {
				OSUIFramework.Helper.Dom.Styles.RemoveClass(tableRow, 'table-row-selected');
			}
		}
	}

	/**
	 * Action to be used on the Login screen to enable users to show or hide the password characters.
	 */
	export function ShowPassword(): void {
		const inputPassword = OSUIFramework.Helper.Dom.ClassSelector(document, 'login-password') as HTMLInputElement;
		const typeInputPassword = inputPassword.type;

		OSUIFramework.Helper.Dom.Attribute.Set(
			inputPassword,
			'type',
			typeInputPassword === 'password' ? 'text' : 'password'
		);
	}
}
