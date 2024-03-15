import React, { useEffect, useState } from 'react';
import {
  Button,
  Form,
  Input,
  Label,
  Message,
  Pagination,
  Popup,
  Table,
} from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import {
  API,
  setPromptShown,
  shouldShowPrompt,
  showError,
  showInfo,
  showSuccess,
  timestamp2string,
  loadChannelModels,
} from '../helpers';

import { renderGroup, renderNumber } from '../helpers/render';

import { CHANNEL_OPTIONS, ITEMS_PER_PAGE } from '../constants';

/**
 * 将时间戳转换为字符串并渲染。
 * @param {number} timestamp - 要转换的时间戳。
 * @returns {JSX.Element} 渲染的时间戳字符串。
 */
function renderTimestamp(timestamp) {
  // 假设 timestamp2string(timestamp) 是一个将时间戳转换为字符串的函数
  return <>{timestamp2string(timestamp)}</>;
}

let type2label = undefined;

/**
 * 渲染类型对应的标签。
 * @param {number} type - 要渲染标签的类型。
 * @returns {JSX.Element} 对应类型的标签组件。
 */
function renderType(type) {
  if (!type2label) {
    type2label = new Map();

    for (let i = 0; i < CHANNEL_OPTIONS.length; i++) {
      type2label[CHANNEL_OPTIONS[i].value] = CHANNEL_OPTIONS[i];
    }

    type2label[0] = { value: 0, text: '未知类型', color: 'grey' };
  }

  return (
    <Label basic color={type2label[type]?.color}>
      {type2label[type]?.text}
    </Label>
  );
}

/**
 * 渲染不同类型对应的余额。
 * @param {number} type - 余额类型。
 * @param {number} balance - 余额数值。
 * @returns {JSX.Element} 渲染后的余额组件。
 */
function renderBalance(type, balance) {
  switch (type) {
    case 1: // OpenAI
      return <span>${balance.toFixed(2)}</span>;
    case 4: // CloseAI
      return <span>¥{balance.toFixed(2)}</span>;
    case 8: // 自定义
      return <span>${balance.toFixed(2)}</span>;
    case 5: // OpenAI-SB
      return <span>¥{(balance / 10000).toFixed(2)}</span>;
    case 10: // AI Proxy
      return <span>{renderNumber(balance)}</span>;
    case 12: // API2GPT
      return <span>¥{balance.toFixed(2)}</span>;
    case 13: // AIGC2D
      return <span>{renderNumber(balance)}</span>;
    default:
      return <span>不支持</span>;
  }
}

const ChannelsTable = () => {
  const [channels, setChannels] = useState([]); // 渠道列表数据
  const [loading, setLoading] = useState(true); // 加载状态
  const [activePage, setActivePage] = useState(1); // 当前活动页数
  const [searchKeyword, setSearchKeyword] = useState(''); // 搜索关键词
  const [searching, setSearching] = useState(false); // 搜索状态
  const [updatingBalance, setUpdatingBalance] = useState(false); // 更新余额状态
  const [showPrompt, setShowPrompt] = useState(
    shouldShowPrompt('channel-test')
  ); // 是否显示提示框

  /**
   * 异步加载渠道数据并更新状态。
   * @param {number} startIdx - 起始索引值。
   */
  const loadChannels = async (startIdx) => {
    // 发起 API 请求获取渠道数据
    const res = await API.get(`/api/channel/?p=${startIdx}`);
    const { success, message, data } = res.data;

    if (success) {
      if (startIdx === 0) {
        // 如果 startIdx 为 0，表示是首次加载，直接使用返回的数据设置 channels 状态
        setChannels(data);
      } else {
        // 如果 startIdx 不为 0，表示是分页加载，需要将新数据插入到已有的 channels 数组中
        let newChannels = [...channels];
        newChannels.splice(startIdx * ITEMS_PER_PAGE, data.length, ...data);
        setChannels(newChannels);
      }
    } else {
      // 如果请求不成功，显示错误信息
      showError(message);
    }

    // 数据加载完成后，将 loading 状态设置为 false
    setLoading(false);
  };

  /**
   * 响应分页组件的切换事件，更新渠道列表状态及当前页码。
   * 如果需要加载更多数据，则调用 loadChannels 函数异步加载新数据并追加到现有数据中。
   * @param {object} e - 分页组件切换事件对象。
   * @param {object} data - 分页组件切换事件携带的数据对象，包含 activePage 属性表示当前选中的页码。
   */
  const onPaginationChange = (e, { activePage }) => {
    // 创建立即调用的 async 函数，以便使用 await 关键字等待异步操作完成
    (async () => {
      if (activePage === Math.ceil(channels.length / ITEMS_PER_PAGE) + 1) {
        // 如果当前页码等于渠道列表总页数加一，表示需要加载更多数据
        await loadChannels(activePage - 1); // 调用异步函数 loadChannels 加载新数据并追加到 channels 状态中
      }
      setActivePage(activePage); // 更新当前页码状态
    })();
  };

  /**
   * 异步刷新渠道数据，重新加载当前页数据。
   * 设置 loading 状态为 true，然后调用 loadChannels 函数加载当前页的数据。
   */
  const refresh = async () => {
    setLoading(true); // 设置 loading 状态为 true，表示正在加载数据
    await loadChannels(activePage - 1); // 调用 loadChannels 函数加载当前页的数据
  };

  // 使用 useEffect 钩子函数来在组件加载完成后执行一次异步加载渠道数据的操作
  useEffect(() => {
    // 在组件加载完成后执行一次异步加载渠道数据的操作
    loadChannels(0)
      .then()
      .catch((reason) => {
        // 如果加载数据出错，则显示错误信息
        showError(reason);
      });
    loadChannelModels().then();
  }, []);

  /**
   * 对渠道进行管理操作，包括删除、启用、禁用、设置优先级和权重等。
   * @param {string} id - 渠道的唯一标识符。
   * @param {string} action - 执行的操作，可以是 'delete'、'enable'、'disable'、'priority' 或 'weight'。
   * @param {number} idx - 在渠道列表中的索引位置。
   * @param {string} value - 操作需要的值，如优先级或权重。
   */
  const manageChannel = async (id, action, idx, value) => {
    // 初始化数据对象
    let data = { id };
    let res;

    // 根据不同操作执行相应的处理
    switch (action) {
      case 'delete':
        // 删除操作
        res = await API.delete(`/api/channel/${id}/`);
        break;
      case 'enable':
        // 启用操作
        data.status = 1;
        res = await API.put('/api/channel/', data);
        break;
      case 'disable':
        // 禁用操作
        data.status = 2;
        res = await API.put('/api/channel/', data);
        break;
      case 'priority':
        // 设置优先级操作
        if (value === '') {
          return;
        }
        data.priority = parseInt(value);
        res = await API.put('/api/channel/', data);
        break;
      case 'weight':
        // 设置权重操作
        if (value === '') {
          return;
        }
        data.weight = parseInt(value);
        if (data.weight < 0) {
          data.weight = 0;
        }
        res = await API.put('/api/channel/', data);
        break;
    }

    // 处理 API 返回的结果
    const { success, message } = res.data;

    // 根据操作结果显示成功或错误信息，并更新渠道数据
    if (success) {
      showSuccess('操作成功完成！');
      let channel = res.data.data;
      let newChannels = [...channels];
      let realIdx = (activePage - 1) * ITEMS_PER_PAGE + idx;

      if (action === 'delete') {
        newChannels[realIdx].deleted = true;
      } else {
        newChannels[realIdx].status = channel.status;
      }

      setChannels(newChannels);
    } else {
      showError(message);
    }
  };

  /**
   * 根据状态值渲染不同样式和内容的标签。
   * @param {number} status - 渠道的状态值，可能取 1、2、3。
   * @returns {JSX.Element} - 返回渲染出的标签元素。
   */
  const renderStatus = (status) => {
    switch (status) {
      case 1:
        // 当状态为 1 时，显示绿色标签“已启用”
        return (
          <Label basic color='green'>
            已启用
          </Label>
        );
      case 2:
        // 当状态为 2 时，显示红色标签“已禁用”，并附带弹出提示信息
        return (
          <Popup
            trigger={
              <Label basic color='red'>
                已禁用
              </Label>
            }
            content='本渠道被手动禁用'
            basic
          />
        );
      case 3:
        // 当状态为 3 时，显示黄色标签“已禁用”，并附带弹出提示信息
        return (
          <Popup
            trigger={
              <Label basic color='yellow'>
                已禁用
              </Label>
            }
            content='本渠道被程序自动禁用'
            basic
          />
        );
      default:
        // 默认情况下，显示灰色标签“未知状态”
        return (
          <Label basic color='grey'>
            未知状态
          </Label>
        );
    }
  };

  /**
   * 根据响应时间值渲染不同样式和内容的标签。
   * @param {number} responseTime - 响应时间，单位为毫秒。
   * @returns {JSX.Element} - 返回渲染出的标签元素。
   */
  const renderResponseTime = (responseTime) => {
    let time = responseTime / 1000; // 将毫秒转换为秒
    time = time.toFixed(2) + ' 秒'; // 格式化时间为保留两位小数的秒数加上单位

    if (responseTime === 0) {
      // 当响应时间为 0 时，显示灰色标签“未测试”
      return (
        <Label basic color='grey'>
          未测试
        </Label>
      );
    } else if (responseTime <= 1000) {
      // 当响应时间小于等于 1000 毫秒时，显示绿色标签，显示格式化后的时间
      return (
        <Label basic color='green'>
          {time}
        </Label>
      );
    } else if (responseTime <= 3000) {
      // 当响应时间小于等于 3000 毫秒时，显示橄榄色标签，显示格式化后的时间
      return (
        <Label basic color='olive'>
          {time}
        </Label>
      );
    } else if (responseTime <= 5000) {
      // 当响应时间小于等于 5000 毫秒时，显示黄色标签，显示格式化后的时间
      return (
        <Label basic color='yellow'>
          {time}
        </Label>
      );
    } else {
      // 其他情况下，显示红色标签，显示格式化后的时间
      return (
        <Label basic color='red'>
          {time}
        </Label>
      );
    }
  };

  /**
   * 搜索频道的异步函数。
   */
  const searchChannels = async () => {
    if (searchKeyword === '') {
      // 如果搜索关键词为空，加载文件而不是搜索
      await loadChannels(0); // 调用 loadChannels 函数加载文件
      setActivePage(1); // 设置活动页面为第一页
      return;
    }

    setSearching(true); // 设置搜索中状态为 true
    const res = await API.get(`/api/channel/search?keyword=${searchKeyword}`); // 发起搜索请求
    const { success, message, data } = res.data; // 从响应数据中解构出 success、message 和 data

    if (success) {
      setChannels(data); // 如果搜索成功，设置频道数据为搜索结果
      setActivePage(1); // 设置活动页面为第一页
    } else {
      showError(message); // 如果搜索失败，显示错误信息
    }

    setSearching(false); // 设置搜索中状态为 false
  };

  /**
   * 测试频道响应时间的异步函数。
   * @param {string} id - 频道的唯一标识符。
   * @param {string} name - 频道名称。
   * @param {number} idx - 频道在列表中的索引。
   */
  const testChannel = async (id, name, idx) => {
    const res = await API.get(`/api/channel/test/${id}/`); // 发起测试频道响应时间的请求
    const { success, message, time } = res.data; // 从响应数据中解构出 success、message 和 time

    if (success) {
      let newChannels = [...channels]; // 创建频道列表的副本
      let realIdx = (activePage - 1) * ITEMS_PER_PAGE + idx; // 计算频道在整个列表中的实际索引
      newChannels[realIdx].responseTime = time * 1000; // 更新频道的响应时间（转换为毫秒）
      newChannels[realIdx].testTime = Date.now() / 1000; // 记录测试时间
      setChannels(newChannels); // 更新频道列表数据
      showInfo(`通道 ${name} 测试成功，耗时 ${time.toFixed(2)} 秒。`); // 显示测试成功信息
    } else {
      showError(message); // 显示错误信息
    }
  };

  /**
   * 开始测试所有通道的响应时间的异步函数。
   */
  const testChannels = async (scope) => {
    const res = await API.get(`/api/channel/test?scope=${scope}`); // 发起测试所有通道的请求
    const { success, message } = res.data; // 从响应数据中解构出 success 和 message

    if (success) {
      showInfo('已成功开始测试通道，请刷新页面查看结果。'); // 显示提示信息，通知已成功开始测试所有通道
    } else {
      showError(message); // 显示错误信息
    }
  };

  /**
   * 删除所有已禁用频道的异步函数。
   */
  const deleteAllDisabledChannels = async () => {
    const res = await API.delete(`/api/channel/disabled`); // 发起删除所有已禁用频道的请求
    const { success, message, data } = res.data; // 从响应数据中解构出 success、message 和 data

    if (success) {
      showSuccess(`已删除所有禁用渠道，共计 ${data} 个`); // 显示成功提示信息，显示已删除的禁用频道数量
      await refresh(); // 刷新页面数据
    } else {
      showError(message); // 显示错误信息
    }
  };

  /**
   * 更新频道余额信息的异步函数。
   * @param {string} id - 频道的唯一标识符。
   * @param {string} name - 频道名称。
   * @param {number} idx - 频道在列表中的索引。
   */
  const updateChannelBalance = async (id, name, idx) => {
    const res = await API.get(`/api/channel/update_balance/${id}/`); // 发起更新频道余额信息的请求
    const { success, message, balance } = res.data; // 从响应数据中解构出 success、message 和 balance

    if (success) {
      let newChannels = [...channels]; // 创建频道列表的副本
      let realIdx = (activePage - 1) * ITEMS_PER_PAGE + idx; // 计算频道在整个列表中的实际索引
      newChannels[realIdx].balance = balance; // 更新频道的余额信息
      newChannels[realIdx].balanceUpdateTime = Date.now() / 1000; // 记录余额更新时间
      setChannels(newChannels); // 更新频道列表数据
      showInfo(`通道 ${name} 余额更新成功！`); // 显示余额更新成功信息
    } else {
      showError(message); // 显示错误信息
    }
  };

  /**
   * 更新所有已启用通道余额信息的异步函数。
   */
  const updateAllChannelsBalance = async () => {
    setUpdatingBalance(true); // 设置正在更新余额信息的状态为 true
    const res = await API.get(`/api/channel/update_balance`); // 发起更新所有已启用通道余额信息的请求
    const { success, message } = res.data; // 从响应数据中解构出 success 和 message

    if (success) {
      showInfo('已更新完毕所有已启用通道余额！'); // 显示更新完毕的提示信息
    } else {
      showError(message); // 显示错误信息
    }
    setUpdatingBalance(false); // 设置正在更新余额信息的状态为 false
  };

  /**
   * 处理关键字变化的异步函数。
   * @param {Object} e - 事件对象。
   * @param {Object} value - 变化后的关键字值。
   */
  const handleKeywordChange = async (e, { value }) => {
    setSearchKeyword(value.trim()); // 更新搜索关键字，去除前后空格
  };

  /**
   * 对频道列表进行排序的函数。
   * @param {string} key - 排序关键字。
   */
  const sortChannel = (key) => {
    if (channels.length === 0) return; // 如果频道列表为空，则直接返回
    setLoading(true); // 设置加载状态为 true
    let sortedChannels = [...channels]; // 创建频道列表的副本用于排序
    sortedChannels.sort((a, b) => {
      if (!isNaN(a[key])) {
        // 如果值是数字，则以数字方式排序
        return a[key] - b[key];
      } else {
        // 如果值不是数字，则以字符串方式排序
        return ('' + a[key]).localeCompare(b[key]);
      }
    });
    if (sortedChannels[0].id === channels[0].id) {
      sortedChannels.reverse(); // 如果排序后第一个频道与原列表第一个频道相同，则反转排序顺序
    }
    setChannels(sortedChannels); // 更新排序后的频道列表
    setLoading(false); // 设置加载状态为 false
  };

  return (
    <>
      <Form onSubmit={searchChannels}>
        <Form.Input
          icon='search'
          fluid
          iconPosition='left'
          placeholder='搜索渠道的 ID，名称和密钥 ...'
          value={searchKeyword}
          loading={searching}
          onChange={handleKeywordChange}
        />
      </Form>
      {showPrompt && (
        <Message
          onDismiss={() => {
            setShowPrompt(false);
            setPromptShown('channel-test');
          }}
        >
          OpenAI 渠道已经不再支持通过 key 获取余额，因此余额显示为
          0。对于支持的渠道类型，请点击余额进行刷新。
        </Message>
      )}
      <Table basic compact size='small'>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell
              style={{ cursor: 'pointer' }}
              onClick={() => {
                sortChannel('id');
              }}
            >
              ID
            </Table.HeaderCell>
            <Table.HeaderCell
              style={{ cursor: 'pointer' }}
              onClick={() => {
                sortChannel('name');
              }}
            >
              名称
            </Table.HeaderCell>
            <Table.HeaderCell
              style={{ cursor: 'pointer' }}
              onClick={() => {
                sortChannel('group');
              }}
            >
              分组
            </Table.HeaderCell>
            <Table.HeaderCell
              style={{ cursor: 'pointer' }}
              onClick={() => {
                sortChannel('type');
              }}
            >
              类型
            </Table.HeaderCell>
            <Table.HeaderCell
              style={{ cursor: 'pointer' }}
              onClick={() => {
                sortChannel('status');
              }}
            >
              状态
            </Table.HeaderCell>
            <Table.HeaderCell
              style={{ cursor: 'pointer' }}
              onClick={() => {
                sortChannel('responseTime');
              }}
            >
              响应时间
            </Table.HeaderCell>
            <Table.HeaderCell
              style={{ cursor: 'pointer' }}
              onClick={() => {
                sortChannel('balance');
              }}
            >
              余额
            </Table.HeaderCell>
            <Table.HeaderCell
              style={{ cursor: 'pointer' }}
              onClick={() => {
                sortChannel('priority');
              }}
            >
              优先级
            </Table.HeaderCell>
            <Table.HeaderCell>操作</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {channels
            .slice(
              (activePage - 1) * ITEMS_PER_PAGE,
              activePage * ITEMS_PER_PAGE
            )
            .map((channel, idx) => {
              if (channel.deleted) return <></>;
              return (
                <Table.Row key={channel.id}>
                  <Table.Cell>{channel.id}</Table.Cell>
                  <Table.Cell>{channel.name ? channel.name : '无'}</Table.Cell>
                  <Table.Cell>{renderGroup(channel.group)}</Table.Cell>
                  <Table.Cell>{renderType(channel.type)}</Table.Cell>
                  <Table.Cell>{renderStatus(channel.status)}</Table.Cell>
                  <Table.Cell>
                    <Popup
                      content={
                        channel.testTime
                          ? renderTimestamp(channel.testTime)
                          : '未测试'
                      }
                      key={channel.id}
                      trigger={renderResponseTime(channel.responseTime)}
                      basic
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <Popup
                      trigger={
                        <span
                          onClick={() => {
                            updateChannelBalance(channel.id, channel.name, idx);
                          }}
                          style={{ cursor: 'pointer' }}
                        >
                          {renderBalance(channel.type, channel.balance)}
                        </span>
                      }
                      content='点击更新'
                      basic
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <Popup
                      trigger={
                        <Input
                          type='number'
                          defaultValue={channel.priority}
                          onBlur={(event) => {
                            manageChannel(
                              channel.id,
                              'priority',
                              idx,
                              event.target.value
                            );
                          }}
                        >
                          <input style={{ maxWidth: '60px' }} />
                        </Input>
                      }
                      content='渠道选择优先级，越高越优先'
                      basic
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <div>
                      <Button
                        size={'small'}
                        positive
                        onClick={() => {
                          testChannel(channel.id, channel.name, idx);
                        }}
                      >
                        测试
                      </Button>
                      <Button
                        size={'small'}
                        positive
                        loading={updatingBalance}
                        onClick={() => {
                          updateChannelBalance(channel.id, channel.name, idx);
                        }}
                      >
                        更新余额
                      </Button>
                      <Popup
                        trigger={
                          <Button size='small' negative>
                            删除
                          </Button>
                        }
                        on='click'
                        flowing
                        hoverable
                      >
                        <Button
                          negative
                          onClick={() => {
                            manageChannel(channel.id, 'delete', idx);
                          }}
                        >
                          删除渠道 {channel.name}
                        </Button>
                      </Popup>
                      <Button
                        size={'small'}
                        onClick={() => {
                          manageChannel(
                            channel.id,
                            channel.status === 1 ? 'disable' : 'enable',
                            idx
                          );
                        }}
                      >
                        {channel.status === 1 ? '禁用' : '启用'}
                      </Button>
                      <Button
                        size={'small'}
                        as={Link}
                        to={'/channel/edit/' + channel.id}
                      >
                        编辑
                      </Button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              );
            })}
        </Table.Body>

        <Table.Footer>
          <Table.Row>
            <Table.HeaderCell colSpan='9'>
              <Button
                size='small'
                as={Link}
                to='/channel/add'
                loading={loading}
              >
                添加新的渠道
              </Button>
              <Button
                size='small'
                loading={loading}
                onClick={() => {
                  testChannels('all');
                }}
              >
                测试所有渠道
              </Button>
              <Button
                size='small'
                loading={loading}
                onClick={() => {
                  testChannels('disabled');
                }}
              >
                测试禁用渠道
              </Button>
              <Button
                size='small'
                onClick={updateAllChannelsBalance}
                loading={loading || updatingBalance}
              >
                更新已启用渠道余额
              </Button>
              <Popup
                trigger={
                  <Button size='small' loading={loading}>
                    删除禁用渠道
                  </Button>
                }
                on='click'
                flowing
                hoverable
              >
                <Button
                  size='small'
                  loading={loading}
                  negative
                  onClick={deleteAllDisabledChannels}
                >
                  确认删除
                </Button>
              </Popup>
              <Pagination
                floated='right'
                activePage={activePage}
                onPageChange={onPaginationChange}
                size='small'
                siblingRange={1}
                totalPages={
                  Math.ceil(channels.length / ITEMS_PER_PAGE) +
                  (channels.length % ITEMS_PER_PAGE === 0 ? 1 : 0)
                }
              />
              <Button size='small' onClick={refresh} loading={loading}>
                刷新
              </Button>
            </Table.HeaderCell>
          </Table.Row>
        </Table.Footer>
      </Table>
    </>
  );
};

export default ChannelsTable;
