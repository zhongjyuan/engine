import React, { useEffect, useState } from 'react';
import { Divider, Form, Grid, Header } from 'semantic-ui-react';

import {
  API,
  showError,
  showSuccess,
  timestamp2string,
  verifyJSON,
} from '../helpers';

const OperationSetting = () => {
  let now = new Date(); // 获取当前时间

  // 定义加载状态和设置加载状态的函数
  let [loading, setLoading] = useState(false);

  // 设置历史时间戳为一个月前
  let [historyTimestamp, setHistoryTimestamp] = useState(
    timestamp2string(now.getTime() / 1000 - 30 * 24 * 3600)
  );

  // 定义输入状态并设置默认值
  let [inputs, setInputs] = useState({
    QuotaForNewUser: 0, // 新用户配额
    QuotaForInviter: 0, // 邀请者配额
    QuotaForInvitee: 0, // 被邀请者配额
    QuotaRemindThreshold: 0, // 配额提醒阈值
    PreConsumedQuota: 0, // 预消耗配额
    ModelRatio: '', // 模型比例
    CompletionRatio: '', // 完成比例
    GroupRatio: '', // 群组比例
    TopUpLink: '', // 充值链接
    ChatLink: '', // 聊天链接
    QuotaPerUnit: 0, // 单位配额
    AutomaticDisableChannelEnabled: '', // 启用自动禁用通道
    AutomaticEnableChannelEnabled: '', // 启用自动启用通道
    ChannelDisableThreshold: 0, // 通道禁用阈值
    LogConsumeEnabled: '', // 启用日志消耗
    DisplayInCurrencyEnabled: '', // 启用货币显示
    DisplayTokenStatEnabled: '', // 启用令牌统计显示
    ApproximateTokenEnabled: '', // 启用近似令牌
    RetryTimes: 0, // 重试次数
  });

  // 定义原始输入状态并设置为空对象
  const [originInputs, setOriginInputs] = useState({});

  // 异步函数，从 API 获取选项
  const getOptions = async () => {
    // 通过 API 发送请求获取数据
    const res = await API.get('/api/option/');
    // 从返回的数据中提取 success、message 和 data
    const { success, message, data } = res.data;
    // 如果请求成功
    if (success) {
      // 创建一个新的输入对象
      let newInputs = {};
      // 遍历获取到的数据
      data.forEach((item) => {
        // 如果 key 是 'ModelRatio'、'GroupRatio' 或 'CompletionRatio'
        if (
          item.key === 'ModelRatio' ||
          item.key === 'GroupRatio' ||
          item.key === 'CompletionRatio'
        ) {
          // 将值转换为格式化的 JSON 字符串
          item.value = JSON.stringify(JSON.parse(item.value), null, 2);
        }
        // 如果值为 '{}'，则将其设置为空字符串
        if (item.value === '{}') {
          item.value = '';
        }
        // 将键值对存入新的输入对象中
        newInputs[item.key] = item.value;
      });
      // 更新输入状态
      setInputs(newInputs);
      // 设置原始输入状态
      setOriginInputs(newInputs);
    } else {
      // 如果请求失败，显示错误信息
      showError(message);
    }
  };

  // 使用 useEffect 钩子，在组件加载时调用 getOptions 函数
  useEffect(() => {
    // 调用 getOptions 函数，并使用 then 方法处理返回的 Promise
    getOptions().then();
  }, []); // 传入空数组作为依赖项，表示只在组件加载时执行一次

  // 更新选项的异步函数
  const updateOption = async (key, value) => {
    // 设置加载状态为 true
    setLoading(true);

    // 如果 key 以 'Enabled' 结尾
    if (key.endsWith('Enabled')) {
      // 切换值为布尔值的字符串表示
      value = inputs[key] === 'true' ? 'false' : 'true';
    }

    // 发送 PUT 请求更新选项
    const res = await API.put('/api/option/', {
      key,
      value,
    });

    // 从返回数据中获取 success 和 message
    const { success, message } = res.data;

    // 如果更新成功
    if (success) {
      // 更新输入状态中对应键的值
      setInputs((inputs) => ({ ...inputs, [key]: value }));
    } else {
      // 显示错误信息
      showError(message);
    }

    // 设置加载状态为 false
    setLoading(false);
  };

  // 处理输入变化的异步函数
  const handleInputChange = async (e, { name, value }) => {
    // 如果 name 以 'Enabled' 结尾
    if (name.endsWith('Enabled')) {
      // 调用更新选项函数，并等待其完成
      await updateOption(name, value);
    } else {
      // 更新输入状态中对应键的值
      setInputs((inputs) => ({ ...inputs, [name]: value }));
    }
  };

  // 提交配置的异步函数
  const submitConfig = async (group) => {
    // 根据不同的分组进行处理
    switch (group) {
      case 'monitor':
        // 如果 ChannelDisableThreshold 发生变化
        if (
          originInputs['ChannelDisableThreshold'] !==
          inputs.ChannelDisableThreshold
        ) {
          // 调用更新选项函数，并等待其完成
          await updateOption(
            'ChannelDisableThreshold',
            inputs.ChannelDisableThreshold
          );
        }
        // 如果 QuotaRemindThreshold 发生变化
        if (
          originInputs['QuotaRemindThreshold'] !== inputs.QuotaRemindThreshold
        ) {
          // 调用更新选项函数，并等待其完成
          await updateOption(
            'QuotaRemindThreshold',
            inputs.QuotaRemindThreshold
          );
        }
        break;
      case 'ratio':
        // 如果 ModelRatio 发生变化
        if (originInputs['ModelRatio'] !== inputs.ModelRatio) {
          // 验证 ModelRatio 是否为合法的 JSON 字符串
          if (!verifyJSON(inputs.ModelRatio)) {
            showError('模型倍率不是合法的 JSON 字符串');
            return;
          }
          // 调用更新选项函数，并等待其完成
          await updateOption('ModelRatio', inputs.ModelRatio);
        }
        // 如果 GroupRatio 发生变化
        if (originInputs['GroupRatio'] !== inputs.GroupRatio) {
          // 验证 GroupRatio 是否为合法的 JSON 字符串
          if (!verifyJSON(inputs.GroupRatio)) {
            showError('分组倍率不是合法的 JSON 字符串');
            return;
          }
          // 调用更新选项函数，并等待其完成
          await updateOption('GroupRatio', inputs.GroupRatio);
        }
        // 如果 CompletionRatio 发生变化
        if (originInputs['CompletionRatio'] !== inputs.CompletionRatio) {
          // 验证 CompletionRatio 是否为合法的 JSON 字符串
          if (!verifyJSON(inputs.CompletionRatio)) {
            showError('补全倍率不是合法的 JSON 字符串');
            return;
          }
          // 调用更新选项函数，并等待其完成
          await updateOption('CompletionRatio', inputs.CompletionRatio);
        }
        break;
      case 'quota':
        // 如果 QuotaForNewUser 发生变化
        if (originInputs['QuotaForNewUser'] !== inputs.QuotaForNewUser) {
          // 调用更新选项函数，并等待其完成
          await updateOption('QuotaForNewUser', inputs.QuotaForNewUser);
        }
        // 如果 QuotaForInvitee 发生变化
        if (originInputs['QuotaForInvitee'] !== inputs.QuotaForInvitee) {
          // 调用更新选项函数，并等待其完成
          await updateOption('QuotaForInvitee', inputs.QuotaForInvitee);
        }
        // 如果 QuotaForInviter 发生变化
        if (originInputs['QuotaForInviter'] !== inputs.QuotaForInviter) {
          // 调用更新选项函数，并等待其完成
          await updateOption('QuotaForInviter', inputs.QuotaForInviter);
        }
        // 如果 PreConsumedQuota 发生变化
        if (originInputs['PreConsumedQuota'] !== inputs.PreConsumedQuota) {
          // 调用更新选项函数，并等待其完成
          await updateOption('PreConsumedQuota', inputs.PreConsumedQuota);
        }
        break;
      case 'general':
        // 如果 TopUpLink 发生变化
        if (originInputs['TopUpLink'] !== inputs.TopUpLink) {
          // 调用更新选项函数，并等待其完成
          await updateOption('TopUpLink', inputs.TopUpLink);
        }
        // 如果 ChatLink 发生变化
        if (originInputs['ChatLink'] !== inputs.ChatLink) {
          // 调用更新选项函数，并等待其完成
          await updateOption('ChatLink', inputs.ChatLink);
        }
        // 如果 QuotaPerUnit 发生变化
        if (originInputs['QuotaPerUnit'] !== inputs.QuotaPerUnit) {
          // 调用更新选项函数，并等待其完成
          await updateOption('QuotaPerUnit', inputs.QuotaPerUnit);
        }
        // 如果 RetryTimes 发生变化
        if (originInputs['RetryTimes'] !== inputs.RetryTimes) {
          // 调用更新选项函数，并等待其完成
          await updateOption('RetryTimes', inputs.RetryTimes);
        }
        break;
    }
  };

  /**
   * 异步函数，用于删除历史日志记录
   */
  const deleteHistoryLogs = async () => {
    // 打印当前的输入对象
    console.log(inputs);

    try {
      // 发起异步请求，使用 API.delete 方法删除指定时间戳的日志记录
      const res = await API.delete(
        `/api/log/?targetTimestamp=${Date.parse(historyTimestamp) / 1000}`
      );

      // 从结果中解构出 success, message, data 三个属性
      const { success, message, data } = res.data;

      // 如果删除成功
      if (success) {
        // 展示成功消息，并显示已清理的日志条数
        showSuccess(`${data} 条日志已清理！`);
        return;
      }

      // 如果删除失败，展示错误消息，包括具体的错误信息
      showError('日志清理失败：' + message);
    } catch (error) {
      // 如果请求发生错误，展示错误消息
      showError('请求发生错误：' + error.message);
    }
  };

  return (
    <Grid columns={1}>
      <Grid.Column>
        <Form loading={loading}>
          <Header as='h3'>通用设置</Header>
          <Form.Group widths={4}>
            <Form.Input
              label='充值链接'
              name='TopUpLink'
              onChange={handleInputChange}
              autoComplete='new-password'
              value={inputs.TopUpLink}
              type='link'
              placeholder='例如发卡网站的购买链接'
            />
            <Form.Input
              label='聊天页面链接'
              name='ChatLink'
              onChange={handleInputChange}
              autoComplete='new-password'
              value={inputs.ChatLink}
              type='link'
              placeholder='例如 ChatGPT Next Web 的部署地址'
            />
            <Form.Input
              label='单位美元额度'
              name='QuotaPerUnit'
              onChange={handleInputChange}
              autoComplete='new-password'
              value={inputs.QuotaPerUnit}
              type='number'
              step='0.01'
              placeholder='一单位货币能兑换的额度'
            />
            <Form.Input
              label='失败重试次数'
              name='RetryTimes'
              type={'number'}
              step='1'
              min='0'
              onChange={handleInputChange}
              autoComplete='new-password'
              value={inputs.RetryTimes}
              placeholder='失败重试次数'
            />
          </Form.Group>
          <Form.Group inline>
            <Form.Checkbox
              checked={inputs.DisplayInCurrencyEnabled === 'true'}
              label='以货币形式显示额度'
              name='DisplayInCurrencyEnabled'
              onChange={handleInputChange}
            />
            <Form.Checkbox
              checked={inputs.DisplayTokenStatEnabled === 'true'}
              label='Billing 相关 API 显示令牌额度而非用户额度'
              name='DisplayTokenStatEnabled'
              onChange={handleInputChange}
            />
            <Form.Checkbox
              checked={inputs.ApproximateTokenEnabled === 'true'}
              label='使用近似的方式估算 token 数以减少计算量'
              name='ApproximateTokenEnabled'
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Button
            onClick={() => {
              submitConfig('general').then();
            }}
          >
            保存通用设置
          </Form.Button>
          <Divider />
          <Header as='h3'>日志设置</Header>
          <Form.Group inline>
            <Form.Checkbox
              checked={inputs.LogConsumeEnabled === 'true'}
              label='启用额度消费日志记录'
              name='LogConsumeEnabled'
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group widths={4}>
            <Form.Input
              label='目标时间'
              value={historyTimestamp}
              type='datetime-local'
              name='history_timestamp'
              onChange={(e, { name, value }) => {
                setHistoryTimestamp(value);
              }}
            />
          </Form.Group>
          <Form.Button
            onClick={() => {
              deleteHistoryLogs().then();
            }}
          >
            清理历史日志
          </Form.Button>
          <Divider />
          <Header as='h3'>监控设置</Header>
          <Form.Group widths={3}>
            <Form.Input
              label='最长响应时间'
              name='ChannelDisableThreshold'
              onChange={handleInputChange}
              autoComplete='new-password'
              value={inputs.ChannelDisableThreshold}
              type='number'
              min='0'
              placeholder='单位秒，当运行通道全部测试时，超过此时间将自动禁用通道'
            />
            <Form.Input
              label='额度提醒阈值'
              name='QuotaRemindThreshold'
              onChange={handleInputChange}
              autoComplete='new-password'
              value={inputs.QuotaRemindThreshold}
              type='number'
              min='0'
              placeholder='低于此额度时将发送邮件提醒用户'
            />
          </Form.Group>
          <Form.Group inline>
            <Form.Checkbox
              checked={inputs.AutomaticDisableChannelEnabled === 'true'}
              label='失败时自动禁用通道'
              name='AutomaticDisableChannelEnabled'
              onChange={handleInputChange}
            />
            <Form.Checkbox
              checked={inputs.AutomaticEnableChannelEnabled === 'true'}
              label='成功时自动启用通道'
              name='AutomaticEnableChannelEnabled'
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Button
            onClick={() => {
              submitConfig('monitor').then();
            }}
          >
            保存监控设置
          </Form.Button>
          <Divider />
          <Header as='h3'>额度设置</Header>
          <Form.Group widths={4}>
            <Form.Input
              label='新用户初始额度'
              name='QuotaForNewUser'
              onChange={handleInputChange}
              autoComplete='new-password'
              value={inputs.QuotaForNewUser}
              type='number'
              min='0'
              placeholder='例如：100'
            />
            <Form.Input
              label='请求预扣费额度'
              name='PreConsumedQuota'
              onChange={handleInputChange}
              autoComplete='new-password'
              value={inputs.PreConsumedQuota}
              type='number'
              min='0'
              placeholder='请求结束后多退少补'
            />
            <Form.Input
              label='邀请新用户奖励额度'
              name='QuotaForInviter'
              onChange={handleInputChange}
              autoComplete='new-password'
              value={inputs.QuotaForInviter}
              type='number'
              min='0'
              placeholder='例如：2000'
            />
            <Form.Input
              label='新用户使用邀请码奖励额度'
              name='QuotaForInvitee'
              onChange={handleInputChange}
              autoComplete='new-password'
              value={inputs.QuotaForInvitee}
              type='number'
              min='0'
              placeholder='例如：1000'
            />
          </Form.Group>
          <Form.Button
            onClick={() => {
              submitConfig('quota').then();
            }}
          >
            保存额度设置
          </Form.Button>
          <Divider />
          <Header as='h3'>倍率设置</Header>
          <Form.Group widths='equal'>
            <Form.TextArea
              label='模型倍率'
              name='ModelRatio'
              onChange={handleInputChange}
              style={{ minHeight: 250, fontFamily: 'JetBrains Mono, Consolas' }}
              autoComplete='new-password'
              value={inputs.ModelRatio}
              placeholder='为一个 JSON 文本，键为模型名称，值为倍率'
            />
          </Form.Group>
          <Form.Group widths='equal'>
            <Form.TextArea
              label='补全倍率'
              name='CompletionRatio'
              onChange={handleInputChange}
              style={{ minHeight: 250, fontFamily: 'JetBrains Mono, Consolas' }}
              autoComplete='new-password'
              value={inputs.CompletionRatio}
              placeholder='为一个 JSON 文本，键为模型名称，值为倍率，此处的倍率设置是模型补全倍率相较于提示倍率的比例，使用该设置可强制覆盖 One API 的内部比例'
            />
          </Form.Group>
          <Form.Group widths='equal'>
            <Form.TextArea
              label='分组倍率'
              name='GroupRatio'
              onChange={handleInputChange}
              style={{ minHeight: 250, fontFamily: 'JetBrains Mono, Consolas' }}
              autoComplete='new-password'
              value={inputs.GroupRatio}
              placeholder='为一个 JSON 文本，键为分组名称，值为倍率'
            />
          </Form.Group>
          <Form.Button
            onClick={() => {
              submitConfig('ratio').then();
            }}
          >
            保存倍率设置
          </Form.Button>
        </Form>
      </Grid.Column>
    </Grid>
  );
};

export default OperationSetting;
