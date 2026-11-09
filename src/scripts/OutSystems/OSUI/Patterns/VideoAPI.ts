// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Patterns.VideoAPI {
	const _videoMap = new Map<string, OSFramework.OSUI.Patterns.Video.IVideo>();
	/**
	 * Function that will change the property of a given Video.
	 *
	 * @param videoId The id of the Video element
	 * @param propertyName The name of the property to change
	 * @param propertyValue The new value of the property
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
	 */
	export function ChangeProperty(videoId: string, propertyName: string, propertyValue: unknown): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Video.FailChangeProperty,
			callback: () => {
				const video = GetVideoById(videoId);

				video.changeProperty(propertyName, propertyValue);
			},
		});

		return result;
	}

	/**
	 * Create the new Video instance and add it to the videosMap
	 *
	 * @param videoId The id of the Video element
	 * @param configs The configuration options as a JSON string or object
	 * @returns the Video instance
	 */
	export function Create(videoId: string, configs: string | Configs): OSFramework.OSUI.Patterns.Video.IVideo {
		if (_videoMap.has(videoId)) {
			throw new Error(
				`There is already a ${OSFramework.OSUI.GlobalEnum.PatternName.Video} registered under id: ${videoId}`
			);
		}

		const _newVideo = new OSFramework.OSUI.Patterns.Video.Video(
			videoId,
			OSFramework.OSUI.Helper.ParseConfigs(configs)
		);
		_videoMap.set(videoId, _newVideo);
		return _newVideo;
	}

	/**
	 * Function that will destroy the instance of the given Video
	 *
	 * @param videoId The id of the Video element
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
	 */
	export function Dispose(videoId: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Video.FailDispose,
			callback: () => {
				const video = GetVideoById(videoId);

				video.dispose();

				_videoMap.delete(videoId);
			},
		});

		return result;
	}

	/**
	 * Fucntion that will return the Map with all the Video instances at the page
	 *
	 * @returns the ids of every Video instance
	 */
	export function GetAllVideos(): Array<string> {
		return OSFramework.OSUI.Helper.MapOperation.ExportKeys(_videoMap);
	}

	/**
	 * Function that gets the instance of Video, by a given ID.
	 *
	 * @param videoId The id of the Video element
	 * @returns the Video instance
	 */
	export function GetVideoById(videoId: string): OSFramework.OSUI.Patterns.Video.IVideo {
		return OSFramework.OSUI.Helper.MapOperation.FindInMap(
			OSFramework.OSUI.GlobalEnum.PatternName.Video,
			videoId,
			_videoMap
		) as OSFramework.OSUI.Patterns.Video.IVideo;
	}

	/**
	 * Function that will initialize the pattern instance.
	 *
	 * @param videoId The id of the Video element
	 * @returns the Video instance
	 */
	export function Initialize(videoId: string): OSFramework.OSUI.Patterns.Video.IVideo {
		const video = GetVideoById(videoId);

		video.build();

		return video;
	}

	/**
	 * Function to register a provider callback
	 *
	 * @param videoId The id of the Video element
	 * @param eventName The name of the event to register the callback for
	 * @param callback The function invoked when the event fires
	 * @returns Return Message Success or message of error info if it's the case.
	 */
	export function RegisterCallback(
		videoId: string,
		eventName: EventName,
		callback: OSFramework.OSUI.GlobalCallbacks.OSGeneric
	): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Video.FailRegisterCallback,
			callback: () => {
				const _videoItem = this.GetVideoById(videoId);

				_videoItem.registerCallback(eventName, callback);
			},
		});

		return result;
	}

	/**
	 * Function that returns the state of a given video
	 *
	 * @param videoId The id of the Video element
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
	 */
	export function GetState(videoId: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Video.FailGetState,
			hasValue: true,
			callback: () => {
				const video = GetVideoById(videoId);

				return video.getVideoState;
			},
		});

		return result;
	}

	/**
	 *
	 * Function that pause video on a given video
	 * @param videoId The id of the Video element
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
	 */
	export function Pause(videoId: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Video.FailPause,
			callback: () => {
				const video = GetVideoById(videoId);

				video.setVideoPause();
			},
		});

		return result;
	}

	/**
	 * Function that play video on a given video
	 *
	 * @param videoId The id of the Video element
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
	 */
	export function Play(videoId: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Video.FailPlay,
			callback: () => {
				const video = GetVideoById(videoId);

				video.setVideoPlay();
			},
		});

		return result;
	}

	/**
	 * Function that jump to a specific time on a given video
	 *
	 * @param videoId The id of the Video element
	 * @param currentTime The time in seconds to jump to
	 * @returns the API response envelope as a JSON string: `{ code, isSuccess, message, value? }`
	 */
	export function JumpToTime(videoId: string, currentTime: number): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Video.FailSetTime,
			callback: () => {
				const video = GetVideoById(videoId);

				video.setVideoJumpToTime(currentTime);
			},
		});

		return result;
	}
}
