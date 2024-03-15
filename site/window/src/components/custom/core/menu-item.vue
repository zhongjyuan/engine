<template>
	<div>
		<div class="item" :class="menu_item_class" @click="click" @contextmenu.prevent="context_menu($event)">
			<span :style="menu_item_span_style"></span>

			<win-icon :badge_text="badge_text" :icon="apps[item.app].icon" v-if="!item.children"></win-icon>

			<div v-else class="icon-drawer">
				<template v-for="(child, childId) in item.children">
					<win-icon
						class="icon-drawer-pre"
						:badge_text="badge_text"
						:icon="apps[child.app].icon"
						:drawer="true"
						:badge="0"
						v-if="!child.children"
					></win-icon>
				</template>
			</div>

			<span class="title">{{ item.title }}</span>

			<div class="arrow" :class="menu_item_arrow_class" v-if="item.children">
				<i class="fa fa-fw fa-angle-up"></i>
				<i class="fa fa-fw fa-angle-down"></i>
			</div>
		</div>

		<win-menu-item
			:badge_text="badge_text"
			:item="subItem"
			:itemid="subId"
			:apps="apps"
			:open="item.open && open"
			:depth="depth + 1"
			:key="subId"
			v-if="item.children"
			v-for="(subItem, subId) in item.children"
			@onMenuItemClick="menu_item_click($event)"
			@onMenuItemContextMenu="menu_item_context_menu($event)"
		>
		</win-menu-item>
	</div>
</template>

<script>
	export default {
		name: "win-menu-item",
		props: ["item", "itemid", "apps", "open", "depth", "badge_text"],
		data: function() {
			return {
				itemid: null,
				item: {},
				apps: {},
				open: false,
				depth: 0,
			};
		},
		watch: {
			itemid: {
				handler(newVal, oldVal) {
					if (newVal !== oldVal) ZHONGJYUAN.logger.trace("vue.menu-item.[watch] itemid: ${0} => ${1}", oldVal, newVal);
				},
			},
			item: {
				handler(newVal, oldVal) {
					if (newVal !== oldVal) ZHONGJYUAN.logger.trace("vue.menu-item.[watch] item: ${0} => ${1}", JSON.stringify(oldVal), JSON.stringify(newVal));
				},
				deep: true,
			},
			apps: {
				handler(newVal, oldVal) {
					if (newVal !== oldVal) ZHONGJYUAN.logger.trace("vue.menu-item.[watch] apps: ${0} => ${1}", JSON.stringify(oldVal), JSON.stringify(newVal));
				},
				deep: true,
			},
			open: {
				handler(newVal, oldVal) {
					if (newVal !== oldVal) ZHONGJYUAN.logger.trace("vue.menu-item.[watch] open: ${0} => ${1}", oldVal, newVal);
				},
			},
			depth: {
				handler(newVal, oldVal) {
					if (newVal !== oldVal) ZHONGJYUAN.logger.trace("vue.menu-item.[watch] depth: ${0} => ${1}", oldVal, newVal);
				},
			},
		},
		methods: {
			/**
			 * 单击
			 * @author zhongjyuan
			 * @date 2023年5月31日10:24:47
			 * @email  zhongjyuan@outlook.com
			 */
			click: function() {
				if (this.item.children) {
					this.item.open = !this.item.open;
				} else {
					this.$emit("onMenuItemclick", this.item);
				}
			},

			/**
			 * 右侧菜单
			 * @author zhongjyuan
			 * @date 2023年5月31日10:25:35
			 * @email  zhongjyuan@outlook.com
			 * @param {*} $event 事件对象
			 */
			context_menu: function($event) {
				this.$emit("onMenuItemContextMenu", {
					id: this.itemid,
					item: this.item,
					event: $event,
				});
			},

			/**
			 * 菜单单击
			 * @author zhongjyuan
			 * @date 2023年5月31日10:29:56
			 * @email  zhongjyuan@outlook.com
			 * @param {*} $event 事件对象
			 */
			menu_item_click: function($event) {
				this.$emit("onMenuItemClick", $event);
			},

			/**
			 * 菜单右侧菜单
			 * @author zhongjyuan
			 * @date 2023年5月31日10:34:32
			 * @email  zhongjyuan@outlook.com
			 * @param {*} data 数据
			 */
			menu_item_context_menu: function(data) {
				this.$emit("onMenuItemContextMenu", data);
			},
		},
		computed: {
			/**
			 * 菜单项样式类
			 * @author zhongjyuan
			 * @date 2023年6月1日20:06:08
			 * @email  zhongjyuan@outlook.com
			 */
			menu_item_class: function() {
				var that = this;
				ZHONGJYUAN.logger.trace("vue.menu-item.[menu_item_class] title:${0}", that.item.title);

				return { open: that.open };
			},
			/**
			 * 菜单项缩进span样式
			 * @author zhongjyuan
			 * @date 2023年6月1日20:07:42
			 * @email  zhongjyuan@outlook.com
			 */
			menu_item_span_style: function() {
				var that = this;
				ZHONGJYUAN.logger.trace("vue.menu-item.[menu_item_span_style] title:${0}", that.item.title);

				return { "margin-left": that.depth * 15 + "px" };
			},
			/**
			 * 菜单项展开/收缩箭头样式
			 * @author zhongjyuan
			 * @date 2023年6月1日20:08:35
			 * @email  zhongjyuan@outlook.com
			 */
			menu_item_arrow_class: function() {
				var that = this;
				ZHONGJYUAN.logger.trace("vue.menu-item.[menu_item_arrow_class] title:${0}", that.item.title);

				return { open: that.item.open };
			},
		},
	};
</script>
