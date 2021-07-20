var el = document.getElementById($parameters.Id);
var tabsContent = el.querySelector('.tabs-content-wrapper');

if (tabsContent.classList.contains('no-transition')) {
	tabsContent.classList.remove('no-transition');
}
