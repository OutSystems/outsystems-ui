// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Event.DOMEvents.Listeners {
	/**
	 * Listener Mananer Class to handle the creation of all eventListeners
	 *
	 * @export
	 * @class ListenerManager
	 * @extends {AbstractEventsManager<Type, string>}
	 */
	export class ListenerManager extends AbstractEventsManager<Type, string> {
		protected getInstanceOfEventType(listenerType: Type): IListener {
			switch (listenerType) {
				case Type.BalloonOnToggle:
					return new BalloonOnToggle();
				case Type.BodyOnClick:
					return new BodyOnClick();
				case Type.BodyOnScroll:
					return new BodyOnScroll();
				case Type.BodyOnMouseDown:
					return new BodyOnMouseDown();
				case Type.WindowResize:
					return new WindowResize();
				case Type.OrientationChange:
					return new OrientationChange();
				case Type.WindowMessage:
					return new WindowMessage();
				default:
					throw new Error(`The listener ${listenerType} is not supported.`);
			}
		}
	}

	/**
	 * Class to create and store the ListenerManager Class
	 *
	 * @export
	 * @class GlobalListenerManager
	 */
	export class GlobalListenerManager {
		private static _listenerManager = new ListenerManager();

		public static get Instance(): ListenerManager {
			return GlobalListenerManager._listenerManager;
		}
	}
}
