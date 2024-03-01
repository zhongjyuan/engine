/**component 登录模版 */
export const comp_login = `
<div id="background">
	<div class="dynamic-background"></div>
	<div class="static-background"></div>
</div>
<div id="login-form">
	<div id="login-header">
		<img id="logo" src="./favicon.ico" alt="logo" />
		<h2 id="description">欢迎登录</h2>
	</div>
	<div id="login-body">
		<form>
			<div id="username-group" class="input-group">
				<i class="fa fa-mobile"></i>
				<input id="username" type="text" placeholder="请输入手机号" value="17370115370" />
			</div>
			<div id="password-group" class="input-group">
				<i class="fa fa-lock"></i>
				<input id="password" type="password" placeholder="请输入密码" value="zhongjyuan" />
			</div>
			<div id="captcha-group" class="captcha-group">
				<input id="captcha" type="text" placeholder="请输入验证码" />
				<button id="send-captcha">发送验证码</button>
			</div>
			<div id="third-party-login">
				<span>第三方登录：</span>
				<i class="fa fa-brands fa-weixin"></i>
				<i class="fa fa-brands fa-qq"></i>
				<i class="fa fa-brands fa-weibo"></i>
			</div>
			<button id="login-btn">登录</button>
		</form>
	</div>
	<div id="login-footer">
		<span>没有账号？</span>
		<a href="#">立即注册</a>
	</div>
</div>
<button id="switch-btn" class="active"><i class="fa fa-pause"></i></button>
`;
