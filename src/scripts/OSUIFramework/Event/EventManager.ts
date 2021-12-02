// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Event {
	export class EventManager extends AbstractEventsManager<Type, string> {
		protected getInstanceOfEventType(eventType: Type): IEvent<string> {
			switch (eventType) {
				case Type.NotificationOpen:
					return new Patterns.Notification.Open();
				case Type.SubmenuOpen:
					return new Patterns.Submenu.Open();
				case Type.BodyOnClick:
					return new Event.BodyOnClick();
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
