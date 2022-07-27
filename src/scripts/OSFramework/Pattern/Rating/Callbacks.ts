// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Patterns.Rating.Callbacks {
	export type OSOnSelectEvent = {
		(ratingId: string, value: number): void;
	};
}
