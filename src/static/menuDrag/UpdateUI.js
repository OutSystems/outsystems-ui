var el = document.querySelector('.app-menu-content');

el.style.transform = 'translateX(' + ($parameters.MoveX + $parameters.MenuWidth) + 'px)';
el.style.webkitTransform = 'translateX(' + ($parameters.MoveX + $parameters.MenuWidth) + 'px)';

requestAnimationFrame($actions.UpdateUI);
