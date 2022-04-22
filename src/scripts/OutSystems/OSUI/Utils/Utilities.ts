// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Utils {
	export function AddFavicon(URL: string): void {
		const link = (OSUIFramework.Helper.Dom.TagSelector(document.head, "link[rel*='icon']") ||
			document.createElement('link')) as HTMLLinkElement;
		link.type = 'image/x-icon';
		link.rel = 'shortcut icon';
		link.href = URL;
		document.getElementsByTagName('head')[0].appendChild(link);
	}

	// eslint-disable-next-line @typescript-eslint/naming-convention
	export function GetIsRTL(): boolean {
		return OSUIFramework.Helper.Dom.Styles.ContainsClass(document.body, OSUIFramework.Constants.IsRTLClass);
	}

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

	export function SetActiveElement(ElementId: string, IsActive: boolean): void {
		const elem = OSUIFramework.Helper.Dom.GetElementById(ElementId);

		if (IsActive) {
			OSUIFramework.Helper.Dom.Styles.AddClass(elem, 'active-element');
		} else {
			OSUIFramework.Helper.Dom.Styles.RemoveClass(elem, 'active-element');
		}
	}

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
