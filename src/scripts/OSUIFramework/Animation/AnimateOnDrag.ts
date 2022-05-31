// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Animation {
	/**
	 * Class to hold the drag information
	 *
	 * @class DragParams
	 */
	class DragParams {
		public DragOrientation = GlobalEnum.Orientation.None;
		public ExpectedDirection = GlobalEnum.Direction.Right;
		public InvalidDrag = false;
		public IsMoving = false;
		public IsOpen = false;
		public IsReadyToTriggerCallback = false;
		public LastX = 0;
		public LastY = 0;
		public MoveX = 0;
		public MoveY = 0;
		public Size = undefined;
		public VerticalDrag = false;
	}

	/**
	 * Class to manage an element's transform animation on drag
	 *
	 * @export
	 * @class AnimateOnDrag
	 */
	export class AnimateOnDrag {
		// Store the transition information
		private _dragParams: DragParams;

		// Store the minimal speed for a swipe to be triggered
		private readonly _swipeTriggerSpeed = 0.3;

		// Target element where the transition will be done
		private _targetElement: HTMLElement;

		constructor(target: HTMLElement) {
			this._targetElement = target;
			this._dragParams = new DragParams();
		}

		// Method to check if current gesture is withing sidebar boundaries
		private _checkIsDraggingInsideBounds(x: number): boolean {
			const isLeft = this._dragParams.ExpectedDirection === GlobalEnum.Direction.Left;

			const baseThreshold = this._dragParams.MoveX + (x - this._dragParams.LastX);

			// Check correct threshold for each direction
			return isLeft
				? baseThreshold > -parseInt(this._dragParams.Size) &&
						this._dragParams.MoveX + (x - this._dragParams.LastX) <= 0
				: baseThreshold < parseInt(this._dragParams.Size) &&
						this._dragParams.MoveX + (x - this._dragParams.LastX) >= 0;
		}

		// Method to update the last x and y positions
		private _updateLastPositions(x: number, y: number): void {
			this._dragParams.LastX = x;
			this._dragParams.LastY = y;
		}

		// Method to apply the transform property on target, depending on the orientation
		// eslint-disable-next-line @typescript-eslint/naming-convention
		private _updateUI(): void {
			if (this._dragParams.IsMoving) {
				if (this._dragParams.VerticalDrag) {
					this._targetElement.style.transform = `translateY(${this._dragParams.MoveY}px)`;
				} else {
					this._targetElement.style.transform = `translateX(${this._dragParams.MoveX}px)`;
				}

				requestAnimationFrame(this._updateUI.bind(this));
			}
		}

		/**
		 * Get dragParams object
		 *
		 * @readonly
		 * @type {unknown}
		 * @memberof AnimateOnDrag
		 */
		public get dragParams(): unknown {
			return this._dragParams;
		}

		/**
		 *
		 *
		 * @param {number} offsetX
		 * @param {number} offsetY
		 * @param {number} timeTaken
		 * @param {Callbacks.Generic} callback
		 * @return {*}  {void}
		 * @memberof AnimateOnDrag
		 */
		public onDragEnd(offsetX: number, offsetY: number, timeTaken: number, callback: Callbacks.Generic): void {
			this._dragParams.IsMoving = false;

			// Remove transitions
			Helper.Dom.Styles.RemoveClass(this._targetElement, Constants.NoTransition);

			// Just clicked or swiped in invalid direction?
			if ((offsetX === 0 && offsetY === 0) || this._dragParams.InvalidDrag) {
				return;
			}

			const checkSwipeSpeed = Math.abs(offsetX) / timeTaken > this._swipeTriggerSpeed;

			const sizeThreshold = -parseInt(this._dragParams.Size) / 2;

			// Define a interval for later checks, depending on Sidebar visibility
			const swipedHalfWidth = this._dragParams.MoveX < sizeThreshold;

			// If swipe was fast enough or with sufficient move, procede to toggleSidebar
			this._dragParams.IsReadyToTriggerCallback = swipedHalfWidth || checkSwipeSpeed;

			this._targetElement.style.transform = '';

			if (this._dragParams.IsReadyToTriggerCallback) {
				callback();
			}
		}

		/**
		 *
		 *
		 * @param {number} offsetX
		 * @param {number} offsetY
		 * @param {number} currentX
		 * @param {number} currentY
		 * @param {TouchEvent} event
		 * @return {*}  {void}
		 * @memberof AnimateOnDrag
		 */
		public onDragMove(
			offsetX: number,
			offsetY: number,
			currentX: number,
			currentY: number,
			event: TouchEvent
		): void {
			// Check X axis direction
			const _dragDirection = offsetX > 0 ? GlobalEnum.Direction.Right : GlobalEnum.Direction.Left;
			// Set direction as invalid if isOpen and swipe is on opposite direction
			this._dragParams.InvalidDrag =
				this._dragParams.IsOpen && _dragDirection !== this._dragParams.ExpectedDirection;

			// Swiped in wrong direction?
			if (this._dragParams.InvalidDrag) {
				this._updateLastPositions(currentX, currentY);
				return;
			}

			// No orientation set?
			if (this._dragParams.DragOrientation === '') {
				const isHorizontal = Math.abs(offsetX) >= Math.abs(offsetY);

				this._dragParams.DragOrientation = isHorizontal
					? GlobalEnum.Orientation.Horizontal
					: GlobalEnum.Orientation.Vertical;

				requestAnimationFrame(this._updateUI.bind(this));
			}

			// Is Scrolling?
			if (this._dragParams.DragOrientation === GlobalEnum.Orientation.Vertical) {
				this._updateLastPositions(currentX, currentY);
				return;
			}

			// Prevent scrolling the page while doing gesture
			event.preventDefault();

			const IsDraggingInsideBounds = this._checkIsDraggingInsideBounds(currentX);

			// Dragging inside bounds?
			if (IsDraggingInsideBounds) {
				const updateXaxis = this._dragParams.MoveX + (currentX - this._dragParams.LastX);
				// Update x axis offset
				this._dragParams.MoveX = updateXaxis;
			}

			this._updateLastPositions(currentX, currentY);
		}

		/**
		 *
		 *
		 * @param {boolean} verticalDrag
		 * @param {GlobalEnum.Direction} expectedDirection
		 * @param {number} currentX
		 * @param {number} currentY
		 * @param {boolean} isOpen
		 * @param {string} width
		 * @memberof AnimateOnDrag
		 */
		public onDragStart(
			verticalDrag: boolean,
			expectedDirection: GlobalEnum.Direction,
			currentX: number,
			currentY: number,
			isOpen: boolean,
			width: string
		): void {
			// Set defaults
			this._dragParams.IsMoving = true;
			this._dragParams.DragOrientation = GlobalEnum.Orientation.None;
			this._dragParams.LastX = currentX;
			this._dragParams.LastY = currentY;
			this._dragParams.Size = width;
			this._dragParams.ExpectedDirection = expectedDirection;
			this._dragParams.VerticalDrag = verticalDrag;
			this._dragParams.IsOpen = isOpen;

			if (this._dragParams.IsOpen) {
				this._dragParams.MoveX = 0;
			} else if (this._dragParams.ExpectedDirection === GlobalEnum.Direction.Left) {
				this._dragParams.MoveX = -parseInt(this._dragParams.Size);
			} else {
				this._dragParams.MoveX = parseInt(this._dragParams.Size);
			}

			Helper.Dom.Styles.AddClass(this._targetElement, Constants.NoTransition);
		}
	}

	/**
	 * Class to manage the overlay opacity on a drag transition
	 *
	 * @export
	 * @abstract
	 * @class OverlayTransition
	 */
	export abstract class OverlayTransitionOnDrag {
		/**
		 * Set overlay opacity
		 *
		 * @static
		 * @param {HTMLElement} target
		 * @param {number} x
		 * @param {GlobalEnum.Direction} direction
		 * @param {string} size
		 * @memberof OverlayTransition
		 */
		public static Set(target: HTMLElement, x: number, direction: GlobalEnum.Direction, size: string): void {
			const isLeft = direction === GlobalEnum.Direction.Left;
			const currentOpacity = parseInt(target.style.getPropertyValue(GlobalEnum.CSSVariables.OverlayOpacity));

			const percentageBeforeDif = (Math.abs(x) * 100) / parseInt(size);
			const percentage = isLeft ? 0 + percentageBeforeDif : 100 - percentageBeforeDif;

			const newOpacity = Math.floor(percentage) / 100;

			if (currentOpacity !== newOpacity && newOpacity % 1 !== 0) {
				Helper.Dom.Styles.SetStyleAttribute(target, GlobalEnum.CSSVariables.OverlayOpacity, newOpacity);
			}
		}

		/**
		 * Unset overlay opacity
		 *
		 * @static
		 * @param {HTMLElement} target
		 * @memberof OverlayTransition
		 */
		public static UnSet(target: HTMLElement): void {
			Helper.Dom.Styles.SetStyleAttribute(target, GlobalEnum.CSSVariables.OverlayOpacity, 0);
		}
	}
}
