<template>
	<!--任务栏-->
	<div class="bar" :class="bar_class" :style="bar_style" @contextmenu.prevent="bar_context_menu">
		<div class="mask" :style="background_theme_color"></div>
		<div class="mask" :style="{ background: 'rgba(0,0,0,0.18)' }"></div>
		<div class="mask powered-by" :class="bar_powered_class">
			{{ bar_powered_text() }}
		</div>

		<!-- 开始按钮 -->
		<div class="btn shadow-hover fa fa-fw" :class="bar_start_button_class" :style="bar_start_button_style" @click="bar_start_button_click"></div>

		<!-- 窗口任务按钮 -->
		<div
			class="btn win-task"
			:class="bar_win_task_button_class(winId)"
			:style="bar_win_task_button_style"
			v-if="!win.plugin"
			v-for="(win, winId) in wins"
			@click="bar_win_task_button_click(winId)"
			@contextmenu.prevent="win_context_menu(winId, $event)"
		>
			<win-icon :badge_text="badge_text" :icon="win.icon" @onImageError="image_error"></win-icon>
			<div class="title">{{ win.title }}</div>
			<div class="line"></div>
		</div>

		<!-- 显示桌面按钮 -->
		<div
			id="btn-right-bottom"
			class="btn shadow-hover fa fa-fw"
			:class="bar_show_desktop_button_class"
			:style="bar_show_desktop_button_style"
			@click="bar_show_desktop_button_click"
		></div>

		<!-- 消息中心按钮 -->
		<div id="zhongjyuan-btn-center" class="btn shadow-hover" :style="bar_message_center_button_style" @click="bar_message_center_button_click">
			<div class="badge" :style="bar_message_center_badge_style" v-show="center.unreadCount">
				{{ badge_text(center.unreadCount) }}
			</div>
		</div>

		<!-- 时间按钮 -->
		<div
			class="btn shadow-hover"
			:style="bar_datetime_button_style"
			:title="runtime.date && runtime.date.toLocaleString()"
			v-show="!runtime.isSmallScreen"
			v-html="runtime.time"
			@click="bar_datetime_button_click"
		></div>

		<!-- 任务托盘按钮 -->
		<div
			class="btn shadow-hover fa fa-fw"
			:class="bar_tasktray_button_class"
			:style="bar_tasktray_button_style"
			@click="bar_tasktray_button_click"
		></div>

		<!-- 任务托盘盒子 -->
		<transition name="opacity">
			<div class="plugin-icons shadow" v-show="runtime.pluginIconsOpen">
				<div class="mask" :style="background_theme_color"></div>
				<div class="mask" style="background: white; opacity: 0.04"></div>
				<div
					class="plugin-icon"
					:class="tasktray_icon_class(winId)"
					:style="tasktray_icon_style(winId)"
					:title="win.title"
					:key="win.iframeId"
					v-if="win.plugin"
					v-for="(win, winId) in wins"
					@click="win_show_switch(winId)"
					@contextmenu.prevent="win_context_menu(winId, $event)"
				>
					<win-icon :badge_text="badge_text" :icon="win.icon" @onImageError="image_error"></win-icon>
				</div>
			</div>
		</transition>

		<!-- 日历盒子 -->
		<transition name="opacity">
			<div id="_box_time" class="calendar-box shadow" v-show="runtime.calendarOpen" @contextmenu.prevent="ContextMenu.render($event, true)">
				<div class="mask" :style="background_theme_color"></div>
				<div class="mask" style="background: white; opacity: 0.02"></div>
				<div class="_h_m_s div-time"></div>
				<div class="_y_m_d div-time"></div>
				<div class="calendar clearfix">
					<div class="_header">
						<strong></strong>
						<span class="aL">ꜜ</span>
						<span class="aR">ꜛ</span>
					</div>
					<div class="_normal">
						<div class="_week clearfix"></div>
						<div class="_days clearfix">
							<ul class="clearfix"></ul>
						</div>
					</div>
					<div class="_years_months clearfix">
						<ul></ul>
					</div>
					<div class="_tenyears clearfix">
						<ul></ul>
					</div>
				</div>
			</div>
		</transition>
	</div>
</template>

<script>
	export default {
		name: "win-bar",
		props: [
			"runtime",
			"configs",
			"wins",
			"startMenu",
			"center",
			"badge_text",
			"background_theme_color",
			"bar_class",
			"bar_style",
			"bar_powered_text",
			"bar_powered_class",
			"bar_start_button_class",
			"bar_start_button_style",
			"bar_win_task_button_class",
			"bar_win_task_button_style",
			"bar_show_desktop_button_class",
			"bar_show_desktop_button_style",
			"bar_message_center_button_style",
			"bar_message_center_badge_style",
			"bar_datetime_button_style",
			"bar_tasktray_button_class",
			"bar_tasktray_button_style",
			"tasktray_icon_class",
			"tasktray_icon_style",
		],
		data: function() {
			return {
				runtime: {},
				configs: {},
				startMenu: {},
				center: {},
			};
		},
		watch: {
			runtime: {
				handler(newVal, oldVal) {
					if (newVal !== oldVal)
						ZHONGJYUAN.logger.trace("vue.bar.[watch] runtime: ${0} => ${1}", JSON.stringify(oldVal), JSON.stringify(newVal));
				},
				deep: true,
			},
			configs: {
				handler(newVal, oldVal) {
					if (newVal !== oldVal)
						ZHONGJYUAN.logger.trace("vue.bar.[watch] configs: ${0} => ${1}", JSON.stringify(oldVal), JSON.stringify(newVal));
				},
				deep: true,
			},
			wins: {
				handler(newVal, oldVal) {
					if (newVal !== oldVal)
						ZHONGJYUAN.logger.trace("vue.bar.[watch] wins: ${0} => ${1}", JSON.stringify(oldVal), JSON.stringify(newVal));
				},
				deep: true,
			},
			startMenu: {
				handler(newVal, oldVal) {
					if (newVal !== oldVal)
						ZHONGJYUAN.logger.trace("vue.bar.[watch] startMenu: ${0} => ${1}", JSON.stringify(oldVal), JSON.stringify(newVal));
				},
				deep: true,
			},
			center: {
				handler(newVal, oldVal) {
					if (newVal !== oldVal)
						ZHONGJYUAN.logger.trace("vue.bar.[watch] center: ${0} => ${1}", JSON.stringify(oldVal), JSON.stringify(newVal));
				},
				deep: true,
			},
		},
		methods: {
			image_error: function(element) {
				this.$emit("onImageError", element);
			},
			/**
			 * 窗体显示切换
			 * @author zhongjyuan
			 * @date 2023年6月2日18:11:46
			 * @email  zhongjyuan@outlook.com
			 * @param {*} winId 窗体唯一标识
			 */
			win_show_switch: function(winId) {
				this.$emit("onWinShowSwitch", winId);
			},

			/**
			 * 窗体右侧菜单
			 * @author zhongjyuan
			 * @date 2023年6月2日18:12:05
			 * @email  zhongjyuan@outlook.com
			 * @param {*} winId 窗体唯一标识
			 * @param {*} $event 事件对象
			 */
			win_context_menu: function(winId, $event) {
				this.$emit("onWinContextMenu", winId, $event);
			},

			/**
			 * 任务栏右侧菜单
			 * @author zhongjyuan
			 * @date 2023年5月31日18:07:28
			 * @email  zhongjyuan@outlook.com
			 * @param {*} $event 事件对象
			 */
			bar_context_menu: function($event) {
				this.$emit("onBarContextMenu", $event);
			},

			/**
			 * 任务栏开始按钮点击
			 * @author zhongjyuan
			 * @date 2023年6月2日18:10:33
			 * @email  zhongjyuan@outlook.com
			 */
			bar_start_button_click: function() {
				this.$emit("onBarStartButtonClick");
			},

			/**
			 * 任务栏窗体任务按钮点击
			 * @author zhongjyuan
			 * @date 2023年6月2日18:11:04
			 * @email  zhongjyuan@outlook.com
			 * @param {*} winId 窗体唯一标识
			 */
			bar_win_task_button_click: function(winId) {
				this.$emit("onBarWinTaskButtonClick", winId);
			},

			/**
			 * 任务栏显示桌面按钮点击
			 * @author zhongjyuan
			 * @date 2023年6月2日18:12:55
			 * @email  zhongjyuan@outlook.com
			 */
			bar_show_desktop_button_click: function() {
				this.$emit("onBarShowDesktopButtonClick");
			},

			/**
			 * 任务栏消息中心按钮点击
			 * @author zhongjyuan
			 * @date 2023年6月2日18:13:11
			 * @email  zhongjyuan@outlook.com
			 */
			bar_message_center_button_click: function() {
				this.$emit("onBarMessageCenterButtonClick");
			},

			/**
			 * 任务栏时间按钮点击
			 * @author zhongjyuan
			 * @date 2023年6月2日18:13:26
			 * @email  zhongjyuan@outlook.com
			 */
			bar_datetime_button_click: function() {
				this.$emit("onBarDateTimeButtonClick");
			},

			/**
			 * 任务栏任务盒子按钮点击
			 * @author zhongjyuan
			 * @date 2023年6月2日18:13:47
			 * @email  zhongjyuan@outlook.com
			 */
			bar_tasktray_button_click: function() {
				this.$emit("onBarTaskTrayButtonClick");
			},
		},
	};
</script>
