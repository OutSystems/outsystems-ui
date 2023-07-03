// eslint-disable-next-line @typescript-eslint/no-unused-vars
<<<<<<<< HEAD:src/scripts/OSFramework/Helper/Sanitize.ts
namespace OSFramework.Helper {
========
namespace OSFramework.OSUI.Helper {
>>>>>>>> origin/rc2.16.0:src/scripts/OSFramework/OSUI/Helper/Sanitize.ts
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
