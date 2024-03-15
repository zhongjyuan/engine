<template>
	<div class="tab-right" :class="system_theme_color_class">
		<div class="show" id="colors">
			<h1>{{ lang("Color") }}</h1>
			<div class="color-choose">
				<div v-for="color in colors" class="color-block" :style="color_style(color)" @click="color_choose_click(color)"></div>
			</div>
			<div>
				<div :style="color_picker_style" @click="color_picker_click"></div>
				<input :style="color_picker_input_style" :disabled="autoThemeColor" v-model="chooseColor" @input="color_choose_change" />
				<el-switch
					inactive-color="gray"
					v-model="autoThemeColor"
					:style="auto_theme_color_switch_style"
					:active-text="lang('PickFromBgAuto')"
					@change="auto_theme_color_change"
				></el-switch>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: "system-theme-color",
		props: ["lang", "colors", "chooseColor", "autoThemeColor", "system_theme_color_class", "color_style"],
		data: function() {
			return {
				colors: [
					"#FFB900",
					"#FF8C00",
					"#F7630C",
					"#CA5010",
					"#DA3B01",
					"#EF6950",
					"#D13438",
					"#D13438",
					"#E74856",
					"#E81123",
					"#EA005E",
					"#C30052",
					"#E3008C",
					"#BF0077",
					"#C239B3",
					"#9A0089",
					"#0078D7",
					"#0063B1",
					"#8E8CD8",
					"#6B69D6",
					"#8764B8",
					"#744DA9",
					"#B146C2",
					"#881798",
					"#0099BC",
					"#2D7D9A",
					"#00B7C3",
					"#038387",
					"#00B294",
					"#018574",
					"#00CC6A",
					"#10893E",
					"#7A7574",
					"#5D5A58",
					"#68768A",
					"#515C6B",
					"#567C73",
					"#486860",
					"#498205",
					"#107C10",
					"#767676",
					"#4C4A48",
					"#69797E",
					"#4A5459",
					"#647C64",
					"#525E54",
					"#847545",
					"#7E735F",
				],
				chooseColor: "",
				autoThemeColor: false,
			};
		},
		watch: {
			colors: {
				handler(newVal, oldVal) {
					// ZHONGJYUAN.logger.trace("vue.system.theme-color.[watch] colors: ${0} => ${1}", JSON.stringify(oldVal), JSON.stringify(newVal));
				},
				deep: true,
			},
			chooseColor: {
				handler(newVal, oldVal) {
					// ZHONGJYUAN.logger.trace("vue.system.theme-color.[watch] chooseColor: ${0} => ${1}", JSON.stringify(oldVal), JSON.stringify(newVal));
				},
			},
			autoThemeColor: {
				handler(newVal, oldVal) {
					// ZHONGJYUAN.logger.trace("vue.system.theme-color.[watch] autoThemeColor: ${0} => ${1}", JSON.stringify(oldVal), JSON.stringify(newVal));
				},
			},
		},
		methods: {
			color_choose_click: function(color) {
				this.$emit("onColorChooseClick", color);
			},
			color_picker_click: function(color) {
				this.$emit("onColorPickerClick", color);
			},
			color_choose_change: function(event) {
				this.$emit("onColorChooseChange", event);
			},
			auto_theme_color_change: function(value) {
				this.$emit("onAutoThemeColorChange", value);
			},
		},
		computed: {
			color_picker_style: function() {
				return {
					float: "left",
					"margin-right": "1em",
					width: "4em",
					height: "calc(2em + 2px)",
					"background-color": this.chooseColor,
				};
			},
			color_picker_input_style: function() {
				return {
					width: "103px",
					"margin-right": "20px",
					float: "left",
					padding: "0.5em",
					outline: "none",
				};
			},
			auto_theme_color_switch_style: function() {
				return { display: "block", position: "relative", top: "4px", float: "left", width: "200px" };
			},
		},
	};
</script>
