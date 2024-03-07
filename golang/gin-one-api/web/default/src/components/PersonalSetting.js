import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Divider,
  Form,
  Header,
  Image,
  Message,
  Modal,
} from 'semantic-ui-react';
import { Link, useNavigate } from 'react-router-dom';
import Turnstile from 'react-turnstile';

import {
  API,
  copy,
  showError,
  showInfo,
  showNotice,
  showSuccess,
} from '../helpers';
import { onGitHubOAuthClicked } from './utils';
import { UserContext } from '../context/User';

const PersonalSetting = () => {
  let navigate = useNavigate(); // 页面导航的钩子函数

  const [loading, setLoading] = useState(false); // 控制页面加载状态的布尔值状态变量
  const [countdown, setCountdown] = useState(30); // 倒计时的初始值，用于倒计时功能
  const [disableButton, setDisableButton] = useState(false); // 控制按钮禁用状态的布尔值状态变量
  const [turnstileEnabled, setTurnstileEnabled] = useState(false); // Turnstile 是否启用的布尔值状态变量
  const [turnstileToken, setTurnstileToken] = useState(''); // Turnstile Token 的状态变量
  const [turnstileSiteKey, setTurnstileSiteKey] = useState(''); // Turnstile Site Key 的状态变量
  const [showWeChatBindModal, setShowWeChatBindModal] = useState(false); // 控制显示微信绑定模态框的布尔值状态变量
  const [showEmailBindModal, setShowEmailBindModal] = useState(false); // 控制显示邮箱绑定模态框的布尔值状态变量
  const [showAccountDeleteModal, setShowAccountDeleteModal] = useState(false); // 控制显示账号删除模态框的布尔值状态变量

  const [status, setStatus] = useState({}); // 用于存储状态信息的对象状态变量
  const [affLink, setAffLink] = useState(''); // 用于存储关联链接的状态变量
  const [systemToken, setSystemToken] = useState(''); // 系统 Token 的状态变量

  const [userState, userDispatch] = useContext(UserContext); // 用户上下文的状态和分发函数
  const [inputs, setInputs] = useState({
    email: '', // 邮箱输入字段的值
    emailVerificationCode: '', // 邮箱验证码输入字段的值
    wechatVverificationCode: '', // 微信验证码输入字段的值
    selfAaccountDeletionConfirmation: '', // 自我账号删除确认输入字段的值
  });
  // 包含多个输入字段值的对象状态变量

  useEffect(() => {
    // 从本地存储中获取状态信息
    let status = localStorage.getItem('status');
    if (status) {
      // 如果存在状态信息，则解析并设置状态
      status = JSON.parse(status);
      setStatus(status); // 设置状态信息
      if (status.turnstile_check) {
        setTurnstileEnabled(true); // 启用 Turnstile
        setTurnstileSiteKey(status.turnstile_site_key); // 设置 Turnstile Site Key
      }
    }
  }, []);

  useEffect(() => {
    let countdownInterval = null;
    if (disableButton && countdown > 0) {
      // 如果按钮禁用且倒计时大于0，则启动倒计时定时器
      countdownInterval = setInterval(() => {
        setCountdown(countdown - 1); // 每秒减少倒计时的值
      }, 1000);
    } else if (countdown === 0) {
      // 如果倒计时为0，则重置按钮状态和倒计时值
      setDisableButton(false); // 启用按钮
      setCountdown(30); // 重置倒计时为初始值
    }
    return () => clearInterval(countdownInterval); // 组件卸载时清除定时器
  }, [disableButton, countdown]);

  /**
   * 处理输入框内容变化的函数
   * @param {Object} e - 事件对象
   * @param {Object} param1 - 包含 name 和 value 的对象
   */
  const handleInputChange = (e, { name, value }) => {
    setInputs((inputs) => ({ ...inputs, [name]: value }));
  };

  /**
   * 生成访问令牌的函数，异步操作
   */
  const generateAccessToken = async () => {
    const res = await API.get('/api/user/token');
    const { success, message, data } = res.data;

    if (success) {
      // 如果生成成功
      setSystemToken(data); // 设置系统令牌
      setAffLink(''); // 清空关联链接
      await copy(data); // 复制令牌到剪贴板
      showSuccess(`令牌已重置并已复制到剪贴板`); // 显示成功消息
    } else {
      // 如果生成失败
      showError(message); // 显示错误消息
    }
  };

  /**
   * 获取关联链接的函数，异步操作
   */
  const getAffLink = async () => {
    const res = await API.get('/api/user/aff');
    const { success, message, data } = res.data;

    if (success) {
      // 如果获取成功
      let link = `${window.location.origin}/register?aff=${data}`; // 构建邀请链接
      setAffLink(link); // 设置关联链接
      setSystemToken(''); // 清空系统令牌
      await copy(link); // 复制邀请链接到剪贴板
      showSuccess(`邀请链接已复制到剪切板`); // 显示成功消息
    } else {
      // 如果获取失败
      showError(message); // 显示错误消息
    }
  };
  /**
   * 处理点击关联链接的函数
   * @param {Event} e 事件对象
   */
  const handleAffLinkClick = async (e) => {
    e.target.select(); // 选中文本框内容
    await copy(e.target.value); // 复制文本框内容到剪贴板
    showSuccess(`邀请链接已复制到剪切板`); // 显示成功消息
  };

  /**
   * 处理点击系统令牌的函数
   * @param {Event} e 事件对象
   */
  const handleSystemTokenClick = async (e) => {
    e.target.select(); // 选中文本框内容
    await copy(e.target.value); // 复制文本框内容到剪贴板
    showSuccess(`系统令牌已复制到剪切板`); // 显示成功消息
  };

  /**
   * 删除账户的函数
   */
  const deleteAccount = async () => {
    if (inputs.selfAaccountDeletionConfirmation !== userState.user.userName) {
      showError('请输入你的账户名以确认删除！'); // 显示错误消息
      return;
    }

    const res = await API.delete('/api/user/self');
    const { success, message } = res.data;

    if (success) {
      showSuccess('账户已删除！'); // 显示成功消息
      await API.get('/api/user/logout');
      userDispatch({ type: 'logout' });
      localStorage.removeItem('user');
      navigate('/login');
    } else {
      showError(message); // 显示错误消息
    }
  };

  /**
   * 绑定微信账户的函数
   */
  const bindWeChat = async () => {
    if (inputs.wechatVverificationCode === '') return;
    const res = await API.get(
      `/api/oauth/wechat/bind?code=${inputs.wechatVverificationCode}`
    );
    const { success, message } = res.data;
    if (success) {
      showSuccess('微信账户绑定成功！'); // 显示成功消息
      setShowWeChatBindModal(false);
    } else {
      showError(message); // 显示错误消息
    }
  };

  /**
   * 发送验证码的函数
   */
  const sendVerificationCode = async () => {
    setDisableButton(true);
    if (inputs.email === '') return;
    if (turnstileEnabled && turnstileToken === '') {
      showInfo('请稍后几秒重试，Turnstile 正在检查用户环境！'); // 显示信息消息
      return;
    }
    setLoading(true);
    const res = await API.get(
      `/api/verification?email=${inputs.email}&turnstile=${turnstileToken}`
    );
    const { success, message } = res.data;
    if (success) {
      showSuccess('验证码发送成功，请检查邮箱！'); // 显示成功消息
    } else {
      showError(message); // 显示错误消息
    }
    setLoading(false);
  };

  /**
   * 绑定邮箱账户的函数
   */
  const bindEmail = async () => {
    if (inputs.emailVerificationCode === '') return;
    setLoading(true);
    const res = await API.get(
      `/api/oauth/email/bind?email=${inputs.email}&code=${inputs.emailVerificationCode}`
    );
    const { success, message } = res.data;
    if (success) {
      showSuccess('邮箱账户绑定成功！'); // 显示成功消息
      setShowEmailBindModal(false);
    } else {
      showError(message); // 显示错误消息
    }
    setLoading(false);
  };

  return (
    <div style={{ lineHeight: '40px' }}>
      <Header as='h3'>通用设置</Header>
      <Message>
        注意，此处生成的令牌用于系统管理，而非用于请求 OpenAI
        相关的服务，请知悉。
      </Message>
      <Button as={Link} to={`/user/edit/`}>
        更新个人信息
      </Button>
      <Button onClick={generateAccessToken}>生成系统访问令牌</Button>
      <Button onClick={getAffLink}>复制邀请链接</Button>
      <Button
        onClick={() => {
          setShowAccountDeleteModal(true);
        }}
      >
        删除个人账户
      </Button>

      {systemToken && (
        <Form.Input
          fluid
          readOnly
          value={systemToken}
          onClick={handleSystemTokenClick}
          style={{ marginTop: '10px' }}
        />
      )}
      {affLink && (
        <Form.Input
          fluid
          readOnly
          value={affLink}
          onClick={handleAffLinkClick}
          style={{ marginTop: '10px' }}
        />
      )}
      <Divider />
      <Header as='h3'>账号绑定</Header>
      {status.wechat_login && (
        <Button
          onClick={() => {
            setShowWeChatBindModal(true);
          }}
        >
          绑定微信账号
        </Button>
      )}
      <Modal
        onClose={() => setShowWeChatBindModal(false)}
        onOpen={() => setShowWeChatBindModal(true)}
        open={showWeChatBindModal}
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
                onChange={handleInputChange}
              />
              <Button color='' fluid size='large' onClick={bindWeChat}>
                绑定
              </Button>
            </Form>
          </Modal.Description>
        </Modal.Content>
      </Modal>
      {status.github_oauth && (
        <Button
          onClick={() => {
            onGitHubOAuthClicked(status.github_client_id);
          }}
        >
          绑定 GitHub 账号
        </Button>
      )}
      <Button
        onClick={() => {
          setShowEmailBindModal(true);
        }}
      >
        绑定邮箱地址
      </Button>
      <Modal
        onClose={() => setShowEmailBindModal(false)}
        onOpen={() => setShowEmailBindModal(true)}
        open={showEmailBindModal}
        size={'tiny'}
        style={{ maxWidth: '450px' }}
      >
        <Modal.Header>绑定邮箱地址</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <Form size='large'>
              <Form.Input
                fluid
                placeholder='输入邮箱地址'
                onChange={handleInputChange}
                name='email'
                type='email'
                action={
                  <Button
                    onClick={sendVerificationCode}
                    disabled={disableButton || loading}
                  >
                    {disableButton ? `重新发送(${countdown})` : '获取验证码'}
                  </Button>
                }
              />
              <Form.Input
                fluid
                placeholder='验证码'
                name='emailVerificationCode'
                value={inputs.emailVerificationCode}
                onChange={handleInputChange}
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
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: '1rem',
                }}
              >
                <Button
                  color=''
                  fluid
                  size='large'
                  onClick={bindEmail}
                  loading={loading}
                >
                  确认绑定
                </Button>
                <div style={{ width: '1rem' }}></div>
                <Button
                  fluid
                  size='large'
                  onClick={() => setShowEmailBindModal(false)}
                >
                  取消
                </Button>
              </div>
            </Form>
          </Modal.Description>
        </Modal.Content>
      </Modal>
      <Modal
        onClose={() => setShowAccountDeleteModal(false)}
        onOpen={() => setShowAccountDeleteModal(true)}
        open={showAccountDeleteModal}
        size={'tiny'}
        style={{ maxWidth: '450px' }}
      >
        <Modal.Header>危险操作</Modal.Header>
        <Modal.Content>
          <Message>您正在删除自己的帐户，将清空所有数据且不可恢复</Message>
          <Modal.Description>
            <Form size='large'>
              <Form.Input
                fluid
                placeholder={`输入你的账户名 ${userState?.user?.userName} 以确认删除`}
                name='selfAaccountDeletionConfirmation'
                value={inputs.selfAaccountDeletionConfirmation}
                onChange={handleInputChange}
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
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: '1rem',
                }}
              >
                <Button
                  color='red'
                  fluid
                  size='large'
                  onClick={deleteAccount}
                  loading={loading}
                >
                  确认删除
                </Button>
                <div style={{ width: '1rem' }}></div>
                <Button
                  fluid
                  size='large'
                  onClick={() => setShowAccountDeleteModal(false)}
                >
                  取消
                </Button>
              </div>
            </Form>
          </Modal.Description>
        </Modal.Content>
      </Modal>
    </div>
  );
};

export default PersonalSetting;
