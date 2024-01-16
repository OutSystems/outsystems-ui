// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Helper {
	const MAX_TIME_LAPSE_MINUTES = 10;
	const MAX_TIME_LAPSE_MS = MAX_TIME_LAPSE_MINUTES * 60000;

	interface IStorageInfo {
		data: unknown;
		time: number;
	}

	export abstract class TempStorage {
		private static _instore = new Map<string, IStorageInfo>();
		private static _timerInterval = undefined;

		private static _cleanUp() {
			if (TempStorage._instore.size > 0) {
				const cutDate = Date.now();
				const keys = TempStorage._instore.keys();
				for (const key of keys) {
					const val = TempStorage._instore.get(key);
					if (val.time + MAX_TIME_LAPSE_MS < cutDate) {
						TempStorage._instore.delete(key);
					}
				}
			} else {
				TempStorage._stopTimer();
			}
		}

		private static _startTimer() {
			if (TempStorage._timerInterval === undefined) {
				TempStorage._timerInterval = setInterval(TempStorage._cleanUp, MAX_TIME_LAPSE_MS);
			}
		}

		private static _stopTimer() {
			clearInterval(TempStorage._timerInterval);
			TempStorage._timerInterval = undefined;
		}

		public static get<T>(key: string): T {
			if (TempStorage.has(key)) {
				const val = TempStorage._instore.get(key);

				return val.data as T;
			}
			return {} as T;
		}

		public static has(key: string): boolean {
			return TempStorage._instore.has(key);
		}

		public static keep<T>(key: string, value: T): void {
			TempStorage._instore.set(key, { data: value, time: Date.now() });
			TempStorage._startTimer();
		}
	}
}
