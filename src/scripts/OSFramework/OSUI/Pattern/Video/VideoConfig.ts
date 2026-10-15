// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.Video {
	/**
	 * Class that represents the custom configurations received by the Video.
	 */
	export class VideoConfig extends AbstractConfiguration {
		/** Starts playback automatically (browsers may require Muted). */
		public Autoplay: boolean;
		/** JSON list of caption tracks: [{ LanguageCode, SourceFile, Label }]. */
		public Captions: string;
		/** Shows the native player controls. */
		public Controls: boolean;
		/** Height of the player (CSS length). */
		public Height: string;
		/** Restarts playback when the video ends. */
		public Loop: boolean;
		/** Starts muted. */
		public Muted: boolean;
		/** Image shown before playback starts. */
		public PosterURL: string;
		/** Video source: a URL or a base64 data URL. */
		public URL: string;
		/** Width of the player (CSS length). */
		public Width: string;

		constructor(config: JSON) {
			super(config);
		}
	}
}
