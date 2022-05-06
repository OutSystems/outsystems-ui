// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Event {
	export interface IGestureEvent {
		setTouchEvents(
			onStartCallback: Callbacks.Generic,
			onMoveCallback: Callbacks.Generic,
			onEndCallback?: Callbacks.Generic
		);
	}
}
