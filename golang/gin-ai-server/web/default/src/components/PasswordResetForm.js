import React, { useEffect, useState } from 'react';
import { Button, Form, Grid, Header, Image, Segment } from 'semantic-ui-react';
import Turnstile from 'react-turnstile';

import { API, showError, showInfo, showSuccess } from '../helpers';

const PasswordResetForm = () => {
  const [countdown, setCountdown] = useState(30); // 倒计时
  const [loading, setLoading] = useState(false); // 加载状态
  const [disableButton, setDisableButton] = useState(false); // 按钮禁用状态
  const [turnstileEnabled, setTurnstileEnabled] = useState(false); // 转门是否启用
  const [turnstileToken, setTurnstileToken] = useState(''); // 转门 Token
  const [turnstileSiteKey, setTurnstileSiteKey] = useState(''); // 转门 Site Key
  const [inputs, setInputs] = useState({
    email: '',
  });
  const { email } = inputs; // 解构获取 email

  /**
   * 在 disableButton 或 countdown 发生变化时执行副作用操作
   */
  useEffect(() => {
    let countdownInterval = null;

    // 如果 disableButton 为 true 且 countdown 大于 0，则启动倒计时
    if (disableButton && countdown > 0) {
      countdownInterval = setInterval(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (countdown === 0) {
      // 如果 countdown 为 0，则重置 disableButton 和 countdown
      setDisableButton(false);
      setCountdown(30);
    }

    // 在组件卸载前清除定时器
    return () => clearInterval(countdownInterval);
  }, [disableButton, countdown]);

  /**
   * 处理输入框变化事件
   * @param {Event} e - 事件对象
   */
  function handleChange(e) {
    const { name, value } = e.target;

    // 使用函数形式更新 inputs 状态，以确保获取到最新的 inputs 值
    setInputs((inputs) => ({ ...inputs, [name]: value }));
  }

  /**
   * 提交表单处理函数
   * @param {Event} e - 事件对象
   */
  async function handleSubmit(e) {
    setDisableButton(true);

    // 检查是否输入了邮箱地址
    if (!email) return;

    // 检查 Turnstile 是否启用且 Token 为空
    if (turnstileEnabled && turnstileToken === '') {
      showInfo('请稍后几秒重试，Turnstile 正在检查用户环境！');
      return;
    }

    setLoading(true);

    // 发起异步请求，重置密码
    const res = await API.get(
      `/api/reset_password?email=${email}&turnstile=${turnstileToken}`
    );
    const { success, message } = res.data;

    // 根据请求结果显示消息
    if (success) {
      showSuccess('重置邮件发送成功，请检查邮箱！');
      setInputs({ ...inputs, email: '' });
    } else {
      showError(message);
    }
    setLoading(false);
  }

  return (
    <Grid textAlign='center' style={{ marginTop: '48px' }}>
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as='h2' color='' textAlign='center'>
          <Image src='/logo.png' /> 密码重置
        </Header>
        <Form size='large'>
          <Segment>
            <Form.Input
              fluid
              icon='mail'
              iconPosition='left'
              placeholder='邮箱地址'
              name='email'
              value={email}
              onChange={handleChange}
            />
            {turnstileEnabled ? (
              <Turnstile
                sitekey={turnstileSiteKey}
                onVerify={(token) => {
                  setTurnstileToken(token);
                }}
              />
            ) : (
              <></>
            )}
            <Button
              color='green'
              fluid
              size='large'
              onClick={handleSubmit}
              loading={loading}
              disabled={disableButton}
            >
              {disableButton ? `重试 (${countdown})` : '提交'}
            </Button>
          </Segment>
        </Form>
      </Grid.Column>
    </Grid>
  );
};

export default PasswordResetForm;
