import React from "react";
import { connect } from "react-redux";
import { IntlProvider } from "react-intl";
import { Icon, notification, Button, Input, message, Modal, Table } from "antd";

import { config, tool as i18nTool } from "../../tools/i18n";

import { permission } from "../../tools/permission";
import { socketClientSave } from "../actions/main";

import subscribe from "../../tools/socket/subscribe";
import application from "../../../public/config/application";

import LoginPage from "./login";

const messages = config();

/**
 * 程序入口组件
 */
class Main extends React.Component {
	/**
	 * 构造函数
	 * @param {*} props
	 */
	constructor(props) {
		super(props);

		//构建本地state,只能这个页面中使用
		this.state = {
			visible: false,
			showResults: false,
			activeKeys: ["homePage"],
			activeKey: "homePage",
			panes: [],
		};
	}

	/**
	 * 点击事件
	 */
	eventClick = () => {
		messageHelp(globalMesage, 3);
	};

	/**
	 * 异常事件
	 */
	eventError = () => {
		message.error(globalMesage);
	};

	/**
	 * 成功事件
	 */
	eventSuccess = () => {
		message.success(globalMesage);
	};

	/**
	 * 显示执行结果
	 */
	showExcuteResults = () => {
		this.setState({
			showResults: true,
		});
	};

	/**
	 * 关闭执行结果
	 */
	closeExcuteResults = () => {
		this.setState({
			showResults: false,
		});
	};

	/**
	 * 进入页面就会去执行(初始化完成后)
	 */
	componentDidMount() {
		const { dispatch } = this.props;
		const { language } = this.props.main;

		var socketUrl = application.socketUrl;
		var socket = io.connect(socketUrl);

		if (socket != null) {
			dispatch(socketClientSave(socket));

			const btn_gotoLogin_click = function () {
				location.reload(false);
			};

			const btn_gotoLogin = (
				<Button type="primary" size="small" onClick={btn_gotoLogin_click}>
					{i18nTool(language, "Go To Login")}
				</Button>
			);

			/**监听与后台服务端断开连接 */
			socket.on(subscribe.server.disconnect, function (data) {
				notification.open({
					duration: 0,
					btn_gotoLogin,
					message: i18nTool(language, "Socket Disconnect"),
					description: i18nTool(language, "Server Disconnect"),
					icon: <Icon type="frown-o" style={{ color: "#e9080b" }} />,
				});

				// location.reload(false);
			});

			/**监听Node端Socket Client断开连接(异常) */
			socket.on(subscribe.socketclient.disconnect, function (data) {
				notification.open({
					duration: 0,
					btn_gotoLogin,
					message: i18nTool(language, "Socket Disconnect"),
					description: i18nTool(language, "Socket Client Disconnect"),
					icon: <Icon type="frown-o" style={{ color: "#e9080b" }} />,
				});
			});

			/**监听Node端Socket Server断开连接 */
			socket.on(subscribe.socketserver.disconnect, function () {
				notification.open({
					duration: 0,
					btn_gotoLogin,
					message: i18nTool(language, "Socket Disconnect"),
					description: i18nTool(language, "Socket Server Disconnect"),
					icon: <Icon type="frown-o" style={{ color: "#e9080b" }} />,
				});
			});

			/**监听用户被踢下线 */
			socket.on(subscribe.login.unique, function (data) {
				notification.open({
					duration: 0,
					btn_gotoLogin,
					message: i18nTool(language, "Ticket Tip"),
					description: i18nTool(language, "Ticket Message"),
					icon: <Icon type="frown-o" style={{ color: "#e9080b" }} />,
				});
			});

			/**监听修改密码响应 */
			socket.on(subscribe.account.updatepassword_response, function (data) {
				notification.open({
					duration: 0,
					message: i18nTool(language, "Password Update Tip"),
					description: data,
				});
			});

			/**监听租户断开连接(异常) */
			socket.on(subscribe.tenant.error, function (data) {
				notification.open({
					duration: 0,
					message: i18nTool(language, "System Tip"),
					description: data,
				});
			});
		}
	}

	render() {
		const { language, results } = this.props.main;
		const { isLogin } = this.props.account;

		const resultColumns = [
			{
				title: i18nTool(language, "Result Column Key Title"),
				dataIndex: "name",
			},
			{
				title: i18nTool(language, "Result Column Status Title"),
				dataIndex: "code",
				render: (text) => (
					<span>
						{text == -1 ? (
							<Icon type="loading" />
						) : text == 0 ? (
							<span style={{ color: "green" }}>
								{i18nTool(language, "Result Column Status Success")}
							</span>
						) : (
							<span style={{ color: "red" }}>
								{i18nTool(language, "Result Column Status Fail")}
							</span>
						)}
					</span>
				),
			},
			{
				title: i18nTool(language, "Result Column Message Title"),
				dataIndex: "msg",
			},
		];
		return (
			<IntlProvider locale={language} messages={messages[language]}>
				<div style={{ height: "100%" }}>
					{isLogin ? <LoginPage /> : <LoginPage />}
					<Button
						id="eventClick"
						onClick={() => {
							this.eventClick();
						}}
						style={{ display: "none" }}
					/>
					<Button
						id="eventError"
						onClick={() => {
							this.eventError();
						}}
						style={{ display: "none" }}
					/>
					<Button
						id="eventSuccess"
						onClick={() => {
							this.eventSuccess();
						}}
						style={{ display: "none" }}
					/>
					<Button
						id="showExcuteResult"
						onClick={() => {
							this.showExcuteResults();
						}}
						style={{ display: "none" }}
					/>
					<Modal
						visible={this.state.showResults}
						title={"执行结果"}
						footer={null}
						onCancel={this.closeExcuteResults}
						width={"40%"}>
						<Table
							bordered
							size="small"
							pagination={false}
							dataSource={results}
							columns={resultColumns}
						/>
					</Modal>
				</div>
			</IntlProvider>
		);
	}
}

/**
 * 消息帮助函数
 * @param {*} title 标题
 * @param {*} timeOut 时长
 */
function messageHelp(title, timeOut) {
	message.loading(title, timeOut);
}

/**
 * 将 State 数据转换到 Props 中
 * @param {*} state 数据源
 * @returns
 */
function mapStateToProps(state) {
	return {
		main: state.main,
		account: state.account,
	};
}

export default connect(mapStateToProps)(Main);
