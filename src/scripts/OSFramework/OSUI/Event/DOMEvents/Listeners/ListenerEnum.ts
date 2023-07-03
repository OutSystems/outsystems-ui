// eslint-disable-next-line @typescript-eslint/no-unused-vars
<<<<<<<< HEAD:src/scripts/OSFramework/Event/EventEnum.ts
namespace OSFramework.Event {
	export enum Type {
		BodyOnClick = 'body.onclick',
		BodyOnScroll = 'body.onscroll',
		OrientationChange = 'window.onorientationchange',
		SubmenuOpen = 'submenu.open',
========
namespace OSFramework.OSUI.Event.DOMEvents.Listeners {
	/**
	 * Listener Event Types
	 */
	export enum Type {
		BodyOnClick = 'body.onclick',
		BodyOnScroll = 'body.onscroll',
		BodyOnMouseDown = 'body.mousedown',
		OrientationChange = 'window.onorientationchange',
>>>>>>>> origin/rc2.16.0:src/scripts/OSFramework/OSUI/Event/DOMEvents/Listeners/ListenerEnum.ts
		WindowResize = 'window.onresize',
		WindowMessage = 'window.message',
	}
}
