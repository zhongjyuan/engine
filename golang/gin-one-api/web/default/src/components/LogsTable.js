import React, { useEffect, useState } from 'react';
import {
  Button,
  Form,
  Header,
  Label,
  Pagination,
  Segment,
  Select,
  Table,
} from 'semantic-ui-react';

import { API, isAdmin, showError, timestamp2string } from '../helpers';
import { renderQuota } from '../helpers/render';

import { ITEMS_PER_PAGE } from '../constants';

/**
 * 将时间戳转换为字符串并渲染到UI上。
 *
 * @param {number} timestamp - 要转换的时间戳。
 * @returns {JSX.Element} - 返回渲染时间戳字符串的 JSX 元素。
 */
function renderTimestamp(timestamp) {
  return <>{timestamp2string(timestamp)}</>;
}

/**
 * 可选的模式常量数组，用于表示用户选择的不同模式。
 *
 * 每个选项包含以下属性：
 *   - key: 选项的键值
 *   - text: 选项在UI上显示的文本
 *   - value: 选项的实际值
 *
 * @type {Array<{key: string, text: string, value: string}>}
 */
const MODE_OPTIONS = [
  { key: 'all', text: '全部用户', value: 'all' },
  { key: 'self', text: '当前用户', value: 'self' },
];

/**
 * 日志类型选项常量数组，用于表示不同类型的日志。
 *
 * 每个选项包含以下属性：
 *   - key: 选项的键值
 *   - text: 选项在 UI 上显示的文本
 *   - value: 选项的实际值
 *
 * @type {Array<{key: string, text: string, value: number}>}
 */
const LOG_OPTIONS = [
  { key: '0', text: '全部', value: 0 },
  { key: '1', text: '充值', value: 1 },
  { key: '2', text: '消费', value: 2 },
  { key: '3', text: '管理', value: 3 },
  { key: '4', text: '系统', value: 4 },
];

/**
 * 渲染给定类型的标签。
 *
 * @param {number} type - 要渲染的类型。
 * @returns {JSX.Element} - 返回渲染类型标签的 JSX 元素。
 */
function renderType(type) {
  switch (type) {
    case 1:
      return (
        <Label basic color='green'>
          {' '}
          充值{' '}
        </Label>
      );
    case 2:
      return (
        <Label basic color='olive'>
          {' '}
          消费{' '}
        </Label>
      );
    case 3:
      return (
        <Label basic color='orange'>
          {' '}
          管理{' '}
        </Label>
      );
    case 4:
      return (
        <Label basic color='purple'>
          {' '}
          系统{' '}
        </Label>
      );
    default:
      return (
        <Label basic color='black'>
          {' '}
          未知{' '}
        </Label>
      );
  }
}

const LogsTable = () => {
  const [loading, setLoading] = useState(true); // 加载状态
  const [showStat, setShowStat] = useState(false); // 是否显示统计信息
  const [searching, setSearching] = useState(false); // 搜索状态
  const [logs, setLogs] = useState([]); // 日志数据
  const [logType, setLogType] = useState(0); // 日志类型
  const [activePage, setActivePage] = useState(1); // 当前活动页码
  const [searchKeyword, setSearchKeyword] = useState(''); // 搜索关键词

  const [stat, setStat] = useState({
    quota: 0, // 配额
    token: 0, // 令牌
  });

  const [inputs, setInputs] = useState({
    userName: '', // 用户名
    tokenName: '', // 令牌名称
    modelName: '', // 模块名称
    channelId: '', // 渠道ID
    startTimestamp: timestamp2string(0), // 开始时间戳
    endTimestamp: timestamp2string(now.getTime() / 1000 + 3600), // 结束时间戳
  });

  // 解构赋值从 inputs 中获取变量
  const {
    userName,
    tokenName,
    modelName,
    startTimestamp,
    endTimestamp,
    channelId,
  } = inputs;

  // 创建日期对象
  let now = new Date();
  // 检查当前用户是否为管理员
  const isAdminUser = isAdmin();

  /**
   * 处理输入框值变化的函数。
   *
   * @param {Event} e - 事件对象.
   * @param {Object} data - 包含输入框名称和值的对象.
   */
  const handleInputChange = (e, { name, value }) => {
    // 使用回调函数形式更新 inputs 状态
    setInputs((inputs) => ({ ...inputs, [name]: value }));
  };

  /**
   * 获取用户日志统计信息。
   */
  const getLogSelfStat = async () => {
    // 将开始和结束时间戳转换为秒
    let localStartTimestamp = Date.parse(startTimestamp) / 1000;
    let localEndTimestamp = Date.parse(endTimestamp) / 1000;

    // 发起 API 请求获取用户日志统计信息
    try {
      let res = await API.get(
        `/api/log/self/stat?type=${logType}&tokenName=${tokenName}&modelName=${modelName}&startTimestamp=${localStartTimestamp}&endTimestamp=${localEndTimestamp}`
      );

      const { success, message, data } = res.data;

      if (success) {
        // 设置统计数据状态
        setStat(data);
      } else {
        // 显示错误信息
        showError(message);
      }
    } catch (error) {
      // 捕获异常并处理
      console.error('Error fetching log self stat:', error);
    }
  };

  /**
   * 获取日志统计信息。
   */
  const getLogStat = async () => {
    // 将开始和结束时间戳转换为秒
    let localStartTimestamp = Date.parse(startTimestamp) / 1000;
    let localEndTimestamp = Date.parse(endTimestamp) / 1000;

    // 发起 API 请求获取日志统计信息
    try {
      let res = await API.get(
        `/api/log/stat?type=${logType}&userName=${userName}&tokenName=${tokenName}&modelName=${modelName}&startTimestamp=${localStartTimestamp}&endTimestamp=${localEndTimestamp}&channelId=${channelId}`
      );

      const { success, message, data } = res.data;

      if (success) {
        // 设置统计数据状态
        setStat(data);
      } else {
        // 显示错误信息
        showError(message);
      }
    } catch (error) {
      // 捕获异常并处理
      console.error('Error fetching log stat:', error);
    }
  };

  /**
   * 处理眼睛图标点击事件，用于显示/隐藏统计信息。
   */
  const handleEyeClick = async () => {
    if (!showStat) {
      // 如果未显示统计信息
      if (isAdminUser) {
        // 如果是管理员用户，获取日志统计信息
        await getLogStat();
      } else {
        // 如果是普通用户，获取个人日志统计信息
        await getLogSelfStat();
      }
    }

    // 切换显示统计信息状态
    setShowStat(!showStat);
  };

  /**
   * 加载日志数据。
   * @param {number} startIdx - 起始索引
   */
  const loadLogs = async (startIdx) => {
    let url = '';
    let localStartTimestamp = Date.parse(startTimestamp) / 1000;
    let localEndTimestamp = Date.parse(endTimestamp) / 1000;

    // 根据用户类型构建请求 URL
    if (isAdminUser) {
      url = `/api/log/?p=${startIdx}&type=${logType}&userName=${userName}&tokenName=${tokenName}&modelName=${modelName}&startTimestamp=${localStartTimestamp}&endTimestamp=${localEndTimestamp}&channelId=${channelId}`;
    } else {
      url = `/api/log/self/?p=${startIdx}&type=${logType}&tokenName=${tokenName}&modelName=${modelName}&startTimestamp=${localStartTimestamp}&endTimestamp=${localEndTimestamp}`;
    }

    // 发起 API 请求加载日志数据
    const res = await API.get(url);
    const { success, message, data } = res.data;

    if (success) {
      if (startIdx === 0) {
        // 如果是从头开始加载，设置日志数据
        setLogs(data);
      } else {
        // 如果是加载更多，合并新的日志数据
        let newLogs = [...logs];
        newLogs.splice(startIdx * ITEMS_PER_PAGE, data.length, ...data);
        setLogs(newLogs);
      }
    } else {
      // 显示错误信息
      showError(message);
    }

    // 停止加载状态
    setLoading(false);
  };

  /**
   * 处理分页改变事件，用于加载更多日志数据或更新当前页码。
   * @param {Event} e - 事件对象
   * @param {Object} data - 分页数据
   */
  const onPaginationChange = (e, { activePage }) => {
    (async () => {
      if (activePage === Math.ceil(logs.length / ITEMS_PER_PAGE) + 1) {
        // 如果当前页码是最后一页，需要加载更多数据并追加到现有数据中
        await loadLogs(activePage - 1);
      }
      setActivePage(activePage);
    })();
  };

  /**
   * 刷新日志数据，重新加载第一页日志。
   */
  const refresh = async () => {
    setLoading(true); // 设置加载状态为 true
    setActivePage(1); // 重置当前页码为 1
    await loadLogs(0); // 加载第一页日志数据
  };

  /**
   * 当日志类型发生变化时，刷新日志数据。
   */
  useEffect(() => {
    refresh().then();
  }, [logType]);

  /**
   * 搜索日志数据。
   */
  const searchLogs = async () => {
    if (searchKeyword === '') {
      // 如果搜索关键字为空，加载文件而不是搜索
      await loadLogs(0);
      setActivePage(1);
      return;
    }

    setSearching(true); // 设置搜索状态为 true

    const res = await API.get(`/api/log/self/search?keyword=${searchKeyword}`);
    const { success, message, data } = res.data;

    if (success) {
      setLogs(data); // 设置搜索结果日志数据
      setActivePage(1); // 设置当前页码为第一页
    } else {
      showError(message); // 显示错误信息
    }

    setSearching(false); // 设置搜索状态为 false
  };

  /**
   * 处理搜索关键字改变事件，更新搜索关键字。
   * @param {Event} e - 事件对象
   * @param {Object} data - 输入数据
   */
  const handleKeywordChange = async (e, { value }) => {
    setSearchKeyword(value.trim()); // 更新搜索关键字，去除首尾空格
  };

  /**
   * 对日志进行排序。
   * @param {string} key - 排序关键字
   */
  const sortLog = (key) => {
    if (logs.length === 0) return; // 如果日志为空，直接返回

    setLoading(true); // 设置加载状态为 true

    let sortedLogs = [...logs]; // 复制日志数组

    // 根据排序关键字的类型进行不同的排序方法
    if (typeof sortedLogs[0][key] === 'string') {
      sortedLogs.sort((a, b) => {
        return ('' + a[key]).localeCompare(b[key]);
      });
    } else {
      sortedLogs.sort((a, b) => {
        if (a[key] === b[key]) return 0;
        if (a[key] > b[key]) return -1;
        if (a[key] < b[key]) return 1;
      });
    }

    // 如果排序后第一个日志与原来的第一个日志相同，则反转数组
    if (sortedLogs[0].id === logs[0].id) {
      sortedLogs.reverse();
    }

    setLogs(sortedLogs); // 设置排序后的日志数组
    setLoading(false); // 设置加载状态为 false
  };

  return (
    <>
      <Segment>
        <Header as='h3'>
          使用明细（总消耗额度：
          {showStat && renderQuota(stat.quota)}
          {!showStat && (
            <span
              onClick={handleEyeClick}
              style={{ cursor: 'pointer', color: 'gray' }}
            >
              点击查看
            </span>
          )}
          ）
        </Header>
        <Form>
          <Form.Group>
            <Form.Input
              fluid
              label={'令牌名称'}
              width={3}
              value={tokenName}
              placeholder={'可选值'}
              name='tokenName'
              onChange={handleInputChange}
            />
            <Form.Input
              fluid
              label='模型名称'
              width={3}
              value={modelName}
              placeholder='可选值'
              name='modelName'
              onChange={handleInputChange}
            />
            <Form.Input
              fluid
              label='起始时间'
              width={4}
              value={startTimestamp}
              type='datetime-local'
              name='startTimestamp'
              onChange={handleInputChange}
            />
            <Form.Input
              fluid
              label='结束时间'
              width={4}
              value={endTimestamp}
              type='datetime-local'
              name='endTimestamp'
              onChange={handleInputChange}
            />
            <Form.Button fluid label='操作' width={2} onClick={refresh}>
              查询
            </Form.Button>
          </Form.Group>
          {isAdminUser && (
            <>
              <Form.Group>
                <Form.Input
                  fluid
                  label={'渠道 ID'}
                  width={3}
                  value={channelId}
                  placeholder='可选值'
                  name='channelId'
                  onChange={handleInputChange}
                />
                <Form.Input
                  fluid
                  label={'用户名称'}
                  width={3}
                  value={userName}
                  placeholder={'可选值'}
                  name='userName'
                  onChange={handleInputChange}
                />
              </Form.Group>
            </>
          )}
        </Form>
        <Table basic compact size='small'>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  sortLog('createTime');
                }}
                width={3}
              >
                时间
              </Table.HeaderCell>
              {isAdminUser && (
                <Table.HeaderCell
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    sortLog('channelId');
                  }}
                  width={1}
                >
                  渠道
                </Table.HeaderCell>
              )}
              {isAdminUser && (
                <Table.HeaderCell
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    sortLog('userName');
                  }}
                  width={1}
                >
                  用户
                </Table.HeaderCell>
              )}
              <Table.HeaderCell
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  sortLog('tokenName');
                }}
                width={1}
              >
                令牌
              </Table.HeaderCell>
              <Table.HeaderCell
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  sortLog('type');
                }}
                width={1}
              >
                类型
              </Table.HeaderCell>
              <Table.HeaderCell
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  sortLog('modelName');
                }}
                width={2}
              >
                模型
              </Table.HeaderCell>
              <Table.HeaderCell
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  sortLog('promptTokens');
                }}
                width={1}
              >
                提示
              </Table.HeaderCell>
              <Table.HeaderCell
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  sortLog('completionTokens');
                }}
                width={1}
              >
                补全
              </Table.HeaderCell>
              <Table.HeaderCell
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  sortLog('quota');
                }}
                width={1}
              >
                额度
              </Table.HeaderCell>
              <Table.HeaderCell
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  sortLog('content');
                }}
                width={isAdminUser ? 4 : 6}
              >
                详情
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {logs
              .slice(
                (activePage - 1) * ITEMS_PER_PAGE,
                activePage * ITEMS_PER_PAGE
              )
              .map((log, idx) => {
                if (log.deleted) return <></>;
                return (
                  <Table.Row key={log.id}>
                    <Table.Cell>{renderTimestamp(log.createTime)}</Table.Cell>
                    {isAdminUser && (
                      <Table.Cell>
                        {log.channelId ? (
                          <Label basic>{log.channelId}</Label>
                        ) : (
                          ''
                        )}
                      </Table.Cell>
                    )}
                    {isAdminUser && (
                      <Table.Cell>
                        {log.userName ? <Label>{log.userName}</Label> : ''}
                      </Table.Cell>
                    )}
                    <Table.Cell>
                      {log.tokenName ? (
                        <Label basic>{log.tokenName}</Label>
                      ) : (
                        ''
                      )}
                    </Table.Cell>
                    <Table.Cell>{renderType(log.type)}</Table.Cell>
                    <Table.Cell>
                      {log.modelName ? (
                        <Label basic>{log.modelName}</Label>
                      ) : (
                        ''
                      )}
                    </Table.Cell>
                    <Table.Cell>
                      {log.promptTokens ? log.promptTokens : ''}
                    </Table.Cell>
                    <Table.Cell>
                      {log.completionTokens ? log.completionTokens : ''}
                    </Table.Cell>
                    <Table.Cell>
                      {log.quota ? renderQuota(log.quota, 6) : ''}
                    </Table.Cell>
                    <Table.Cell>{log.content}</Table.Cell>
                  </Table.Row>
                );
              })}
          </Table.Body>

          <Table.Footer>
            <Table.Row>
              <Table.HeaderCell colSpan={'10'}>
                <Select
                  placeholder='选择明细分类'
                  options={LOG_OPTIONS}
                  style={{ marginRight: '8px' }}
                  name='logType'
                  value={logType}
                  onChange={(e, { name, value }) => {
                    setLogType(value);
                  }}
                />
                <Button size='small' onClick={refresh} loading={loading}>
                  刷新
                </Button>
                <Pagination
                  floated='right'
                  activePage={activePage}
                  onPageChange={onPaginationChange}
                  size='small'
                  siblingRange={1}
                  totalPages={
                    Math.ceil(logs.length / ITEMS_PER_PAGE) +
                    (logs.length % ITEMS_PER_PAGE === 0 ? 1 : 0)
                  }
                />
              </Table.HeaderCell>
            </Table.Row>
          </Table.Footer>
        </Table>
      </Segment>
    </>
  );
};

export default LogsTable;
