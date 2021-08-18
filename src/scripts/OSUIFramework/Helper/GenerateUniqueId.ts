/* eslint-disable @typescript-eslint/no-unused-vars */
namespace OSUIFramework.Helper {
	/**
	 * Generate a Random Sting that could be assigned as a pattern UniqueId
	 *
	 * @export
	 * @return {*}  {string}
	 */
	export function GenerateUniqueId(): string {
		return Math.random().toString(36);
	}
}
