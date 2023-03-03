// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.Progress {
	/**
	 * Defines the interface for OutSystemsUI Progress Patterns
	 */
	export interface IProgress extends Interface.IPattern {
		progressApplyGradient(gradientType: string, colors: GradientColor): void;
		resetProgressValue(): void;
		setProgressValue(value: number): void;
	}
}
