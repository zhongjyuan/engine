import React, { useEffect, useState } from 'react';
import { Button, Form, Grid, Header, Image, Segment } from 'semantic-ui-react';
import { useSearchParams } from 'react-router-dom';
import {
  API,
  copy,
  showError,
  showInfo,
  showNotice,
  showSuccess,
} from '../helpers';

const PasswordResetConfirm = () => {
  const [loading, setLoading] = useState(false); // 加载状态
  const [disableButton, setDisableButton] = useState(false); // 按钮禁用状态
  const [countdown, setCountdown] = useState(30); // 倒计时
  const [newPassword, setNewPassword] = useState(''); // 新密码
  const [inputs, setInputs] = useState({
    email: '', // 邮箱输入
    token: '', // 令牌输入
  });
  const { email, token } = inputs; // 解构赋值提取 email 和 token
  const [searchParams, setSearchParams] = useSearchParams(); // 使用 searchParams

  /**
   * 在组件挂载后执行副作用操作
   */
  useEffect(() => {
    // 从 searchParams 获取 token 和 email
    let token = searchParams.get('token');
    let email = searchParams.get('email');

    // 更新 inputs 状态
    setInputs({
      token,
      email,
    });
  }, []);

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
   * 处理表单提交
   * @param {Event} e - 事件对象
   */
  async function handleSubmit(e) {
    // 设置禁用按钮状态
    setDisableButton(true);

    // 如果邮箱为空则直接返回
    if (!email) return;

    // 设置加载状态
    setLoading(true);

    // 发起重置密码的 API 请求
    const res = await API.post(`/api/user/reset`, {
      email,
      token,
    });

    // 从响应中获取成功状态和消息
    const { success, message } = res.data;

    // 如果重置成功，则获取新密码并复制到剪贴板，展示提示信息；否则展示错误信息
    if (success) {
      let password = res.data.data;
      setNewPassword(password);
      await copy(password);
      showNotice(`新密码已复制到剪贴板：${password}`);
    } else {
      showError(message);
    }

    // 恢复加载状态
    setLoading(false);
  }

  return (
    <Grid textAlign='center' style={{ marginTop: '48px' }}>
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as='h2' color='' textAlign='center'>
          <Image src='/logo.png' /> 密码重置确认
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
              readOnly
            />
            {newPassword && (
              <Form.Input
                fluid
                icon='lock'
                iconPosition='left'
                placeholder='新密码'
                name='newPassword'
                value={newPassword}
                readOnly
                onClick={(e) => {
                  e.target.select();
                  navigator.clipboard.writeText(newPassword);
                  showNotice(`密码已复制到剪贴板：${newPassword}`);
                }}
              />
            )}
            <Button
              color='green'
              fluid
              size='large'
              onClick={handleSubmit}
              loading={loading}
              disabled={disableButton}
            >
              {disableButton ? `密码重置完成` : '提交'}
            </Button>
          </Segment>
        </Form>
      </Grid.Column>
    </Grid>
  );
};

export default PasswordResetConfirm;
