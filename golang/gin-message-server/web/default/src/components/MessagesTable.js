import React, { useEffect, useRef, useState } from 'react';
import {
  Button,
  Form,
  Label,
  Modal,
  Pagination,
  Table,
} from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import { ITEMS_PER_PAGE } from '../constants';
import { API, openPage, showError, showSuccess, showWarning } from '../helpers';
import { renderTimestamp } from '../helpers/render';

/**
 * renderStatus 函数用于根据状态值渲染相应的标签。
 *
 * @param {number} status - 状态值
 * @returns {JSX.Element} - 渲染的标签组件
 */
function renderStatus(status) {
  switch (status) {
    case 1:
      // 如果状态值为 1，返回一个带有 olive 颜色的基本标签
      return (
        <Label basic color='olive'>
          正在投递
        </Label>
      );
    case 2:
      // 如果状态值为 2，返回一个带有 green 颜色的基本标签
      return (
        <Label basic color='green'>
          发送成功
        </Label>
      );
    case 3:
      // 如果状态值为 3，返回一个带有 red 颜色的基本标签
      return (
        <Label basic color='red'>
          发送失败
        </Label>
      );
    case 4:
      // 如果状态值为 4，返回一个带有 orange 颜色的基本标签
      return (
        <Label basic color='orange'>
          已在队列
        </Label>
      );
    default:
      // 对于其他未知状态值，返回一个带有 grey 颜色的基本标签
      return (
        <Label basic color='grey'>
          未知状态
        </Label>
      );
  }
}

const MessagesTable = () => {
  // 定义并初始化 loading 状态，初始值为 true
  const [loading, setLoading] = useState(true);
  // 定义并初始化 searching 状态，用于指示是否正在进行搜索，初始值为 false
  const [searching, setSearching] = useState(false);
  // 定义并初始化 autoRefresh 状态，用于指示是否启用自动刷新，初始值为 false
  const [autoRefresh, setAutoRefresh] = useState(false);
  // 定义并初始化 viewModalOpen 状态，用于指示查看模态框是否打开，初始值为 false
  const [viewModalOpen, setViewModalOpen] = useState(false);
  // 定义并初始化 activePage 状态，用于跟踪当前活动页码，初始值为 1
  const [activePage, setActivePage] = useState(1);
  // 定义并初始化 searchKeyword 状态，用于存储搜索关键词，初始为空字符串
  const [searchKeyword, setSearchKeyword] = useState('');
  // 定义并初始化 autoRefreshSeconds 状态，用于存储自动刷新的时间间隔（秒），初始值为 10
  const [autoRefreshSeconds, setAutoRefreshSeconds] = useState(10);

  // 定义并初始化 messages 状态，用于存储消息列表，初始为空数组
  const [messages, setMessages] = useState([]);
  // 定义并初始化 message 状态，用于存储要被查看的消息对象，初始包含默认消息内容
  const [message, setMessage] = useState({
    title: '消息标题',
    description: '消息描述',
    content: '消息内容',
    link: '',
  }); // Message to be viewed

  // 创建 autoRefreshSecondsRef 引用，用于保存 autoRefreshSeconds 的值
  const autoRefreshSecondsRef = useRef(autoRefreshSeconds);

  /**
   * 异步加载消息数据
   * @param {number} startIdx - 起始索引
   */
  const loadMessages = async (startIdx) => {
    // 设置 loading 状态为 true，表示正在加载数据
    setLoading(true);

    // 发起 API 请求，获取消息数据
    const res = await API.get(`/api/message/?p=${startIdx}`);
    const { success, message, data } = res.data;

    // 根据请求结果进行处理
    if (success) {
      // 如果起始索引为 0，直接设置消息数据
      if (startIdx === 0) {
        setMessages(data);
      } else {
        // 否则将新数据追加到现有消息列表中
        let newMessages = messages;
        newMessages.push(...data);
        setMessages(newMessages);
      }
    } else {
      // 如果请求失败，显示错误信息
      showError(message);
    }

    // 加载数据完成，设置 loading 状态为 false
    setLoading(false);
  };

  /**
   * 处理分页改变事件
   * @param {Event} e - 事件对象
   * @param {object} param1 - 包含活动页码的对象
   */
  const onPaginationChange = (e, { activePage }) => {
    // 异步函数立即执行
    (async () => {
      // 检查是否需要加载更多数据以进行追加
      if (activePage === Math.ceil(messages.length / ITEMS_PER_PAGE) + 1) {
        // 在这种情况下，我们需要加载更多数据然后追加它们
        await loadMessages(activePage - 1);
      }
      // 设置活动页码
      setActivePage(activePage);
    })();
  };

  /**
   * 检查权限
   */
  const checkPermission = async () => {
    // 检查全局权限
    let res = await API.get('/api/status');
    const { success, data } = res.data;
    if (success) {
      if (data.messagePersistenceEnabled) {
        return;
      }
    }

    // 检查用户权限
    {
      let res = await API.get('/api/user/self');
      const { success, message, data } = res.data;
      if (success) {
        if (data.save_message_to_database !== 1) {
          // 提示用户没有消息持久化权限
          showWarning('您没有消息持久化的权限，消息未保存，请联系管理员。');
        }
      } else {
        // 显示错误信息
        showError(message);
      }
    }
  };

  // 使用 useEffect 来处理组件的副作用
  useEffect(() => {
    // 载入消息，参数为 0
    loadMessages(0)
      .then()
      .catch((reason) => {
        // 如果载入消息出错，显示错误信息
        showError(reason);
      });

    // 检查权限
    checkPermission().then();

    // 创建一个 EventSource 对象，监听消息推送流
    const eventSource = new EventSource('/api/message/stream');
    // 监听连接错误事件
    eventSource.onerror = (e) => {
      // 显示服务端消息推送流连接出错的错误信息
      showError('服务端消息推送流连接出错！');
    };

    // 监听消息到达事件
    eventSource.onmessage = (e) => {
      // 解析收到的新消息数据
      let newMessage = JSON.parse(e.data);
      // 插入新消息
      insertNewMessage(newMessage);
    };

    // 在组件销毁时关闭 EventSource 连接
    return () => {
      eventSource.close();
    };
  }, []);

  /**
   * 查看消息
   * @param {string} id - 消息ID
   */
  const viewMessage = async (id) => {
    // 设置 loading 状态为 true，表示正在加载数据
    setLoading(true);

    // 发起 API 请求，获取消息数据
    const res = await API.get(`/api/message/${id}`);
    const { success, message, data } = res.data;

    // 根据请求结果进行处理
    if (success) {
      // 设置消息数据，并打开查看模态框
      setMessage(data);
      setViewModalOpen(true);
    } else {
      // 如果请求失败，显示错误信息
      showError(message);
    }

    // 加载数据完成，设置 loading 状态为 false
    setLoading(false);
  };

  /**
   * 重新发送消息
   * @param {string} id - 消息ID
   */
  const resendMessage = async (id) => {
    // 设置 loading 状态为 true，表示正在加载数据
    setLoading(true);

    // 发起 API POST 请求，重新发送消息
    const res = await API.post(`/api/message/resend/${id}`);
    const { success, message } = res.data;

    // 根据请求结果进行处理
    if (success) {
      // 显示成功提示消息
      showSuccess('消息已重新发送！');
    } else {
      // 如果请求失败，显示错误信息
      showError(message);
    }

    // 加载数据完成，设置 loading 状态为 false
    setLoading(false);
  };

  /**
   * 删除消息
   * @param {string} id - 消息ID
   * @param {number} idx - 消息索引
   */
  const deleteMessage = async (id, idx) => {
    // 设置 loading 状态为 true，表示正在加载数据
    setLoading(true);

    // 发起 API DELETE 请求，删除消息
    const res = await API.delete(`/api/message/${id}`);
    const { success, message } = res.data;

    // 根据请求结果进行处理
    if (success) {
      // 显示成功提示消息
      showSuccess('操作成功完成！');

      // 更新消息列表中对应消息的 deleted 属性为 true
      let newMessages = [...messages];
      let realIdx = (activePage - 1) * ITEMS_PER_PAGE + idx;
      newMessages[realIdx].deleted = true;
      setMessages(newMessages);
    } else {
      // 如果请求失败，显示错误信息
      showError(message);
    }

    // 加载数据完成，设置 loading 状态为 false
    setLoading(false);
  };

  /**
   * 搜索消息
   */
  const searchMessages = async () => {
    if (searchKeyword === '') {
      // 如果关键词为空，则加载文件而不是搜索
      await loadMessages(0);
      setActivePage(1);
      return;
    }

    // 设置搜索状态为 true，表示正在搜索
    setSearching(true);

    // 发起 API GET 请求，搜索消息
    const res = await API.get(`/api/message/search?keyword=${searchKeyword}`);
    const { success, message, data } = res.data;

    // 根据请求结果进行处理
    if (success) {
      // 设置搜索结果的消息列表，并将当前页设置为第一页
      setMessages(data);
      setActivePage(1);
    } else {
      // 如果请求失败，显示错误信息
      showError(message);
    }

    // 搜索完成，设置搜索状态为 false
    setSearching(false);
  };

  /**
   * 处理关键词变化
   * @param {Event} e - 事件对象
   * @param {Object} value - 变化后的值
   */
  const handleKeywordChange = async (e, { value }) => {
    // 去除首尾空格后设置搜索关键词
    setSearchKeyword(value.trim());
  };

  /**
   * 对消息进行排序
   * @param {string} key - 排序依据的键值
   */
  const sortMessage = (key) => {
    // 如果消息列表为空，则直接返回
    if (messages.length === 0) return;

    // 设置 loading 状态为 true，表示正在加载数据
    setLoading(true);

    // 复制消息列表进行排序操作
    let sortedMessages = [...messages];
    sortedMessages.sort((a, b) => {
      return ('' + a[key]).localeCompare(b[key]);
    });

    // 检查是否需要反转排序结果
    if (sortedMessages[0].id === messages[0].id) {
      sortedMessages.reverse();
    }

    // 更新消息列表为排序后的列表
    setMessages(sortedMessages);

    // 设置 loading 状态为 false，加载数据完成
    setLoading(false);
  };

  // insertNewMessage 函数用于插入新的消息。
  //
  // 输入参数：
  //   - message: 要插入的新消息对象。
  // 输出参数：
  //   - 无。
  const insertNewMessage = (message) => {
    // 使用 setMessages 更新 messages 数组
    setMessages((messages) => {
      // 创建一个含有新消息的数组
      let newMessages = [message];

      // 将原来的 messages 数组展开，并追加到新消息数组中
      newMessages.push(...messages);

      // 返回更新后的 messages 数组
      return newMessages;
    });

    // 设置 activePage 为 1
    setActivePage(1);
  };

  /**
   * 刷新消息列表
   */
  const refresh = async () => {
    // 调用加载消息的函数，加载第一页的消息
    await loadMessages(0);
    // 将当前页设置为第一页
    setActivePage(1);
  };

  /**
   * 自动刷新效果
   */
  useEffect(() => {
    let intervalId;

    if (autoRefresh) {
      // 设置定时器，每秒执行一次
      intervalId = setInterval(() => {
        if (autoRefreshSecondsRef.current === 0) {
          // 当自动刷新倒计时为 0 时，调用刷新函数，并重置倒计时为 10 秒
          refresh().then();
          setAutoRefreshSeconds(10);
          autoRefreshSecondsRef.current = 10;
        } else {
          // 倒计时减 1，更新倒计时显示
          autoRefreshSecondsRef.current -= 1;
          setAutoRefreshSeconds((autoRefreshSeconds) => autoRefreshSeconds - 1); // Important!
        }
      }, 1000);
    }

    // 在组件卸载时清除定时器
    return () => clearInterval(intervalId);
  }, [autoRefresh]);

  return (
    <>
      <Form onSubmit={searchMessages}>
        <Form.Input
          icon='search'
          fluid
          iconPosition='left'
          placeholder='搜索消息的 ID，标题，描述，以及消息内容 ...'
          value={searchKeyword}
          loading={searching}
          onChange={handleKeywordChange}
        />
      </Form>
      <Table basic loading={loading}>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell
              style={{ cursor: 'pointer' }}
              onClick={() => {
                sortMessage('id');
              }}
            >
              消息 ID
            </Table.HeaderCell>
            <Table.HeaderCell
              style={{ cursor: 'pointer' }}
              onClick={() => {
                sortMessage('title');
              }}
            >
              标题
            </Table.HeaderCell>
            <Table.HeaderCell
              style={{ cursor: 'pointer' }}
              onClick={() => {
                sortMessage('channel');
              }}
            >
              通道
            </Table.HeaderCell>
            <Table.HeaderCell
              style={{ cursor: 'pointer' }}
              onClick={() => {
                sortMessage('timestamp');
              }}
            >
              发送时间
            </Table.HeaderCell>
            <Table.HeaderCell
              style={{ cursor: 'pointer' }}
              onClick={() => {
                sortMessage('status');
              }}
            >
              状态
            </Table.HeaderCell>
            <Table.HeaderCell>操作</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {messages
            .slice(
              (activePage - 1) * ITEMS_PER_PAGE,
              activePage * ITEMS_PER_PAGE
            )
            .map((message, idx) => {
              if (message.deleted) return <></>;
              return (
                <Table.Row key={message.id}>
                  <Table.Cell>{'#' + message.id}</Table.Cell>
                  <Table.Cell>
                    {message.title ? message.title : '无标题'}
                  </Table.Cell>
                  <Table.Cell>
                    <Label>{message.channel}</Label>
                  </Table.Cell>
                  <Table.Cell>{renderTimestamp(message.timestamp)}</Table.Cell>
                  <Table.Cell>{renderStatus(message.status)}</Table.Cell>
                  <Table.Cell>
                    <div>
                      <Button
                        size={'small'}
                        positive
                        loading={loading}
                        onClick={() => {
                          viewMessage(message.id).then();
                        }}
                      >
                        查看
                      </Button>
                      <Button
                        size={'small'}
                        primary
                        loading={loading}
                        as={Link}
                        to={'/editor/' + message.id}
                      >
                        编辑
                      </Button>
                      <Button
                        size={'small'}
                        color={'yellow'}
                        loading={loading}
                        onClick={() => {
                          resendMessage(message.id).then();
                        }}
                      >
                        重发
                      </Button>
                      <Button
                        size={'small'}
                        negative
                        loading={loading}
                        onClick={() => {
                          deleteMessage(message.id, idx).then();
                        }}
                      >
                        删除
                      </Button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              );
            })}
        </Table.Body>

        <Table.Footer>
          <Table.Row>
            <Table.HeaderCell colSpan='6'>
              <Button
                size='small'
                loading={loading}
                onClick={() => {
                  refresh().then();
                }}
              >
                手动刷新
              </Button>
              <Button
                size='small'
                loading={loading}
                onClick={() => {
                  setAutoRefresh(!autoRefresh);
                  setAutoRefreshSeconds(10);
                }}
              >
                {autoRefresh
                  ? `自动刷新中（${autoRefreshSeconds} 秒后刷新）`
                  : '自动刷新'}
              </Button>
              <Pagination
                floated='right'
                activePage={activePage}
                onPageChange={onPaginationChange}
                size='small'
                siblingRange={1}
                totalPages={
                  Math.ceil(messages.length / ITEMS_PER_PAGE) +
                  (messages.length % ITEMS_PER_PAGE === 0 ? 1 : 0)
                }
              />
            </Table.HeaderCell>
          </Table.Row>
        </Table.Footer>
      </Table>
      <Modal size='tiny' open={viewModalOpen}>
        <Modal.Header>{message.title ? message.title : '无标题'}</Modal.Header>
        <Modal.Content>
          {message.description ? (
            <p className={'quote'}>{message.description}</p>
          ) : (
            ''
          )}
          {message.content ? <p>{message.content}</p> : ''}
        </Modal.Content>
        <Modal.Actions>
          <Button
            onClick={() => {
              if (message.URL) {
                openPage(message.URL);
              } else {
                openPage(`/message/${message.link}`);
              }
            }}
          >
            访问链接
          </Button>
          <Button
            onClick={() => {
              setViewModalOpen(false);
            }}
          >
            关闭
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  );
};

export default MessagesTable;
