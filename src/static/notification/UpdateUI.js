requestAnimationFrame($actions.UpdateUI);

var el = document.getElementById($parameters.Id);

el.style.transform = 'translateY(' + $parameters.OffsetY + 'px) translateZ(0)';
el.style.webkitTransform = 'translateY(' + $parameters.OffsetY + 'px) translateZ(0)';
