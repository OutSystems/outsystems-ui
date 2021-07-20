// Check if is Placeholder to pass Null Values
var isPlaceholder = $parameters.Event.detail.choice.placeholder;
var currentValue = isPlaceholder ? $parameters.NullValue : $parameters.Event.detail.choice.value;
var currentLabel = isPlaceholder ? $parameters.NullText : $parameters.Event.detail.choice.label;

$actions.OnChangeListener(currentValue, currentLabel);
