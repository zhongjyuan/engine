export const common = {
	UNKNOWN: "Unknown",
};

/**数组排序常量对象 */
export const sort = {
	/**转为小写后进行排序 */
	CASEINSENSITIVE: 1,
	/**倒序 */
	DESCENDING: 2,
	/**去重后进行排序 */
	UNIQUESORT: 4,
	/**排序后返回索引器(新数组) */
	RETURNINDEXEDARRAY: 8,
	/**转为数值后进行排序 */
	NUMERIC: 16,
};

/**公共常量 */
export default {
	...common,
	sort: sort,
};
