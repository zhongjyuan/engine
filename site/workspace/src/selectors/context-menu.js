import { createSelector } from "reselect";

export const contextMenuOptionsSelector = createSelector(
	(state) => state.contextmenu,
	(contextmenu) => {
		var acount = contextmenu.menus[contextmenu.opts].length;
		var tmpos = {
			top: contextmenu.top,
			left: contextmenu.left,
		};
		var tmpleft = false;

		var wnwidth = window.innerWidth;
		var wnheight = window.innerHeight;

		var ewidth = 312;
		var eheight = acount * 28;

		tmpleft = wnwidth - tmpos.left > 504;
		if (wnwidth - tmpos.left < ewidth) {
			tmpos.left = wnwidth - ewidth;
		}

		if (wnheight - tmpos.top < eheight) {
			tmpos.bottom = wnheight - tmpos.top;
			tmpos.top = null;
		}

		return {
			abpos: tmpos,
			isLeft: tmpleft,
		};
	}
);
