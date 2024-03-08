import React, { useContext, useEffect, useState } from 'react';
import { Dimmer, Loader, Segment } from 'semantic-ui-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { API, showError, showSuccess } from '../helpers';
import { UserContext } from '../context/User';

const GitHubOAuth = () => {
  // 设置提示信息的状态，默认为 '处理中...'
  const [prompt, setPrompt] = useState('处理中...');

  // 设置处理状态的状态，默认为 true，表示正在处理中
  const [processing, setProcessing] = useState(true);

  // 使用 useContext 和 UserContext 上下文获取用户状态和派发函数
  const [userState, userDispatch] = useContext(UserContext);

  // 使用 useSearchParams 自定义 Hook 获取搜索参数
  const [searchParams, setSearchParams] = useSearchParams();

  let navigate = useNavigate();

  /**
   * 发送验证码并处理返回结果
   * @param {string} code - 验证码
   * @param {string} state - 状态
   * @param {number} count - 重试次数
   */
  const sendCode = async (code, state, count) => {
    // 发送请求到后端API，使用传入的code和state作为参数
    const res = await API.get(`/api/oauth/github?code=${code}&state=${state}`);

    // 解构获取响应中的success、message和data字段
    const { success, message, data } = res.data;

    if (success) {
      // 如果请求成功
      if (message === 'bind') {
        // 如果返回消息为'bind'，显示绑定成功提示，跳转至设置页面
        showSuccess('绑定成功！');
        navigate('/setting');
      } else {
        // 否则，更新用户状态，存储用户信息到localStorage，显示登录成功提示，跳转至首页
        userDispatch({ type: 'login', payload: data });
        localStorage.setItem('user', JSON.stringify(data));
        showSuccess('登录成功！');
        navigate('/');
      }
    } else {
      // 如果请求失败
      showError(message);

      if (count === 0) {
        // 如果重试次数已经用尽，显示提示信息，跳转至设置页面（失败绑定GitHub的情况）
        setPrompt(`操作失败，重定向至登录界面中...`);
        navigate('/setting');
        return;
      }

      // 增加重试次数，更新提示信息，等待一段时间后进行重试
      count++;
      setPrompt(`出现错误，第 ${count} 次重试中...`);
      await new Promise((resolve) => setTimeout(resolve, count * 2000));
      await sendCode(code, state, count); // 递归调用自身进行重试
    }
  };

  // 当组件挂载后执行一次的效果钩子
  useEffect(() => {
    // 从 URL 查询参数中获取 code 和 state
    let code = searchParams.get('code');
    let state = searchParams.get('state');

    // 调用 sendCode 函数发送验证码，并传入初始重试次数为 0
    sendCode(code, state, 0).then(); // 使用 then() 可以忽略异步操作的返回值
  }, []);

  return (
    <Segment style={{ minHeight: '300px' }}>
      <Dimmer active inverted>
        <Loader size='large'>{prompt}</Loader>
      </Dimmer>
    </Segment>
  );
};

export default GitHubOAuth;
