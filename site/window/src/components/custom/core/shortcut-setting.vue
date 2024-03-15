<template>
	<!--快捷方式配置-->
	<transition name="opacity">
		<div class="shader" v-if="shortSetting" :style="shortcut_setting_style" @click.self="shortcut_setting_click">
			<div class="drawer">
				<div class="mask" :style="background_theme_color"></div>

				<div class="title">
					{{ shortSetting.title }}
					<span class="btn-advance" v-if="shortSetting.app" @click="shortcut_setting_advance_click(shortSetting.app)">
						{{ shortcut_setting_advance_text() }}
					</span>
				</div>

				<div class="line" :style="shortcut_setting_title_style">
					<span>{{ shortcut_setting_title_text() }}</span>
					<input spellcheck="false" autofocus v-model="shortSetting.title" />
				</div>

				<template v-if="shortSetting.params">
					<div class="line">
						<span>{{ shortcut_setting_param_hash_text() }}</span>
						<input spellcheck="false" v-model="shortSetting.hash" />
					</div>

					<div class="line">
						<input spellcheck="false" :placeholder="param_key_placeholder" v-model="runtime.shortcutNewParamName" />
						<input spellcheck="false" :placeholder="param_value_placeholder" v-model="runtime.shortcutNewParamValue" />
						<i class="fa fa-plus-circle" @click="shortcut_setting_param_add_click"></i>
					</div>

					<div v-for="(val, name) in shortSetting.params" class="line">
						<span :title="name">{{ name }}</span>
						<input spellcheck="false" v-model="shortSetting.params[name]" />
						<i class="fa fa-minus-circle" @click="shortcut_setting_param_delete_click(name)"></i>
					</div>
				</template>
			</div>
		</div>
	</transition>
</template>

<script>
	export default {
		name: "win-shortcut-setting",
		props: [
			"runtime",
			"shortSetting",
			"background_theme_color",
			"shortcut_setting_style",
			"shortcut_setting_advance_text",
			"shortcut_setting_title_style",
			"shortcut_setting_title_text",
			"shortcut_setting_param_key_text",
			"shortcut_setting_param_value_text",
			"shortcut_setting_param_hash_text",
		],
		data: function() {
			return {
				runtime: {},
				shortSetting: {},
			};
		},
		watch: {
			runtime: {
				handler(newVal, oldVal) {
					if (newVal !== oldVal)
						ZHONGJYUAN.logger.trace("vue.shortcut-setting.[watch] runtime: ${0} => ${1}", JSON.stringify(oldVal), JSON.stringify(newVal));
				},
				deep: true,
			},
			shortSetting: {
				handler(newVal, oldVal) {
					if (newVal !== oldVal)
						ZHONGJYUAN.logger.trace("vue.shortcut-setting.[watch] shortSetting: ${0} => ${1}", JSON.stringify(oldVal), JSON.stringify(newVal));
				},
				deep: true,
			},
		},
		methods: {
			shortcut_setting_click: function() {
				this.$emit("onShortcutSettingClick");
			},
			shortcut_setting_advance_click: function() {
				this.$emit("onShortcutSettingAdvanceClick");
			},
			shortcut_setting_param_add_click: function() {
				this.$emit("onShortcutSettingParamAddClick");
			},
			shortcut_setting_param_delete_click: function(name) {
				this.$emit("onShortcutSettingParamDeleteClick", name);
			},
		},
		computed: {
			param_key_placeholder: function() {
				return this.shortcut_setting_param_key_text();
			},
			param_value_placeholder: function() {
				return this.shortcut_setting_param_value_text();
			},
		},
	};
</script>
