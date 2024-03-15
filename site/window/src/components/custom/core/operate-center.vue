<template>
	<!--操作中心-->
	<div class="center shadow" :class="operate_center_class" :style="operate_center_style">
		<div class="mask" :style="background_theme_color"></div>
		<div class="banner">
			{{ operate_center_banner_text() }}
			<div class="clear" v-show="center.messageCount > 0" @click="operate_center_banner_clean_button_click">
				{{ operate_center_banner_clean_button_text() }}
			</div>
		</div>

		<transition name="custom-classes-transition-msg" enter-active-class="animated slideInRight" leave-active-class="animated slideOutRight">
			<div class="banner no-msg" style="animation-duration: 0.5s" v-show="center.messageCount <= 0">
				{{ operate_center_message_no_text() }}
			</div>
		</transition>

		<div class="msgs">
			<transition-group name="custom-classes-transition-msg" enter-active-class="animated bounceInRight" leave-active-class="animated bounceOutRight">
				<div class="msg shadow-hover" :key="message.key" v-for="(message, messageId) in center.message">
					<div class="title">
						{{ message.title }}
						<div class="btn-close" @click="operate_center_message_close_button_click(messageId)">
							<i class="fa fa-trash"></i>
						</div>
					</div>
					<div class="content selectable" v-html="message.content"></div>
				</div>
			</transition-group>
		</div>
	</div>
</template>

<script>
	export default {
		name: "win-operate-center",
		props: [
			"runtime",
			"center",
			"background_theme_color",
			"operate_center_class",
			"operate_center_style",
			"operate_center_banner_text",
			"operate_center_banner_clean_button_text",
			"operate_center_message_no_text",
		],
		data: function() {
			return {
				runtime: {},
				center: {},
			};
		},
		watch: {
			runtime: {
				handler(newVal, oldVal) {
					if (newVal !== oldVal)
						ZHONGJYUAN.logger.trace("vue.operate-center.[watch] runtime: ${0} => ${1}", JSON.stringify(oldVal), JSON.stringify(newVal));
				},
				deep: true,
			},
			center: {
				handler(newVal, oldVal) {
					if (newVal !== oldVal)
						ZHONGJYUAN.logger.trace("vue.operate-center.[watch] center: ${0} => ${1}", JSON.stringify(oldVal), JSON.stringify(newVal));
				},
				deep: true,
			},
		},
		methods: {
			operate_center_banner_clean_button_click: function() {
				this.$emit("onOperateCenterBannerCleanButtonClick");
			},
			operate_center_message_close_button_click: function(messageId) {
				this.$emit("onOperateCenterMessageCloseButtonClick", messageId);
			},
		},
		computed: {},
	};
</script>
