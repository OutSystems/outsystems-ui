var tab = document.getElementById($parameters.TabsId);
var headerTabs = tab.querySelector('.tabs-header');

var tabHeader = headerTabs.querySelector("[data-tab = '" + $parameters.ActiveTab + "']");

tabHeader.classList.remove('active');
