//target element that we will observe
var target = document.documentElement;

//Define observer configurations
var config = {
	attributeFilter: ['lang'],
	attributeOldValue: true,
	characterData: false,
	characterDataOldValue: false,
	childList: false,
	subtree: false,
};

//Call update action to apply new values on datepicker only when lang changed
function updateDatepicker(mutations) {
	if (mutations[0].oldValue !== document.documentElement.lang) {
		switch (mutations[0].type) {
			case 'attributes':
				switch (mutations[0].attributeName) {
					case 'lang':
						$actions.OnParametersChanged();
						break;
				}
				break;
		}
	}
}

//instantiating observer
var observer = new MutationObserver(updateDatepicker);

//observing target
observer.observe(target, config);
