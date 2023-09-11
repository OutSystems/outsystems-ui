// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Event.DOMEvents.Listeners {
	/**
	 * Listener Event Types
	 */
	export enum Type {
		BalloonOnToggle = 'balloon.onToggle',
		BodyOnClick = 'body.onclick',
		BodyOnScroll = 'body.onscroll',
		BodyOnMouseDown = 'body.mousedown',
		OrientationChange = 'window.onorientationchange',
		WindowResize = 'window.onresize',
		WindowMessage = 'window.message',
	}
}
