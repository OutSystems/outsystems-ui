namespace OSUIFramework.Event {
	export class EventManager extends AbstractEventsManager<Type, string> {
		protected getInstanceOfEventType(eventType: Type): IEvent<string> {
			switch (eventType) {
				case Type.NotificationOpen:
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
					return new OSUIFramework.Patterns.Notification.Open();
				case Type.SubmenuOpen:
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
					return new OSUIFramework.Patterns.Submenu.Open();
				case Type.BodyOnClick:
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
					return new OSUIFramework.Event.BodyOnClick();
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
