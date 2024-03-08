import React, { useEffect, useState } from 'react';
import { Button, Form, Header, Segment } from 'semantic-ui-react';
import { useParams, useNavigate } from 'react-router-dom';

import { API, showError, showSuccess } from '../../helpers';

const EditUser = () => {
  const params = useParams();
  const navigate = useNavigate();

  const userId = params.id;

  const [loading, setLoading] = useState(true);

  const [inputs, setInputs] = useState({
    userName: '',
    displayName: '',
    password: '',
    email: '',
    profile: {
      githubId: '',
      wechatId: '',
    },
  });
  const {
    userName,
    displayName,
    password,
    email,
    profile: { githubId, wechatId },
  } = inputs;

  const handleInputChange = (e, { name, value }) => {
    setInputs((inputs) => ({ ...inputs, [name]: value }));
  };

  const handleCancel = () => {
    navigate('/setting');
  };

  const loadUser = async () => {
    let res = undefined;
    if (userId) {
      res = await API.get(`/api/user/${userId}`);
    } else {
      res = await API.get(`/api/user/self`);
    }
    const { success, message, data } = res.data;
    if (success) {
      data.password = '';
      setInputs(data);
      // setInputs({ ...data, ...data.profile, password: '' });
    } else {
      showError(message);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadUser().then();
  }, []);

  const submit = async () => {
    let res = undefined;
    if (userId) {
      let data = { ...inputs, id: parseInt(userId) };
      if (typeof data.quota === 'string') {
        data.quota = parseInt(data.quota);
      }
      res = await API.put(`/api/user/`, data);
    } else {
      res = await API.put(`/api/user/self`, inputs);
    }
    const { success, message } = res.data;
    if (success) {
      showSuccess('用户信息更新成功！');
    } else {
      showError(message);
    }
  };

  return (
    <>
      <Segment loading={loading}>
        <Header as="h3">更新用户信息</Header>
        <Form autoComplete="new-password">
          <Form.Field>
            <Form.Input
              label="用户名"
              name="userName"
              placeholder={'请输入新的用户名'}
              onChange={handleInputChange}
              value={userName}
              autoComplete="new-password"
            />
          </Form.Field>
          <Form.Field>
            <Form.Input
              label="密码"
              name="password"
              type={'password'}
              placeholder={'请输入新的密码，最短 8 位'}
              onChange={handleInputChange}
              value={password}
              autoComplete="new-password"
            />
          </Form.Field>
          <Form.Field>
            <Form.Input
              label="显示名称"
              name="displayName"
              placeholder={'请输入新的显示名称'}
              onChange={handleInputChange}
              value={displayName}
              autoComplete="new-password"
            />
          </Form.Field>
          <Form.Field>
            <Form.Input
              label="已绑定的 GitHub 账户"
              name="githubId"
              value={githubId}
              autoComplete="new-password"
              placeholder="此项只读，需要用户通过个人设置页面的相关绑定按钮进行绑定，不可直接修改"
              readOnly
            />
          </Form.Field>
          <Form.Field>
            <Form.Input
              label="已绑定的微信账户"
              name="wechatId"
              value={wechatId}
              autoComplete="new-password"
              placeholder="此项只读，需要用户通过个人设置页面的相关绑定按钮进行绑定，不可直接修改"
              readOnly
            />
          </Form.Field>
          <Form.Field>
            <Form.Input
              label="已绑定的邮箱账户"
              name="email"
              value={email}
              autoComplete="new-password"
              placeholder="此项只读，需要用户通过个人设置页面的相关绑定按钮进行绑定，不可直接修改"
              readOnly
            />
          </Form.Field>
          <Button onClick={handleCancel}>取消</Button>
          <Button positive onClick={submit}>
            提交
          </Button>
        </Form>
      </Segment>
    </>
  );
};

export default EditUser;
