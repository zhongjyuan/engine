import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Divider,
  Form,
  Grid,
  Header,
  Image,
  Message,
  Modal,
  Segment,
} from 'semantic-ui-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

import { UserContext } from '../context/User';
import { API, getLogo, showError, showSuccess, showWarning } from '../helpers';
import { onGitHubOAuthClicked } from './utils';

const LoginForm = () => {
  // 获取路由导航函数
  let navigate = useNavigate();

  const [status, setStatus] = useState({}); // 用于存储状态信息
  const [submitted, setSubmitted] = useState(false); // 标记表单是否已提交
  const [showWeChatLoginModal, setShowWeChatLoginModal] = useState(false); // 用于控制是否显示微信登录模态框
  const [inputs, setInputs] = useState({
    userName: '',
    password: '',
    wechatVverificationCode: '',
  }); // 用户输入的数据
  const { userName, password } = inputs; // 解构用户输入的用户名和密码

  const [userState, userDispatch] = useContext(UserContext); // 获取用户上下文状态
  const [searchParams, setSearchParams] = useSearchParams(); // 获取 URL 查询参数

  // 调用函数来获取 logo 相关信息
  const logo = getLogo();

  useEffect(() => {
    // 如果 URL 查询参数中包含 'expired'，则显示错误信息提示用户重新登录
    if (searchParams.get('expired')) {
      showError('未登录或登录已过期，请重新登录！');
    }

    // 从 localStorage 中获取存储的状态信息并更新状态变量
    let status = localStorage.getItem('status');
    if (status) {
      status = JSON.parse(status);
      setStatus(status);
    }
  }, []);

  // 当点击微信登录时调用的函数，用于显示微信登录模态框
  const onWeChatLoginClicked = () => {
    setShowWeChatLoginModal(true);
  };

  /**
   * 提交微信验证码的函数，异步操作
   */
  const onSubmitWeChatVerificationCode = async () => {
    // 发起 API 请求，获取微信登录信息
    const res = await API.get(
      `/api/oauth/wechat?code=${inputs.wechatVverificationCode}`
    );
    const { success, message, data } = res.data;

    if (success) {
      // 登录成功，更新用户状态并存储用户信息到 localStorage
      userDispatch({ type: 'login', payload: data });
      localStorage.setItem('user', JSON.stringify(data));
      navigate('/'); // 导航到首页
      showSuccess('登录成功！'); // 显示成功消息
      setShowWeChatLoginModal(false); // 关闭微信登录模态框
    } else {
      // 登录失败，显示错误消息
      showError(message);
    }
  };

  /**
   * 处理输入框内容变化的函数
   * @param {Object} e - 事件对象
   */
  function handleChange(e) {
    const { name, value } = e.target;
    setInputs((inputs) => ({ ...inputs, [name]: value }));
  }

  /**
   * 提交表单的函数，异步操作
   * @param {Object} e - 事件对象
   */
  async function handleSubmit(e) {
    setSubmitted(true); // 设置提交状态为 true

    if (userName && password) {
      // 检查用户名和密码是否存在
      const res = await API.post(`/api/user/login`, {
        // 发起登录请求
        userName,
        password,
      });

      const { success, message, data } = res.data; // 解构获取返回的数据

      if (success) {
        // 如果登录成功
        userDispatch({ type: 'login', payload: data }); // 更新用户状态
        localStorage.setItem('user', JSON.stringify(data)); // 将用户信息存储到 localStorage

        if (userName === 'root' && password === '123456') {
          // 如果是默认账号
          navigate('/user/edit'); // 导航到用户编辑页面
          showSuccess('登录成功！'); // 显示成功消息
          showWarning('请立刻修改默认密码！'); // 显示警告消息
        } else {
          // 如果不是默认账号
          navigate('/token'); // 导航到 token 页面
          showSuccess('登录成功！'); // 显示成功消息
        }
      } else {
        // 如果登录失败
        showError(message); // 显示错误消息
      }
    }
  }

  return (
    <Grid textAlign='center' style={{ marginTop: '48px' }}>
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as='h2' color='' textAlign='center'>
          <Image src={logo} /> 用户登录
        </Header>
        <Form size='large'>
          <Segment>
            <Form.Input
              fluid
              icon='user'
              iconPosition='left'
              placeholder='用户名'
              name='userName'
              value={userName}
              onChange={handleChange}
            />
            <Form.Input
              fluid
              icon='lock'
              iconPosition='left'
              placeholder='密码'
              name='password'
              type='password'
              value={password}
              onChange={handleChange}
            />
            <Button color='green' fluid size='large' onClick={handleSubmit}>
              登录
            </Button>
          </Segment>
        </Form>
        <Message>
          忘记密码？
          <Link to='/reset' className='btn btn-link'>
            点击重置
          </Link>
          ； 没有账户？
          <Link to='/register' className='btn btn-link'>
            点击注册
          </Link>
        </Message>
        {status.github_oauth || status.wechat_login ? (
          <>
            <Divider horizontal>Or</Divider>
            {status.github_oauth ? (
              <Button
                circular
                color='black'
                icon='github'
                onClick={() => onGitHubOAuthClicked(status.github_client_id)}
              />
            ) : (
              <></>
            )}
            {status.wechat_login ? (
              <Button
                circular
                color='green'
                icon='wechat'
                onClick={onWeChatLoginClicked}
              />
            ) : (
              <></>
            )}
          </>
        ) : (
          <></>
        )}
        <Modal
          onClose={() => setShowWeChatLoginModal(false)}
          onOpen={() => setShowWeChatLoginModal(true)}
          open={showWeChatLoginModal}
          size={'mini'}
        >
          <Modal.Content>
            <Modal.Description>
              <Image src={status.wechat_qrcode} fluid />
              <div style={{ textAlign: 'center' }}>
                <p>
                  微信扫码关注公众号，输入「验证码」获取验证码（三分钟内有效）
                </p>
              </div>
              <Form size='large'>
                <Form.Input
                  fluid
                  placeholder='验证码'
                  name='wechatVverificationCode'
                  value={inputs.wechatVverificationCode}
                  onChange={handleChange}
                />
                <Button
                  color=''
                  fluid
                  size='large'
                  onClick={onSubmitWeChatVerificationCode}
                >
                  登录
                </Button>
              </Form>
            </Modal.Description>
          </Modal.Content>
        </Modal>
      </Grid.Column>
    </Grid>
  );
};

export default LoginForm;
