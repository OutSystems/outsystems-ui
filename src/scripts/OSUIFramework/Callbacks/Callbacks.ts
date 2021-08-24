// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Callbacks {
	export type OSRatingSelectEvent = {
		(ratingId: string, value: number): void;
	};

	export type OSSearchCollapseEvent = {
		(searchId: string): void;
	};

	export type OSSidebarToggleEvent = {
		(sidebarId: string): void;
	};
}
