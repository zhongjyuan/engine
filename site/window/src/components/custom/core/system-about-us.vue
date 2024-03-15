<template>
	<div class="tab-right" :class="system_about_us_class">
		<div class="show">
			<h1>{{ lang("AboutUs") }}</h1>
			<div :style="software_name_style">
				<i class="fa" :class="software_name_icon_class"></i>
				{{ information.name }}
			</div>
			<table class="tb-about-us">
				<tr>
					<td :width="isSmallScreen ? '100' : '150'">
						{{ lang("Version") }}
					</td>
					<td>{{ information.version }}</td>
				</tr>
				<tr>
					<td>{{ lang("Author") }}</td>
					<td>{{ information.author }}</td>
				</tr>
				<tr>
					<td>{{ lang("Contact") }}</td>
					<td>{{ information.email }}</td>
				</tr>
				<tr>
					<td>{{ lang("OfficialWebsite") }}</td>
					<td>
						<a style="text-decoration: underline; cursor: pointer" @click="website_click">
							{{ information.website }}
						</a>
					</td>
				</tr>
				<tr>
					<td>{{ lang("Copyright") }}</td>
					<td style="font-size: 12px">
						{{ information.copyright }}
					</td>
				</tr>
				<tr>
					<td>{{ lang("Authorization") }}</td>
					<td>{{ information.authorization }}</td>
				</tr>
				<tr>
					<td>{{ lang("SerialNumber") }}</td>
					<td>{{ information.serialNumber }}</td>
				</tr>
				<tr v-if="information.showStatement">
					<td>{{ lang("OtherStatements") }}</td>
					<td style="font-size: 12px">
						{{ information.statement }}
					</td>
				</tr>
			</table>
		</div>
	</div>
</template>

<script>
	export default {
		name: "system-about-us",
		props: ["lang", "themeColor", "isSmallScreen", "information", "system_about_us_class", "software_name_icon_class"],
		data: function() {
			return {
				themeColor: "",
				isSmallScreen: false,
			};
		},
		watch: {
			themeColor: {
				handler(newVal, oldVal) {
					// ZHONGJYUAN.logger.trace("vue.system.about.us.[watch] themeColor: ${0} => ${1}", JSON.stringify(oldVal), JSON.stringify(newVal));
				},
				deep: true,
			},
			isSmallScreen: {
				handler(newVal, oldVal) {
					// ZHONGJYUAN.logger.trace("vue.system.about.us.[watch] isSmallScreen: ${0} => ${1}", JSON.stringify(oldVal), JSON.stringify(newVal));
				},
			},
		},
		methods: {
			website_click: function() {
				this.$emit("onWebsiteClick");
			},
		},
		computed: {
			software_name_style: function() {
				return { margin: "15px auto", color: this.themeColor, "font-size": this.isSmallScreen ? "22px" : "68px" };
			},
		},
	};
</script>
