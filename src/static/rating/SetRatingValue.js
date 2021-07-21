var rating = document.getElementById($parameters.WidgetId);
var ratingItems;
var ratingValue = Math.floor($parameters.RatingValue);
var ratingDecimalValue = Math.round(($parameters.RatingValue - Math.floor($parameters.RatingValue)) * 100) / 100;
var isHalfValue = ratingDecimalValue >= 0.3 && ratingDecimalValue <= 0.7 ? true : false;
$parameters.IsHalf = isHalfValue;

// If value is bigger than scale, value is equal to scale
if (ratingValue > $parameters.RatingScale) {
	ratingValue = $parameters.RatingScale;
} else if (ratingValue < 0) {
	ratingValue = 0;
}

if (ratingDecimalValue > $parameters.RatingScale) {
	ratingDecimalValue = $parameters.RatingScale;
} else if (ratingDecimalValue < 0) {
	ratingValue = 0;
}

// Set initial rating
var setInitialRating = (function () {
	ratingItems = rating.querySelectorAll('input');

	if ($parameters.RatingValue !== null) {
		if ($parameters.RatingScale === 1) {
			ratingItems[1].checked = true;
			return;
		}

		if (ratingDecimalValue > 0) {
			if (ratingDecimalValue < 0.3) {
				ratingItems[ratingValue].checked = true;
			} else if (isHalfValue || ratingDecimalValue > 0.7) {
				ratingItems[ratingValue + 1].checked = true;

				if (isHalfValue) {
					rating.classList.add('is-half');
				}
			}
		} else {
			ratingItems[ratingValue].checked = true;
		}
	}
})();
