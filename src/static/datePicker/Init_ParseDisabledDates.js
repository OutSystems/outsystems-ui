var events = JSON.parse($parameters.EventList);

$parameters.Events = [];

for (var i = 0; i < events.length; i++) {
	var day = new Date(events[i]).toDateString();
	$parameters.Events.push(day);
}

$parameters.Events = $parameters.Events.toString();
