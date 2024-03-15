function onVisibilityChanged() {
	if (document.hidden || document.mozHidden || document.webkitHidden || document.msHidden) cr_setSuspended(true);
	else cr_setSuspended(false);
}

document.addEventListener("visibilitychange", onVisibilityChanged, false);

document.addEventListener("mozvisibilitychange", onVisibilityChanged, false);

document.addEventListener("webkitvisibilitychange", onVisibilityChanged, false);

document.addEventListener("msvisibilitychange", onVisibilityChanged, false);
