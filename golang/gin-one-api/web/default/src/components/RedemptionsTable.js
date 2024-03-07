import React, { useEffect, useState } from 'react';
import {
  Button,
  Form,
  Label,
  Popup,
  Pagination,
  Table,
} from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import {
  API,
  copy,
  showError,
  showInfo,
  showSuccess,
  showWarning,
  timestamp2string,
} from '../helpers';
import { renderQuota } from '../helpers/render';

import { ITEMS_PER_PAGE } from '../constants';

/**
 * 将时间戳转换为可读的时间字符串并返回
 * @param {number} timestamp 时间戳
 * @returns {string} 格式化后的时间字符串
 */
function renderTimestamp(timestamp) {
  return <>{timestamp2string(timestamp)}</>;
}
/**
 * 根据状态值返回相应的标签组件，用于展示不同状态的信息
 * @param {number} status 状态值
 * @returns {ReactNode} 相应的标签组件
 */
function renderStatus(status) {
  switch (status) {
    case 1:
      return (
        <Label basic color='green'>
          未使用
        </Label>
      );
    case 2:
      return (
        <Label basic color='red'>
          已禁用
        </Label>
      );
    case 3:
      return (
        <Label basic color='grey'>
          已使用
        </Label>
      );
    default:
      return (
        <Label basic color='black'>
          未知状态
        </Label>
      );
  }
}

const RedemptionsTable = () => {
  const [loading, setLoading] = useState(true); // 加载状态
  const [searching, setSearching] = useState(false); // 搜索状态
  const [activePage, setActivePage] = useState(1); // 当前页码
  const [redemptions, setRedemptions] = useState([]); // 兑换列表数据
  const [searchKeyword, setSearchKeyword] = useState(''); // 搜索关键词

  /**
   * 从服务器加载兑换列表数据
   * @param {number} startIdx - 起始索引
   * @returns {void}
   */
  const loadRedemptions = async (startIdx) => {
    try {
      // 发送API请求获取兑换列表数据
      const res = await API.get(`/api/redemption/?p=${startIdx}`);
      const { success, message, data } = res.data;

      if (success) {
        // 如果请求成功
        if (startIdx === 0) {
          // 第一次加载数据，直接设置为redemptions的新值
          setRedemptions(data);
        } else {
          // 在现有数据基础上加载更多数据
          let newRedemptions = [...redemptions];
          newRedemptions.push(...data);
          setRedemptions(newRedemptions);
        }
      } else {
        // 请求失败，显示错误信息
        showError(message);
      }

      // 加载完成，将loading状态设为false
      setLoading(false);
    } catch (error) {
      // 捕获并处理异步操作中的错误
      console.error('Error while loading redemptions:', error);
      showError('Failed to load redemptions');
      setLoading(false);
    }
  };

  /**
   * 处理分页改变事件
   * @param {Event} e - 事件对象
   * @param {Object} data - 包含activePage属性的对象
   * @returns {void}
   */
  const onPaginationChange = (e, { activePage }) => {
    (async () => {
      if (activePage === Math.ceil(redemptions.length / ITEMS_PER_PAGE) + 1) {
        // 如果当前页为最后一页，则加载更多数据并追加到列表中
        await loadRedemptions(activePage - 1);
      }
      // 更新当前活动页码
      setActivePage(activePage);
    })();
  };

  /**
   * 初始化加载兑换列表数据
   * @returns {void}
   */
  useEffect(() => {
    loadRedemptions(0)
      .then()
      .catch((reason) => {
        showError(reason);
      });
  }, []);

  /**
   * 管理兑换操作：删除、启用或禁用
   * @param {number} id - 兑换项ID
   * @param {string} action - 操作类型 ('delete', 'enable', 'disable')
   * @param {number} idx - 在当前页中的索引
   * @returns {void}
   */
  const manageRedemption = async (id, action, idx) => {
    let data = { id };
    let res;
    switch (action) {
      case 'delete':
        res = await API.delete(`/api/redemption/${id}/`);
        break;
      case 'enable':
        data.status = 1;
        res = await API.put('/api/redemption/?withStatus=true', data);
        break;
      case 'disable':
        data.status = 2;
        res = await API.put('/api/redemption/?withStatus=true', data);
        break;
    }
    const { success, message } = res.data;
    if (success) {
      showSuccess('操作成功完成！');
      let redemption = res.data.data;
      let newRedemptions = [...redemptions];
      let realIdx = (activePage - 1) * ITEMS_PER_PAGE + idx;
      if (action === 'delete') {
        newRedemptions[realIdx].deleted = true;
      } else {
        newRedemptions[realIdx].status = redemption.status;
      }
      setRedemptions(newRedemptions);
    } else {
      showError(message);
    }
  };
  /**
   * 搜索兑换项
   * 如果搜索关键词为空，则加载文件。
   * @returns {void}
   */
  const searchRedemptions = async () => {
    if (searchKeyword === '') {
      // 如果关键词为空，则加载文件。
      await loadRedemptions(0);
      setActivePage(1);
      return;
    }
    setSearching(true);
    const res = await API.get(
      `/api/redemption/search?keyword=${searchKeyword}`
    );
    const { success, message, data } = res.data;
    if (success) {
      setRedemptions(data);
      setActivePage(1);
    } else {
      showError(message);
    }
    setSearching(false);
  };

  /**
   * 处理关键词变化
   * @param {Object} e - 事件对象
   * @param {Object} value - 输入值
   * @returns {void}
   */
  const handleKeywordChange = async (e, { value }) => {
    setSearchKeyword(value.trim());
  };

  /**
   * 对兑换项进行排序
   * @param {string} key - 排序关键词
   * @returns {void}
   */
  const sortRedemption = (key) => {
    if (redemptions.length === 0) return;
    setLoading(true);
    let sortedRedemptions = [...redemptions];
    sortedRedemptions.sort((a, b) => {
      if (!isNaN(a[key])) {
        // 如果值是数字，则相减进行排序
        return a[key] - b[key];
      } else {
        // 如果值不是数字，则按字符串排序
        return ('' + a[key]).localeCompare(b[key]);
      }
    });
    if (sortedRedemptions[0].id === redemptions[0].id) {
      sortedRedemptions.reverse();
    }
    setRedemptions(sortedRedemptions);
    setLoading(false);
  };

  return (
    <>
      <Form onSubmit={searchRedemptions}>
        <Form.Input
          icon='search'
          fluid
          iconPosition='left'
          placeholder='搜索兑换码的 ID 和名称 ...'
          value={searchKeyword}
          loading={searching}
          onChange={handleKeywordChange}
        />
      </Form>

      <Table basic compact size='small'>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell
              style={{ cursor: 'pointer' }}
              onClick={() => {
                sortRedemption('id');
              }}
            >
              ID
            </Table.HeaderCell>
            <Table.HeaderCell
              style={{ cursor: 'pointer' }}
              onClick={() => {
                sortRedemption('name');
              }}
            >
              名称
            </Table.HeaderCell>
            <Table.HeaderCell
              style={{ cursor: 'pointer' }}
              onClick={() => {
                sortRedemption('status');
              }}
            >
              状态
            </Table.HeaderCell>
            <Table.HeaderCell
              style={{ cursor: 'pointer' }}
              onClick={() => {
                sortRedemption('quota');
              }}
            >
              额度
            </Table.HeaderCell>
            <Table.HeaderCell
              style={{ cursor: 'pointer' }}
              onClick={() => {
                sortRedemption('createTime');
              }}
            >
              创建时间
            </Table.HeaderCell>
            <Table.HeaderCell
              style={{ cursor: 'pointer' }}
              onClick={() => {
                sortRedemption('redeemedTime');
              }}
            >
              兑换时间
            </Table.HeaderCell>
            <Table.HeaderCell>操作</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {redemptions
            .slice(
              (activePage - 1) * ITEMS_PER_PAGE,
              activePage * ITEMS_PER_PAGE
            )
            .map((redemption, idx) => {
              if (redemption.deleted) return <></>;
              return (
                <Table.Row key={redemption.id}>
                  <Table.Cell>{redemption.id}</Table.Cell>
                  <Table.Cell>
                    {redemption.name ? redemption.name : '无'}
                  </Table.Cell>
                  <Table.Cell>{renderStatus(redemption.status)}</Table.Cell>
                  <Table.Cell>{renderQuota(redemption.quota)}</Table.Cell>
                  <Table.Cell>
                    {renderTimestamp(redemption.createTime)}
                  </Table.Cell>
                  <Table.Cell>
                    {redemption.redeemedTime
                      ? renderTimestamp(redemption.redeemedTime)
                      : '尚未兑换'}{' '}
                  </Table.Cell>
                  <Table.Cell>
                    <div>
                      <Button
                        size={'small'}
                        positive
                        onClick={async () => {
                          if (await copy(redemption.key)) {
                            showSuccess('已复制到剪贴板！');
                          } else {
                            showWarning(
                              '无法复制到剪贴板，请手动复制，已将兑换码填入搜索框。'
                            );
                            setSearchKeyword(redemption.key);
                          }
                        }}
                      >
                        复制
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
                            manageRedemption(redemption.id, 'delete', idx);
                          }}
                        >
                          确认删除
                        </Button>
                      </Popup>
                      <Button
                        size={'small'}
                        disabled={redemption.status === 3} // used
                        onClick={() => {
                          manageRedemption(
                            redemption.id,
                            redemption.status === 1 ? 'disable' : 'enable',
                            idx
                          );
                        }}
                      >
                        {redemption.status === 1 ? '禁用' : '启用'}
                      </Button>
                      <Button
                        size={'small'}
                        as={Link}
                        to={'/redemption/edit/' + redemption.id}
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
            <Table.HeaderCell colSpan='8'>
              <Button
                size='small'
                as={Link}
                to='/redemption/add'
                loading={loading}
              >
                添加新的兑换码
              </Button>
              <Pagination
                floated='right'
                activePage={activePage}
                onPageChange={onPaginationChange}
                size='small'
                siblingRange={1}
                totalPages={
                  Math.ceil(redemptions.length / ITEMS_PER_PAGE) +
                  (redemptions.length % ITEMS_PER_PAGE === 0 ? 1 : 0)
                }
              />
            </Table.HeaderCell>
          </Table.Row>
        </Table.Footer>
      </Table>
    </>
  );
};

export default RedemptionsTable;
