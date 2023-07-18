// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.Video {
	/**
	 * Class that represents the custom configurations received by the Video.
	 *
	 * @export
	 * @class VideoConfig
	 * @extends {AbstractConfiguration}
	 */
	export class VideoConfig extends AbstractConfiguration {
		public Autoplay: boolean;
		public Captions: string;
		public Controls: boolean;
		public Height: string;
		public Loop: boolean;
		public Muted: boolean;
		public PosterURL: string;
		public URL: string;
		public Width: string;

		constructor(config: JSON) {
			super(config);
		}
	}
}
