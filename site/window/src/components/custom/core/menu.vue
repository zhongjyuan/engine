<template>
	<div class="menu" @contextmenu.self="menu_context_menu($event)">
		<win-menu-item
			class="animated fadeInUp"
			:style="menu_item_style(index)"
			:badge_text="badge_text"
			:item="item"
			:itemid="id"
			:apps="apps"
			:open="true"
			:depth="0"
			:key="id"
			v-for="(item, id, index) in menu"
			@onMenuItemClick="menu_item_click($event)"
			@onMenuItemContextMenu="menu_item_context_menu($event)"
		>
		</win-menu-item>
	</div>
</template>

<script>
	export default {
		name: "win-menu",
		props: ["menu", "apps", "badge_text", "menu_item_style"],
		data: function() {
			return {
				menu: {},
				apps: {},
			};
		},
		watch: {
			menu: {
				handler(newVal, oldVal) {
					if (newVal !== oldVal) ZHONGJYUAN.logger.trace("vue.menu.[watch] menu: ${0} => ${1}", JSON.stringify(oldVal), JSON.stringify(newVal));
				},
				deep: true,
			},
			apps: {
				handler(newVal, oldVal) {
					if (newVal !== oldVal) ZHONGJYUAN.logger.trace("vue.menu.[watch] apps: ${0} => ${1}", JSON.stringify(oldVal), JSON.stringify(newVal));
				},
				deep: true,
			},
		},
		methods: {
			/**
			 * 菜单项点击
			 * @author zhongjyuan
			 * @date 2023年5月31日10:41:22
			 * @email  zhongjyuan@outlook.com
			 * @param {*} $event 事件对象
			 */
			menu_item_click: function($event) {
				this.$emit("onMenuItemClick", $event);
			},

			/**
			 * 菜单项右侧菜单
			 * @author zhongjyuan
			 * @date 2023年5月31日10:42:03
			 * @email  zhongjyuan@outlook.com
			 * @param {*} $event 事件对象
			 */
			menu_item_context_menu: function($event) {
				this.$emit("onMenuItemContextMenu", $event);
			},

			/**
			 * 菜单右侧菜单
			 * @author zhongjyuan
			 * @date 2023年5月31日10:42:47
			 * @email  zhongjyuan@outlook.com
			 * @param {*} $event 事件对象
			 */
			menu_context_menu: function($event) {
				this.$emit("onMenuContextMenu", $event);
			},
		},
	};
</script>
