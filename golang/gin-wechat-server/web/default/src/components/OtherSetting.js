import React, { useEffect, useState } from 'react';
import {
  Button,
  Divider,
  Form,
  Grid,
  Header,
  Message,
  Modal,
} from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { marked } from 'marked';

import { API, showError, showSuccess } from '../helpers';

const OtherSetting = () => {
  // 使用useState钩子初始化loading状态，并设置初始值为false
  let [loading, setLoading] = useState(false);

  // 使用useState钩子初始化showUpdateModal状态，并设置初始值为false
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  // 使用useState钩子初始化inputs状态，并设置初始值为一个包含特定属性的对象
  let [inputs, setInputs] = useState({
    Logo: '', // 系统Logo
    Theme: '', // 主题
    Footer: '', // 底部信息
    Notice: '', // 通知信息
    About: '', // 关于信息
    SystemName: '', // 系统名称
    HomePageContent: '', // 首页内容
  });

  // 使用useState钩子初始化updateData状态，并设置初始值为一个包含tag_name和content属性的对象
  const [updateData, setUpdateData] = useState({
    tagName: '', // 标签名称
    content: '', // 内容
  });

  /**
   * 从API获取选项数据并更新inputs状态
   * @returns {Promise<void>}
   */
  const getOptions = async () => {
    // 发起API请求获取选项数据
    const res = await API.get('/api/option/');

    // 从API响应中解构出success、message和data
    const { success, message, data } = res.data;

    // 如果请求成功
    if (success) {
      // 创建一个新对象用于存储更新后的inputs状态
      let newInputs = {};

      // 遍历API返回的数据
      data.forEach((item) => {
        // 检查数据中的key是否存在于inputs对象中
        if (item.key in inputs) {
          // 将数据中的值存储到newInputs对象中
          newInputs[item.key] = item.value;
        }
      });

      // 更新inputs状态为新的对象
      setInputs(newInputs);
    } else {
      // 如果请求失败，显示错误消息
      showError(message);
    }
  };

  // 在组件加载时调用getOptions函数以获取选项数据
  useEffect(() => {
    getOptions().then();
  }, []);

  /**
   * 更新选项数据
   * @param {string} key - 选项的键名
   * @param {any} value - 选项的新值
   * @returns {Promise<void>}
   */
  const updateOption = async (key, value) => {
    setLoading(true);

    // 发起API请求更新选项数据
    const res = await API.put('/api/option/', {
      key,
      value,
    });

    // 从API响应中解构出success和message
    const { success, message } = res.data;

    if (success) {
      // 更新inputs状态，使用回调函数以确保获取最新的inputs值
      setInputs((inputs) => ({ ...inputs, [key]: value }));
    } else {
      // 如果更新失败，显示错误消息
      showError(message);
    }

    setLoading(false);
  };

  /**
   * 处理输入框数值变化
   * @param {Event} e - 事件对象
   * @param {Object} data - 包含输入框的名称(name)和值(value)的对象
   */
  const handleInputChange = async (e, { name, value }) => {
    // 更新inputs状态，使用回调函数以确保获取最新的inputs值
    setInputs((inputs) => ({ ...inputs, [name]: value }));
  };
  /**
   * 提交通知内容更新
   */
  const submitNotice = async () => {
    await updateOption('Notice', inputs.Notice);
  };

  /**
   * 提交页脚内容更新
   */
  const submitFooter = async () => {
    await updateOption('Footer', inputs.Footer);
  };

  /**
   * 提交系统名称更新
   */
  const submitSystemName = async () => {
    await updateOption('SystemName', inputs.SystemName);
  };

  /**
   * 提交主题更新
   */
  const submitTheme = async () => {
    await updateOption('Theme', inputs.Theme);
  };

  /**
   * 提交Logo更新
   */
  const submitLogo = async () => {
    await updateOption('Logo', inputs.Logo);
  };

  /**
   * 提交关于信息更新
   */
  const submitAbout = async () => {
    await updateOption('About', inputs.About);
  };

  /**
   * 提交特定选项更新
   * @param {string} key - 选项的键名
   */
  const submitOption = async (key) => {
    await updateOption(key, inputs[key]);
  };

  /**
   * 打开 GitHub Release 页面
   */
  const openGitHubRelease = () => {
    // 使用 window.location 跳转到指定链接
    window.location = 'https://gitee.com/zhongjyuan/one-api/releases/latest';
  };

  /**
   * 检查更新
   */
  const checkUpdate = async () => {
    try {
      // 发起API请求获取最新版本信息
      const res = await API.get(
        'https://api.github.com/repos/songquanpeng/one-api/releases/latest'
      );
      const { tagName, body } = res.data;

      // 检查是否为最新版本
      if (tagName === process.env.REACT_APP_VERSION) {
        // 如果是最新版本，显示成功消息
        showSuccess(`已是最新版本：${tagName}`);
      } else {
        // 如果不是最新版本，设置更新数据并显示更新模态框
        setUpdateData({
          tagName: tagName,
          content: marked.parse(body),
        });
        setShowUpdateModal(true);
      }
    } catch (error) {
      console.error('Error checking for updates:', error);
    }
  };

  return (
    <Grid columns={1}>
      <Grid.Column>
        <Form loading={loading}>
          <Header as='h3'>通用设置</Header>
          <Form.Button onClick={checkUpdate}>检查更新</Form.Button>
          <Form.Group widths='equal'>
            <Form.TextArea
              label='公告'
              placeholder='在此输入新的公告内容，支持 Markdown & HTML 代码'
              value={inputs.Notice}
              name='Notice'
              onChange={handleInputChange}
              style={{ minHeight: 150, fontFamily: 'JetBrains Mono, Consolas' }}
            />
          </Form.Group>
          <Form.Button onClick={submitNotice}>保存公告</Form.Button>
          <Divider />
          <Header as='h3'>个性化设置</Header>
          <Form.Group widths='equal'>
            <Form.Input
              label='系统名称'
              placeholder='在此输入系统名称'
              value={inputs.SystemName}
              name='SystemName'
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Button onClick={submitSystemName}>设置系统名称</Form.Button>
          <Form.Group widths='equal'>
            <Form.Input
              label={
                <label>
                  主题名称（
                  <Link to='https://gitee.com/zhongjyuan/one-api/blob/main/web/README.md'>
                    当前可用主题
                  </Link>
                  ）
                </label>
              }
              placeholder='请输入主题名称'
              value={inputs.Theme}
              name='Theme'
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Button onClick={submitTheme}>设置主题（重启生效）</Form.Button>
          <Form.Group widths='equal'>
            <Form.Input
              label='Logo 图片地址'
              placeholder='在此输入 Logo 图片地址'
              value={inputs.Logo}
              name='Logo'
              type='url'
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Button onClick={submitLogo}>设置 Logo</Form.Button>
          <Form.Group widths='equal'>
            <Form.TextArea
              label='首页内容'
              placeholder='在此输入首页内容，支持 Markdown & HTML 代码，设置后首页的状态信息将不再显示。如果输入的是一个链接，则会使用该链接作为 iframe 的 src 属性，这允许你设置任意网页作为首页。'
              value={inputs.HomePageContent}
              name='HomePageContent'
              onChange={handleInputChange}
              style={{ minHeight: 150, fontFamily: 'JetBrains Mono, Consolas' }}
            />
          </Form.Group>
          <Form.Button onClick={() => submitOption('HomePageContent')}>
            保存首页内容
          </Form.Button>
          <Form.Group widths='equal'>
            <Form.TextArea
              label='关于'
              placeholder='在此输入新的关于内容，支持 Markdown & HTML 代码。如果输入的是一个链接，则会使用该链接作为 iframe 的 src 属性，这允许你设置任意网页作为关于页面。'
              value={inputs.About}
              name='About'
              onChange={handleInputChange}
              style={{ minHeight: 150, fontFamily: 'JetBrains Mono, Consolas' }}
            />
          </Form.Group>
          <Form.Button onClick={submitAbout}>保存关于</Form.Button>
          <Message>
            移除 One API
            的版权标识必须首先获得授权，项目维护需要花费大量精力，如果本项目对你有意义，请主动支持本项目。
          </Message>
          <Form.Group widths='equal'>
            <Form.Input
              label='页脚'
              placeholder='在此输入新的页脚，留空则使用默认页脚，支持 HTML 代码'
              value={inputs.Footer}
              name='Footer'
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Button onClick={submitFooter}>设置页脚</Form.Button>
        </Form>
      </Grid.Column>
      <Modal
        onClose={() => setShowUpdateModal(false)}
        onOpen={() => setShowUpdateModal(true)}
        open={showUpdateModal}
      >
        <Modal.Header>新版本：{updateData.tagName}</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <div dangerouslySetInnerHTML={{ __html: updateData.content }}></div>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => setShowUpdateModal(false)}>关闭</Button>
          <Button
            content='详情'
            onClick={() => {
              setShowUpdateModal(false);
              openGitHubRelease();
            }}
          />
        </Modal.Actions>
      </Modal>
    </Grid>
  );
};

export default OtherSetting;
