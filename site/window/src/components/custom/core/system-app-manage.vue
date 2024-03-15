<template>
	<div class="tab-right" :class="system_app_manage_class">
		<div class="show">
			<h1>{{ lang("AppManager") }}</h1>
			<div id="app-manage">
				<div>
					<input
						:style="search_input_style"
						:placeholder="lang('Search') + '/' + lang('Create') + ' ' + lang('Application') + '...'"
						v-model="searchWords"
					/>
					<el-button type="primary" size="small" icon="el-icon-plus" @click="app_create(searchWords)">
						{{ lang("Application") }}
					</el-button>

					<table class="list" :style="table_style">
						<tr class="item">
							<th class="text" width="120" :style="table_th_style">
								{{ lang("Application") }}
							</th>
							<th class="text" width="120" :style="table_th_style">
								ID
							</th>
							<th class="text" width="110" :style="table_th_style">
								{{ lang("Description") }}
							</th>
							<th class="text" width="50" :style="table_th_style">
								{{ lang("Copyright") }}
							</th>
							<th class="text" width="40" :style="table_th_style">
								{{ lang("AutoRun") }}
							</th>
						</tr>

						<tr
							v-for="(app, id) in apps"
							class="item"
							v-show="app_show(id)"
							@dblclick="app_double_click(app)"
							@contextmenu.prevent="app_context_menu(id, $event)"
						>
							<td class="text title">
								<win-icon
									:badge_text="badge_text"
									:icon="app.icon"
									:img="app_icon_image_url_fix(app.icon.content)"
									@onImageError="url_error"
								></win-icon>
								<span :style="table_td_title_span_style" :title="app.title">{{ app.title }}</span>
							</td>
							<td class="text" :title="id">
								{{ id }}
							</td>
							<td class="text" :title="app.description ? app.description : lang('NoMoreDescription')">
								{{ app.description ? app.description : lang("NoMoreDescription") }}
							</td>
							<td class="text" :title="app.developer">
								{{ app.developer }}
							</td>
							<td class="text">
								{{ render_auto_run(app.autoRun) }}
							</td>
						</tr>
					</table>
				</div>
			</div>

			<!--抽屉渲染-->
			<transition name="opacity">
				<div class="shader" style="z-index: 1" v-if="appSetting" @click.self="opacity_click">
					<div class="drawer">
						<el-form
							ref="form"
							size="mini"
							label-width="8em"
							:style="drawer_from_style"
							:label-position="isSmallScreen ? 'top' : 'left'"
							:model="appSettingForm"
						>
							<el-form-item :label="lang('Title')">
								<el-input size="mini" spellcheck="false" v-model="appSetting.title"></el-input>
							</el-form-item>
							<el-form-item :label="lang('Version')">
								<el-input size="mini" spellcheck="false" v-model="appSetting.version"></el-input>
							</el-form-item>
							<el-form-item :label="lang('Description')">
								<el-input size="mini" spellcheck="false" v-model="appSetting.description"></el-input>
							</el-form-item>
							<el-form-item :label="lang('Copyright')">
								<el-input size="mini" spellcheck="false" v-model="appSetting.developer"></el-input>
							</el-form-item>
							<el-form-item label="URL">
								<el-input size="mini" spellcheck="false" v-model="appSetting.url" :placeholder="lang('CanBeEmpty')"></el-input>
							</el-form-item>
							<el-form-item :label="lang('Tile') + ' ' + 'URL'">
								<el-input size="mini" spellcheck="false" v-model="appSetting.tileUrl" :placeholder="lang('CanBeEmpty')"></el-input>
							</el-form-item>
							<el-form-item :label="lang('OpenMode')">
								<el-select size="mini" v-model="appSetting.openMode" :placeholder="lang('PleaseChoose')">
									<el-option :label="lang('Normal')" value="normal"></el-option>
									<el-option :label="lang('Maximize')" value="max"></el-option>
									<el-option :label="lang('Minimize')" value="min"></el-option>
									<el-option :label="lang('Outer')" value="outer"></el-option>
								</el-select>
							</el-form-item>
							<el-form-item :label="lang('IconType')">
								<el-select size="mini" v-model="appSetting.icon.type" :placeholder="lang('PleaseChoose')">
									<el-option label="Font Awesome" value="fa"></el-option>
									<el-option :label="lang('Initial')" value="str"></el-option>
									<el-option :label="lang('Image')" value="img"></el-option>
								</el-select>
								<el-button
									plain
									size="mini"
									icon="el-icon-search"
									style="margin-left: 10px"
									v-show="appSetting.icon.type === 'fa'"
									@click="font_awesome_click"
								></el-button>
								<el-button plain size="mini" icon="el-icon-upload" v-show="appSetting.icon.type === 'img'" @click="image_host_click"> </el-button>
							</el-form-item>
							<el-form-item :label="lang('IconContent')">
								<el-input size="mini" spellcheck="false" v-model="appSetting.icon.content"> </el-input>
							</el-form-item>
							<el-form-item :label="lang('IconBgColor')">
								<el-row>
									<el-col :span="2">
										<div :style="icon_bg_style" @click="icon_bg_click">
											&nbsp;
										</div>
									</el-col>
									<el-col :span="22">
										<el-input size="mini" spellcheck="false" style="width: 147px" v-model="appSetting.icon.bg" :placeholder="lang('LegalCSSColor')">
										</el-input>
									</el-col>
								</el-row>
							</el-form-item>
							<el-form-item :label="lang('AutoRun')">
								<el-button-group>
									<el-button plain size="mini" icon="el-icon-remove" @click="reduce_auto_run_level(appSetting)">
										{{ lang("Degrade") }}
									</el-button>
									<el-button plain size="mini"> {{ lang("Current") }}:{{ render_auto_run(appSetting.autoRun) }} </el-button>
									<el-button plain size="mini" icon="el-icon-circle-plus" @click="increase_auto_run_level(appSetting)">
										{{ lang("Upgrade") }}
									</el-button>
								</el-button-group>
							</el-form-item>
							<el-form-item :label="lang('Superscript')">
								<el-input-number size="mini" v-model="appSetting.badge" :min="0" :max="999"> </el-input-number>
							</el-form-item>
							<el-form-item :label="lang('Position') + ' - ' + lang('AutoOffset')">
								<el-switch
									style="top: 4px;width: 40px;display: block;position: relative;"
									inactive-color="gray"
									v-model="appSetting.position.autoOffset"
								>
								</el-switch>
							</el-form-item>
							<el-form-item :label="lang('Position') + ' - ' + lang('LateralAlignment')">
								<el-switch
									inactive-color="#409EFF"
									v-model="appSetting.position.left"
									:active-text="lang('AlignLeft')"
									:inactive-text="lang('AlignRight')"
								>
								</el-switch>
							</el-form-item>
							<el-form-item :label="lang('Position') + ' - ' + lang('VerticalAlignment')">
								<el-switch
									inactive-color="#409EFF"
									v-model="appSetting.position.top"
									:active-text="lang('AlignTop')"
									:inactive-text="lang('AlignBottom')"
								>
								</el-switch>
							</el-form-item>
							<el-form-item :label="lang('Position') + ' - ' + lang('LateralOffset')">
								<el-input size="mini" :placeholder="lang('TipsOfSizeSetting')" v-model="appSetting.position.x"></el-input>
							</el-form-item>
							<el-form-item :label="lang('Position') + ' - ' + lang('VerticalOffset')">
								<el-input size="mini" :placeholder="lang('TipsOfSizeSetting')" v-model="appSetting.position.y"></el-input>
							</el-form-item>
							<el-form-item :label="lang('Size') + ' - ' + lang('Width')">
								<el-input size="mini" :placeholder="lang('TipsOfSizeSetting')" v-model="appSetting.size.width"></el-input>
							</el-form-item>
							<el-form-item :label="lang('Size') + ' - ' + lang('Height')">
								<el-input size="mini" :placeholder="lang('TipsOfSizeSetting')" v-model="appSetting.size.height"></el-input>
							</el-form-item>
							<el-form-item :label="lang('DisplayMode')">
								<el-row>
									<el-col :span="12">
										<el-switch inactive-color="gray" :active-text="lang('PluginMode')" v-model="appSetting.plugin"> </el-switch>
									</el-col>
									<el-col :span="12">
										<el-switch inactive-color="gray" :active-text="lang('SingleWindow')" v-model="appSetting.single"> </el-switch>
									</el-col>
								</el-row>
								<el-row>
									<el-col :span="12">
										<el-switch inactive-color="gray" :active-text="lang('DisplayAddressBar')" v-model="appSetting.addressBar"> </el-switch>
									</el-col>
									<el-col :span="12">
										<el-switch inactive-color="gray" :active-text="lang('BackMode')" v-model="appSetting.background"> </el-switch>
									</el-col>
								</el-row>
								<el-row>
									<el-col :span="12">
										<el-switch inactive-color="gray" :active-text="lang('Resizable')" v-model="appSetting.resizable"> </el-switch>
									</el-col>
									<el-col :span="12">
										<el-switch inactive-color="gray" :active-text="lang('UrlRandomToken')" v-model="appSetting.urlRandomToken"> </el-switch>
									</el-col>
								</el-row>
							</el-form-item>
						</el-form>
					</div>
				</div>
			</transition>
		</div>
	</div>
</template>

<script>
	export default {
		name: "system-app-manage",
		props: [
			"lang",
			"searchWords",
			"apps",
			"appSetting",
			"appSettingForm",
			"system_app_manage_class",
			"badge_text",
			"render_auto_run",
			"app_show",
			"app_icon_image_url_fix",
		],
		data: function() {
			return {
				searchWords: "",
				apps: {},
				appSetting: {},
				appSettingForm: {},
			};
		},
		watch: {
			searchWords: {
				handler(newVal, oldVal) {
					// ZHONGJYUAN.logger.trace("vue.system.app-manage.[watch] searchWords: ${0} => ${1}", JSON.stringify(oldVal), JSON.stringify(newVal));
				},
			},
			apps: {
				handler(newVal, oldVal) {
					// ZHONGJYUAN.logger.trace("vue.system.app-manage.[watch] apps: ${0} => ${1}", JSON.stringify(oldVal), JSON.stringify(newVal));
				},
				deep: true,
			},
			appSetting: {
				handler(newVal, oldVal) {
					// ZHONGJYUAN.logger.trace("vue.system.app-manage.[watch] appSetting: ${0} => ${1}", JSON.stringify(oldVal), JSON.stringify(newVal));
				},
				deep: true,
			},
			appSettingForm: {
				handler(newVal, oldVal) {
					// ZHONGJYUAN.logger.trace("vue.system.app-manage.[watch] appSettingForm: ${0} => ${1}", JSON.stringify(oldVal), JSON.stringify(newVal));
				},
				deep: true,
			},
		},
		methods: {
			url_error: function(element) {
				this.$emit("onUrlError", element);
			},
			check_auto_run_level: function(app) {
				this.$emit("onCheckAutoRunLevel", app);
			},
			reduce_auto_run_level: function(app) {
				this.$emit("onReduceAutoRunLevel", app);
			},
			increase_auto_run_level: function(app) {
				this.$emit("onIncreaseAutoRunLevel", app);
			},
			opacity_click: function() {
				this.$emit("onOpacityClick");
			},
			app_create: function(title) {
				this.$emit("onAppCreate", title);
			},
			app_uninstall: function(id) {
				this.$emit("onAppUninstall", id);
			},
			app_add_to_shortcut: function(id) {
				this.$emit("onAppAddToShortcut", id);
			},
			app_add_to_start_menu: function(id) {
				this.$emit("onAppAddToStartMenu", id);
			},
			app_add_to_start_menu_sidebar: function(id) {
				this.$emit("onAppAddToStartMenuSidebar", id);
			},
			app_add_to_tile: function(id) {
				this.$emit("onAppAddToTile", id);
			},
			app_context_menu: function(id, event) {
				this.$emit("onAppContextMenu", id, event);
			},
			app_double_click: function(app) {
				this.$emit("onAppDoubleClick", app);
			},
			font_awesome_click: function() {
				this.$emit("onFontAwesomeClick");
			},
			image_host_click: function() {
				this.$emit("onImageHostClick");
			},
			icon_bg_click: function() {
				this.$emit("onIconBgClick");
			},
		},
		computed: {
			search_input_style: function() {
				return {
					padding: "0.5em",
					width: "calc(100% - 7.5em)",
					"margin-bottom": "1em",
					"max-width": "36em",
					outline: "none",
				};
			},
			table_style: function() {
				return { "table-layout": "fixed", width: "100%" };
			},
			table_th_style: function() {
				return { "font-weight": "bold" };
			},
			table_td_title_span_style: function() {
				return { "padding-left": "0.5em" };
			},
			drawer_from_style: function() {
				return { padding: "1em", overflow: "auto", height: "calc(100% - 2em)" };
			},
			icon_bg_style: function() {
				return {
					width: "90%",
					height: "27px",
					"margin-top": "1px",
					"border-radius": "3px",
					"box-sizing": "border-box",
					border: "1px solid darkgray",
					background: this.appSetting.icon.bg,
				};
			},
		},
	};
</script>
