// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Helper {
	// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
	export function AsyncInvocation(callback: Callbacks.Generic, ...args: any) {
		if (callback) setTimeout(() => callback(...args), 0);
	}
}
