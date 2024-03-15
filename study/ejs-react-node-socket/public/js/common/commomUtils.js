/**
 * 全局缓存区服ID对应的游戏区信息
 * @type {{}}
 */
var gameZoneInfo = {};
var gameZoneParentAgents = {};
var ccuAgentId = {};
var allGameZoneInfo = {};
var allCcuRegionStr = "";

var myEventEmit = new EventEmitter();

//全局通知
var globalMesage = "";
//操作结果集
var results = [];
/**
 * 生成UUID
 */
function generateUUID() {
	var d = new Date().getTime();
	var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
		/[xy]/g,
		function (c) {
			var r = (d + Math.random() * 16) % 16 | 0;
			d = Math.floor(d / 16);
			return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
		}
	);
	return uuid;
}

/**
 * 获取当前时间
 * @returns {string}
 */
function getNowFormatDate() {
	var date = new Date();
	var month = date.getMonth() + 1;
	var strDate = date.getDate();
	if (month >= 1 && month <= 9) {
		month = "0" + month;
	}
	if (strDate >= 0 && strDate <= 9) {
		strDate = "0" + strDate;
	}
	var currentdate =
		date.getFullYear() +
		month +
		strDate +
		date.getHours() +
		date.getMinutes() +
		date.getSeconds();
	return currentdate;
}

/**
 * 获取当前时间  2000-01-01 00:00:00
 * @returns {string}
 */
function getNowDate() {
	var date = new Date();
	var seperator1 = "-";
	var seperator2 = ":";
	var month = date.getMonth() + 1;
	var strDate = date.getDate();
	if (month >= 1 && month <= 9) {
		month = "0" + month;
	}
	if (strDate >= 0 && strDate <= 9) {
		strDate = "0" + strDate;
	}
	var currentdate =
		date.getFullYear() +
		seperator1 +
		month +
		seperator1 +
		strDate +
		" " +
		date.getHours() +
		seperator2 +
		date.getMinutes() +
		seperator2 +
		date.getSeconds();
	return currentdate;
}

/**
 * 获取弹填特定时间的日期
 * @param hour
 * @param min
 * @param sec
 * @returns {string}
 */
function getHourDate(hour, min, sec) {
	var date = new Date();
	date.setHours(hour);
	date.setMinutes(min);
	date.setSeconds(sec);
	var seperator1 = "-";
	var seperator2 = ":";
	var month = date.getMonth() + 1;
	var strDate = date.getDate();
	if (month >= 1 && month <= 9) {
		month = "0" + month;
	}
	if (strDate >= 0 && strDate <= 9) {
		strDate = "0" + strDate;
	}
	var currentdate =
		date.getFullYear() +
		seperator1 +
		month +
		seperator1 +
		strDate +
		" " +
		date.getHours() +
		seperator2 +
		date.getMinutes() +
		seperator2 +
		date.getSeconds();
	return currentdate;
}

/**
 * 通过H5 API上传文件,返回文件流给回调方法
 * @param id
 * @param callBack
 */
function uploadFileByH5Api(id, callBack) {
	let selectedFile = document.getElementById(id).files[0]; //获取读取的File对象
	let name = selectedFile.name; //读取选中文件的文件名
	let size = selectedFile.size; //读取选中文件的大小
	console.log("文件名:" + name + "大小：" + size);

	let reader = new FileReader(); //这里是核心！！！读取操作就是由它完成的。
	reader.readAsArrayBuffer(selectedFile); //读取文件的内容

	reader.onload = function () {
		if (callBack) {
			callBack(name, this.result);
		}
	};
}

function readSimpleXlsxData(id, type, callBack) {
	let selectedFile = document.getElementById(id).files[0]; //获取读取的File对象
	let name = selectedFile.name; //读取选中文件的文件名
	let size = selectedFile.size; //读取选中文件的大小
	console.log("文件名:" + name + "大小：" + size);

	if (!selectedFile) {
		return false;
	}

	let wb; //读取完成的数据
	let rABS = false; //是否将文件读取为二进制字符串

	if (type == "base64") {
		rABS = true;
	}

	let reader = new FileReader();
	reader.onload = function (e) {
		var data = e.target.result;
		if (rABS) {
			wb = XLSX.read(btoa(fixdata(data)), {
				//手动转化
				type: "base64",
			});
		} else {
			wb = XLSX.read(data, {
				type: "binary",
			});
		}
		//wb.SheetNames是获取Sheets中的名字
		//wb.Sheets[Sheet名]获取第一个Sheet的数据
		// callBack(JSON.stringify( XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]])));
		const xlsxData = {};
		const sheetNames = wb.SheetNames;
		for (let i = 0; i < sheetNames.length; i++) {
			const sheetName = sheetNames[i];
			xlsxData[sheetName] = XLSX.utils.sheet_to_json(wb.Sheets[sheetName]);
		}

		callBack(name, xlsxData);
	};
	if (rABS) {
		reader.readAsArrayBuffer(selectedFile);
	} else {
		reader.readAsBinaryString(selectedFile);
	}
	document.getElementById(id).setAttribute("type", "text");
}

function fixdata(data) {
	//文件流转BinaryString
	var o = "",
		l = 0,
		w = 10240;
	for (; l < data.byteLength / w; ++l)
		o += String.fromCharCode.apply(
			null,
			new Uint8Array(data.slice(l * w, l * w + w))
		);
	o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
	return o;
}

/**
 * 数组转字符串
 * @param arrays
 * @returns {string}
 * @constructor
 */
function ArrayToString(arrays) {
	let value = "";
	try {
		if (arrays != null && arrays != undefined) {
			for (let i = 0; i < arrays.length; i++) {
				if (i < arrays.length - 1) {
					value = value + arrays[i] + ",";
				} else {
					value = value + arrays[i];
				}
			}
		}
	} catch (e) {
		console.log(e);
	}
	return value;
}

/**
 * 字符串转数组
 * @param value 字符串
 * @param type Number 代表数值数组
 * @returns {Array}
 * @constructor
 */
function StringToArray(value, type) {
	let array = [];
	try {
		if (value != null && value != undefined) {
			value = value + "";
			let valueArr = value.split(",");
			if (type == "Number") {
				for (let i = 0; i < valueArr.length; i++) {
					array.push(parseInt(valueArr[i]));
				}
			} else {
				return valueArr;
			}
		}
	} catch (e) {
		console.log(e);
	}
	return array;
}
