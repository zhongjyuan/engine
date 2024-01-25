import _debug from "debug";
import Assert from "assert";

const debug = _debug("assert");

/**
 * 断言实际值等于期望值
 * @param {*} actual - 实际值
 * @param {*} expected - 期望值
 * @param {object} response - HTTP 响应对象
 *
 * @example
 * assert.equal(2 + 2, 4, response);
 */
export function equal(actual, expected, response) {
	try {
		Assert.equal(actual, expected);
	} catch (e) {
		debug(e);
		delete response.request;
		e.response = response;
		throw e;
	}
}

/**
 * 断言实际值不等于期望值
 * @param {*} actual - 实际值
 * @param {*} expected - 期望值
 * @param {object} response - HTTP 响应对象
 *
 * @example
 * assert.notEqual(2 + 2, 5, response);
 */
export function notEqual(actual, expected, response) {
	try {
		Assert.notEqual(actual, expected);
	} catch (e) {
		debug(e);
		delete response.request;
		e.response = response;
		throw e;
	}
}

/**
 * 断言实际值为真
 * @param {*} actual - 实际值
 * @param {object} response - HTTP 响应对象
 *
 * @example
 * assert.ok(2 + 2 === 4, response);
 */
export function ok(actual, response) {
	try {
		Assert.ok(actual);
	} catch (e) {
		debug(e);
		delete response.request;
		e.response = response;
		throw e;
	}
}
