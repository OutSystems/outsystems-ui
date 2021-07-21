var targetNode = document.body;

// Options for the observer (which mutations to observe)
var config = { attributes: true };

// On mutation, run OnInitialize to update Device variable
var callback = function () {
	$actions.OnInitialize();
};

// Create an observer instance linked to the callback function
var observer = new MutationObserver(callback);

// Start observing the target node for configured mutations
observer.observe(targetNode, config);

$parameters.ObserverObject = observer;
