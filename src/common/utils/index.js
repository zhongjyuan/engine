import array from "./array"; // 数组函数对象
import browse from "./browse"; // 浏览器函数对象
import business from "./business"; // 业务函数对象
import color from "./color"; // 颜色函数对象
import common from "./default"; // 默认函数对象
import dom from "./dom"; // DOM函数对象
import file from "./file"; // 文件函数对象
import format from "./format"; // 格式化函数对象
import image from "./image"; // 图像函数对象
import math from "./math"; // 计算函数对象
import object from "./object"; // 对象函数对象
import random from "./random"; // 随机函数对象
import request from "./request"; // 请求函数对象
import screen from "./screen"; // 屏幕函数对象
import site from "./site"; // 站点函数对象
import storage from "./storage"; // 存储函数对象
import system from "./system"; // 系统函数对象

export default {
	array: array,
	browse: browse,
	...business,
	color: color,
	...common,
	dom: dom,
	file: file,
	...format,
	image: image,
	math: math,
	object: object,
	random: random,
	...request,
	screen: screen,
	site: site,
	storage: storage,
	system: system,
};
