import React, { useEffect, useState } from 'react';
import { Button, Form, Header, Label, Pagination, Segment, Select, Table } from 'semantic-ui-react';
import { API, isAdmin, showError, timestamp2string } from '../helpers';

import { ITEMS_PER_PAGE } from '../constants';
import { renderQuota } from '../helpers/render';

function renderTimestamp(timestamp) {
  return (
    <>
      {timestamp2string(timestamp)}
    </>
  );
}

const MODE_OPTIONS = [
  { key: 'all', text: '全部用户', value: 'all' },
  { key: 'self', text: '当前用户', value: 'self' }
];

const LOG_OPTIONS = [
  { key: '0', text: '全部', value: 0 },
  { key: '1', text: '充值', value: 1 },
  { key: '2', text: '消费', value: 2 },
  { key: '3', text: '管理', value: 3 },
  { key: '4', text: '系统', value: 4 }
];

function renderType(type) {
  switch (type) {
    case 1:
      return <Label basic color='green'> 充值 </Label>;
    case 2:
      return <Label basic color='olive'> 消费 </Label>;
    case 3:
      return <Label basic color='orange'> 管理 </Label>;
    case 4:
      return <Label basic color='purple'> 系统 </Label>;
    default:
      return <Label basic color='black'> 未知 </Label>;
  }
}

const LogsTable = () => {
  const [logs, setLogs] = useState([]);
  const [showStat, setShowStat] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searching, setSearching] = useState(false);
  const [logType, setLogType] = useState(0);
  const isAdminUser = isAdmin();
  let now = new Date();
  const [inputs, setInputs] = useState({
    userName: '',
    tokenName: '',
    modelName: '',
    startTimestamp: timestamp2string(0),
    endTimestamp: timestamp2string(now.getTime() / 1000 + 3600),
    channelId: ''
  });
  const { userName, tokenName, modelName, startTimestamp, endTimestamp, channelId } = inputs;

  const [stat, setStat] = useState({
    quota: 0,
    token: 0
  });

  const handleInputChange = (e, { name, value }) => {
    setInputs((inputs) => ({ ...inputs, [name]: value }));
  };

  const getLogSelfStat = async () => {
    let localStartTimestamp = Date.parse(startTimestamp) / 1000;
    let localEndTimestamp = Date.parse(endTimestamp) / 1000;
    let res = await API.get(`/api/log/self/stat?type=${logType}&tokenName=${tokenName}&modelName=${modelName}&startTimestamp=${localStartTimestamp}&endTimestamp=${localEndTimestamp}`);
    const { success, message, data } = res.data;
    if (success) {
      setStat(data);
    } else {
      showError(message);
    }
  };

  const getLogStat = async () => {
    let localStartTimestamp = Date.parse(startTimestamp) / 1000;
    let localEndTimestamp = Date.parse(endTimestamp) / 1000;
    let res = await API.get(`/api/log/stat?type=${logType}&userName=${userName}&tokenName=${tokenName}&modelName=${modelName}&startTimestamp=${localStartTimestamp}&endTimestamp=${localEndTimestamp}&channelId=${channelId}`);
    const { success, message, data } = res.data;
    if (success) {
      setStat(data);
    } else {
      showError(message);
    }
  };

  const handleEyeClick = async () => {
    if (!showStat) {
      if (isAdminUser) {
        await getLogStat();
      } else {
        await getLogSelfStat();
      }
    }
    setShowStat(!showStat);
  };

  const loadLogs = async (startIdx) => {
    let url = '';
    let localStartTimestamp = Date.parse(startTimestamp) / 1000;
    let localEndTimestamp = Date.parse(endTimestamp) / 1000;
    if (isAdminUser) {
      url = `/api/log/?p=${startIdx}&type=${logType}&userName=${userName}&tokenName=${tokenName}&modelName=${modelName}&startTimestamp=${localStartTimestamp}&endTimestamp=${localEndTimestamp}&channelId=${channelId}`;
    } else {
      url = `/api/log/self/?p=${startIdx}&type=${logType}&tokenName=${tokenName}&modelName=${modelName}&startTimestamp=${localStartTimestamp}&endTimestamp=${localEndTimestamp}`;
    }
    const res = await API.get(url);
    const { success, message, data } = res.data;
    if (success) {
      if (startIdx === 0) {
        setLogs(data);
      } else {
        let newLogs = [...logs];
        newLogs.splice(startIdx * ITEMS_PER_PAGE, data.length, ...data);
        setLogs(newLogs);
      }
    } else {
      showError(message);
    }
    setLoading(false);
  };

  const onPaginationChange = (e, { activePage }) => {
    (async () => {
      if (activePage === Math.ceil(logs.length / ITEMS_PER_PAGE) + 1) {
        // In this case we have to load more data and then append them.
        await loadLogs(activePage - 1);
      }
      setActivePage(activePage);
    })();
  };

  const refresh = async () => {
    setLoading(true);
    setActivePage(1);
    await loadLogs(0);
  };

  useEffect(() => {
    refresh().then();
  }, [logType]);

  const searchLogs = async () => {
    if (searchKeyword === '') {
      // if keyword is blank, load files instead.
      await loadLogs(0);
      setActivePage(1);
      return;
    }
    setSearching(true);
    const res = await API.get(`/api/log/self/search?keyword=${searchKeyword}`);
    const { success, message, data } = res.data;
    if (success) {
      setLogs(data);
      setActivePage(1);
    } else {
      showError(message);
    }
    setSearching(false);
  };

  const handleKeywordChange = async (e, { value }) => {
    setSearchKeyword(value.trim());
  };

  const sortLog = (key) => {
    if (logs.length === 0) return;
    setLoading(true);
    let sortedLogs = [...logs];
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
    if (sortedLogs[0].id === logs[0].id) {
      sortedLogs.reverse();
    }
    setLogs(sortedLogs);
    setLoading(false);
  };

  return (
    <>
      <Segment>
        <Header as='h3'>
          使用明细（总消耗额度：
          {showStat && renderQuota(stat.quota)}
          {!showStat && <span onClick={handleEyeClick} style={{ cursor: 'pointer', color: 'gray' }}>点击查看</span>}
          ）
        </Header>
        <Form>
          <Form.Group>
            <Form.Input fluid label={'令牌名称'} width={3} value={tokenName}
                        placeholder={'可选值'} name='tokenName' onChange={handleInputChange} />
            <Form.Input fluid label='模型名称' width={3} value={modelName} placeholder='可选值'
                        name='modelName'
                        onChange={handleInputChange} />
            <Form.Input fluid label='起始时间' width={4} value={startTimestamp} type='datetime-local'
                        name='startTimestamp'
                        onChange={handleInputChange} />
            <Form.Input fluid label='结束时间' width={4} value={endTimestamp} type='datetime-local'
                        name='endTimestamp'
                        onChange={handleInputChange} />
            <Form.Button fluid label='操作' width={2} onClick={refresh}>查询</Form.Button>
          </Form.Group>
          {
            isAdminUser && <>
              <Form.Group>
                <Form.Input fluid label={'渠道 ID'} width={3} value={channelId}
                            placeholder='可选值' name='channelId'
                            onChange={handleInputChange} />
                <Form.Input fluid label={'用户名称'} width={3} value={userName}
                            placeholder={'可选值'} name='userName'
                            onChange={handleInputChange} />

              </Form.Group>
            </>
          }
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
              {
                isAdminUser && <Table.HeaderCell
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    sortLog('channelId');
                  }}
                  width={1}
                >
                  渠道
                </Table.HeaderCell>
              }
              {
                isAdminUser && <Table.HeaderCell
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    sortLog('userName');
                  }}
                  width={1}
                >
                  用户
                </Table.HeaderCell>
              }
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
                    {
                      isAdminUser && (
                        <Table.Cell>{log.channelId ? <Label basic>{log.channelId}</Label> : ''}</Table.Cell>
                      )
                    }
                    {
                      isAdminUser && (
                        <Table.Cell>{log.userName ? <Label>{log.userName}</Label> : ''}</Table.Cell>
                      )
                    }
                    <Table.Cell>{log.tokenName ? <Label basic>{log.tokenName}</Label> : ''}</Table.Cell>
                    <Table.Cell>{renderType(log.type)}</Table.Cell>
                    <Table.Cell>{log.modelName ? <Label basic>{log.modelName}</Label> : ''}</Table.Cell>
                    <Table.Cell>{log.promptTokens ? log.promptTokens : ''}</Table.Cell>
                    <Table.Cell>{log.completionTokens ? log.completionTokens : ''}</Table.Cell>
                    <Table.Cell>{log.quota ? renderQuota(log.quota, 6) : ''}</Table.Cell>
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
                <Button size='small' onClick={refresh} loading={loading}>刷新</Button>
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
