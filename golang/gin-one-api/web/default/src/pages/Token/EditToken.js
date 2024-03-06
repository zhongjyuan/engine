import React, { useEffect, useState } from 'react';
import { Button, Form, Header, Message, Segment } from 'semantic-ui-react';
import { useParams, useNavigate } from 'react-router-dom';
import { API, showError, showSuccess, timestamp2string } from '../../helpers';
import { renderQuota, renderQuotaWithPrompt } from '../../helpers/render';

const EditToken = () => {
  const params = useParams();
  const tokenId = params.id;
  const isEdit = tokenId !== undefined;
  const [loading, setLoading] = useState(isEdit);
  const originInputs = {
    name: '',
    remainQuota: isEdit ? 0 : 500000,
    expireTime: -1,
    unlimitedQuota: false
  };
  const [inputs, setInputs] = useState(originInputs);
  const { name, remainQuota, expireTime, unlimitedQuota } = inputs;
  const navigate = useNavigate();
  const handleInputChange = (e, { name, value }) => {
    setInputs((inputs) => ({ ...inputs, [name]: value }));
  };
  const handleCancel = () => {
    navigate("/token");
  }
  const setExpiredTime = (month, day, hour, minute) => {
    let now = new Date();
    let timestamp = now.getTime() / 1000;
    let seconds = month * 30 * 24 * 60 * 60;
    seconds += day * 24 * 60 * 60;
    seconds += hour * 60 * 60;
    seconds += minute * 60;
    if (seconds !== 0) {
      timestamp += seconds;
      setInputs({ ...inputs, expireTime: timestamp2string(timestamp) });
    } else {
      setInputs({ ...inputs, expireTime: -1 });
    }
  };

  const setUnlimitedQuota = () => {
    setInputs({ ...inputs, unlimitedQuota: !unlimitedQuota });
  };

  const loadToken = async () => {
    let res = await API.get(`/api/token/${tokenId}`);
    const { success, message, data } = res.data;
    if (success) {
      if (data.expireTime !== -1) {
        data.expireTime = timestamp2string(data.expireTime);
      }
      setInputs(data);
    } else {
      showError(message);
    }
    setLoading(false);
  };
  useEffect(() => {
    if (isEdit) {
      loadToken().then();
    }
  }, []);

  const submit = async () => {
    if (!isEdit && inputs.name === '') return;
    let localInputs = inputs;
    localInputs.remainQuota = parseInt(localInputs.remainQuota);
    if (localInputs.expireTime !== -1) {
      let time = Date.parse(localInputs.expireTime);
      if (isNaN(time)) {
        showError('过期时间格式错误！');
        return;
      }
      localInputs.expireTime = Math.ceil(time / 1000);
    }
    let res;
    if (isEdit) {
      res = await API.put(`/api/token/`, { ...localInputs, id: parseInt(tokenId) });
    } else {
      res = await API.post(`/api/token/`, localInputs);
    }
    const { success, message } = res.data;
    if (success) {
      if (isEdit) {
        showSuccess('令牌更新成功！');
      } else {
        showSuccess('令牌创建成功，请在列表页面点击复制获取令牌！');
        setInputs(originInputs);
      }
    } else {
      showError(message);
    }
  };

  return (
    <>
      <Segment loading={loading}>
        <Header as='h3'>{isEdit ? '更新令牌信息' : '创建新的令牌'}</Header>
        <Form autoComplete='new-password'>
          <Form.Field>
            <Form.Input
              label='名称'
              name='name'
              placeholder={'请输入名称'}
              onChange={handleInputChange}
              value={name}
              autoComplete='new-password'
              required={!isEdit}
            />
          </Form.Field>
          <Form.Field>
            <Form.Input
              label='过期时间'
              name='expireTime'
              placeholder={'请输入过期时间，格式为 yyyy-MM-dd HH:mm:ss，-1 表示无限制'}
              onChange={handleInputChange}
              value={expireTime}
              autoComplete='new-password'
              type='datetime-local'
            />
          </Form.Field>
          <div style={{ lineHeight: '40px' }}>
            <Button type={'button'} onClick={() => {
              setExpiredTime(0, 0, 0, 0);
            }}>永不过期</Button>
            <Button type={'button'} onClick={() => {
              setExpiredTime(1, 0, 0, 0);
            }}>一个月后过期</Button>
            <Button type={'button'} onClick={() => {
              setExpiredTime(0, 1, 0, 0);
            }}>一天后过期</Button>
            <Button type={'button'} onClick={() => {
              setExpiredTime(0, 0, 1, 0);
            }}>一小时后过期</Button>
            <Button type={'button'} onClick={() => {
              setExpiredTime(0, 0, 0, 1);
            }}>一分钟后过期</Button>
          </div>
          <Message>注意，令牌的额度仅用于限制令牌本身的最大额度使用量，实际的使用受到账户的剩余额度限制。</Message>
          <Form.Field>
            <Form.Input
              label={`额度${renderQuotaWithPrompt(remainQuota)}`}
              name='remainQuota'
              placeholder={'请输入额度'}
              onChange={handleInputChange}
              value={remainQuota}
              autoComplete='new-password'
              type='number'
              disabled={unlimitedQuota}
            />
          </Form.Field>
          <Button type={'button'} onClick={() => {
            setUnlimitedQuota();
          }}>{unlimitedQuota ? '取消无限额度' : '设为无限额度'}</Button>
          <Button floated='right' positive onClick={submit}>提交</Button>
          <Button floated='right' onClick={handleCancel}>取消</Button>
        </Form>
      </Segment>
    </>
  );
};

export default EditToken;
