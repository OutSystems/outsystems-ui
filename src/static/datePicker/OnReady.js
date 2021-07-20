var field = document.getElementById($parameters.InputWidgetid);
var fieldType;

if (field && field.type !== undefined) {
	$parameters.FieldType = field.type;
}
