var tabsNumber = 0;
var el = document.getElementById($parameters.Id);
var tabsChildren = el.querySelector('.tabs-header').children;
var tabsContent = el.querySelector('.tabs-content-wrapper');
var isRTL = document.querySelector('.is-rtl');
var tabsHeaderList = el.querySelector('.tabs-header .list.list-group');

if (tabsHeaderList) {
	tabsChildren = el.querySelector('.tabs-header .list.list-group').children;
}

for (var i = 0; i < tabsChildren.length; i++) {
	if (tabsChildren[i].innerHTML !== '') {
		tabsNumber++;
	}
}

$parameters.Width = el.offsetWidth;
$parameters.TabsNumber = tabsNumber;

if (isRTL) {
	$parameters.IsRTL = true;
}

tabsContent.classList.add('no-transition');
