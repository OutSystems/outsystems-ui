// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.Video {
	/**
	 * Defines the interface for OutSystemsUI Patterns
	 *
	 * @export
	 * @class Video
	 * @extends {AbstractPattern<VideoConfig>}
	 * @implements {IVideo}
	 */
	export class Video extends AbstractPattern<VideoConfig> implements IVideo {
		// Store the platform events
		private _platformEventOnStateChanged: Callbacks.OSOnStateChangedEvent;
		// Store the video element
		private _videoElement: HTMLVideoElement;
		// Store the value for video to jump into a specific time
		private _videoJumpTime: number;
		// Store the source element
		private _videoSourceElement: HTMLSourceElement;
		// Store the current video state
		private _videoState: string;

		/**
		 * Creates an instance of Video.
		 * @param {string} uniqueId
		 * @param {JSON} configs
		 * @memberof Video
		 */
		constructor(uniqueId: string, configs: JSON) {
			super(uniqueId, new VideoConfig(configs));
		}

		/**
		 * Method that will set the Autoplay attribute
		 *
		 * @private
		 * @memberof Video
		 */
		private _setAutoplay(): void {
			this._videoElement.autoplay = this.configs.Autoplay;

			if (this.configs.Autoplay && this.configs.Muted === false) {
				console.warn(
					`Some modern browsers will not autoplay your video on ${GlobalEnum.PatternName.Video} if it's not muted. The general rule of many browsers is that a user must opt-in to certain actions before they can happen. Set the Muted parameter to True, to start the video automatically.`
				);
			}
		}

		/**
		 * Method that will set the controls attribute
		 *
		 * @private
		 * @memberof Video
		 */
		private _setControls(): void {
			this._videoElement.controls = this.configs.Controls;
		}

		/**
		 * Method that will set the Height attribute
		 *
		 * @private
		 * @memberof Video
		 */
		private _setHeight(): void {
			if (this.configs.Height !== Constants.EmptyString) {
				OSUI.Helper.Dom.Attribute.Set(
					this._videoElement,
					Patterns.Video.Enum.VideoAttributes.Height,
					this.configs.Height
				);
			} else {
				OSUI.Helper.Dom.Attribute.Remove(this._videoElement, Patterns.Video.Enum.VideoAttributes.Height);
			}
		}

		/**
		 * Method that will set the loop attribute
		 *
		 * @private
		 * @memberof Video
		 */
		private _setLoop(): void {
			this._videoElement.loop = this.configs.Loop;
		}

		/**
		 * Method that will set the muted attribute
		 *
		 * @private
		 * @memberof Video
		 */
		private _setMuted(): void {
			this._videoElement.muted = this.configs.Muted;
		}

		/**
		 * Method that will set the poster image on video
		 *
		 * @private
		 * @memberof Video
		 */
		private _setPosterUrl(): void {
			if (this.configs.PosterURL !== Constants.EmptyString) {
				this._videoElement.poster = this.configs.PosterURL;
			} else {
				this._videoElement.poster = Constants.EmptyString;
			}
		}

		/**
		 * Method to apply all initial video configs
		 *
		 * @private
		 * @memberof Video
		 */
		private _setVideoConfigs(): void {
			this._setAutoplay();

			this._setControls();

			this._setLoop();

			this._setMuted();

			this._setPosterUrl();

			this._setWidth();

			this._setHeight();

			// Trigger the event of unstarted based on video progress
			if (this._videoElement.currentTime === 0) {
				this._triggerOnStateChangedEvent(Patterns.Video.Enum.VideoStates.Unstarted);
			}
		}

		/**
		 * Method to create the source element
		 *
		 * @private
		 * @memberof Video
		 */
		private _setVideoSource(): void {
			// Get the file extension from URL
			const _urlFileExtension = OSUI.Helper.URL.GetFileTypeFromURL(this.configs.URL);

			if (_urlFileExtension === null) {
				console.warn(`The URL '${this.configs.URL}' is not a valid URL.`);
			}

			// Add class to video source element
			OSUI.Helper.Dom.Styles.AddClass(this._videoSourceElement, Patterns.Video.Enum.CssClass.VideoSource);

			// Set the attributes to video source created
			this._videoSourceElement.src = this.configs.URL;
			this._videoSourceElement.type = Patterns.Video.Enum.VideoAttributes.TypePath + _urlFileExtension;
		}

		/**
		 * Method create the track element
		 *
		 * @private
		 * @memberof Video
		 */
		private _setVideoTrack(): void {
			// Check if contains tracks to be added
			// If true, create the element with all the attributes
			const captionsList = JSON.parse(this.configs.Captions);

			if (captionsList.length > 0) {
				for (const item of captionsList) {
					const trackElement = document.createElement(Patterns.Video.Enum.VideoTags.Track);

					// Add class to track element created
					OSUI.Helper.Dom.Styles.AddClass(trackElement, Patterns.Video.Enum.CssClass.VideoTrack);

					// Set track element attributes
					trackElement.kind = Patterns.Video.Enum.VideoAttributes.Captions;
					trackElement.srclang = item.LanguageCode;
					trackElement.src = item.SourceFile;
					trackElement.label = item.Label;

					// Append the track element into video HTML element
					this.selfElement.appendChild(trackElement);
				}
			}
		}

		/**
		 * Method that will set the Width attribute
		 *
		 * @private
		 * @memberof Video
		 */
		private _setWidth(): void {
			if (this.configs.Width !== Constants.EmptyString) {
				OSUI.Helper.Dom.Attribute.Set(
					this._videoElement,
					Patterns.Video.Enum.VideoAttributes.Width,
					this.configs.Width
				);
			} else {
				OSUI.Helper.Dom.Attribute.Remove(this._videoElement, Patterns.Video.Enum.VideoAttributes.Width);
			}
		}

		/**
		 * Method that triggers the OnStateChanged event
		 *
		 * @private
		 * @param {string} stateChanged value of video state
		 * @memberof Video
		 */
		private _triggerOnStateChangedEvent(stateChanged: string): void {
			if (stateChanged === Patterns.Video.Enum.VideoStates.Unstarted) {
				if (this._videoElement.currentTime === 0) {
					this.triggerPlatformEventCallback(this._platformEventOnStateChanged, stateChanged);
				}
			} else {
				this.triggerPlatformEventCallback(this._platformEventOnStateChanged, stateChanged);
			}

			// Update video state value
			this._videoState = stateChanged;
		}

		/**
		 * Sets the A11Y properties when the pattern is built.
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Video.Video
		 */
		protected setA11YProperties(): void {
			console.log(GlobalEnum.WarningMessages.MethodNotImplemented);
		}

		/**
		 * Sets the callbacks to be used in the pattern.
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Video.Video
		 */
		protected setCallbacks(): void {
			// Check the video time and trigger the event if is 0 with the status Unstarted
			this._videoElement.onplay = this._triggerOnStateChangedEvent.bind(
				this,
				Patterns.Video.Enum.VideoStates.Unstarted
			);

			this._videoElement.onplaying = this._triggerOnStateChangedEvent.bind(
				this,
				Patterns.Video.Enum.VideoStates.OnPlaying
			);

			this._videoElement.onpause = this._triggerOnStateChangedEvent.bind(
				this,
				Patterns.Video.Enum.VideoStates.OnPause
			);
			this._videoElement.onended = this._triggerOnStateChangedEvent.bind(
				this,
				Patterns.Video.Enum.VideoStates.OnEnded
			);
		}

		/**
		 * Set the html references that will be used to manage the cssClasses and atribute properties
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Video.Video
		 */
		protected setHtmlElements(): void {
			// Set the video element
			this._videoElement = this.selfElement as HTMLVideoElement;
			// Create source element
			this._videoSourceElement = document.createElement(Patterns.Video.Enum.VideoTags.Source);

			// Append the created element into video element
			this.selfElement.appendChild(this._videoSourceElement);

			this._setVideoSource();

			this._setVideoConfigs();

			this._setVideoTrack();
		}

		/**
		 * Method to remove all assigned callbacks
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Video.Video
		 */
		protected unsetCallbacks(): void {
			this._platformEventOnStateChanged = undefined;
			this._videoElement.onended = undefined;
			this._videoElement.onpause = undefined;
			this._videoElement.onplay = undefined;
			this._videoElement.onplaying = undefined;
		}

		/**
		 * Release references to HTML elements.
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.Video.Video
		 */
		protected unsetHtmlElements(): void {
			this._videoElement = undefined;
			this._videoSourceElement = undefined;
		}

		/**
		 * Method to build the Video
		 *
		 * @memberof OSFramework.Patterns.Video.Video
		 */
		public build(): void {
			super.build();

			this.setHtmlElements();

			this.setCallbacks();

			this.finishBuild();
		}

		/**
		 * Method to change the value of configs/current state.
		 *
		 * @param {string} propertyName
		 * @param {unknown} propertyValue
		 * @memberof OSFramework.Patterns.Video.Video
		 */
		public changeProperty(propertyName: string, propertyValue: unknown): void {
			super.changeProperty(propertyName, propertyValue);

			if (this.isBuilt) {
				// Check which property changed and call respective method to update it
				switch (propertyName) {
					case Enum.Properties.Autoplay:
						this._setAutoplay();
						break;
					case Enum.Properties.Controls:
						this._setControls();
						break;
					case Enum.Properties.Loop:
						this._setLoop();
						break;
					case Enum.Properties.Muted:
						this._setMuted();
						break;
					case Enum.Properties.PosterURL:
						this._setPosterUrl();
						break;
					case Enum.Properties.URL:
						this._setVideoSource();
						break;
					case Enum.Properties.Width:
						this._setWidth();
						break;
					case Enum.Properties.Height:
						this._setHeight();
						break;
				}
			}
		}

		/**
		 * Method to destroy Video instance
		 *
		 * @memberof OSFramework.Patterns.Video.Video
		 */
		public dispose(): void {
			this.unsetCallbacks();

			this.unsetHtmlElements();

			//Destroying the base of pattern
			super.dispose();
		}

		/**
		 * Method to get video state
		 *
		 * @memberof OSFramework.Patterns.Video.Video
		 */
		public get getVideoState(): string {
			return this._videoState;
		}

		/**
		 * Set callbacks for the pattern
		 *
		 * @param {string} eventName
		 * @param {GlobalCallbacks.OSGeneric} callback
		 @memberof OSFramework.Patterns.Video.Video
		 */
		public registerCallback(eventName: string, callback: GlobalCallbacks.OSGeneric): void {
			switch (eventName) {
				case Patterns.Video.Enum.Events.OnStateChanged:
					if (this._platformEventOnStateChanged === undefined) {
						this._platformEventOnStateChanged = callback;
					} else {
						console.warn(`The ${GlobalEnum.PatternName.Video} already has the state changed callback set.`);
					}
					break;

				default:
					super.registerCallback(eventName, callback);
			}
		}

		/**
		 * Method to set current time
		 *
		 * @param {number} currentTime value in seconds
		 * @memberof Video
		 */
		public setVideoJumpToTime(currentTime: number): void {
			this._videoElement.currentTime = currentTime;
		}

		/**
		 * Method to pause video
		 *
		 * @memberof OSFramework.Patterns.Video.Video
		 */
		public setVideoPause(): void {
			this._videoElement.pause();
		}

		/**
		 * Method to play video
		 *
		 * @memberof OSFramework.Patterns.Video.Video
		 */
		public setVideoPlay(): void {
			this._videoElement.play();
		}
	}
}
