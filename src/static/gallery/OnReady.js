var root = document.documentElement;
var gallery = document.getElementById($parameters.GalleryId);
var IsEdge = document.body.classList.contains('edge');
var itemsDesktop = $parameters.ColumnsInDesktop;
var itemsTablet = $parameters.ColumnsInTablet;
var itemsPhone = $parameters.ColumnsInPhone;

// Set Items
gallery.style.setProperty('--grid-desktop', itemsDesktop);
gallery.style.setProperty('--grid-tablet', itemsTablet);
gallery.style.setProperty('--grid-phone', itemsPhone);

// Set Gutter
gallery.style.setProperty('--grid-gap', 'var(--space-' + $parameters.GutterSize + ')');

// Fix for Edge, as css calc() doesn't work on all scenarios for this browser
itemsDesktop++;
itemsTablet++;
itemsPhone++;
gallery.style.setProperty('--grid-list-desktop', itemsDesktop);
gallery.style.setProperty('--grid-list-tablet', itemsTablet);
gallery.style.setProperty('--grid-list-phone', itemsPhone);
