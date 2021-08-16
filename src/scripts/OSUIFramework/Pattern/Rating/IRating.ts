// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.Rating {
	/**
	 * Defines the interface for OutSystemsUI Rating Pattern
	 */
	export interface IRating extends Interface.IPattern {
		//setValue(): any;
		//getValue(): any;
		setScale(value: number): void;
		setIsEdit(isEdit: boolean): void;
		destroy(IsUpdate: boolean): void;
	}
}
