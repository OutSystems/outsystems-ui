// eslint-disable-next-line @typescript-eslint/no-unused-vars
<<<<<<<< HEAD:src/scripts/OSFramework/Pattern/Progress/IProgress.ts
namespace OSFramework.Patterns.Progress {
========
namespace OSFramework.OSUI.Patterns.Progress {
>>>>>>>> origin/rc2.16.0:src/scripts/OSFramework/OSUI/Pattern/Progress/IProgress.ts
	/**
	 * Defines the interface for OutSystemsUI Progress Patterns
	 */
	export interface IProgress extends Interface.IPattern {
<<<<<<<< HEAD:src/scripts/OSFramework/Pattern/Progress/IProgress.ts
========
		progressApplyGradient(gradientType: string, colors: GradientColor): void;
>>>>>>>> origin/rc2.16.0:src/scripts/OSFramework/OSUI/Pattern/Progress/IProgress.ts
		resetProgressValue(): void;
		setProgressValue(value: number): void;
	}
}
