export const comp_setting = `
<div id="set-button"><i class="fa-solid fa-gear fa-spin"></i></div>
<div id="set-panel" style="display: none">
	<div id="panel-left">
		<div id="panel-left-top">
			<div id="avatar"></div>
			<div id="username" title="zhongjyuan">zhongjyuan</div>
		</div>
		<div id="panel-left-main"><ul id="menu"></ul></div>
		<div id="panel-left-bottom"></div>
	</div>
	<div id="panel-right">
		<div id="title">用户信息</div>
		<div id="fullscreen-button"><i id="fullscreen" class="fa-solid fa-expand fa-beat-fade"></i></div>
		<div id="data"></div>
	</div>
</div>
`;

export const comp_setting_0 = `
<form id="myForm">
	<div class="form-row">
		<label for="1">ID号：</label>
		<input type="text" id="1" name="1" />
	</div>

	<div class="form-row">
		<label for="2">设备号：</label>
		<input type="email" id="2" name="2" />
	</div>

	<div class="form-row">
		<label for="3">GPS：</label>
		<input type="text" id="3" name="3" />
	</div>

	<div class="form-row btn-group">
		<button type="button" class="save-btn" onclick="saveFormData()">暂 存</button>
		<button type="button" class="submit-btn" onclick="submitFormData()">提 交</button>
	</div>
</form>
`;

export const comp_setting_1 = `
<form id="myForm">
	<div class="form-row">
		<label for="1">设备号：</label>
		<input type="text" id="1" name="1" />
	</div>

	<div class="form-row">
		<label for="2">当地温度：</label>
		<input type="email" id="2" name="2" />
	</div>

	<div class="form-row">
		<label for="3">压力：</label>
		<input type="text" id="3" name="3" />
	</div>

	<div class="form-row">
		<label for="4">压缩机电流：</label>
		<input type="text" id="4" name="4" />
	</div>

	<div class="form-row btn-group">
		<button type="button" class="save-btn" onclick="saveFormData()">暂 存</button>
		<button type="button" class="submit-btn" onclick="submitFormData()">提 交</button>
	</div>
</form>
`;

export const comp_setting_2 = `
<form id="myForm">
	<div class="form-row">
		<label for="1">设备号：</label>
		<input type="text" id="1" name="1" />
	</div>

	<div class="form-row">
		<label for="2">工作状态设定：</label>
		<input type="email" id="2" name="2" />
	</div>

	<div class="form-row btn-group">
		<button type="button" class="save-btn" onclick="saveFormData()">暂 存</button>
		<button type="button" class="submit-btn" onclick="submitFormData()">提 交</button>
	</div>
</form>
`;
