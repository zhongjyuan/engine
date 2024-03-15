/**
 * 权限(是否有权限)
 * @param {*} permission 权限集
 * @param {*} key 权限键
 * @returns 
 */
export function permission(permission, key) {
	var value = permission[key];
	if (value == null || value == undefined) {
		return false;
	} else {
		for (var index in value) {
			if (value[index]) {
				return true;
			}
		}
	}
}
