import React from "react";
import { connect } from "react-redux";
import { Form, Input, Button, Icon, Spin, Alert, Checkbox } from "antd";

//组件
const FormItem = Form.Item;

function mapStateToProps(state) {
	return {
		main: state.main,
	};
}

class Login extends React.Component {
	render() {
		return (
			<div className="container">
				<h1>Please Login</h1>
				<form>
					{/* <!-- 邮箱账号 --> */}
					<div className="form-control">
						<input type="text" required=""></input>
						<label>
							<span style={{transitionDelay:'0ms'}}>E</span>
							<span style={{transitionDelay:'50ms'}}>m</span>
							<span style={{transitionDelay:'100ms'}}>a</span>
							<span style={{transitionDelay:'150ms'}}>i</span>
							<span style={{transitionDelay:'200ms'}}>l</span>
						</label>
					</div>

					{/* <!-- 密码 --> */}
					<div className="form-control">
						<input type="password" required=""></input>
						<label>
							<span style={{transitionDelay:'0ms'}}>P</span>
							<span style={{transitionDelay:'50ms'}}>a</span>
							<span style={{transitionDelay:'100ms'}}>s</span>
							<span style={{transitionDelay:'150ms'}}>s</span>
							<span style={{transitionDelay:'200ms'}}>w</span>
							<span style={{transitionDelay:'250ms'}}>o</span>
							<span style={{transitionDelay:'300ms'}}>r</span>
							<span style={{transitionDelay:'350ms'}}>d</span>
						</label>
					</div>
					{/* <!-- 按钮 --> */}
					<button className="btn">Login</button>
					{/* <!-- 底部提示 --> */}
					<p className="text">
						Don't have an account? <a href="#">Register</a>{" "}
					</p>
				</form>
			</div>
		);
	}
}

export default connect(mapStateToProps)(Login);
