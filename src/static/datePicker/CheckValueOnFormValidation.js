var obj = $parameters.Obj;
var field = $parameters.Obj._o.field;
var dateFormat = $parameters.DateFormat;
var selectedDate = $parameters.SelectedDate;

if (field) {
	field.value = $parameters.IsNull ? '' : moment(new Date(selectedDate)).format(dateFormat);
}
