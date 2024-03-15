<template>
	<!--消息预览-->
	<transition-group name="custom-classes-transition-msg" enter-active-class="animated bounceInRight" leave-active-class="animated bounceOutRight">
		<div
			class="msg-attention animated"
			:style="message_preview_style(message)"
			:key="message.key"
			v-if="message"
			v-for="(message, messageId) in messagePreviews"
			@click="message_preview_click"
		>
			<div class="mask" :style="background_theme_color"></div>
			<div class="title">{{ message.title }}</div>
			<div class="content selectable" v-html="message.content"></div>
			<div class="mask-msg" :style="message_preview_mask_style"></div>
		</div>
	</transition-group>
</template>

<script>
	export default {
		name: "win-message-preview",
		props: ["runtime", "configs", "messagePreviews", "background_theme_color", "message_preview_style", "message_preview_mask_style"],
		data: function() {
			return {
				runtime: {},
				configs: {},
				messagePreviews: {},
			};
		},
		watch: {
			runtime: {
				handler(newVal, oldVal) {
					if (newVal !== oldVal)
						ZHONGJYUAN.logger.trace("vue.message-preview.[watch] runtime: ${0} => ${1}", JSON.stringify(oldVal), JSON.stringify(newVal));
				},
				deep: true,
			},
			configs: {
				handler(newVal, oldVal) {
					if (newVal !== oldVal)
						ZHONGJYUAN.logger.trace("vue.message-preview.[watch] configs: ${0} => ${1}", JSON.stringify(oldVal), JSON.stringify(newVal));
				},
				deep: true,
			},
			messagePreviews: {
				handler(newVal, oldVal) {
					if (newVal !== oldVal)
						ZHONGJYUAN.logger.trace("vue.message-preview.[watch] messagePreviews: ${0} => ${1}", JSON.stringify(oldVal), JSON.stringify(newVal));
				},
				deep: true,
			},
		},
		methods: {
			message_preview_click: function() {
				this.$emit("onMessagePreviewClick");
			},
		},
		computed: {},
	};
</script>
