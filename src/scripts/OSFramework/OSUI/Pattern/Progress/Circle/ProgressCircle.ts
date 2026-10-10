/// <reference path="AbstractCircleProgress.ts" />

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.Progress.Circle {
	export class Circle extends Progress.AbstractCircleProgress<ProgressCircleConfig> {
		constructor(uniqueId: string, configs: JSON) {
			super(uniqueId, new ProgressCircleConfig(configs));
			this.progressType = ProgressEnum.ProgressTypes.Circle;
		}

		/**
		 * The circle is a square: fit the smaller parent edge so it never overflows.
		 *
		 * @protected
		 * @param parentWidth parent client width in pixels
		 * @param parentHeight parent client height in pixels
		 * @returns the diameter in pixels
		 * @memberof OSFramework.Patterns.Progress.Circle.Circle
		 */
		protected fitToParent(parentWidth: number, parentHeight: number): number {
			return parentWidth > parentHeight ? parentHeight : parentWidth;
		}

		/**
		 * CSS class of the Progress Circle content placeholder.
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Progress.Circle.Circle
		 */
		protected getContentClass(): string {
			return Progress.ProgressEnum.CssClass.ProgressCircleContent;
		}

		/**
		 * Linear gradient vectors in the SVG's pre-rotation unit box. The values
		 * compensate for the circle's rotate(-90deg) so Horizontal reads left to
		 * right on screen, Vertical top to bottom, Diagonally top-left to bottom-right.
		 *
		 * @protected
		 * @param gradientType one of the ProgressEnum.Gradient linear types
		 * @returns the x1/x2/y1/y2 vector for the linearGradient element
		 * @memberof OSFramework.Patterns.Progress.Circle.Circle
		 */
		protected getLinearGradientCoords(gradientType: string): LinearGradientCoords {
			switch (gradientType) {
				case ProgressEnum.Gradient.LinearDiagonally:
					return { x1: 1, x2: 0, y1: 0, y2: 1 };
				case ProgressEnum.Gradient.LinearVertical:
					return { x1: 1, x2: 0, y1: 1, y2: 1 };
				case ProgressEnum.Gradient.LinearHorizontal:
				default:
					return { x1: 1, x2: 1, y1: 0, y2: 1 };
			}
		}

		/**
		 * CSS class of the Progress Circle progress stroke.
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Progress.Circle.Circle
		 */
		protected getProgressPathClass(): string {
			return Enum.CssClass.Progress;
		}

		/**
		 * Progress Circle paints the full circumference.
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Progress.Circle.Circle
		 */
		protected getSweepRatio(): number {
			return 1;
		}
	}
}
