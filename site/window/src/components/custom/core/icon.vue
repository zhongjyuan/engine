<template>
	<div :class="icon_class" :style="icon_style">
		<template v-if="icon.type === 'str'">
			{{ icon.content.substr(0, 1) }}
		</template>

		<i class="fa fa-fw" :class="icon_fa_class" v-if="icon.type === 'fa'"> </i>

		<template v-if="icon.type === 'img'">
			<img class="fa" ondragstart="return false;" :src="img ? img : icon.content" @error="image_error($event.target)" />
		</template>

		<div class="badge" v-show="badge">{{ badge_text(badge) }}</div>
	</div>
</template>

<script>
	export default {
		name: "win-icon",
		props: ["icon", "nobg", "drawer", "badge", "img", "badge_text"],
		data: function() {
			return {
				/**图标对象 */
				icon: {},
				/**是否有背景 */
				nobg: false,
				/**是否处于抽屉状态 */
				drawer: false,
				/**角标 */
				badge: 0,
				/**默认图片 */
				img: "",
			};
		},
		watch: {
			icon: {
				handler(newVal, oldVal) {
					if (newVal !== oldVal) ZHONGJYUAN.logger.trace("vue.icon.[watch] icon: ${0} => ${1}", JSON.stringify(oldVal), JSON.stringify(newVal));
				},
				deep: true,
			},
			nobg: {
				handler(newVal, oldVal) {
					if (newVal !== oldVal) ZHONGJYUAN.logger.trace("vue.icon.[watch] nobg: ${0} => ${1}", oldVal, newVal);
				},
			},
			drawer: {
				handler(newVal, oldVal) {
					if (newVal !== oldVal) ZHONGJYUAN.logger.trace("vue.icon.[watch] drawer: ${0} => ${1}", oldVal, newVal);
				},
			},
			badge: {
				handler(newVal, oldVal) {
					if (newVal !== oldVal) ZHONGJYUAN.logger.trace("vue.icon.[watch] badge: ${0} => ${1}", oldVal, newVal);
				},
			},
			img: {
				handler(newVal, oldVal) {
					if (newVal !== oldVal) ZHONGJYUAN.logger.trace("vue.icon.[watch] img: ${0} => ${1}", oldVal, newVal);
				},
			},
		},
		methods: {
			image_error: function(element) {
				this.$emit("onImageError", element);
			},
		},
		computed: {
			/**
			 * 图标样式类
			 * @author zhongjyuan
			 * @date 2023年6月1日19:44:11
			 * @email  zhongjyuan@outlook.com
			 * @returns
			 */
			icon_class: function() {
				ZHONGJYUAN.logger.trace("vue.icon.[icon_class]");
				var that = this;

				return [that.drawer ? "icon-drawer-pre" : "icon"];
			},

			/**
			 * 图标样式
			 * @author zhongjyuan
			 * @date 2023年6月1日19:46:12
			 * @email  zhongjyuan@outlook.com
			 * @returns
			 */
			icon_style: function() {
				ZHONGJYUAN.logger.trace("vue.icon.[icon_style]");
				var that = this;

				return { background: that.nobg ? "none" : that.icon.bg };
			},

			/**
			 * 图标font-awesome样式
			 * @author zhongjyuan
			 * @date 2023年6月1日19:57:57
			 * @email  zhongjyuan@outlook.com
			 * @returns
			 */
			icon_fa_class: function() {
				ZHONGJYUAN.logger.trace("vue.icon.[icon_fa_class]");
				var that = this;

				return ["fa-" + that.icon.content];
			},
		},
	};
</script>
