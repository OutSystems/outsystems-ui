// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Helper {
	export function AsyncInvocation(callback: Callbacks.Generic, ...args: unknown[]): void {
		if (callback) setTimeout(() => callback(...args), 0);
	}
}
