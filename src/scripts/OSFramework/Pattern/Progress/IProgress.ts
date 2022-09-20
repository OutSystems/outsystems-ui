// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Patterns.Progress {
	/**
	 * Defines the interface for OutSystemsUI Progress Patterns
	 */
	export interface IProgress extends Interface.IPattern {
		resetProgressValue(): void;
		setProgressValue(value: number): void;
	}
}
