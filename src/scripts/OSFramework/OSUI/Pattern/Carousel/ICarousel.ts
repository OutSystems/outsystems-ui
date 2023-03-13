// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.Carousel {
	/**
	 * Defines the interface for OutSystemsUI Carousel Pattern
	 */
	export interface ICarousel extends Interface.IPattern {
		goTo(index: number): void;
		next(): void;
		previous(): void;
		registerCallback(eventName: string, callback: GlobalCallbacks.OSGeneric): void;
		setCarouselDirection(direction: string): void;
		setProviderConfigs(providerConfigs: ProviderConfigs): void;
		setProviderEvent(eventName: string, callback: OSFramework.OSUI.GlobalCallbacks.Generic, uniqueId: string): void;
		toggleDrag(hasDrag: boolean): void;
		toggleOnRender(blockOnRender: boolean): void;
		unsetProviderEvent(eventId: string): void;
		updateOnRender(): void;
	}
}
