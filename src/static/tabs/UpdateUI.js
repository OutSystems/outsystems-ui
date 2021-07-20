var el = document.getElementById($parameters.Id).querySelector('.tabs-content-wrapper');

el.style.transform = 'translateX(' + $parameters.OffsetX + 'px)';
el.style.webkitTransform = 'translateX(' + $parameters.OffsetX + 'px)';

requestAnimationFrame($actions.UpdateUI);
