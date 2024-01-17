// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Helper {
	const MAX_TIME_LAPSE_MINUTES = 10;
	const MAX_TIME_LAPSE_MILISECONDS = MAX_TIME_LAPSE_MINUTES * 60000;

	interface IStorageInfo {
		data: unknown;
		time: number;
	}

	export abstract class TempStorage {
		private static _instore = new Map<string, IStorageInfo>();
		private static _timerInterval = undefined;

		private static _cleanUp() {
			const cutDate = Date.now();
			TempStorage._instore.forEach((val, key) => {
				if (val.time + MAX_TIME_LAPSE_MILISECONDS < cutDate) {
					TempStorage._instore.delete(key);
				}
			});

			if (TempStorage._instore.size === 0) {
				TempStorage._stopTimer();
			}
		}

		private static _startTimer() {
			if (TempStorage._timerInterval === undefined) {
				TempStorage._timerInterval = setInterval(TempStorage._cleanUp, MAX_TIME_LAPSE_MILISECONDS);
			}
		}

		private static _stopTimer() {
			clearInterval(TempStorage._timerInterval);
			TempStorage._timerInterval = undefined;
		}

		public static get<T>(key: string): T | undefined {
			if (TempStorage.has(key)) {
				const val = TempStorage._instore.get(key);

				return val.data as T;
			}
			return undefined;
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
