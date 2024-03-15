<template>
	<div class="tab-right" :class="system_data_manage_class">
		<div class="show">
			<h1>{{ lang("DataManager") }}</h1>
			<div style="min-width: 250px; overflow-x: hidden">
				<el-button-group>
					<el-button plain size="small" icon="el-icon-refresh" :type="dataChange ? 'primary' : ''" @click="data_refresh_click">
						<span class="small-screen-hidden">{{ lang("Refresh") }}</span>
					</el-button>
					<el-button plain size="small" icon="el-icon-sort" :loading="effectLoading" @click="data_effect_click">
						<span class="small-screen-hidden">{{ lang("TakeEffect") }}</span>
					</el-button>
					<el-button plain size="small" icon="el-icon-tickets" @click="data_copy_click">
						<span class="small-screen-hidden">{{ lang("Copy") }}</span>
					</el-button>
					<el-button plain size="small" icon="el-icon-upload2" @click="data_import_click">
						<input type="file" id="ipt-json-file" @change="data_import_change" />
						<span class="small-screen-hidden"> {{ lang("Import") }}</span>
					</el-button>
					<el-button plain size="small" icon="el-icon-download" @click="data_export_click">
						<span class="small-screen-hidden">{{ lang("Export") }}</span>
					</el-button>
				</el-button-group>
			</div>
			<textarea id="text-data" spellcheck="false" style="margin: 5px 0" v-model="textData"></textarea>
		</div>
	</div>
</template>

<script>
	export default {
		name: "system-data-manage",
		props: ["lang", "textData", "dataChange", "effectLoading", "system_data_manage_class"],
		data: function() {
			return {
				textData: "",
				dataChange: false,
				effectLoading: false,
			};
		},
		watch: {
			textData: {
				handler(newVal, oldVal) {
					// ZHONGJYUAN.logger.trace("vue.system.data.manage.[watch] textData: ${0} => ${1}", JSON.stringify(oldVal), JSON.stringify(newVal));
				},
				deep: true,
			},
			dataChange: {
				handler(newVal, oldVal) {
					// ZHONGJYUAN.logger.trace("vue.system.data.manage.[watch] dataChange: ${0} => ${1}", JSON.stringify(oldVal), JSON.stringify(newVal));
				},
			},
			effectLoading: {
				handler(newVal, oldVal) {
					// ZHONGJYUAN.logger.trace("vue.system.data.manage.[watch] effectLoading: ${0} => ${1}", JSON.stringify(oldVal), JSON.stringify(newVal));
				},
			},
		},
		methods: {
			data_refresh_click: function() {
				this.$emit("onDataRefreshClick");
			},
			data_effect_click: function() {
				this.$emit("onDataEffectClick");
			},
			data_copy_click: function() {
				this.$emit("onDataCopyClick");
			},
			data_import_click: function() {
				this.$emit("onDataImportClick");
			},
			data_import_change: function() {
				this.$emit("onDataImportChange");
			},
			data_export_click: function() {
				this.$emit("onDatExportClick");
			},
		},
		computed: {},
	};
</script>
