/**
 * Namespace for all public methods to access and use the OutSystemsUI components.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.osuiAPI {
	/**
	 * Function that returns the OutSystemsUI version value
	 *
	 * @export
	 * @return {*}  {string}
	 */
	export function GetVersion(): string {
		const version = '2.6.9';
		return 'OutSystems UI - Version ' + version;
	}
}
