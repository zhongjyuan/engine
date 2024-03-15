<template>
	<div class="tab-right" :class="system_wallpaper_manage_class">
		<div class="show">
			<h1>{{ lang("Wallpaper") }}</h1>

			<img id="img-wallpaper-preview" width="336" height="185" :src="wallpaper_current_fixed" @error="url_error($event.target)" />

			<div>
				<el-switch inactive-color="gray" v-model="wallpaperBlur" :active-text="lang('Blur')" @change="wallpaper_blur_change"> </el-switch>
				<el-switch
					inactive-color="gray"
					style="margin-left: 20px"
					v-model="wallpaperSlide"
					:active-text="lang('Slide')"
					@change="wallpaper_slide_change"
				>
				</el-switch>
			</div>

			<div v-show="wallpaperSlide">
				<div style="margin-top: 20px">
					<el-radio-group size="small" v-model="wallpaperSlideRandom" @change="wallpaper_slide_random_change">
						<el-radio-button :label="true">{{ lang("PlayRandomly") }}</el-radio-button>
						<el-radio-button :label="false">{{ lang("PlaySequentially") }}</el-radio-button>
					</el-radio-group>
				</div>
				<div style="margin-top: 20px">
					{{ lang("SwitchingFrequency") }}
					<el-select size="small" v-model="wallpaperSlideInterval" :placeholder="lang('PleaseChoose')" @change="wallpaper_slide_interval_change">
						<el-option :label="'1 ' + lang('Minutes')" :value="1"></el-option>
						<el-option :label="'10 ' + lang('Minutes')" :value="10"></el-option>
						<el-option :label="'30 ' + lang('Minutes')" :value="30"></el-option>
						<el-option :label="'1 ' + lang('Hours')" :value="60"></el-option>
						<el-option :label="'6 ' + lang('Hours')" :value="360"></el-option>
						<el-option :label="'24 ' + lang('Hours')" :value="1440"></el-option>
					</el-select>
				</div>
			</div>

			<p>
				<input class="ipt-zhongjyuan" v-model="wallpaperAddUrl" :placeholder="lang('AddPictureOnline')" />
				<el-button size="medium" :style="wallpaper_image_add_button_style" @click="wallpaper_image_add_click">
					{{ lang("Add") }}
				</el-button>
				<el-button size="medium" icon="el-icon-upload" :style="wallpaper_image_upload_button_style" @click="wallpaper_image_upload_click"></el-button>
			</p>

			<div class="img-bg-preview">
				<img
					:style="wallpaper_image_preview_style"
					v-for="wallpaper in wallpapers"
					:src="wallpaper_fixed(wallpaper)"
					@error="url_error($event.target)"
					@click="wallpaper_image_preview_click(wallpaper)"
					@contextMenu="imgContextMenu(wallpaper, $event)"
				/>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: "system-wallpaper-manage",
		props: [
			"lang",
			"wallpaper",
			"wallpapers",
			"wallpaperAddUrl",
			"wallpaperBlur",
			"wallpaperSlide",
			"wallpaperSlideRandom",
			"wallpaperSlideInterval",
			"system_wallpaper_manage_class",
			"wallpaper_fixed",
			"wallpaper_current_fixed",
		],
		data: function() {
			return {
				wallpapers: [],
				wallpaper: "",
				wallpaperAddUrl: "",
				wallpaperBlur: false,
				wallpaperSlide: false,
				wallpaperSlideRandom: false,
				wallpaperSlideInterval: 5,
			};
		},
		watch: {
			wallpapers: {
				handler(newVal, oldVal) {
					// ZHONGJYUAN.logger.trace("vue.system.wallpaper.manage.[watch] wallpapers: ${0} => ${1}", JSON.stringify(oldVal), JSON.stringify(newVal));
				},
				deep: true,
			},
			wallpaperAddUrl: {
				handler(newVal, oldVal) {
					// ZHONGJYUAN.logger.trace("vue.system.wallpaper.manage.[watch] wallpaperAddUrl: ${0} => ${1}", JSON.stringify(oldVal), JSON.stringify(newVal));
				},
			},
			wallpaper: {
				handler(newVal, oldVal) {
					// ZHONGJYUAN.logger.trace("vue.system.wallpaper.manage.[watch] wallpaper: ${0} => ${1}", JSON.stringify(oldVal), JSON.stringify(newVal));
				},
			},
			wallpaperBlur: {
				handler(newVal, oldVal) {
					// ZHONGJYUAN.logger.trace("vue.system.wallpaper.manage.[watch] wallpaperBlur: ${0} => ${1}", JSON.stringify(oldVal), JSON.stringify(newVal));
				},
			},
			wallpaperSlide: {
				handler(newVal, oldVal) {
					// ZHONGJYUAN.logger.trace("vue.system.wallpaper.manage.[watch] wallpaperSlide: ${0} => ${1}", JSON.stringify(oldVal), JSON.stringify(newVal));
				},
			},
			wallpaperSlideRandom: {
				handler(newVal, oldVal) {
					// ZHONGJYUAN.logger.trace("vue.system.wallpaper.manage.[watch] wallpaperSlideRandom: ${0} => ${1}", JSON.stringify(oldVal), JSON.stringify(newVal));
				},
			},
			wallpaperSlideInterval: {
				handler(newVal, oldVal) {
					// ZHONGJYUAN.logger.trace("vue.system.wallpaper.manage.[watch] wallpaperSlideInterval: ${0} => ${1}", JSON.stringify(oldVal), JSON.stringify(newVal));
				},
			},
		},
		methods: {
			url_error: function(element) {
				this.$emit("onUrlError", element);
			},
			wallpaper_blur_change: function(value) {
				this.$emit("onWallpaperBlurChange", value);
			},
			wallpaper_slide_change: function(value) {
				this.$emit("onWallpaperSlideChange", value);
			},
			wallpaper_slide_random_change: function(value) {
				this.$emit("onWallpaperSlideRandomChange", value);
			},
			wallpaper_slide_interval_change: function(value) {
				this.$emit("onWallpaperSlideIntervalChange", value);
			},
			wallpaper_image_add_click: function() {
				this.$emit("onWallpaperImageAddClick");
			},
			wallpaper_image_upload_click: function() {
				this.$emit("onWallpaperImageUploadClick");
			},
			wallpaper_image_preview_click: function(wallpaper) {
				this.$emit("onWallpaperImagePreviewClick", wallpaper);
			},
			wallpaper_image_context_menu: function(wallpaper, event) {
				this.$emit("onWallpaperImageContextMenu", wallpaper, event);
			},
		},
		computed: {
			wallpaper_image_preview_style: function() {
				return { "border-color": this.themeColor };
			},
			wallpaper_image_add_button_style: function() {
				return { width: "81px", "border-radius": "inherit", "font-size": "12px" };
			},
			wallpaper_image_upload_button_style: function() {
				return { "border-radius": "inherit", "margin-left": "13px", "font-size": "12px" };
			},
		},
	};
</script>
