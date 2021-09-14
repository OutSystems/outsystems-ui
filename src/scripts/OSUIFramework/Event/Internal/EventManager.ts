namespace OSUIFramework.Event.Internal {
	export class EventManager extends AbstractEventsManager<Events, string> {
		protected getInstanceOfEventType(eventType: Events): IEvent<string> {
			switch (eventType) {
				case Events.SubmenuOpen:
					return new OSUIFramework.Patterns.Submenu.Event.Open();
			}

			// throw new Error('Method not implemented.');
		}
	}
	const eventManager = new EventManager();
	export function GetEventManagerInstance(): EventManager {
		return eventManager;
	}
}
