requestAnimationFrame(function () {
	var elTrans = 0;
	var elZindex = 5;
	var elScale = 1;
	var elOpac = 1;
	var elTransTop = $parameters.Items;
	var elTransInc = $parameters.ElementsMargin;

	for (i = $parameters.CurrentPosition; i < $parameters.CurrentPosition + $parameters.Items; i++) {
		if ($parameters.ListElNodesObj[i]) {
			if ($parameters.StackedOptions === 'Top') {
				$parameters.ListElNodesObj[i].classList.add(
					'stackedcards-top',
					'stackedcards--animatable',
					'stackedcards-origin-top'
				);

				if ($parameters.UseOverlays) {
					$parameters.LeftObj.classList.add('stackedcards-origin-top');
					$parameters.RightObj.classList.add('stackedcards-origin-top');
					$parameters.TopObj.classList.add('stackedcards-origin-top');
				}

				elTrans = elTransInc * elTransTop;
				elTransTop--;
			} else if ($parameters.StackedOptions === 'Bottom') {
				$parameters.ListElNodesObj[i].classList.add(
					'stackedcards-bottom',
					'stackedcards--animatable',
					'stackedcards-origin-bottom'
				);

				if ($parameters.UseOverlays) {
					$parameters.LeftObj.classList.add('stackedcards-origin-bottom');
					$parameters.RightObj.classList.add('stackedcards-origin-bottom');
					$parameters.TopObj.classList.add('stackedcards-origin-bottom');
				}

				elTrans = elTrans + elTransInc;
			} else {
				$parameters.ListElNodesObj[i].classList.add('stackedcards-none', 'stackedcards--animatable');
				elTrans = elTrans + elTransInc;
			}

			$parameters.ListElNodesObj[i].style.transform =
				'scale(' + elScale + ') translateX(0) translateY(' + (elTrans - elTransInc) + 'px) translateZ(0)';
			$parameters.ListElNodesObj[i].style.webkitTransform =
				'scale(' + elScale + ') translateX(0) translateY(' + (elTrans - elTransInc) + 'px) translateZ(0)';
			$parameters.ListElNodesObj[i].style.opacity = elOpac;
			$parameters.ListElNodesObj[i].style.zIndex = elZindex;

			elScale = elScale - 0.04;
			elOpac = elOpac - 1 / $parameters.Items;
			elZindex--;
		}
	}
});
