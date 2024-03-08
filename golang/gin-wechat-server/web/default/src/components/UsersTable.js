import React, { useEffect, useState } from 'react';
import {
  Button,
  Form,
  Label,
  Pagination,
  Popup,
  Table,
} from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import { API, showError, showSuccess } from '../helpers';
import { renderText } from '../helpers/render';

import { ITEMS_PER_PAGE } from '../constants';

function renderRole(role) {
  switch (role) {
    case 1:
      return <Label>普通用户</Label>;
    case 10:
      return <Label color="yellow">管理员</Label>;
    case 100:
      return <Label color="orange">超级管理员</Label>;
    default:
      return <Label color="red">未知身份</Label>;
  }
}

const UsersTable = () => {
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [activePage, setActivePage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [users, setUsers] = useState([]);

  const loadUsers = async (startIdx) => {
    const res = await API.get(`/api/user/?p=${startIdx}`);
    const { success, message, data } = res.data;
    if (success) {
      if (startIdx === 0) {
        setUsers(data);
      } else {
        let newUsers = users;
        newUsers.push(...data);
        setUsers(newUsers);
      }
    } else {
      showError(message);
    }
    setLoading(false);
  };

  const onPaginationChange = (e, { activePage }) => {
    (async () => {
      if (activePage === Math.ceil(users.length / ITEMS_PER_PAGE) + 1) {
        // In this case we have to load more data and then append them.
        await loadUsers(activePage - 1);
      }
      setActivePage(activePage);
    })();
  };

  useEffect(() => {
    loadUsers(0)
      .then()
      .catch((reason) => {
        showError(reason);
      });
  }, []);

  const manageUser = (userName, action, idx) => {
    (async () => {
      const res = await API.post('/api/user/manage', {
        userName,
        action,
      });
      const { success, message } = res.data;
      if (success) {
        showSuccess('操作成功完成！');
        let user = res.data.data;
        let newUsers = [...users];
        let realIdx = (activePage - 1) * ITEMS_PER_PAGE + idx;
        if (action === 'delete') {
          newUsers[realIdx].deleted = true;
        } else {
          newUsers[realIdx].status = user.status;
          newUsers[realIdx].role = user.role;
        }
        setUsers(newUsers);
      } else {
        showError(message);
      }
    })();
  };

  const renderStatus = (status) => {
    switch (status) {
      case 1:
        return <Label basic>已激活</Label>;
      case 2:
        return (
          <Label basic color="red">
            已封禁
          </Label>
        );
      default:
        return (
          <Label basic color="grey">
            未知状态
          </Label>
        );
    }
  };

  const searchUsers = async () => {
    if (searchKeyword === '') {
      // if keyword is blank, load files instead.
      await loadUsers(0);
      setActivePage(1);
      return;
    }
    setSearching(true);
    const res = await API.get(`/api/user/search?keyword=${searchKeyword}`);
    const { success, message, data } = res.data;
    if (success) {
      setUsers(data);
      setActivePage(1);
    } else {
      showError(message);
    }
    setSearching(false);
  };

  const handleKeywordChange = async (e, { value }) => {
    setSearchKeyword(value.trim());
  };

  const sortUser = (key) => {
    if (users.length === 0) return;
    setLoading(true);
    let sortedUsers = [...users];
    sortedUsers.sort((a, b) => {
      if (!isNaN(a[key])) {
        // If the value is numeric, subtract to sort
        return a[key] - b[key];
      } else {
        // If the value is not numeric, sort as strings
        return ('' + a[key]).localeCompare(b[key]);
      }
    });
    if (sortedUsers[0].id === users[0].id) {
      sortedUsers.reverse();
    }
    setUsers(sortedUsers);
    setLoading(false);
  };

  return (
    <>
      <Form onSubmit={searchUsers}>
        <Form.Input
          icon="search"
          fluid
          iconPosition="left"
          placeholder="搜索用户的 ID，用户名，显示名称，以及邮箱地址 ..."
          value={searchKeyword}
          loading={searching}
          onChange={handleKeywordChange}
        />
      </Form>

      <Table basic compact size="small">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell
              style={{ cursor: 'pointer' }}
              onClick={() => {
                sortUser('id');
              }}
            >
              ID
            </Table.HeaderCell>
            <Table.HeaderCell
              style={{ cursor: 'pointer' }}
              onClick={() => {
                sortUser('userName');
              }}
            >
              用户名
            </Table.HeaderCell>
            <Table.HeaderCell
              style={{ cursor: 'pointer' }}
              onClick={() => {
                sortUser('role');
              }}
            >
              用户角色
            </Table.HeaderCell>
            <Table.HeaderCell
              style={{ cursor: 'pointer' }}
              onClick={() => {
                sortUser('status');
              }}
            >
              状态
            </Table.HeaderCell>
            <Table.HeaderCell>操作</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {users
            .slice(
              (activePage - 1) * ITEMS_PER_PAGE,
              activePage * ITEMS_PER_PAGE
            )
            .map((user, idx) => {
              if (user.deleted) return <></>;
              return (
                <Table.Row key={user.id}>
                  <Table.Cell>{user.id}</Table.Cell>
                  <Table.Cell>
                    <Popup
                      content={user.email ? user.email : '未绑定邮箱地址'}
                      key={user.userName}
                      header={
                        user.displayName ? user.displayName : user.userName
                      }
                      trigger={<span>{renderText(user.userName, 15)}</span>}
                      hoverable
                    />
                  </Table.Cell>
                  <Table.Cell>{renderRole(user.role)}</Table.Cell>
                  <Table.Cell>{renderStatus(user.status)}</Table.Cell>
                  <Table.Cell>
                    <div>
                      <Button
                        size={'small'}
                        positive
                        onClick={() => {
                          manageUser(user.userName, 'promote', idx);
                        }}
                        disabled={user.role === 100}
                      >
                        提升
                      </Button>
                      <Button
                        size={'small'}
                        color={'yellow'}
                        onClick={() => {
                          manageUser(user.userName, 'demote', idx);
                        }}
                        disabled={user.role === 100}
                      >
                        降级
                      </Button>
                      <Popup
                        trigger={
                          <Button
                            size="small"
                            negative
                            disabled={user.role === 100}
                          >
                            删除
                          </Button>
                        }
                        on="click"
                        flowing
                        hoverable
                      >
                        <Button
                          negative
                          onClick={() => {
                            manageUser(user.userName, 'delete', idx);
                          }}
                        >
                          删除用户 {user.userName}
                        </Button>
                      </Popup>
                      <Button
                        size={'small'}
                        onClick={() => {
                          manageUser(
                            user.userName,
                            user.status === 1 ? 'disable' : 'enable',
                            idx
                          );
                        }}
                        disabled={user.role === 100}
                      >
                        {user.status === 1 ? '禁用' : '启用'}
                      </Button>
                      <Button
                        size={'small'}
                        as={Link}
                        to={'/user/edit/' + user.id}
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
            <Table.HeaderCell colSpan="7">
              <Button size="small" as={Link} to="/user/add" loading={loading}>
                添加新的用户
              </Button>
              <Pagination
                floated="right"
                activePage={activePage}
                onPageChange={onPaginationChange}
                size="small"
                siblingRange={1}
                totalPages={
                  Math.ceil(users.length / ITEMS_PER_PAGE) +
                  (users.length % ITEMS_PER_PAGE === 0 ? 1 : 0)
                }
              />
            </Table.HeaderCell>
          </Table.Row>
        </Table.Footer>
      </Table>
    </>
  );
};

export default UsersTable;
