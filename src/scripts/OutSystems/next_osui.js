/* This will be the Scrit that will replace the one that we've now. */

function osuijs() {
	return {
		GetVersion: function () {
			return OutSystems.osuiAPI.GetVersion();
		},
		HideOnScroll: function () {
			return {
				init: () => {
					OutSystems.osuiAPI.HideOnScroll.Init();
				},
			};
		},
		ToggleClass: function (el, state, className) {
			OutSystems.osuiAPI.ToggleClass(el, state, className);
		},
		GetClosest: function (elem, selector) {
			return OutSystems.osuiAPI.GetClosest(elem, selector);
		},
		FixInputs: function () {
			OutSystems.osuiAPI.FixInputs();
		},
		HasMasterDetail: function () {
			OutSystems.osuiAPI.HasMasterDetail();
		},
		StartMWO: function () {
			OutSystems.osuiAPI.StartMadeWithOS();
		},
	};
}

var osui = new osuijs();
