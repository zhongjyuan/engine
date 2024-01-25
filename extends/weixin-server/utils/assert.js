"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.equal = equal;
exports.notEqual = notEqual;
exports.ok = ok;

var _debug2 = require("debug");

var _debug3 = _interopRequireDefault(_debug2);

var _assert = require("assert");

var _assert2 = _interopRequireDefault(_assert);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = (0, _debug3.default)("assert");

/**
 * 断言实际值等于期望值
 * @param {*} actual - 实际值
 * @param {*} expected - 期望值
 * @param {object} response - HTTP 响应对象
 *
 * @example
 * assert.equal(2 + 2, 4, response);
 */
function equal(actual, expected, response) {
	try {
		_assert2.default.equal(actual, expected);
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
function notEqual(actual, expected, response) {
	try {
		_assert2.default.notEqual(actual, expected);
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
function ok(actual, response) {
	try {
		_assert2.default.ok(actual);
	} catch (e) {
		debug(e);
		delete response.request;
		e.response = response;
		throw e;
	}
}
//# sourceMappingURL=assert.js.map