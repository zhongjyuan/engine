<template>
	<div class="tab-right" :class="system_other_manage_class">
		<div class="show">
			<h1>{{ lang("Others") }}</h1>
			<p>
				<el-switch inactive-color="gray" v-model="topTaskBar" :active-text="lang('TopTaskBar')" @change="top_taskbar_change"> </el-switch>
			</p>
			<div style="margin-top: 20px">
				{{ lang("MaxNumberOfWindows") }}
				<el-select size="small" v-model="openMax" :placeholder="lang('PleaseChoose')" @change="open_max_change">
					<el-option label="6" :value="6"></el-option>
					<el-option label="9" :value="9"></el-option>
					<el-option label="12" :value="12"></el-option>
					<el-option label="15" :value="15"></el-option>
					<el-option label="18" :value="18"></el-option>
				</el-select>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: "system-other-manage",
		props: ["lang", "topTaskBar", "openMax", "system_other_manage_class"],
		data: function() {
			return {
				openMax: 9,
				topTaskBar: false,
			};
		},
		watch: {
			openMax: {
				handler(newVal, oldVal) {
					// ZHONGJYUAN.logger.trace("vue.system.other-manage.[watch] openMax: ${0} => ${1}", JSON.stringify(oldVal), JSON.stringify(newVal));
				},
			},
			topTaskBar: {
				handler(newVal, oldVal) {
					// ZHONGJYUAN.logger.trace("vue.system.other-manage.[watch] topTaskBar: ${0} => ${1}", JSON.stringify(oldVal), JSON.stringify(newVal));
				},
			},
		},
		methods: {
			top_taskbar_change: function(value) {
				this.$emit("onTopTaskBarChange", value);
			},
			open_max_change: function(value) {
				this.$emit("onOpenMaxChange", value);
			},
		},
		computed: {},
	};
</script>
