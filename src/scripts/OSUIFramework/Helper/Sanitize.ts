// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Helper {
	/**
	 * Method used to sanitize a given value text
	 *
	 * @param value Text to be sanitized
	 * @returns
	 */
	export function Sanitize(value: string): string {
		if (typeof value === 'string') {
			if (value !== undefined && value !== null && value !== '') {
				return value.replace(/</g, '‹').replace(/>/g, '›');
			}
		}
		return value;
	}
}
