/// <reference path="../Circle/AbstractCircleProgress.ts" />

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.Progress.SemiCircle {
	/**
	 * Upper 180-degree gauge. Progress 0–100 fills the top arc clockwise from the left.
	 */
	export class SemiCircle extends Progress.AbstractCircleProgress<ProgressSemiCircleConfig> {
		constructor(uniqueId: string, configs: JSON) {
			super(uniqueId, new ProgressSemiCircleConfig(configs));
			this.progressType = ProgressEnum.ProgressTypes.SemiCircle;
		}

		/**
		 * Auto size fills the parent width; the gauge is then half of that tall.
		 * The parent height is not read: in content-sized containers it is made of the
		 * gauge itself, and feeding it back makes the gauge grow on every resize event.
		 * Set the Size parameter when the height must constrain the gauge.
		 *
		 * @protected
		 * @param parentWidth parent client width in pixels
		 * @returns the diameter in pixels
		 * @memberof OSFramework.Patterns.Progress.SemiCircle.SemiCircle
		 */
		protected fitToParent(parentWidth: number): number {
			return parentWidth;
		}

		/**
		 * CSS class of the Progress Semi-Circle content placeholder.
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Progress.SemiCircle.SemiCircle
		 */
		protected getContentClass(): string {
			return Progress.ProgressEnum.CssClass.ProgressSemiCircleContent;
		}

		/**
		 * Linear gradient vectors in the SVG's pre-rotation unit box. The values
		 * compensate for the semi-circle's rotate(180deg) and span only the visible
		 * upper half of the bounding box, so the whole color ramp lands on the arc:
		 * Horizontal reads left to right on screen, Vertical from the top of the arc
		 * down to the diameter, Diagonally across the visible half-box.
		 *
		 * @protected
		 * @param gradientType one of the ProgressEnum.Gradient linear types
		 * @returns the x1/x2/y1/y2 vector for the linearGradient element
		 * @memberof OSFramework.Patterns.Progress.SemiCircle.SemiCircle
		 */
		protected getLinearGradientCoords(gradientType: string): Progress.LinearGradientCoords {
			switch (gradientType) {
				case ProgressEnum.Gradient.LinearDiagonally:
					return { x1: 1, x2: 0, y1: 1, y2: 0.5 };
				case ProgressEnum.Gradient.LinearVertical:
					return { x1: 1, x2: 1, y1: 1, y2: 0.5 };
				case ProgressEnum.Gradient.LinearHorizontal:
				default:
					return { x1: 1, x2: 0, y1: 0, y2: 0 };
			}
		}

		/**
		 * CSS class of the Progress Semi-Circle progress stroke.
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Progress.SemiCircle.SemiCircle
		 */
		protected getProgressPathClass(): string {
			return Enum.CssClass.Progress;
		}

		/**
		 * Progress Semi-Circle paints half of the circumference.
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Progress.SemiCircle.SemiCircle
		 */
		protected getSweepRatio(): number {
			return 0.5;
		}
	}
}
