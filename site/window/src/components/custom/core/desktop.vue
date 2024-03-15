<template>
	<!--桌面 图标 抽屉 窗体-->
	<div class="desktop" :style="desktop_style">
		<!--图标-->
		<div
			class="shortcut"
			:class="shortcut_class(shortcutId, shortcut)"
			:style="shortcut_style(shortcutId, null)"
			:key="shortcutId"
			:title="shortcut.title"
			v-show="runtime.shortcutsShow"
			v-for="(shortcut, shortcutId) in shortcuts"
			@mousedown="shortcut_mouse_down(shortcutId, null, $event)"
			@touchstart="shortcut_mouse_down(shortcutId, null, $event)"
			@contextmenu.prevent="shortcut_context_menu(shortcutId, null, $event)"
		>
			<win-icon
				:badge_text="badge_text"
				:icon="apps[shortcut.app].icon"
				:badge="apps[shortcut.app].badge"
				v-if="!shortcut.children"
				@onImageError="image_error"
			>
			</win-icon>

			<div class="icon-drawer" v-if="shortcut.children">
				<template v-for="(shortcutChildren, childrenId) in shortcut.children">
					<win-icon
						class="icon-drawer-pre"
						:badge_text="badge_text"
						:icon="apps[shortcutChildren.app].icon"
						:badge="0"
						:drawer="true"
						@onImageError="image_error"
					>
					</win-icon>
				</template>

				<div class="badge" v-show="shortcut_drawer_stat_badge(shortcutId)">
					{{ badge_text(shortcut_drawer_stat_badge(shortcutId)) }}
				</div>
			</div>

			<div class="title">{{ shortcut.title }}</div>
		</div>

		<!--抽屉渲染-->
		<transition name="opacity">
			<div class="shader" style="z-index: 999999" v-if="shortcuts[drawer]" @mousedown.self="drawer_mouse_down">
				<div class="drawer">
					<div class="mask" :style="background_theme_color"></div>
					<div class="title">{{ shortcuts[drawer].title }}</div>
					<div
						class="shortcut"
						:class="shortcut_class(shortcutId, shortcut, true)"
						:style="shortcut_drawer_style(shortcut)"
						:title="shortcut.title"
						:key="shortcutId"
						v-for="(shortcut, shortcutId) in shortcuts[drawer].children"
						@mousedown="shortcut_mouse_down(shortcutId, drawer, $event)"
						@touchstart="shortcut_mouse_down(shortcutId, drawer, $event)"
						@contextmenu.prevent="shortcut_context_menu(shortcutId, drawer, $event, true)"
					>
						<win-icon
							:badge_text="badge_text"
							:icon="apps[shortcut.app].icon"
							:badge="apps[shortcut.app].badge"
							v-if="!shortcut.drawer"
							@onImageError="image_error"
						>
						</win-icon>

						<div class="title">{{ shortcut.title }}</div>
					</div>
				</div>
			</div>
		</transition>

		<!--窗体渲染-->
		<transition-group name="opacity">
			<div
				class="win shadow"
				:class="win_class(winId)"
				:style="win_style(winId)"
				:id="winId"
				:key="win.iframeId"
				v-show="!win.min"
				v-for="(win, winId) in wins"
				@mousedown="win_set_active(winId)"
			>
				<div class="init" :style="win_init_style(win)" v-if="!win.plugin && win.init">
					<win-icon :style="win_icon_style(winId)" :badge_text="badge_text" :icon="win.icon" :badge="0" @onImageError="image_error"></win-icon>

					<div class="load" v-if="runtime.isSmallScreen">
						<div class="k-line k-line6b-1"></div>
						<div class="k-line k-line6b-2"></div>
						<div class="k-line k-line6b-3"></div>
						<div class="k-line k-line6b-4"></div>
						<div class="k-line k-line6b-5"></div>
					</div>

					<div class="load" v-else>
						<div class="k-line2 k-line12-1"></div>
						<div class="k-line2 k-line12-2"></div>
						<div class="k-line2 k-line12-3"></div>
						<div class="k-line2 k-line12-4"></div>
						<div class="k-line2 k-line12-5"></div>
						<div class="k-line2 k-line12-6"></div>
						<div class="k-line2 k-line12-7"></div>
						<div class="k-line2 k-line12-8"></div>
					</div>
				</div>

				<div class="bar-box">
					<div class="bar" :class="win_bar_class(win)">
						<div class="mask bar-mask"></div>
						<div class="mask" :style="win_bar_mask_style(win)"></div>

						<!--标题栏-->
						<div
							class="title"
							:title="win.title"
							@dblclick="win_title_double_click(winId)"
							@mousedown="win_title_mouse_down(winId, $event)"
							@touchstart="win_title_mouse_down(winId, $event)"
							@contextmenu.prevent="win_context_menu(winId, $event)"
						>
							<win-icon :badge_text="badge_text" :icon="win.icon" @onImageError="image_error"></win-icon>
							{{ win.title }}
						</div>

						<div class="tools">
							<span class="tool" style="background-image: url('./assets/icon/minimize.svg')" @click="win_minimize(winId)"></span>
							<span
								class="tool"
								style="background-image: url('./assets/icon/maximize.svg')"
								v-if="!win.plugin && win.state === 'normal' && win.resizable && !runtime.isSmallScreen"
								@click="win_maximize(winId)"
							></span>
							<span
								class="tool"
								style="background-image: url('./assets/icon/restore.svg')"
								v-if="!win.plugin && win.state === 'max' && !runtime.isSmallScreen"
								@click="win_restore(winId)"
							></span>
							<span class="tool close" style="background-image: url('./assets/icon/close.svg')" @click="win_close(winId)"></span>
							<div style="clear: both"></div>
						</div>

						<div style="clear: both"></div>
					</div>

					<div class="address-bar" v-show="win.addressBar">
						<i class="btns fa fa-fw fa-arrow-left" :class="{ disable: !win_urlbar_back_available(winId) }" @click="win_urlbar_back(winId)"></i>
						<i class="btns fa fa-fw fa-arrow-right" :class="{ disable: !win_urlbar_forward_available(winId) }" @click="win_urlbar_forward(winId)"></i>
						<i class="btns fa fa-fw fa-rotate-right" :class="{ disable: !win.childSupport }" @click="!win.childSupport || win_refresh(winId)"></i>
						<i class="btns fa fa-fw fa-home" @click="win_home(winId)"></i>

						<input spellcheck="false" v-model="win.urlBar" @keyup.enter="win.url = win.urlBar" />
					</div>
				</div>

				<div class="win-drag-placeholder">
					<div class="mask" style="z-index: 2" v-show="runtime.drag"></div>
					<iframe class="frm" :id="win.iframeId" :name="winId" :src="win.url"></iframe>
					<div class="win-resize" v-show="win.resizable" @mousedown="win_resize_mouse_down(winId, $event)"></div>
					<div
						class="win-move"
						@mousedown="win_title_mouse_down(winId, $event)"
						@touchstart="win_title_mouse_down(winId, $event)"
						@contextmenu.prevent="win_context_menu(winId, $event)"
					></div>
				</div>
			</div>
		</transition-group>

		<!--背景图-->
		<div
			class="background-mask"
			@click.self="desktop_click"
			@mousedown.self="desktop_mouse_down"
			@mouseup.self="desktop_mouse_up"
			@mousemove.self="desktop_mouse_move"
			@contextmenu.prevent.self="desktop_context_menu"
		></div>
		<div class="background" :class="background_class" :style="background_style"></div>
	</div>
</template>

<script>
	export default {
		name: "win-desktop",
		props: [
			"runtime",
			"drawer",
			"configs",
			"apps",
			"shortcuts",
			"wins",
			"badge_text",
			"background_class",
			"background_style",
			"background_theme_color",
			"desktop_style",
			"shortcut_class",
			"shortcut_style",
			"shortcut_drawer_style",
			"win_class",
			"win_style",
			"win_icon_style",
			"win_init_style",
			"win_bar_class",
			"win_bar_mask_style",
		],
		data: function() {
			return {
				runtime: {},
				drawer: false,
				configs: {},
				apps: [],
				shortcuts: [],
				wins: [],
			};
		},
		watch: {
			runtime: {
				handler(newVal, oldVal) {
					if (newVal !== oldVal) ZHONGJYUAN.logger.trace("vue.desktop.[watch] runtime: ${0} => ${1}", JSON.stringify(oldVal), JSON.stringify(newVal));
				},
				deep: true,
			},
			drawer: {
				handler(newVal, oldVal) {
					if (newVal !== oldVal) ZHONGJYUAN.logger.trace("vue.desktop.[watch] drawer: ${0} => ${1}", oldVal, newVal);
				},
			},
			configs: {
				handler(newVal, oldVal) {
					if (newVal !== oldVal) ZHONGJYUAN.logger.trace("vue.desktop.[watch] configs: ${0} => ${1}", JSON.stringify(oldVal), JSON.stringify(newVal));
				},
				deep: true,
			},
			apps: {
				handler(newVal, oldVal) {
					if (newVal !== oldVal) ZHONGJYUAN.logger.trace("vue.desktop.[watch] apps: ${0} => ${1}", JSON.stringify(oldVal), JSON.stringify(newVal));
				},
				deep: true,
			},
			shortcuts: {
				handler(newVal, oldVal) {
					if (newVal !== oldVal)
						ZHONGJYUAN.logger.trace("vue.desktop.[watch] shortcuts: ${0} => ${1}", JSON.stringify(oldVal), JSON.stringify(newVal));
				},
				deep: true,
			},
			wins: {
				handler(newVal, oldVal) {
					if (newVal !== oldVal) ZHONGJYUAN.logger.trace("vue.desktop.[watch] wins: ${0} => ${1}", JSON.stringify(oldVal), JSON.stringify(newVal));
				},
				deep: true,
			},
		},
		methods: {
			image_error: function(element) {
				this.$emit("onImageError", element);
			},
			/**
			 * 窗体横栏最大化工具显示
			 * @author zhongjyuan
			 * @date 2023年6月2日16:15:06
			 * @email  zhongjyuan@outlook.com
			 * @param {*} win 窗体对象
			 */
			win_bar_tool_maximize_show: function(win) {
				ZHONGJYUAN.logger.trace("vue.desktop.[win_bar_tool_maximize_show]");
				var that = this;
				return !win.plugin && win.state === "normal" && win.resizable && !that.runtime.isSmallScreen;
			},

			/**
			 * 窗体横栏还原工具显示
			 * @author zhongjyuan
			 * @date 2023年6月2日16:15:10
			 * @email  zhongjyuan@outlook.com
			 * @param {*} win 窗体对象
			 */
			win_bar_tool_restore_show: function(win) {
				ZHONGJYUAN.logger.trace("vue.desktop.[win_bar_tool_restore_show]");
				var that = this;
				return !win.plugin && win.state === "max" && !that.runtime.isSmallScreen;
			},

			/**
			 * 快捷方式抽屉按下
			 * @author zhongjyuan
			 * @date 2023年5月31日11:15:45
			 * @email  zhongjyuan@outlook.com
			 */
			drawer_mouse_down: function() {
				this.$emit("onDrawerMouseDown");
			},

			/**
			 * 桌面点击
			 * @author zhongjyuan
			 * @date 2023年5月31日11:16:13
			 * @email  zhongjyuan@outlook.com
			 * @param {*} $event 事件对象
			 */
			desktop_click: function($event) {
				this.$emit("onDesktopClick", $event);
			},

			/**
			 * 桌面鼠标松开
			 * @author zhongjyuan
			 * @date 2023年5月31日11:16:46
			 * @email  zhongjyuan@outlook.com
			 * @param {*} $event 事件对象
			 */
			desktop_mouse_up: function($event) {
				this.$emit("onDesktopMouseUp", $event);
			},

			/**
			 * 桌面鼠标按下
			 * @author zhongjyuan
			 * @date 2023年5月31日11:17:13
			 * @email  zhongjyuan@outlook.com
			 * @param {*} $event 事件对象
			 */
			desktop_mouse_down: function($event) {
				this.$emit("onDesktopMouseDown", $event);
			},

			/**
			 * 桌面鼠标移动
			 * @author zhongjyuan
			 * @date 2023年5月31日11:17:38
			 * @email  zhongjyuan@outlook.com
			 * @param {*} $event 事件对象
			 */
			desktop_mouse_move: function($event) {
				this.$emit("onDesktopMouseMove", $event);
			},

			/**
			 * 桌面右侧菜单
			 * @author zhongjyuan
			 * @date 2023年5月31日11:18:00
			 * @email  zhongjyuan@outlook.com
			 * @param {*} $event 事件对象
			 */
			desktop_context_menu: function($event) {
				this.$emit("onDesktopContextMenu", $event);
			},

			/**
			 * 快捷方式鼠标按下
			 * @author zhongjyuan
			 * @date 2023年5月31日11:18:31
			 * @email  zhongjyuan@outlook.com
			 * @param {*} id 主键
			 * @param {*} pid 父级主键
			 * @param {*} $event 事件对象
			 */
			shortcut_mouse_down: function(id, pid, $event) {
				this.$emit("onShortcutMouseDown", id, pid, $event);
			},

			/**
			 * 快捷方式右侧菜单
			 * @author zhongjyuan
			 * @date 2023年5月31日11:19:12
			 * @email  zhongjyuan@outlook.com
			 * @param {*} id 主键
			 * @param {*} pid 父级主键
			 * @param {*} $event 事件对象
			 * @param {*} fromDrawer 是否来自抽屉
			 */
			shortcut_context_menu: function(id, pid, $event, fromDrawer) {
				this.$emit("onShortcutContextMenu", id, pid, $event, fromDrawer);
			},

			/**
			 * 快捷方式统计角标(抽屉)
			 * @author zhongjyuan
			 * @date 2023年5月31日11:20:14
			 * @email  zhongjyuan@outlook.com
			 * @param {*} id 主键
			 */
			shortcut_drawer_stat_badge: function(id) {
				this.$emit("onShortcutDrawerStatBadge", id);
			},

			/**
			 * 窗体首页
			 * @author zhongjyuan
			 * @date 2023年5月31日11:20:45
			 * @email  zhongjyuan@outlook.com
			 * @param {*} id 主键
			 */
			win_home: function(id) {
				this.$emit("onWinHome", id);
			},

			/**
			 * 窗体关闭
			 * @author zhongjyuan
			 * @date 2023年5月31日11:21:06
			 * @email  zhongjyuan@outlook.com
			 * @param {*} id 主键
			 */
			win_close: function(id) {
				this.$emit("onWinClose", id);
			},

			/**
			 * 窗体刷新
			 * @author zhongjyuan
			 * @date 2023年5月31日11:22:11
			 * @email  zhongjyuan@outlook.com
			 * @param {*} id 主键
			 */
			win_refresh: function(id) {
				this.$emit("onWinRefresh", id);
			},

			/**
			 * 窗体还原
			 * @author zhongjyuan
			 * @date 2023年5月31日11:22:37
			 * @email  zhongjyuan@outlook.com
			 * @param {*} id 主键
			 */
			win_restore: function(id) {
				this.$emit("onWinRestore", id);
			},

			/**
			 * 窗体最小化
			 * @author zhongjyuan
			 * @date 2023年5月31日11:22:58
			 * @email  zhongjyuan@outlook.com
			 * @param {*} id 主键
			 */
			win_minimize: function(id) {
				this.$emit("onWinMinimize", id);
			},

			/**
			 * 窗体最大化
			 * @author zhongjyuan
			 * @date 2023年5月31日11:23:24
			 * @email  zhongjyuan@outlook.com
			 * @param {*} id 主键
			 */
			win_maximize: function(id) {
				this.$emit("onWinMaximize", id);
			},

			/**
			 * 窗体是否最小化
			 * @author zhongjyuan
			 * @date 2023年5月31日11:25:46
			 * @email  zhongjyuan@outlook.com
			 * @param {*} id 主键
			 */
			win_is_minimize: function(id) {
				this.$emit("onWinIsMinimize", id);
			},

			/**
			 * 设置活动窗体
			 * @author zhongjyuan
			 * @date 2023年5月31日11:26:10
			 * @email  zhongjyuan@outlook.com
			 * @param {*} id 主键
			 */
			win_set_active: function(id) {
				this.$emit("onWinSetActive", id);
			},

			/**
			 * 窗体右侧菜单
			 * @author zhongjyuan
			 * @date 2023年5月31日11:26:34
			 * @email  zhongjyuan@outlook.com
			 * @param {*} id 主键
			 * @param {*} $event 事件对象
			 */
			win_context_menu: function(id, $event) {
				this.$emit("onWinContextMenu", id, $event);
			},

			/**
			 * 窗体大小鼠标按下
			 * @author zhognjyuan
			 * @date 2023年5月31日11:28:21
			 * @email  zhongjyuan@outlook.com
			 * @param {*} id 主键
			 * @param {*} $event 事件对象
			 */
			win_resize_mouse_down: function(id, $event) {
				this.$emit("onWinResizeMouseDown", id, $event);
			},

			/**
			 * 窗体标题鼠标按下
			 * @author zhongjyuan
			 * @date 2023年5月31日11:27:33
			 * @email  zhongjyuan@outlook.com
			 * @param {*} id 主键
			 * @param {*} $event 事件对象
			 */
			win_title_mouse_down: function(id, $event) {
				this.$emit("onWinTitleMouseDown", id, $event);
			},

			/**
			 * 窗体标题双击
			 * @author zhongjyuan
			 * @date 2023年5月31日11:27:11
			 * @email  zhongjyuan@outlook.com
			 * @param {*} id 主键
			 */
			win_title_double_click: function(id) {
				this.$emit("onWinTitleDoubleClick", id);
			},

			/**
			 * 后退地址栏
			 * @author zhongjyuan
			 * @date   2023年5月15日15:57:29
			 * @email  zhongjyuan@outlook.com
			 * @param {*} data 数据
			 * @param {*} winId 窗口唯一标识
			 */
			win_urlbar_back: function(data, winId) {
				this.$emit("onWinUrlBarBack", data, winId);
			},

			/**
			 * 后退地址栏是否可行
			 * @author zhongjyuan
			 * @date   2023年5月15日15:57:38
			 * @email  zhongjyuan@outlook.com
			 * @param {*} data 数据
			 * @param {*} winId 窗口唯一标识
			 * @returns
			 */
			win_urlbar_back_available: function(data, winId) {
				this.$emit("onWinUrlBarBackAvailable", data, winId);
			},

			/**
			 * 前进地址栏
			 * @author zhongjyuan
			 * @date   2023年5月15日15:58:32
			 * @email  zhongjyuan@outlook.com
			 * @param {*} data 数据
			 * @param {*} winId 窗口唯一标识
			 */
			win_urlbar_forward: function(data, winId) {
				this.$emit("onWinUrlBarForward", data, winId);
			},

			/**
			 * 前进地址栏是否可行
			 * @author zhongjyuan
			 * @date   2023年5月15日15:58:37
			 * @email  zhongjyuan@outlook.com
			 * @param {*} data 数据
			 * @param {*} winId 窗口唯一标识
			 * @returns
			 */
			win_urlbar_forward_available: function(data, winId) {
				this.$emit("onWinUrlBarForwardAvailable", data, winId);
			},
		},
		computed: {},
	};
</script>
