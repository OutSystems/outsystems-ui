var mouseTrack = new MouseTrack();
$parameters.isBound = false;

var el = document.getElementById($parameters.WidgetId);

if (el) {
	mouseTrack.init(el, $actions.OnStart, $actions.OnMove, $actions.OnEnd);
	mouseTrack.setPreventDefault($parameters.PreventDefaults);
	$parameters.isBound = true;
}

$parameters.Obj = mouseTrack;
