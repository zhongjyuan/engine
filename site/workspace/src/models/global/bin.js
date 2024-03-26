/**
 * Item类，表示一个实例
 */
export class Item {
	/**
	 * 创建一个实例实例
	 * @param {Object} config - 实例配置
	 * @param {string} config.type - 实例类型，默认为"folder"
	 * @param {string} config.name - 实例名称
	 * @param {Object} config.info - 实例信息
	 * @param {any} config.data - 实例数据
	 * @param {string} config.host - 实例宿主
	 */
	constructor({ type, name, info, data, host }) {
		this.type = type || "folder";
		this.name = name;
		this.info = info || {};
		this.info.icon = this.info.icon || this.type;
		this.data = data;
		this.host = host;
		this.id = this.gene();
	}

	/**
	 * 生成一个随机ID
	 * @returns {string} - 生成的随机ID
	 */
	gene() {
		return Math.random().toString(36).substring(2, 10).toLowerCase();
	}

	/**
	 * 获取实例ID
	 * @returns {string} - 实例ID
	 */
	getId() {
		return this.id;
	}

	/**
	 * 获取实例数据
	 * @returns {any} - 实例数据
	 */
	getData() {
		return this.data;
	}

	/**
	 * 设置实例数据
	 * @param {any} data - 要设置的实例数据
	 */
	setData(data) {
		this.data = data;
	}
}

/**
 * Bin类，表示一个Bin对象
 */
export class Bin {
	/**
	 * 创建一个Bin实例
	 */
	constructor() {
		this.tree = [];
		this.lookup = {};
		this.special = {};
	}

	/**
	 * 设置特殊ID
	 * @param {string} spid - 特殊ID
	 * @param {string} id - ID
	 */
	setSpecial(spid, id) {
		this.special[spid] = id;
	}

	/**
	 * 设置ID对应的项目
	 * @param {string} id - ID
	 * @param {Item} item - 项目
	 */
	setId(id, item) {
		this.lookup[id] = item;
	}

	/**
	 * 根据ID获取项目
	 * @param {string} id - ID
	 * @returns {Item} - 对应的项目
	 */
	getId(id) {
		return this.lookup[id];
	}

	/**
	 * 获取路径
	 * @param {string} id - ID
	 * @returns {string} - 路径
	 */
	getPath(id) {
		var cpath = "";
		var curr = this.getId(id);

		while (curr) {
			cpath = curr.name + "\\" + cpath;
			curr = curr.host;
		}

		return cpath.split("\\").length > 1 ? cpath.slice(0, -1) : cpath;
	}

	/**
	 * 解析路径
	 * @param {string} cpath - 路径
	 * @returns {string|null} - 解析后的路径
	 */
	parsePath(cpath) {
		if (cpath.includes("%")) {
			return this.special[cpath.trim()];
		}

		cpath = cpath
			.split("\\")
			.filter((x) => x !== "")
			.map((x) => x.trim().toLowerCase());
		if (cpath.length === 0) return null;

		var pid = null,
			curr = null;
		for (var i = 0; i < this.tree.length; i++) {
			if (this.tree[i].name.toLowerCase() === cpath[0]) {
				curr = this.tree[i];
				break;
			}
		}

		if (curr) {
			var i = 1,
				l = cpath.length;
			while (curr.type === "folder" && i < l) {
				var res = true;
				for (var j = 0; j < curr.data.length; j++) {
					if (curr.data[j].name.toLowerCase() === cpath[i]) {
						i += 1;
						if (curr.data[j].type === "folder") {
							res = false;
							curr = curr.data[j];
						}
						break;
					}
				}

				if (res) break;
			}

			if (i === l) pid = curr.id;
		}

		return pid;
	}

	/**
	 * 解析文件夹
	 * @param {Object} data - 数据
	 * @param {string} name - 名称
	 * @param {Item} host - 宿主项目
	 * @returns {Item} - 解析后的项目
	 */
	parseFolder(data, name, host = null) {
		var item = new Item({
			type: data.type,
			name: data.name || name,
			info: data.info,
			host: host,
		});

		this.setId(item.id, item);

		if (data.info && data.info.spid) {
			this.setSpecial(data.info.spid, item.id);
		}

		if (item.type !== "folder") {
			item.setData(data.data);
		} else {
			var fdata = [];
			if (data.data) {
				for (const key of Object.keys(data.data)) {
					fdata.push(this.parseFolder(data.data[key], key, item));
				}
			}

			item.setData(fdata);
		}

		return item;
	}

	/**
	 * 解析数据
	 * @param {Object} data - 数据
	 */
	parse(data) {
		var drives = Object.keys(data);
		var tree = [];
		for (var i = 0; i < drives.length; i++) {
			tree.push(this.parseFolder(data[drives[i]]));
		}

		this.tree = tree;
	}
}
