// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.Video {
	export class VideoConfig extends AbstractConfiguration {
		public Autoplay: boolean;
		public Controls: boolean;
		public Height: string;
		public Loop: boolean;
		public Muted: boolean;
		public PosterURL: string;
		public Subtitles: string;
		public URL: string;
		public Width: string;

		constructor(config: JSON) {
			super(config);
		}
	}
}
