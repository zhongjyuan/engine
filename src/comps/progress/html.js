/**component 进度模版 */
export const comp_progress = `
<div id="progress-box" class="box">
	<p class="title">
		<span id="software-name"></span>
		<span id="software-describe"></span>
	</p>
	<p id="resource-name">...</p>
	<div class="circle-box">
		<div class="circle"></div>
		<div id="percent">0</div>
		<div class="mask right">
			<div id="percent-right" class="circle right"></div>
		</div>
		<div class="mask left">
			<div id="percent-left" class="circle left"></div>
		</div>
	</div>
</div>
<p id="software-statement"></p>
`;
