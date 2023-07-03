// eslint-disable-next-line @typescript-eslint/no-unused-vars
<<<<<<<< HEAD:src/scripts/OSFramework/Pattern/SectionIndexItem/ISectionIndexItem.ts
namespace OSFramework.Patterns.SectionIndexItem {
========
namespace OSFramework.OSUI.Patterns.SectionIndexItem {
>>>>>>>> origin/rc2.16.0:src/scripts/OSFramework/OSUI/Pattern/SectionIndexItem/ISectionIndexItem.ts
	/**
	 * Defines the interface for OutSystemsUI SectionIndexItem Pattern
	 *
	 * @export
	 * @interface ISectionIndexItem
	 * @extends {Interface.IChild}
	 */
	export interface ISectionIndexItem extends Interface.IChild {
		get IsSelected(): boolean;
		get TargetElement(): HTMLElement;
		get TargetElementOffset(): OffsetValues;

<<<<<<<< HEAD:src/scripts/OSFramework/Pattern/SectionIndexItem/ISectionIndexItem.ts
		setIsActive();
		unsetIsActive();
========
		setIsActive(): void;
		unsetIsActive(): void;
>>>>>>>> origin/rc2.16.0:src/scripts/OSFramework/OSUI/Pattern/SectionIndexItem/ISectionIndexItem.ts
	}
}
