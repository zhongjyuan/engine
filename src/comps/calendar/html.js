/**component 日历模版 */
export const comp_calendar = `
<div id="_box_time" class="calendar-box shadow">
	<div class="mask"></div>
	<div class="mask" style="background: white; opacity: 0.02"></div>
	<div class="_h_m_s div-time"></div>
	<div class="_y_m_d div-time"></div>
	<div class="calendar clearfix">
		<div class="_header">
			<strong></strong>
			<span class="aL fa-solid fa-chevron-up fa-bounce"></span>
			<span class="aR fa-solid fa-chevron-down fa-bounce"></i></span>
		</div>
		<div class="_normal">
			<div class="_week clearfix"></div>
			<div class="_days clearfix">
				<ul class="clearfix"></ul>
			</div>
		</div>
		<div class="_years_months clearfix">
			<ul></ul>
		</div>
		<div class="_tenyears clearfix">
			<ul></ul>
		</div>
	</div>
</div>
`;
