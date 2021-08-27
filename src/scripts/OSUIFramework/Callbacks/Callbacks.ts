// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Callbacks {
	export type OSGeneric = { (patternId, ...ags): void };

	export type OSRatingSelectEvent = {
		(ratingId: string, value: number): void;
	};

	export type OSSearchCollapseEvent = {
		(searchId: string): void;
	};
}
