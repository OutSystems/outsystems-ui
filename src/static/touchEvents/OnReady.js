var touchTrack = new TouchTrack();
$parameters.isBound = false;

var el = document.getElementById($parameters.WidgetId);

if (el) {
	touchTrack.init(el, $actions.OnStart, $actions.OnMove, $actions.OnEnd);
	$parameters.isBound = true;
}

$parameters.Obj = touchTrack;
