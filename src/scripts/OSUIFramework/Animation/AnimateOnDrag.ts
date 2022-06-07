// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Animations {
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
		public SpringAnimation: Animation;
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

		// Method to add a spring effect on dragEnd, when the callback expected is not triggered
		// based on: https://www.kirillvasiltsov.com/writing/how-to-create-a-spring-animation-with-web-animation-api/
		private _addSpringEffect(dx: number, dy: number): SpringAnimation {
			if (dx === 0 && dy === 0) return { positions: [], frames: 0 };

			// These 3 are used to configure the effect and are common on any spring animation
			const tension = 300; // Tension, as it refers to how tightly-wound the spring is. The tighter the spring, the more energy is released, leading to a snappy, bouncy animation
			const friction = 10; // friction is the force that dampens the motion. LIke hgravity, as you sprinkle more friction into the universe, the spring becomes less and less bouncy.
			const mass = 1; // Mass refers to the heft of the thing we're moving. A heavier object will move more slowly, but it also has more inertia. We use 1 here for a more simple approach

			const spring_length = 0;
			const k = -tension;
			const d = -friction;
			const frame_rate = 1 / 60; // Framerate: we want 60 fps hence the framerate here is at 1/60
			const displacement_threshold = 3; // Damping is the force that slows down and eventually stops an oscillation by dissipating energy

			let velocity = 0;

			// positions is an array of numbers where each number represents the position of the object in a spring motion at a specific frame
			const positions = [];

			let frames = 0;
			let frames_below_threshold = 0;
			let largest_displ;

			// CHange value to be used, depending if is a vertical or horizontal drag
			let directionDisplacement = this._dragParams.VerticalDrag ? dy : dx;

			for (let step = 0; step <= 1000; step += 1) {
				const Fspring = k * (directionDisplacement - spring_length);

				const Fdamping = d * velocity;

				const accel = (Fspring + Fdamping) / mass;

				velocity += accel * frame_rate;

				directionDisplacement += velocity * frame_rate;

				positions.push({
					transform: this._dragParams.VerticalDrag
						? `translateY(${directionDisplacement}px)`
						: `translateX(${directionDisplacement}px)`,
				});

				// Save the last largest displacement so that we can compare it with threshold later
				largest_displ =
					largest_displ < 0
						? Math.max(largest_displ || -Infinity, Math.sqrt(directionDisplacement ** 2))
						: Math.min(largest_displ || Infinity, Math.sqrt(directionDisplacement ** 2));

				if (Math.abs(largest_displ) < displacement_threshold) {
					frames_below_threshold += 1;
				} else {
					frames_below_threshold = 0; // Reset the frame counter
				}

				if (frames_below_threshold >= 60) {
					frames = step;
					break;
				}
			}

			if (frames === 0) {
				frames = 1000;
			}

			return { positions, frames };
		}

		// Method to check if current gesture is withing sidebar boundaries
		private _checkIsDraggingInsideBounds(currentDrag: number): boolean {
			const move = this._dragParams.VerticalDrag ? this._dragParams.MoveY : this._dragParams.MoveX;
			const last = this._dragParams.VerticalDrag ? this._dragParams.LastY : this._dragParams.LastX;
			const isLeftOrUp =
				this._dragParams.ExpectedDirection === GlobalEnum.Direction.Left ||
				this._dragParams.ExpectedDirection === GlobalEnum.Direction.Up;

			const baseThreshold = move + (currentDrag - last);

			// Check correct threshold for each direction
			return isLeftOrUp
				? baseThreshold > -parseInt(this._dragParams.Size) && move + (currentDrag - last) <= 0
				: baseThreshold < parseInt(this._dragParams.Size) && move + (currentDrag - last) >= 0;
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
		public onDragEnd(
			offsetX: number,
			offsetY: number,
			timeTaken: number,
			callback: Callbacks.Generic,
			addSpringEffect = false
		): void {
			this._dragParams.IsMoving = false;

			// Remove transitions
			Helper.Dom.Styles.RemoveClass(this._targetElement, Constants.NoTransition);

			// Check if just clicked or swiped in invalid direction
			if ((offsetX === 0 && offsetY === 0) || this._dragParams.InvalidDrag) {
				return;
			}

			const checkSwipeSpeed =
				(this._dragParams.VerticalDrag ? Math.abs(offsetY) : Math.abs(offsetX)) / timeTaken >
				this._swipeTriggerSpeed;

			const sizeThreshold = -parseInt(this._dragParams.Size) / 2;

			const axisToValidate = this._dragParams.VerticalDrag ? this._dragParams.MoveY : this._dragParams.MoveX;

			// Define a interval for later checks, depending on Sidebar visibility
			const swipedHalfWidth = axisToValidate < sizeThreshold;

			// If swipe was fast enough or with sufficient move, procede to toggleSidebar
			this._dragParams.IsReadyToTriggerCallback = swipedHalfWidth || checkSwipeSpeed;

			if (this._dragParams.IsReadyToTriggerCallback) {
				this._targetElement.style.transform = '';
				callback();
			} else if (addSpringEffect && this._dragParams.IsOpen) {
				// Create the the position for each frame
				const { positions, frames } = this._addSpringEffect(offsetX, offsetY);

				// Create the keyframe object
				const keyframes = new KeyframeEffect(this._targetElement, positions, {
					duration: (frames / 60) * 1000,
					fill: GlobalEnum.KeyframesEffectOptions.FillBoth,
					easing: GlobalEnum.KeyframesEffectOptions.EasingLinear,
					iterations: 1,
				});

				// Create the animation object
				this._dragParams.SpringAnimation = new Animation(keyframes);

				// Play the animation
				this._dragParams.SpringAnimation.play();
				this._targetElement.style.transform = '';
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
			let _dragDirection;

			// Check X axis direction if not vertical drag
			if (!this._dragParams.VerticalDrag) {
				_dragDirection = offsetX > 0 ? GlobalEnum.Direction.Right : GlobalEnum.Direction.Left;
			} else {
				_dragDirection = offsetY < 0 ? GlobalEnum.Direction.Up : GlobalEnum.Direction.Down;
			}

			// Set direction as invalid if isOpen and swipe is on opposite direction
			this._dragParams.InvalidDrag =
				this._dragParams.IsOpen && _dragDirection !== this._dragParams.ExpectedDirection;

			// CHeck if swiped in wrong direction
			if (this._dragParams.InvalidDrag) {
				this._updateLastPositions(currentX, currentY);
				return;
			}

			// Check if orientation is set
			if (this._dragParams.DragOrientation === '') {
				const isHorizontal = Math.abs(offsetX) >= Math.abs(offsetY);

				this._dragParams.DragOrientation = isHorizontal
					? GlobalEnum.Orientation.Horizontal
					: GlobalEnum.Orientation.Vertical;

				requestAnimationFrame(this._updateUI.bind(this));
			}

			// Check if is scrolling
			if (
				this._dragParams.VerticalDrag === false &&
				this._dragParams.DragOrientation === GlobalEnum.Orientation.Vertical
			) {
				this._updateLastPositions(currentX, currentY);
				return;
			}

			// Prevent scrolling the page while doing gesture
			event.preventDefault();

			const IsDraggingInsideBounds = this._checkIsDraggingInsideBounds(
				this._dragParams.VerticalDrag ? currentY : currentX
			);

			// Checking if dragging inside bounds
			if (IsDraggingInsideBounds) {
				if (this._dragParams.VerticalDrag) {
					// Update y axis offset
					this._dragParams.MoveY = this._dragParams.MoveY + (currentY - this._dragParams.LastY);
				} else {
					// Update x axis offset
					this._dragParams.MoveX = this._dragParams.MoveX + (currentX - this._dragParams.LastX);
				}
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
		 * @param {string} size
		 * @memberof AnimateOnDrag
		 */
		public onDragStart(
			verticalDrag: boolean,
			expectedDirection: GlobalEnum.Direction,
			currentX: number,
			currentY: number,
			isOpen: boolean,
			size: string
		): void {
			// Set defaults
			this._dragParams.DragOrientation = GlobalEnum.Orientation.None;
			this._dragParams.ExpectedDirection = expectedDirection;
			this._dragParams.IsMoving = true;
			this._dragParams.IsOpen = isOpen;
			this._dragParams.LastX = currentX;
			this._dragParams.LastY = currentY;
			this._dragParams.Size = size;
			this._dragParams.VerticalDrag = verticalDrag;

			if (this._dragParams.SpringAnimation) {
				this._dragParams.SpringAnimation.cancel();
			}

			if (this._dragParams.IsOpen) {
				this._dragParams.MoveX = 0;
				this._dragParams.MoveY = 0;
			} else if (this._dragParams.ExpectedDirection === GlobalEnum.Direction.Left) {
				this._dragParams.MoveX = -parseInt(this._dragParams.Size);
				this._dragParams.MoveY = -parseInt(this._dragParams.Size);
			} else {
				this._dragParams.MoveX = parseInt(this._dragParams.Size);
				this._dragParams.MoveY = parseInt(this._dragParams.Size);
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
		 * @param {number} currentDragValue
		 * @param {GlobalEnum.Direction} direction
		 * @param {string} size
		 * @memberof OverlayTransition
		 */
		public static Set(
			target: HTMLElement,
			currentDragValue: number,
			direction: GlobalEnum.Direction,
			size: string
		): void {
			const isLeftOrUp = direction === GlobalEnum.Direction.Left || direction === GlobalEnum.Direction.Up;
			const currentOpacity = parseInt(target.style.getPropertyValue(GlobalEnum.CSSVariables.OverlayOpacity));

			const percentageBeforeDif = (Math.abs(currentDragValue) * 100) / parseInt(size);
			const percentage = isLeftOrUp ? 0 + percentageBeforeDif : 100 - percentageBeforeDif;

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
