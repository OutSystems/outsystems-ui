// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.Video.Enum {
	/**
	 * CSS Classes
	 */
	export enum CssClass {
		VideoSource = 'osui-video-source',
		VideoTrack = 'osui-video-track',
	}

	/**
	 * Callbacks eventName
	 */
	export enum Events {
		OnStateChanged = 'StateChanged',
	}

	/**
	 * Video States Name
	 */
	export enum VideoStates {
		OnEnded = 'Ended',
		OnPause = 'Paused',
		OnPlaying = 'Playing',
		Unstarted = 'Unstarted',
	}

	/**
	 * Properties
	 */
	export enum Properties {
		Autoplay = 'Autoplay',
		Controls = 'Controls',
		Height = 'Height',
		Loop = 'Loop',
		Muted = 'Muted',
		PosterURL = 'PosterURL',
		URL = 'URL',
		Width = 'Width',
	}

	/**
	 * Video Tags
	 */
	export enum VideoTags {
		Source = 'source',
		Track = 'track',
	}

	/**
	 * Video Tags Attributes
	 */
	export enum VideoAttributes {
		Autoplay = 'autoplay',
		Captions = 'captions',
		Controls = 'controls',
		Default = 'default',
		Height = 'height',
		Kind = 'kind',
		Label = 'label',
		Loop = 'loop',
		Muted = 'muted',
		PosterURL = 'poster',
		Src = 'src',
		SrcLang = 'srclang',
		Type = 'type',
		TypePath = 'video/',
		Width = 'width',
	}
}
