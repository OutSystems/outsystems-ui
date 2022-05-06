// /// <reference path="AbstractGestures.ts" />

// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// namespace OSUIFramework.Patterns {
// 	/**
// 	 * Defines the Default props and methods for Patterns that will have drag events
// 	 *
// 	 * @export
// 	 * @abstract
// 	 * @class AbstractDraggable
// 	 * @extends {AbstractPattern<C>}
// 	 * @implements {Interface.IDraggable}
// 	 * @implements {Interface.IPattern}
// 	 * @template C
// 	 */
// 	export abstract class AbstractDraggable<C extends AbstractConfiguration>
// 		extends AbstractGestures<C>
// 		implements Interface.IDraggable
// 	{
// 		public readonly _dragParams = {
// 			InvalidDrag: false,
// 			LastX: 0,
// 			LastY: 0,
// 			MoveY: 0,
// 			MoveX: 0,
// 			IsMoving: false,
// 			IsReadyToTriggerCallback: false,
// 			VerticalDrag: true,
// 			IsOpen: true,
// 			DragDirection: GlobalEnum.Direction.Right,
// 			ExpectedDirection: GlobalEnum.Direction.Right,
// 		};

// 		private _updateLastPositions(x: number, y: number): void {
// 			this._dragParams.LastX = x;
// 			this._dragParams.LastY = y;
// 		}

// 		// eslint-disable-next-line @typescript-eslint/naming-convention
// 		private _updateUI(): void {
// 			if (this._dragParams.IsMoving) {
// 				if (this._dragParams.VerticalDrag) {
// 					this._selfElem.style.transform = `translateY(${this._dragParams.MoveY}px)`;
// 				} else {
// 					this._selfElem.style.transform = `translateX(${this._dragParams.MoveX}px)`;
// 				}

// 				requestAnimationFrame(this._updateUI.bind(this));
// 			}
// 		}

// 		public onGestureEnd(sizeThreshold: number, callback: Callbacks.Generic): void {
// 			this._dragParams.IsMoving = false;

// 			// Remove transitions
// 			Helper.Dom.Styles.RemoveClass(this._selfElem, Constants.NoTransition);

// 			if (
// 				(this._gestureParams.OffsetX === 0 && this._gestureParams.OffsetY === 0) ||
// 				this._dragParams.InvalidDrag
// 			) {
// 				return;
// 			}

// 			const threshold = sizeThreshold / 2;

// 			const axisToValidate = this._dragParams.VerticalDrag ? this._dragParams.MoveY : this._dragParams.MoveX;

// 			// Validate threshold for callback triggering, depending on elem visibility
// 			this._dragParams.IsReadyToTriggerCallback = this._dragParams.IsOpen
// 				? axisToValidate > threshold
// 				: axisToValidate < threshold;

// 			this._selfElem.style.transform = '';

// 			if (this._dragParams.IsReadyToTriggerCallback) {
// 				callback();
// 			}
// 		}

// 		public onGestureMove(): void {
// 			// Check X axis direction if not vertical drag
// 			if (!this._dragParams.VerticalDrag) {
// 				this._dragParams.DragDirection =
// 					this._gestureParams.OffsetX > 0 ? GlobalEnum.Direction.Right : GlobalEnum.Direction.Left;
// 			} else {
// 				this._dragParams.DragDirection =
// 					this._gestureParams.OffsetY < 0 ? GlobalEnum.Direction.Up : GlobalEnum.Direction.Down;
// 			}

// 			// Set direction as invalid if isOpen and swipe is on opposite direction
// 			this._dragParams.InvalidDrag =
// 				this._dragParams.IsOpen && this._dragParams.DragDirection !== this._dragParams.ExpectedDirection;

// 			if (this._dragParams.InvalidDrag) {
// 				this._updateLastPositions(this._gestureParams.CurrentX, this._gestureParams.CurrentY);
// 				return;
// 			}

// 			requestAnimationFrame(this._updateUI.bind(this));

// 			const updateYaxis = this._dragParams.MoveY + (this._gestureParams.CurrentY - this._dragParams.LastY);
// 			// Update x axis offset
// 			this._dragParams.MoveY = updateYaxis;

// 			this._updateLastPositions(this._gestureParams.CurrentX, this._gestureParams.CurrentY);
// 		}

// 		public onGestureStart(verticalDrag: boolean, expectedDirection: GlobalEnum.Direction): void {
// 			// Set defaults
// 			this._dragParams.IsMoving = true;
// 			this._dragParams.LastX = this._gestureParams.CurrentX;
// 			this._dragParams.LastY = this._gestureParams.CurrentY;
// 			this._dragParams.InvalidDrag = false;
// 			this._dragParams.MoveY = 0;
// 			this._dragParams.VerticalDrag = verticalDrag;
// 			this._dragParams.ExpectedDirection = expectedDirection;

// 			Helper.Dom.Styles.AddClass(this._selfElem, Constants.NoTransition);
// 		}
// 	}
// }
