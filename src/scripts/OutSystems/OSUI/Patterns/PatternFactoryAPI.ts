/* eslint-disable @typescript-eslint/no-unused-vars */
namespace OutSystems.OSUI.Patterns.PatternFactoryAPI {
	const _patternClasses = {
		Sidebar: OSFramework.OSUI.Patterns.Sidebar.Sidebar,
	};

	export function CreateInstance(patternName: string, patternId: string, configs: string): unknown {
		return new _patternClasses[patternName](patternId, configs);
	}

	export function ExtendPatternClass(patternName: string, patternClass: object): void {
		_patternClasses[patternName] = patternClass;
	}
}
