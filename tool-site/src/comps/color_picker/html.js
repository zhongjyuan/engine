/**component 取色器模版 */
export const comp_color_picker = `
<div class="mask" style="position: fixed; top: 0px; right: 0px; bottom: 0px; left: 0px"></div>
<div class="box" style="position: inherit; z-index: 100; display: flex; box-shadow: rgba(0, 0, 0, 0.3) 0px 0px 2px, rgba(0, 0, 0, 0.3) 0px 4px 8px">
	<div
		class="palette"
		style="
			width: 180px;
			padding: 10px;
			background: #f9f9f9;
			display: flex;
			flex-flow: row wrap;
			align-content: space-around;
			justify-content: space-around;
		"
	></div>
	<div class="pancel" style="background: rgb(255, 255, 255); box-sizing: initial; width: 225px; font-family: Menlo">
		<div style="width: 100%; padding-bottom: 55%; position: relative; border-radius: 2px 2px 0px 0px; overflow: hidden">
			<div class="color-pancel" style="position: absolute; top: 0px; right: 0px; bottom: 0px; left: 0px">
				<style>
					.saturation-white {
						background: -webkit-linear-gradient(to right, #fff, rgba(255, 255, 255, 0));
						background: linear-gradient(to right, #fff, rgba(255, 255, 255, 0));
					}
					.saturation-black {
						background: -webkit-linear-gradient(to top, #000, rgba(0, 0, 0, 0));
						background: linear-gradient(to top, #000, rgba(0, 0, 0, 0));
					}
				</style>
				<div class="saturation-white" style="position: absolute; top: 0px; right: 0px; bottom: 0px; left: 0px">
					<div class="saturation-black" style="position: absolute; top: 0px; right: 0px; bottom: 0px; left: 0px"></div>
					<div class="picker-button" style="position: absolute; top: 0%; left: 100%; cursor: default">
						<div
							style="
								width: 12px;
								height: 12px;
								border-radius: 6px;
								box-shadow: rgb(255, 255, 255) 0px 0px 0px 1px inset;
								transform: translate(-6px, -6px);
							"
						></div>
					</div>
				</div>
			</div>
		</div>
		<div style="padding: 0 16px 20px">
			<div class="flexbox-fix" style="display: flex; align-items: center; height: 40px">
				<div style="width: 32px">
					<div style="width: 16px; height: 16px; border-radius: 8px; position: relative; overflow: hidden">
						<div
							class="show-color"
							style="
								position: absolute;
								top: 0px;
								right: 0px;
								bottom: 0px;
								left: 0px;
								border-radius: 8px;
								box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 0px 1px inset;
								z-index: 2;
							"
						></div>
						<div
							style="
								position: absolute;
								top: 0px;
								right: 0px;
								bottom: 0px;
								left: 0px;
								background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYGAQYcAP3uCTZhw1gGGYhAGBZIA/nYDCgBDAm9BGDWAAJyRCgLaBCAAgXwixzAS0pgAAAABJRU5ErkJggg==')
									left center;
							"
						></div>
					</div>
				</div>
				<div style="-webkit-box-flex: 1; flex: 1 1 0%">
					<div style="height: 10px; position: relative">
						<div style="position: absolute; top: 0px; right: 0px; bottom: 0px; left: 0px">
							<div class="hue-horizontal" style="padding: 0px 2px; position: relative; height: 100%">
								<style>
									.hue-horizontal {
										background: linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%);
										background: -webkit-linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%);
									}
									.hue-vertical {
										background: linear-gradient(to top, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%);
										background: -webkit-linear-gradient(to top, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%);
									}
								</style>
								<div class="picker-color-bar" style="position: absolute; left: 0%">
									<div
										style="
											width: 12px;
											height: 12px;
											border-radius: 6px;
											transform: translate(-6px, -1px);
											background-color: rgb(248, 248, 248);
											box-shadow: rgba(0, 0, 0, 0.37) 0px 1px 4px 0px;
										"
									></div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="flexbox-fix" style="display: flex">
				<div class="flexbox-fix input-wrap" style="-webkit-box-flex: 1; flex: 1 1 0%; display: flex; margin-left: -6px"></div>
				<div class="mode-button" style="width: 32px; text-align: right; position: relative">
					<div style="margin-right: -4px; cursor: pointer; position: relative">
						<svg viewBox="0 0 24 24" style="width: 24px; height: 24px; border: 1px solid transparent; border-radius: 5px">
							<path fill="#333" d="M12,5.83L15.17,9L16.58,7.59L12,3L7.41,7.59L8.83,9L12,5.83Z"></path>
							<path fill="#333" d="M12,18.17L8.83,15L7.42,16.41L12,21L16.59,16.41L15.17,15Z"></path>
						</svg>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
`;
