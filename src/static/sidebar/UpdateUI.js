var el = document.getElementById($parameters.WidgetId);

el.style.transform = 'translateX(' + $parameters.OffsetX + 'px)';
el.style.webkitTransform = 'translateX(' + $parameters.OffsetX + 'px)';

requestAnimationFrame($actions.UpdateUI);
