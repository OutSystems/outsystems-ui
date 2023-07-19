// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Patterns.VideoAPI {
	const _videoMap = new Map<string, OSFramework.OSUI.Patterns.Video.IVideo>();
	/**
	 * Function that will change the property of a given Video.
	 *
	 * @export
	 * @param {string} videoId
	 * @param {string} propertyName
	 * @param {*} propertyValue
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
	 * @export
	 * @param {string} videoId
	 * @param {string} configs
	 * @return {*}  {OSFramework.OSUI.Patterns.Video.IVideo}
	 */
	export function Create(videoId: string, configs: string): OSFramework.OSUI.Patterns.Video.IVideo {
		if (_videoMap.has(videoId)) {
			throw new Error(
				`There is already a ${OSFramework.OSUI.GlobalEnum.PatternName.Video} registered under id: ${videoId}`
			);
		}

		const _newVideo = new OSFramework.OSUI.Patterns.Video.Video(videoId, JSON.parse(configs));
		_videoMap.set(videoId, _newVideo);
		return _newVideo;
	}

	/**
	 * Function that will destroy the instance of the given Video
	 *
	 * @export
	 * @param {string} videoId
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
	 * @export
	 * @return {*}  {Array<string>}
	 */
	export function GetAllVideos(): Array<string> {
		return OSFramework.OSUI.Helper.MapOperation.ExportKeys(_videoMap);
	}

	/**
	 * Function that gets the instance of Video, by a given ID.
	 *
	 * @export
	 * @param {string} videoId
	 * @return {*}  {OSFramework.OSUI.Patterns.Video.IVideo}
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
	 * @export
	 * @param {string} videoId
	 * @return {*}  {OSFramework.OSUI.Patterns.Video.IVideo}
	 */
	export function Initialize(videoId: string): OSFramework.OSUI.Patterns.Video.IVideo {
		const video = GetVideoById(videoId);

		video.build();

		return video;
	}

	/**
	 * Function to register a provider callback
	 *
	 * @export
	 * @param {string} videoId
	 * @param {string} eventName
	 * @param {OSFramework.OSUI.GlobalCallbacks.OSGeneric} callback
	 * @return {*} {string} Return Message Success or message of error info if it's the case.
	 */
	export function RegisterCallback(
		videoId: string,
		eventName: string,
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
	 * @export
	 * @param {string} videoId
	 * @return {*}  {string}
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
	 * @export
	 * @param {string} videoId
	 * @return {*}  {string}
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
	 * @export
	 * @param {string} videoId
	 * @return {*}  {string}
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
	 * @export
	 * @param {string} videoId
	 * @param {number} currentTime
	 * @return {*}  {string}
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
