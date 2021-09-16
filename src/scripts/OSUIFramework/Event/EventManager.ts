namespace OSUIFramework.Event {
	export class EventManager extends AbstractEventsManager<Type, string> {
		protected getInstanceOfEventType(eventType: Type): IEvent<string> {
			switch (eventType) {
				case Type.SubmenuOpen:
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
					return new OSUIFramework.Patterns.Submenu.Open();
				case Type.BodyOnClick:
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
					return new OSUIFramework.Layout.BodyOnClick();
			}

			// throw new Error('Method not implemented.');
		}
	}

	export class GlobalEventManager {
		private static _eventManager = new EventManager();

		public static get Instance(): EventManager {
			return GlobalEventManager._eventManager;
		}
	}
}
