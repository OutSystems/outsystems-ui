// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Helper {
	export function AsyncInvocation(callback: GlobalCallbacks.Generic, ...args: unknown[]): void {
		if (callback) setTimeout(() => callback(...args), 0);
	}
}
