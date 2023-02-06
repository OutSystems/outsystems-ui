// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Event {
	export class EventManager extends AbstractEventsManager<Type, string> {
		protected getInstanceOfEventType(eventType: Type): IEvent<string> {
			switch (eventType) {
				case Type.BodyOnClick:
					return new Event.BodyOnClick();
				case Type.BodyOnScroll:
					return new Event.BodyOnScroll();
				case Type.WindowResize:
					return new Event.WindowResize();
				case Type.OrientationChange:
					return new Event.OrientationChange();
				default:
					throw new Error(`The event ${eventType} is not supported.`);
			}
		}
	}

	export class GlobalEventManager {
		private static _eventManager = new EventManager();

		public static get Instance(): EventManager {
			return GlobalEventManager._eventManager;
		}
	}
}
