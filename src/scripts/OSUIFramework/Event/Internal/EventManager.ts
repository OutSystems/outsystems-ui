namespace OSUIFramework.Event.Internal {
	export class EventManager extends AbstractEventsManager<Triggers, string> {
		protected getInstanceOfEventType(eventType: Triggers): IEvent<string> {
			switch (eventType) {
				case Triggers.SubmenuOpen:
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
					return new OSUIFramework.Patterns.Submenu.Event.Open();
			}

			// throw new Error('Method not implemented.');
		}
	}

	export class GlobalEventManager {
		private static _eventManager = new EventManager();

		public static instance(): EventManager {
			return GlobalEventManager._eventManager;
		}
	}
}
