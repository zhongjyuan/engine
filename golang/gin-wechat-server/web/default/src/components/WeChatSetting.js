import React, { useEffect, useState } from 'react';
import { Form, Grid } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import { API, showError } from '../helpers';

const WeChatSetting = () => {
  // 使用 useState 创建名为 inputs 的状态和名为 setInputs 的状态更新函数
  let [inputs, setInputs] = useState({
    WeChatToken: '', //   - WeChatToken: 微信 Token，初始为空字符串。
    WeChatAppID: '', //   - WeChatAppID: 微信 AppID，初始为空字符串。
    WeChatAppSecret: '', //   - WeChatAppSecret: 微信 AppSecret，初始为空字符串。
    WeChatEncodingAESKey: '', //   - WeChatEncodingAESKey: 微信 EncodingAESKey，初始为空字符串。
    WeChatOwnerID: '', //   - WeChatOwnerID: 微信 OwnerID，初始为空字符串。
    WeChatMenu: '', //   - WeChatMenu: 微信菜单，初始为空字符串。
  });

  // 使用 useState 创建名为 loading 的状态和名为 setLoading 的状态更新函数，初始状态为 false。
  let [loading, setLoading] = useState(false);

  // getOptions 函数用于获取选项数据。
  //
  // 输入参数：
  //   - 无。
  // 输出参数：
  //   - 无。
  async function getOptions() {
    // 调用 API 的 GET 方法获取选项数据
    const res = await API.get('/api/option');
    const { success, message, data } = res.data;
    if (success) {
      let newInputs = {};
      // 遍历选项数据，将以 "WeChat" 开头的键值对添加到 newInputs 对象中
      data.forEach((item) => {
        if (item.key.startsWith('WeChat')) {
          newInputs[item.key] = item.value;
        }
      });
      // 更新 inputs 状态为新的键值对对象 newInputs
      setInputs(newInputs);
    } else {
      // 显示错误提示消息
      showError(message);
    }
  }

  // 使用 useEffect 在组件挂载时调用 getOptions 函数获取选项数据。
  useEffect(() => {
    getOptions().then();
  }, []);

  // updateOption 函数用于更新选项数据。
  //
  // 输入参数：
  //   - key: 要更新的选项键。
  //   - value: 新的选项值。
  // 输出参数：
  //   - 无。
  async function updateOption(key, value) {
    // 设置 loading 状态为 true，表示正在加载中
    setLoading(true);

    // 调用 API 的 PUT 方法更新选项数据
    const res = await API.put('/api/option', {
      key,
      value,
    });
    const { success, message } = res.data;
    if (success) {
      // 更新 inputs 状态中对应 key 的值为新的 value
      setInputs((inputs) => ({ ...inputs, [key]: value }));
    } else {
      // 显示错误提示消息
      showError(message);
    }

    // 设置 loading 状态为 false，加载完成
    setLoading(false);
  }

  // handleInputChange 函数用于处理输入框变化事件。
  //
  // 输入参数：
  //   - e: 事件对象。
  //   - name: 字段名。
  //   - value: 新的数值。
  // 输出参数：
  //   - 无。
  async function handleInputChange(e, { name, value }) {
    if (name === 'WeChatMenu') {
      // 如果字段名为 WeChatMenu，则更新 inputs 状态中对应的值为新的 value
      setInputs((inputs) => ({ ...inputs, [name]: value }));
    } else {
      // 否则，调用 updateOption 函数更新选项数据
      await updateOption(name, value);
    }
  }

  // submitWeChatMenu 函数用于提交微信菜单数据。
  //
  // 输入参数：
  //   - 无。
  // 输出参数：
  //   - 无。
  async function submitWeChatMenu() {
    // 调用 updateOption 函数更新 WeChatMenu 选项数据
    await updateOption('WeChatMenu', inputs.WeChatMenu);
  }

  return (
    <Grid columns={1}>
      <Grid.Column>
        <Form loading={loading}>
          <Form.Group widths="equal">
            <Form.Input
              label="令牌（Token）"
              placeholder=""
              value={inputs.WeChatToken}
              name="WeChatToken"
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Input
              label="开发者 ID（AppID）"
              placeholder=""
              value={inputs.WeChatAppID}
              name="WeChatAppID"
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Input
              label="开发者密码（AppSecret）"
              placeholder=""
              value={inputs.WeChatAppSecret}
              name="WeChatAppSecret"
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Input
              label="消息加解密密钥（EncodingAESKey）"
              placeholder=""
              value={inputs.WeChatEncodingAESKey}
              name="WeChatEncodingAESKey"
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Input
              label="Root 用户微信 ID"
              placeholder=""
              value={inputs.WeChatOwnerID}
              name="WeChatOwnerID"
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Form.TextArea
              label={
                <p>
                  公众号菜单（
                  <a
                    target="_blank"
                    href="https://developers.weixin.qq.com/doc/offiaccount/Custom_Menus/Creating_Custom-Defined_Menu.html"
                  >
                    格式请参考此处
                  </a>
                  ）
                </p>
              }
              placeholder="JSON 格式"
              value={inputs.WeChatMenu}
              name="WeChatMenu"
              onChange={handleInputChange}
              style={{ minHeight: 150, fontFamily: 'JetBrains Mono, Consolas' }}
            />
          </Form.Group>
          <Form.Button onClick={submitWeChatMenu}>更新公众号菜单</Form.Button>
        </Form>
      </Grid.Column>
    </Grid>
  );
};

export default WeChatSetting;
