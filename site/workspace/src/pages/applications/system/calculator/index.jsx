import React, { useState } from "react";
import { useSelector } from "react-redux";

import { Icon, ToolBar } from "@/components/global";

export const CalculateWind = () => {
	const app = useSelector((state) => state.apps.calculator);

	const [error, setError] = useState(null); // 错误信息
	const [history, setHistory] = useState([]); // 计算历史记录
	const [equation, setEquation] = useState([]); // 数学表达式
	const [currentValue, setCurrentValue] = useState("0"); // 当前值

	/**
	 * 获取节点相对于其兄弟节点的索引。
	 *
	 * @param {Node} node - 要查找索引的节点。
	 * @returns {number} - 节点的索引。
	 */
	const getIndex = (node) => {
		let index = 0; // 将索引变量初始化为 0

		// 循环遍历节点的前一个兄弟节点
		while ((node = node.previousSibling) !== null) {
			index++; // 每个前一个兄弟节点增加索引
		}

		return index; // 返回最终的索引
	};

	/**
	 * 处理用户操作
	 * @param {Event} event - 事件对象
	 */
	const action = (event) => {
		const btn = event.target.dataset.ch; // 获取按钮值
		const index = getIndex(event.target); // 获取按钮索引

		let val = currentValue; // 当前显示的值

		switch (index) {
			case 1:
				// 清除当前值
				setCurrentValue("0");
				break;
			case 2:
				// 清除所有数据
				setCurrentValue("0");
				setEquation([]);
				setError(null);
				break;
			case 3:
				// 删除最后一个字符
				val = val.slice(0, -1) || "0";
				setCurrentValue(val);
				break;
			default:
				// 处理不同操作

				// 处理无穷大或非数值情况
				if (index === 0 && (val === "Infinity" || val === "NaN")) {
					setError(val);
					return;
				}

				// 处理数字输入
				if (index > 7 && (index + 1) % 4 !== 0) {
					handleNumberInput(btn, val);
				}

				// 处理特殊操作
				else if (index < 7 || btn === "inv" || btn === "sq" || btn === "sqrt") {
					handleSpecialOperation(btn, val);
				}

				// 处理算术操作
				else {
					handleArithmeticOperation(btn);
				}
		}
	};

	/**
	 * 处理数字输入
	 * @param {string} btn - 按钮值
	 * @param {string} val - 当前值
	 */
	const handleNumberInput = (btn, val) => {
		let updatedVal = val; // 初始化更新后的值

		if (btn === ".") {
			// 如果按钮是小数点
			updatedVal = val.includes(".") ? val : val + ".";
		} else {
			// 如果按钮是数字
			updatedVal = val === "0" ? btn : val + btn;
		}

		// 检查更新后的值是否符合要求
		if (updatedVal.length < 17 && /^-?[0-9]+([.][0-9]*)?$/.test(updatedVal)) {
			// 更新当前值
			setCurrentValue(updatedVal);
		}
	};

	/**
	 * 处理特殊操作
	 * @param {string} btn - 按钮值
	 * @param {string} val - 当前值
	 */
	const handleSpecialOperation = (btn, val) => {
		switch (btn) {
			case "inv":
				// 处理倒数操作
				handleInverse(val);
				break;
			case "sq":
				// 处理平方操作
				setCurrentValue((parseFloat(val) ** 2).toString());
				break;
			case "sqrt":
				// 处理平方根操作
				handleSquareRoot(val);
				break;
			default:
				// 默认情况
				break;
		}
	};

	/**
	 * 处理倒数操作
	 * @param {string} val - 当前值
	 */
	const handleInverse = (val) => {
		const num = parseFloat(val); // 将当前值转换为数字
		if (num !== 0) {
			// 如果当前值不为零
			setCurrentValue((1 / num).toString()); // 更新当前值为倒数
		} else {
			// 如果当前值为零
			setError("Cannot divide by zero"); // 显示错误信息
		}
	};

	/**
	 * 处理平方根操作
	 * @param {string} val - 当前值
	 */
	const handleSquareRoot = (val) => {
		const num = parseFloat(val); // 将当前值转换为数字
		if (val[0] !== "-") {
			// 如果当前值不是负数
			setCurrentValue(Math.sqrt(num).toString()); // 更新当前值为平方根
		} else {
			// 如果当前值是负数
			setError("Invalid Input"); // 显示错误信息
		}
	};

	/**
	 * 处理算术操作
	 * @param {string} btn - 操作按钮
	 */
	const handleArithmeticOperation = (btn) => {
		let equationArr = [...equation]; // 复制当前的计算表达式数组

		if (btn === "=") {
			// 如果按钮是等号
			handleEqualOperation(equationArr); // 处理等号操作
		} else {
			// 如果按钮不是等号
			handleNonEqualOperation(btn, equationArr); // 处理非等号操作
		}
	};

	/**
	 * 处理等号操作
	 * @param {array} equationArr - 计算表达式数组
	 */
	const handleEqualOperation = (equationArr) => {
		if (equationArr[1] && equationArr[2]) {
			// 如果表达式数组中有运算符和第二个操作数
			const result = performCalculation(equationArr[0], equationArr[1], equationArr[2]); // 执行计算
			setCurrentValue(result.toString()); // 更新当前值为计算结果
			addToHistory(equationArr, result); // 将计算历史记录添加到历史记录中
		}
	};

	/**
	 * 处理非等号操作
	 * @param {string} btn - 操作按钮
	 * @param {array} equationArr - 计算表达式数组
	 */
	const handleNonEqualOperation = (btn, equationArr) => {
		if (equationArr[2] === null) {
			// 如果第三个元素为空
			equationArr[0] = parseFloat(currentValue); // 将当前值转换为数字并赋给第一个操作数
			equationArr[1] = btn; // 设置运算符
		} else {
			equationArr = [currentValue, btn]; // 更新为新的表达式数组
		}
		setCurrentValue("0"); // 将当前值重置为 0
		setEquation(equationArr); // 更新计算表达式数组
	};

	/**
	 * 执行计算
	 * @param {number} num1 - 第一个操作数
	 * @param {string} operator - 运算符
	 * @param {number} num2 - 第二个操作数
	 * @returns {number|string} - 计算结果或错误提示
	 */
	const performCalculation = (num1, operator, num2) => {
		switch (operator) {
			case "/":
				return num2 !== 0 ? num1 / num2 : "Cannot divide by zero"; // 执行除法运算，避免除数为零的情况
			case "x":
				return num1 * num2; // 执行乘法运算
			case "-":
				return num1 - num2; // 执行减法运算
			case "+":
				return num1 + num2; // 执行加法运算
			default:
				return ""; // 默认返回空字符串
		}
	};

	/**
	 * 将计算历史记录添加到历史记录中
	 * @param {array} equationArr - 计算表达式数组
	 * @param {number} result - 计算结果
	 */
	const addToHistory = (equationArr, result) => {
		const updatedHistory = [...history]; // 创建历史记录的副本
		equationArr.push("="); // 将等号添加到表达式数组中
		equationArr.push(result); // 将计算结果添加到表达式数组中
		updatedHistory.push(equationArr); // 将更新后的表达式数组添加到历史记录中
		setHistory(updatedHistory); // 更新历史记录
	};

	return (
		<div
			id={app.icon + "App"}
			className="wind wind-calculator dpShad"
			style={{ ...(app.size == "cstm" ? app.dim : null), zIndex: app.z }}
			data-max={app.max}
			data-size={app.size}
			data-hide={app.hide}
		>
			<ToolBar app={app.action} icon={app.icon} size={app.size} name="计算器" />
			<div className="wind-screen flex flex-col" data-dock="true">
				<div className="flex pt-2">
					<div className="flex pl-2 items-center">
						<Icon className="menu-bar" fafa="faBars" color="#222" width={14} />
						<div className="mx-4 font-semibold pb-1">标准</div>
					</div>
				</div>
				<div className="wind-rest h-full flex-grow flex">
					<div className="w-full flex-grow flex flex-col relative">
						<div className="value-container w-full">
							<div className="equation-container">
								{equation[0]} {equation[1]} {equation[2]} {equation[3]} {equation[4]}
							</div>
							<div className="value-content-container">{error == null ? currentValue : error}</div>
						</div>
						<div className="memory-container">
							<div>MC</div>
							<div>MR</div>
							<div>M+</div>
							<div>M-</div>
							<div>MS</div>
						</div>
						<div className="operate-container" data-error={error != null}>
							<div className="operate" data-ch="%" onClick={action}>
								%
							</div>
							<div className="operate" data-ch="CE" onClick={action}>
								CE
							</div>
							<div className="operate" data-ch="C" onClick={action}>
								C
							</div>
							<div className="operate" data-ch="back" onClick={action}>
								<Icon fafa="faBackspace" />
							</div>
							<div className="operate" data-ch="inv" onClick={action}>
								1/x
							</div>
							<div className="operate square" data-ch="sq" onClick={action}>
								x<sup className="text-xss">2</sup>
							</div>
							<div className="operate square" data-ch="sqrt" onClick={action}>
								<sup className="text-xss">2</sup>
								√x
							</div>
							<div className="operate" data-ch="/" onClick={action}>
								/
							</div>
							<div className="operate" data-ch="7" onClick={action}>
								7
							</div>
							<div className="operate" data-ch="8" onClick={action}>
								8
							</div>
							<div className="operate" data-ch="9" onClick={action}>
								9
							</div>
							<div className="operate" data-ch="x" onClick={action}>
								x
							</div>
							<div className="operate" data-ch="4" onClick={action}>
								4
							</div>
							<div className="operate" data-ch="5" onClick={action}>
								5
							</div>
							<div className="operate" data-ch="6" onClick={action}>
								6
							</div>
							<div className="operate" data-ch="-" onClick={action}>
								-
							</div>
							<div className="operate" data-ch="1" onClick={action}>
								1
							</div>
							<div className="operate" data-ch="2" onClick={action}>
								2
							</div>
							<div className="operate" data-ch="3" onClick={action}>
								3
							</div>
							<div className="operate" data-ch="+" onClick={action}>
								+
							</div>
							<div className="operate" data-ch="+-" onClick={action}>
								+/-
							</div>
							<div className="operate" data-ch="0" onClick={action}>
								0
							</div>
							<div className="operate" data-ch="." onClick={action}>
								.
							</div>
							<div className="operate" data-ch="=" onClick={action}>
								=
							</div>
						</div>
					</div>
					<div className="calculator-history flex flex-col">
						<div className="text-sm font-semibold">历史</div>
						{history.length != 0 ? null : <div className="text-xs mt-4">尚无历史记录</div>}
						<div className="history-container scroll">
							<div className="history-content h-max flex-grow">
								{history.map((his) => {
									return (
										<div className="flex flex-col items-end mb-6 text-gray-500">
											{his[0]} {his[1]} {his[2]} {his[3]}
											<div className="text-2xl text-gray-600">{his[4]}</div>
										</div>
									);
								})}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
