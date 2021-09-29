// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Callbacks {
	export type OSGeneric = { (patternId, ...args): void };

	export type OSRatingSelectEvent = {
		(ratingId: string, value: number): void;
	};

	export type OSSearchCollapseEvent = {
		(searchId: string): void;
	};

	export type OSSidebarToggleEvent = {
		(sidebarId: string, isOpen: boolean): void;
	};

	export type OSFlipContentFlipEvent = {
		(flipId: string, isFlipped: boolean): void;
	};
}
