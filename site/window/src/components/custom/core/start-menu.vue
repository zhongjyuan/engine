<template>
	<!-- 开始菜单盒子 -->
	<transition name="opacity">
		<div
			class="startMenu shadow"
			:class="start_menu_transition_class"
			:style="start_menu_transition_style"
			v-show="startMenu.open"
			@click="start_menu_transition_click"
		>
			<div class="mask" :style="background_theme_color"></div>
			<div class="startMenu-resize" @mousedown="start_menu_transition_resize_mouse_down($event)"></div>

			<!--左侧边栏-->
			<div
				class="sidebar"
				:class="start_menu_transition_sidebar_class"
				:style="background_theme_color"
				@mouseleave="start_menu_transition_sidebar_mouse_leave"
			>
				<div class="mask" :style="start_menu_transition_sidebar_mask_style"></div>

				<div class="btn" @click="start_menu_transition_sidebar_top_button_click">
					<i class="fa fa-fw fa-align-justify"></i>
					<span class="title">{{ start_menu_transition_sidebar_top_button_title() }}</span>
				</div>

				<div class="btn-group">
					<div
						class="btn"
						:title="button.title"
						:key="button.title"
						v-for="(button, buttonId) in startMenu.sidebar.buttons"
						@click="app_open(button.app, button, button)"
						@contextmenu.prevent="start_menu_transition_sidebar_button_context_menu(buttonId, $event)"
					>
						<win-icon
							:badge_text="badge_text"
							:icon="apps[button.app].icon"
							:badge="apps[button.app].badge"
							:nobg="true"
							@onImageError="image_error"
						></win-icon>
						<span class="title">{{ button.title }}</span>
					</div>
				</div>
			</div>

			<!--主菜单-->
			<win-menu
				:style="start_menu_transition_menu_style"
				:menu_item_style="menu_item_style"
				:badge_text="badge_text"
				:apps="apps"
				:menu="startMenu.menu"
				@onMenuContextMenu="start_menu_transition_menu_context_menu($event)"
				@onMenuItemClick="start_menu_transition_menu_item_click($event)"
				@onMenuItemContextMenu="start_menu_transition_menu_item_context_menu($event)"
			>
			</win-menu>

			<!--磁贴-->
			<div class="tiles-box" :style="start_menu_transition_tile_box_style" @contextmenu.prevent="start_menu_transition_tile_box_context_menu($event)">
				<div class="tiles-flex-container" :style="start_menu_transition_tile_container_style">
					<div class="tiles" :style="start_menu_transition_tile_group_style" :key="tileGroup.title" v-for="(tileGroup, groupIndex) in tiles">
						<div class="title" @contextmenu.prevent="start_menu_transition_tile_group_title_context_menu(groupIndex, $event)">
							{{ tileGroup.title }}
							<i class="fa fa-navicon tip" @click="start_menu_transition_tile_group_title_tip_click(tileGroup)"></i>
						</div>

						<win-tile-layout
							:layout="tileGroup.data"
							:col-num="6"
							:row-height="runtime.tileSize"
							:is-draggable="true"
							:is-resizable="true"
							:vertical-compact="true"
							:margin="[4, 4]"
							:use-css-transforms="false"
							:autoSize="true"
						>
							<win-tile-item
								:x="tile.x"
								:y="tile.y"
								:w="tile.w"
								:h="tile.h"
								:i="tile.i"
								:key="tile.app"
								v-for="(tile, i) in tileGroup.data"
								@moved="start_menu_transition_tile_moved"
							>
								<div
									class="tile animated zoomIn"
									:style="start_menu_transition_tile_style"
									:title="tile.title"
									@click="start_menu_transition_tile_click(tile)"
									@mousedown="start_menu_transition_tile_mouse_down($event)"
									@contextmenu.prevent="start_menu_transition_tile_context_menu(groupIndex, i, $event)"
								>
									<div class="mask" style="opacity: 0.85" :style="{ 'background-color': apps[tile.app].icon.bg }">
										<div class="badge" v-show="apps[tile.app].badge">
											{{ badge_text(apps[tile.app].badge) }}
										</div>

										<iframe
											class="custom-tile"
											frameborder="0"
											scrolling="no"
											hspace="0"
											:src="start_menu_transition_tile_custom_iframe(apps[tile.app])"
											v-if="apps[tile.app].tileUrl"
										></iframe>

										<win-icon
											:style="start_menu_transition_tile_icon_style(tile)"
											:badge_text="badge_text"
											:icon="apps[tile.app].icon"
											:badge="0"
											@onImageError="image_error"
											v-else
										></win-icon>

										<div class="title" v-show="Math.min(tile.w, tile.h) * runtime.tileSize > 80">
											{{ tile.title }}
										</div>
									</div>
								</div>
							</win-tile-item>
						</win-tile-layout>
					</div>
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
	export default {
		name: "win-start-menu",
		props: [
			"runtime",
			"configs",
			"apps",
			"tiles",
			"startMenu",
			"badge_text",
			"menu_item_style",
			"background_theme_color",
			"start_menu_transition_class",
			"start_menu_transition_style",
			"start_menu_transition_sidebar_class",
			"start_menu_transition_sidebar_mask_style",
			"start_menu_transition_sidebar_top_button_title",
			"start_menu_transition_menu_style",
			"start_menu_transition_tile_box_style",
			"start_menu_transition_tile_container_style",
			"start_menu_transition_tile_group_style",
			"start_menu_transition_tile_style",
			"start_menu_transition_tile_icon_style",
			"start_menu_transition_tile_custom_iframe",
		],
		data: function() {
			return {
				runtime: {},
				configs: {},
				apps: [],
				tiles: [],
				startMenu: {},
			};
		},
		watch: {
			runtime: {
				handler(newVal, oldVal) {
					if (newVal !== oldVal)
						ZHONGJYUAN.logger.trace("vue.start-menu.[watch] runtime: ${0} => ${1}", JSON.stringify(oldVal), JSON.stringify(newVal));
				},
				deep: true,
			},
			configs: {
				handler(newVal, oldVal) {
					if (newVal !== oldVal)
						ZHONGJYUAN.logger.trace("vue.start-menu.[watch] configs: ${0} => ${1}", JSON.stringify(oldVal), JSON.stringify(newVal));
				},
				deep: true,
			},
			apps: {
				handler(newVal, oldVal) {
					if (newVal !== oldVal) ZHONGJYUAN.logger.trace("vue.start-menu.[watch] apps: ${0} => ${1}", JSON.stringify(oldVal), JSON.stringify(newVal));
				},
				deep: true,
			},
			tiles: {
				handler(newVal, oldVal) {
					if (newVal !== oldVal)
						ZHONGJYUAN.logger.trace("vue.start-menu.[watch] tiles: ${0} => ${1}", JSON.stringify(oldVal), JSON.stringify(newVal));
				},
				deep: true,
			},
			startMenu: {
				handler(newVal, oldVal) {
					if (newVal !== oldVal)
						ZHONGJYUAN.logger.trace("vue.start-menu.[watch] startMenu: ${0} => ${1}", JSON.stringify(oldVal), JSON.stringify(newVal));
				},
				deep: true,
			},
		},
		methods: {
			image_error: function(element) {
				this.$emit("onImageError", element);
			},
			/**
			 * 应用打开
			 * @author zhongjyuan
			 * @date 2023年6月2日19:20:22
			 * @email  zhongjyuan@outlook.com
			 * @param {*} appId 应用唯一标识
			 * @param {*} options 可选配置
			 * @param {*} source 源数据
			 */
			app_open: function(appId, options, source) {
				this.$emit("onAppOpen", appId, options, source);
			},

			/**
			 * 开始菜单盒子点击
			 * @author zhongjyuan
			 * @date 2023年6月2日19:22:37
			 * @email  zhongjyuan@outlook.com
			 */
			start_menu_transition_click: function() {
				this.$emit("onStartMenuTransitionClick");
			},

			/**
			 * 开始菜单盒子大小变化鼠标按下
			 * @author zhongjyuan
			 * @date 2023年6月2日19:23:35
			 * @email  zhongjyuan@outlook.com
			 * @param {*} $event 事件对象
			 */
			start_menu_transition_resize_mouse_down: function($event) {
				this.$emit("onStartMenuTransitionResizeMouseDown", $event);
			},

			/**
			 * 开始菜单盒子左侧栏鼠标离开
			 * @author zhongjyuan
			 * @date 2023年6月2日19:24:06
			 * @email  zhongjyuan@outlook.com
			 */
			start_menu_transition_sidebar_mouse_leave: function() {
				this.$emit("onStartMenuTransitionSidebarMouseLeave");
			},

			/**
			 * 开始菜单盒子左侧栏顶部按钮点击
			 * @author zhongjyuan
			 * @date 2023年6月2日19:24:28
			 * @email  zhongjyuan@outlook.com
			 */
			start_menu_transition_sidebar_top_button_click: function() {
				this.$emit("onStartMenuTransitionSidebarTopButtonClick");
			},

			/**
			 * 开始菜单盒子左侧栏按钮右侧菜单
			 * @author zhongjyuan
			 * @date 2023年6月2日19:24:52
			 * @email  zhongjyuan@outlook.com
			 * @param {*} buttonId 按钮唯一标识
			 * @param {*} $event 事件对象
			 */
			start_menu_transition_sidebar_button_context_menu: function(buttonId, $event) {
				this.$emit("onStartMenuTransitionSidebarButtonContextMenu", buttonId, $event);
			},

			/**
			 * 开始菜单盒子菜单右侧菜单
			 * @author zhongjyuan
			 * @date 2023年6月2日19:25:31
			 * @email  zhongjyuan@outlook.com
			 * @param {*} $event 事件对象
			 */
			start_menu_transition_menu_context_menu: function($event) {
				this.$emit("onStartMenuTransitionMenuContextMenu", $event);
			},

			/**
			 * 开始菜单盒子菜单项点击
			 * @author zhongjyuan
			 * @date 2023年6月2日19:25:52
			 * @email  zhongjyuan@outlook.com
			 * @param {*} $event 事件对象
			 */
			start_menu_transition_menu_item_click: function($event) {
				this.$emit("onStartMenuTransitionMenuItemClick", $event);
			},

			/**
			 * 开始菜单盒子菜单项右侧菜单
			 * @author zhongjyuan
			 * @date 2023年6月2日19:26:13
			 * @email  zhongjyuan@outlook.com
			 * @param {*} $event 事件对象
			 */
			start_menu_transition_menu_item_context_menu: function($event) {
				this.$emit("onStartMenuTransitionMenuItemContextMenu", $event);
			},

			/**
			 * 开始菜单盒子磁贴点击
			 * @author zhongjyuan
			 * @date 2023年6月2日19:26:40
			 * @email  zhongjyuan@outlook.com
			 * @param {*} tile 磁贴对象
			 */
			start_menu_transition_tile_click: function(tile) {
				this.$emit("onStartMenuTransitionTileClick", tile);
			},

			/**
			 * 开始菜单盒子磁贴移动
			 * @author zhongjyuan
			 * @date 2023年6月2日19:27:02
			 * @email  zhongjyuan@outlook.com
			 */
			start_menu_transition_tile_moved: function() {
				this.$emit("onStartMenuTransitionTileMoved");
			},

			/**
			 * 开始菜单盒子磁贴鼠标按下
			 * @author zhongjyuan
			 * @date 2023年6月2日19:27:21
			 * @email  zhongjyuan@outlook.com
			 * @param {*} $event 事件对象
			 */
			start_menu_transition_tile_mouse_down: function($event) {
				this.$emit("onStartMenuTransitionTileMouseDown", $event);
			},

			/**
			 * 开始菜单盒子磁贴右侧菜单
			 * @author zhongjyuan
			 * @date 2023年6月2日19:29:13
			 * @email  zhongjyuan@outlook.com
			 * @param {*} groupIndex 磁贴分组下标
			 * @param {*} tileIndex 磁贴下标
			 * @param {*} $event 事件对象
			 */
			start_menu_transition_tile_context_menu: function(groupIndex, tileIndex, $event) {
				this.$emit("onStartMenuTransitionTileContextMenu", groupIndex, tileIndex, $event);
			},

			/**
			 * 开始菜单盒子磁贴盒子右侧菜单
			 * @author zhongjyuan
			 * @date 2023年6月2日19:29:52
			 * @email  zhongjyuan@outlook.com
			 * @param {*} $event 事件对象
			 */
			start_menu_transition_tile_box_context_menu: function($event) {
				this.$emit("onStartMenuTransitionTileBoxContextMenu", buttonId, $event);
			},

			/**
			 * 开始菜单盒子磁贴分组右侧菜单
			 * @author zhongjyuan
			 * @date 2023年6月2日19:30:19
			 * @email  zhongjyuan@outlook.com
			 * @param {*} groupIndex 磁贴分组下标
			 * @param {*} $event 事件对象
			 */
			start_menu_transition_tile_group_title_context_menu: function(groupIndex, $event) {
				this.$emit("onStartMenuTransitionTileGroupTitleContextMenu", groupIndex, $event);
			},

			/**
			 * 开始菜单盒子磁贴分组tip点击
			 * @author zhongjyuan
			 * @date 2023年6月2日19:30:51
			 * @email  zhongjyuan@outlook.com
			 * @param {*} tileGroup 磁贴分组
			 */
			start_menu_transition_tile_group_title_tip_click: function(tileGroup) {
				this.$emit("onStartMenuTransitionTileGroupTipClick", tileGroup);
			},
		},
	};
</script>
