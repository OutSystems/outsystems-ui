var getTotalPages = $parameters.TotalCount / $parameters.MaxRecords;

if (getTotalPages == Math.floor(getTotalPages)) {
	$parameters.TotalPages = getTotalPages - 1;
} else {
	$parameters.TotalPages = getTotalPages;
}
