// Tooltip Class
function OSUI_ToolTip(opts) {
	// All the public Object info
	var _this = {};

	// properties
	_this.defaultOptions = {
		patternId: '#itemID',
	};

	// private vars & methods
	var _aux = {
		// toogle balloon visibility
		openBalloon: function () {
			// check if there are any tooltip that's opened, if yes, close them
			_aux.closeOpenedTooltips();

			// check if the tooltip has an overflow hidden parentNode or if it's out of viewport
			_aux.testPositionToOpen(_this.tooltipEl.parentElement, _this.tooltipEl_Ballon, _this.tooltipEl_BallonWrapper);

			// toogle is-opened selector
			_this.tooltipEl.classList.toggle('is-opened');
		},

		// close opened tooltips
		closeOpenedTooltips: function () {
			// check for other tooltips opened
			var listOfTooltips = Array.from(document.querySelectorAll('.osui-tooltip.is-opened'));
			for (var i = 0; i < listOfTooltips.length; ++i) {
				outsystems.osui.pattern.tooltip.items[listOfTooltips[i].id].close();
			}
		},

		// add the close balloon behaviour if clicked outside the pattern
		tooltip_windowClick: function (e) {
			// check if the click has been outside of our tooltip
			if (!e.target.closest('.osui-tooltip')) {
				_aux.closeOpenedTooltips();
			}
		},

		// manage if the click event should be added or if has been already there!
		addWindowClickEvent: function () {
			// check if there are not tooltips already in dom where the window click event has been added
			if (!document.querySelector('.osui-tooltip[data-is-added]')) {
				// add a dataSet property that will hep on manage the window event
				_this.tooltipEl.dataset.isAdded = 'true';

				// if don't add the window click event that will be used to close the tooltip!
				window.addEventListener('click', _aux.tooltip_windowClick);
			}
		},

		// recursive function that will be used to check if a given parent element, has overflow hiden, if not check the parents child nodes for an element with the overflow hidden!
		hasOverflowHiddenParentNode: function  (elem) {	
			if(elem === document.body || elem.classList.contains("screen-container")) {
				return false;
			}
			else if(window.getComputedStyle(elem).getPropertyValue("overflow").indexOf("hidden") < 0) {
				if(window.getComputedStyle(elem).getPropertyValue("position").indexOf("fixed") > -1) {
					return false;
				}
				else {
					return _aux.hasOverflowHiddenParentNode(elem.parentElement);
				}
			}
			else {
				return elem;
			}
		},

		// check if the given element item has a class position
		checkIfItemHasPosition: function (elem) {
			var positionsOsUI = ["top", "top-right", "top-left", "right", "bottom", "bottom-left", "bottom-right", "left"];
			for (let i = 0; i < positionsOsUI.length; ++i) {
				if(elem.classList.contains(positionsOsUI[i])) {
					return positionsOsUI[i];
				}
			}
			return false;
		},

		// check if the tooltip ballon is on window edges and will be cutted
		isItemOutOfElementView: function (elem, viewElem) {
			// check if the given elements are not empty
			if(!elem || !viewElem) {
				console.error("Missing some param value at isItemOutOfElementView();");
				return false;
			}

			// Get element's boundings and sizes
			var elemBound = elem.getBoundingClientRect(),
				elemHeight = elem.clientHeight,
				elemWidth = elem.clientWidth,

				viewElemBound = viewElem.getBoundingClientRect()
				viewElemHeight = viewElem.clientHeight,
				viewElemWidth = viewElem.clientWidth;
		
			// Check if it's out of the viewport on each side
			var out = {};
			out.top = elemBound.top < viewElemBound.top;
			out.right = elemBound.right > viewElemBound.right;
			out.bottom = elemBound.bottom > viewElemBound.bottom;
			out.left = elemBound.left < viewElemBound.left;

			// the item is out at top of viewElem but has bigger height, so open it to bottom does not solve the issue!
			if(out.top && elemHeight > viewElemHeight) {
				out.top = false;
			}
			// since it has a smaller height than the viewElem and doesn't fit at top position, check if fits at bottom!
			else if(out.top && Math.abs(elemBound.top - viewElemBound.top) < elemHeight) {
				out.top = false;
			}

			// same as above but in right position
			if(out.right && elemWidth > viewElemWidth) {
				out.right = false;
			}
			// since it has a smaller width than the viewElem and doesn't fit at right position, check if fits at left!
			else if(out.right && Math.abs(elemBound.left - viewElemBound.left) < elemWidth) {
				out.right = false;
			}

			// same as above but regarding bottom position
			if(out.bottom && elemHeight > viewElemHeight) {
				out.bottom = false;
			}
			// since it has a smaller height than the viewElem and doesn't fit at bottom position, check if fits at top!
			else if(out.bottom && Math.abs(elemBound.bottom - viewElemBound.bottom) < elemHeight) {
				out.top = false;
			}

			// same as above but regarding left position
			if(out.left && elemWidth > viewElemWidth) {
				out.bottom = false;
			}
			// since it has a smaller width than the viewElem and doesn't fit at left position, check if fits at right!
			else if(out.left && Math.abs(elemBound.right - viewElemBound.right) < elemWidth) {
				out.right = false;
			}

			// there are no issues with the defined position!
			if (!(out.top || out.left || out.bottom || out.right)) {
				return false;
			}

			// since a position issue has founded, check the new position to the given item
			var openAt = "";

			// is out of top boundary, should open to bottom
			if (out.top) {
				openAt = "bottom";
			
				// is out of top and right boundaries, should open to bottom left
				if(out.right) {
					openAt = "bottom-left";
				}
				// is out of top and left boundaries, should open to bottom right
				else if(out.left) {
					openAt = "bottom-right";
				}
			}

			if (out.right) {
				openAt = "left";
			
				// is out of top and right boundaries
				if(out.top) {
					openAt = "bottom-left";
				}
				// is out of bottom and right boundaries
				else if(out.bottom) {
					openAt = "top-left";
				}
			}

			if (out.bottom) {
				openAt = "top";
			
				// is out of top and right boundaries
				if(out.right) {
					openAt = "top-right";
				}
				// is out of top and left boundaries
				else if(out.left) {
					openAt = "top-left";
				}
			}

			if (out.left) {
				openAt = "right";
			
				// is out of left and right boundaries
				if(out.top) {
					openAt = "bottom-right";
				}
				// is out of bottom and left boundaries
				else if(out.bottom) {
					openAt = "top-right";
				}
			}
			
			return openAt;
		},

		// set the transition end event to the given item
		updatePosOnClose: function (elemTransitionEvent) {
			// check if the given elements are not empty
			if(!elemTransitionEvent) {
				console.error("Missing element at updatePosOnClose();");
				return false;
			}

			_this.tooltipEl_Ballon.addEventListener('transitionend', _aux.checkPosOnClose);
		},

		// update position on close in order to test the proper position to open it after
		checkPosOnClose: function () {
			// remove the transitionend event
			_this.tooltipEl_Ballon.removeEventListener('transitionend', _aux.checkPosOnClose);

			// remove the position class
			_this.tooltipEl_BallonWrapper.classList.remove(_aux.checkIfItemHasPosition(_this.tooltipEl_BallonWrapper));
			
			// check if the element has a default assigned position, if yes assign it
			if(_this.tooltipEl_BallonWrapper.dataset.position !== "") {
				_this.tooltipEl_BallonWrapper.classList.add(_this.tooltipEl_BallonWrapper.dataset.position);
			}

			// test if the default position is the correct one for the element, and if not set the new position!
			_aux.testPositionToOpen(_this.tooltipEl.parentElement, _this.tooltipEl_Ballon, _this.tooltipEl_BallonWrapper);
		},

		// used to check the position where the tooltip must open if it's out of viewport or has an overflow hidden parent
		testPositionToOpen: function (elemWrapper, elemToTestBounds, elemToManagePos) {
			// check if the given elements are not empty
			if(!elemWrapper || !elemToTestBounds || !elemToManagePos) {
				console.error("Missing element at testPositionToOpen();");
				return false;
			}

			// check if there are any parentNode with the overflow hidden property
			var overflowElem = _aux.hasOverflowHiddenParentNode(elemWrapper.parentElement),
				newItemPosition = "";
			
			// check if an parentNode element was found
			if(overflowElem) {
				// check if the element is out of the founded parentNode view boundaries
				newItemPosition = _aux.isItemOutOfElementView(elemToTestBounds, overflowElem);
			}
			else {
				// if there are not a parentNode with the overflow hidden, check the body boudaries
				newItemPosition = _aux.isItemOutOfElementView(elemToTestBounds, document.body);
			}

			// check if the tooltip has already a defined class position
			var checkIfElementPosition = _aux.checkIfItemHasPosition(elemToManagePos);
			
			// check if the old position must be removed!
			if (newItemPosition && checkIfElementPosition && newItemPosition !== checkIfElementPosition) {
				elemToManagePos.classList.remove(checkIfElementPosition);
			}

			// if a new position must be set
			if (newItemPosition) {
				elemToManagePos.classList.add(newItemPosition);
			}
		}

	};

	// destroy method
	_this.destroy = function (isToDeleteElement) {
		// check if there are only one tooltip in dom
		if (document.querySelectorAll('.osui-tooltip').length <= 1) {
			// remove the window click event
			window.removeEventListener('click', _aux.tooltip_windowClick);
		}

		// remove the click event assigned to the tooltipContent
		if (_this.tooltipEl_Content && !_this.tooltipEl.classList.contains('is-hover')) {
			_this.tooltipEl_Content.removeEventListener('click', _aux.openBalloon);
		}

		// if has accessible features - remove the following events
		if (document.querySelector('.has-accessible-features')) {
			_this.tooltipEl_Content.removeEventListener('focus', _this.open);
			_this.tooltipEl_Content.removeEventListener('blur', _this.close);
		}

		// remove the html element if it's to
		if (isToDeleteElement === true) {
			_this.tooltipEl.parentElement.remove();
		}

		// delete this instance from osui api
		delete outsystems.osui.pattern.tooltip.items[_this.defaultOptions.patternId];

		// after clean all the pending properties, clean the global obj
		_this = null;
	};

	// open tooltip dynamically
	_this.open = function () {
		if (!_this.tooltipEl.classList.contains('is-opened')) {
			// check if the tooltip has an overflow hidden parentNode or if it's out of viewport
			_aux.testPositionToOpen(_this.tooltipEl.parentElement, _this.tooltipEl_Ballon, _this.tooltipEl_BallonWrapper);

			_this.tooltipEl.classList.add('is-opened');
		}
	};

	// close tooltip dynamically
	_this.close = function () {
		if (_this.tooltipEl.classList.contains('is-opened')) {
			_this.tooltipEl.classList.remove('is-opened');
			
			if (!_this.tooltipEl.classList.contains('is-hover')) {
				_aux.updatePosOnClose(_this.tooltipEl_Ballon);
			}
		}
	};

	// init
	_this.init = function (opts) {
		// update defaultOptions values
		for (var i = 0; i < Object.keys(opts).length; ++i) {
			if (_this.defaultOptions[Object.keys(opts)[i]]) {
				_this.defaultOptions[Object.keys(opts)[i]] = opts[Object.keys(opts)[i]];
			}
		}

		// pattern elements
		_this.tooltipEl = document.getElementById(_this.defaultOptions.patternId);

		// If the element doesn't exits
		if (!_this.tooltipEl) {
			console.log("The Element with the given id '" + _this.defaultOptions.patternId + "' doesn't exist!");
			return false;
		}

		// assign this instance to the HTML Object
		_this.tooltipEl.api = _this;

		// create or update this instance into osui api with html element
		outsystems.osui.pattern.tooltip.items[_this.defaultOptions.patternId] = _this;

		// assign the other tooltip elements
		_this.tooltipEl_Content = _this.tooltipEl.querySelector('.osui-tooltip_content');
		_this.tooltipEl_BallonWrapper = _this.tooltipEl.querySelector('.osui-tooltip_balloon-wrapper');
		_this.tooltipEl_Ballon = _this.tooltipEl.querySelector('.osui-tooltip_balloon');

		// check if the tooltip has an overflow hidden parentNode or if it's out of viewport
		_aux.testPositionToOpen(_this.tooltipEl.parentElement, _this.tooltipEl_Ballon, _this.tooltipEl_BallonWrapper);

		// check if it has an hover or click trigger behaviour
		if (!_this.tooltipEl.classList.contains('is-hover')) {
			// add the event click to trigger the tooltip
			_this.tooltipEl_Content.addEventListener('click', _aux.openBalloon);

			// add the window click event to manage the close balloon behaviour
			_aux.addWindowClickEvent();
		}

		// check if the accessible features are enabled
		if (document.querySelector('.has-accessible-features')) {
			// add the focus event in order to show the tooltip ballon when the toolTip content is focused
			_this.tooltipEl_Content.addEventListener('focus', _this.open);
			_this.tooltipEl_Content.addEventListener('blur', _this.close);
		}
	};

	// trigger the init method if 'opts' param not empty
	if (opts) {
		_this.init(opts);
	}

	// return all the 'public' stuff
	return _this;
}

/* ------------------------------------------------------------------------------- */

// check if the tooltip object is present on the osui pattern already
window.outsystems = window.outsystems || {};
outsystems.osui = outsystems.osui || {};
outsystems.osui.pattern = outsystems.osui.pattern || {};
outsystems.osui.pattern.tooltip = outsystems.osui.pattern.tooltip || {};
outsystems.osui.pattern.tooltip.api = OSUI_ToolTip;
outsystems.osui.pattern.tooltip.items = outsystems.osui.pattern.tooltip.items || {};

// Development Stuff -------------------------------------------------------------------------------

// Demo a function that will be used as a client action trigger
function myClientActionDemo() {
	console.log('Trigger client action stuff!');
}

// Demo All the initialized process
setTimeout(function () {
	console.clear();

	var tooltipIds = ['b3-Tooltip', 'b4-Tooltip', 'b5-Tooltip', 'b6-Tooltip'];

	// add the multiple instances
	for (var i = 0; i < tooltipIds.length; ++i) {
		outsystems.osui.pattern.tooltip.items[tooltipIds[i]] = new OSUI_ToolTip({
			patternId: tooltipIds[i],
		});
	}
}, 1500);
