import React, { useEffect, useState } from 'react';
import {
  Button,
  Form,
  Grid,
  Header,
  Image,
  Message,
  Segment,
} from 'semantic-ui-react';
import { Link, useNavigate } from 'react-router-dom';
import Turnstile from 'react-turnstile';

import { API, getLogo, showError, showInfo, showSuccess } from '../helpers';

const RegisterForm = () => {
  let navigate = useNavigate();

  // 初始化加载状态变量
  const [loading, setLoading] = useState(false);
  // 初始化turnstileEnabled状态变量
  const [turnstileEnabled, setTurnstileEnabled] = useState(false);
  // 初始化turnstileToken状态变量
  const [turnstileToken, setTurnstileToken] = useState('');
  // 初始化turnstileSiteKey状态变量
  const [turnstileSiteKey, setTurnstileSiteKey] = useState('');
  // 初始化showEmailVerification状态变量
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  // 使用useState声明一个名为inputs的state变量，同时提供更新该state的函数setInputs
  const [inputs, setInputs] = useState({
    // 初始化用户名为空字符串
    userName: '',
    // 初始化密码为空字符串
    password: '',
    // 初始化确认密码为空字符串
    password2: '',
    // 初始化邮箱为空字符串
    email: '',
    // 初始化验证码为空字符串
    verificationCode: '',
  });

  // 从inputs中解构出userName、password和password2
  const { userName, password, password2 } = inputs;

  // 调用getLogo()函数获取logo图片
  const logo = getLogo();

  // 从URL参数中获取'aff'值并存储到localStorage中
  let affCode = new URLSearchParams(window.location.search).get('aff');
  if (affCode) {
    localStorage.setItem('aff', affCode);
  }

  useEffect(() => {
    // 从localStorage中获取status值
    let status = localStorage.getItem('status');
    if (status) {
      // 解析status为对象
      status = JSON.parse(status);
      // 根据status中的email_verification值来设置showEmailVerification状态变量
      setShowEmailVerification(status.email_verification);
      // 如果status中的turnstile_check为true，则设置turnstileEnabled状态变量为true，并设置turnstileSiteKey状态变量为status中的turnstile_site_key值
      if (status.turnstile_check) {
        setTurnstileEnabled(true);
        setTurnstileSiteKey(status.turnstile_site_key);
      }
    }
  });

  /**
   * 处理输入框内容变化的函数
   * @param {Object} e - 事件对象
   */
  function handleChange(e) {
    // 从事件对象中获取输入框的name和value
    const { name, value } = e.target;
    console.log(name, value); // 输出输入框的name和value到控制台
    // 使用回调函数形式更新inputs状态，保留之前的state并更新指定的属性值
    setInputs((inputs) => ({ ...inputs, [name]: value }));
  }

  /**
   * 处理表单提交的函数
   * @param {Object} e - 事件对象
   */
  async function handleSubmit(e) {
    if (password.length < 8) {
      showInfo('密码长度不得小于 8 位！'); // 显示提示信息
      return;
    }
    if (password !== password2) {
      showInfo('两次输入的密码不一致'); // 显示提示信息
      return;
    }
    if (userName && password) {
      if (turnstileEnabled && turnstileToken === '') {
        showInfo('请稍后几秒重试，Turnstile 正在检查用户环境！'); // 显示提示信息
        return;
      }
      setLoading(true); // 设置loading状态为true
      if (!affCode) {
        affCode = localStorage.getItem('aff');
      }
      inputs.affCode = affCode; // 将affCode添加到inputs对象中
      const res = await API.post(
        `/api/user/register?turnstile=${turnstileToken}`,
        inputs
      ); // 发起注册请求
      const { success, message } = res.data;
      if (success) {
        navigate('/login'); // 注册成功后跳转到登录页面
        showSuccess('注册成功！'); // 显示成功信息
      } else {
        showError(message); // 显示错误信息
      }
      setLoading(false); // 设置loading状态为false
    }
  }

  /**
   * 发送验证码的函数
   */
  const sendVerificationCode = async () => {
    if (inputs.email === '') return; // 如果邮箱为空，则直接返回
    if (turnstileEnabled && turnstileToken === '') {
      showInfo('请稍后几秒重试，Turnstile 正在检查用户环境！'); // 显示提示信息
      return;
    }
    setLoading(true); // 设置loading状态为true
    const res = await API.get(
      `/api/verification?email=${inputs.email}&turnstile=${turnstileToken}`
    ); // 发起获取验证码请求
    const { success, message } = res.data;
    if (success) {
      showSuccess('验证码发送成功，请检查你的邮箱！'); // 显示成功信息
    } else {
      showError(message); // 显示错误信息
    }
    setLoading(false); // 设置loading状态为false
  };

  return (
    <Grid textAlign='center' style={{ marginTop: '48px' }}>
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as='h2' color='' textAlign='center'>
          <Image src={logo} /> 新用户注册
        </Header>
        <Form size='large'>
          <Segment>
            <Form.Input
              fluid
              icon='user'
              iconPosition='left'
              placeholder='输入用户名，最长 12 位'
              onChange={handleChange}
              name='userName'
            />
            <Form.Input
              fluid
              icon='lock'
              iconPosition='left'
              placeholder='输入密码，最短 8 位，最长 20 位'
              onChange={handleChange}
              name='password'
              type='password'
            />
            <Form.Input
              fluid
              icon='lock'
              iconPosition='left'
              placeholder='输入密码，最短 8 位，最长 20 位'
              onChange={handleChange}
              name='password2'
              type='password'
            />
            {showEmailVerification ? (
              <>
                <Form.Input
                  fluid
                  icon='mail'
                  iconPosition='left'
                  placeholder='输入邮箱地址'
                  onChange={handleChange}
                  name='email'
                  type='email'
                  action={
                    <Button onClick={sendVerificationCode} disabled={loading}>
                      获取验证码
                    </Button>
                  }
                />
                <Form.Input
                  fluid
                  icon='lock'
                  iconPosition='left'
                  placeholder='输入验证码'
                  onChange={handleChange}
                  name='verificationCode'
                />
              </>
            ) : (
              <></>
            )}
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
            >
              注册
            </Button>
          </Segment>
        </Form>
        <Message>
          已有账户？
          <Link to='/login' className='btn btn-link'>
            点击登录
          </Link>
        </Message>
      </Grid.Column>
    </Grid>
  );
};

export default RegisterForm;
