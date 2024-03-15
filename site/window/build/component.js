/**
 * 引入右侧菜单组件
 */
require("../src/components/custom/context-menu/context-menu.js");
require("../src/components/custom/context-menu/context-menu.css");

/**
 * 引入取色器组件
 */
require("../src/components/custom/color-picker/color-picker.js");
require("../src/components/custom/color-picker/color-picker.css");

/**
 * 引入日历组件
 */
require("../src/components/custom/calendar/calendar.js");
require("../src/components/custom/calendar/calendar.css");

import VueGridLayout from "../src/components/custom/grid-layout/vue-grid-layout-2.1.11.min";
import icon from "../src/components/custom/core/icon.vue";
import menuItem from "../src/components/custom/core/menu-item.vue";
import menu from "../src/components/custom/core/menu.vue";
import desktop from "../src/components/custom/core/desktop.vue";
import bar from "../src/components/custom/core/bar.vue";
import startMenu from "../src/components/custom/core/start-menu.vue";
import operateCenter from "../src/components/custom/core/operate-center.vue";
import shortcutSetting from "../src/components/custom/core/shortcut-setting.vue";
import messagePreview from "../src/components/custom/core/message-preview.vue";
import systemAppManage from "../src/components/custom/core/system-app-manage.vue";
import systemThemeColor from "../src/components/custom/core/system-theme-color.vue";
import systemWallpaperManage from "../src/components/custom/core/system-wallpaper-manage.vue";
import systemOtherManage from "../src/components/custom/core/system-other-manage.vue";
import systemDataManage from "../src/components/custom/core/system-data-manage.vue";
import systemAboutUs from "../src/components/custom/core/system-about-us.vue";
if (typeof Vue !== "undefined") {
	/**
	 * 注册网格布局组件
	 */
	Vue.component("win-tile-layout", VueGridLayout.GridLayout);
	Vue.component("win-tile-item", VueGridLayout.GridItem);

	/**
	 * 注册图标组件
	 */
	Vue.component("win-icon", icon);

	/**
	 * 注册菜单项组件
	 */
	Vue.component("win-menu-item", menuItem);

	/**
	 * 注册菜单组件
	 */
	Vue.component("win-menu", menu);

	/**
	 * 注册桌面组件
	 */
	Vue.component("win-desktop", desktop);

	/**
	 * 注册任务栏组件
	 */
	Vue.component("win-bar", bar);

	/**
	 * 注册开始菜单盒子组件
	 */
	Vue.component("win-start-menu", startMenu);

	/**
	 * 注册操作中心组件
	 */
	Vue.component("win-operate-center", operateCenter);

	/**
	 * 注册快捷方式设置组件
	 */
	Vue.component("win-shortcut-setting", shortcutSetting);

	/**
	 * 注册消息预览组件
	 */
	Vue.component("win-message-preview", messagePreview);

	/**
	 * 注册系统设置-应用管理组件
	 */
	Vue.component("system-app-manage", systemAppManage);

	/**
	 * 注册系统设置-主题颜色组件
	 */
	Vue.component("system-theme-color", systemThemeColor);

	/**
	 * 注册系统设置-壁纸管理组件
	 */
	Vue.component("system-wallpaper-manage", systemWallpaperManage);

	/**
	 * 注册系统设置-其他管理组件
	 */
	Vue.component("system-other-manage", systemOtherManage);

	/**
	 * 注册系统设置-数据管理组件
	 */
	Vue.component("system-data-manage", systemDataManage);

	/**
	 * 注册系统设置-关于我们组件
	 */
	Vue.component("system-about-us", systemAboutUs);
}
