import React, { useContext, useState } from 'react';
import {
  Button,
  Container,
  Dropdown,
  Icon,
  Menu,
  Segment,
} from 'semantic-ui-react';
import { Link, useNavigate } from 'react-router-dom';

import {
  API,
  getLogo,
  getSystemName,
  isAdmin,
  isMobile,
  showSuccess,
} from '../helpers';
import { UserContext } from '../context/User';

import '../index.css';

// Header Buttons// 导航栏按钮配置数组
let headerButtons = [
  {
    name: '首页',
    to: '/',
    icon: 'home',
  },
  {
    name: '渠道',
    to: '/channel',
    icon: 'sitemap',
    admin: true, // 仅管理员可见
  },
  {
    name: '令牌',
    to: '/token',
    icon: 'key',
  },
  {
    name: '兑换',
    to: '/redemption',
    icon: 'dollar sign',
    admin: true, // 仅管理员可见
  },
  {
    name: '充值',
    to: '/topup',
    icon: 'cart',
  },
  {
    name: '用户',
    to: '/user',
    icon: 'user',
    admin: true, // 仅管理员可见
  },
  {
    name: '日志',
    to: '/log',
    icon: 'book',
  },
  {
    name: '设置',
    to: '/setting',
    icon: 'setting',
  },
  {
    name: '关于',
    to: '/about',
    icon: 'info circle',
  },
];

// 检查本地存储中是否存在 'chatLink'
if (localStorage.getItem('chatLink')) {
  // 如果存在 'chatLink'，则向 headerButtons 数组的第二个位置插入一个新的按钮对象
  headerButtons.splice(1, 0, {
    name: '聊天',
    to: '/chat',
    icon: 'comments',
  });
}

const Header = () => {
  // 引入 useNavigate Hook 用于页面导航
  let navigate = useNavigate();

  // 使用 useState Hook 定义一个名为 showSidebar 的状态变量，并提供修改该状态的函数 setShowSidebar
  const [showSidebar, setShowSidebar] = useState(false);

  // 使用 useContext Hook 获取 UserContext 的状态和派发函数
  const [userState, userDispatch] = useContext(UserContext);

  // 调用 getLogo() 和 getSystemName() 函数分别获取 logo 图片和系统名称
  const logo = getLogo();
  const systemName = getSystemName();

  /**
   * 执行用户注销操作
   */
  async function logout() {
    // 关闭侧边栏
    setShowSidebar(false);

    // 发送注销请求到后端API
    await API.get('/api/user/logout');

    // 显示注销成功提示
    showSuccess('注销成功!');

    // 触发用户注销动作，更新用户状态
    userDispatch({ type: 'logout' });

    // 移除本地存储中的用户信息
    localStorage.removeItem('user');

    // 导航至登录页面
    navigate('/login');
  }

  /**
   * 切换侧边栏的显示状态
   */
  const toggleSidebar = () => {
    // 取反操作，修改 showSidebar 的状态
    setShowSidebar(!showSidebar);
  };

  /**
   * 根据 isMobile 参数渲染不同类型的按钮
   * @param {boolean} isMobile - 是否移动设备
   * @returns {Array} 包含按钮元素的数组
   */
  const renderButtons = (isMobile) => {
    return headerButtons.map((button) => {
      // 如果按钮需要管理员权限且当前用户不是管理员，则不渲染该按钮
      if (button.admin && !isAdmin()) return <></>;

      if (isMobile) {
        // 在移动设备上，点击按钮时导航到指定页面，并关闭侧边栏
        return (
          <Menu.Item
            onClick={() => {
              navigate(button.to);
              setShowSidebar(false);
            }}
          >
            {button.name}
          </Menu.Item>
        );
      } else {
        // 在非移动设备上，生成带链接的按钮项
        return (
          <Menu.Item key={button.name} as={Link} to={button.to}>
            <Icon name={button.icon} />
            {button.name}
          </Menu.Item>
        );
      }
    });
  };

  if (isMobile()) {
    return (
      <>
        <Menu
          borderless
          size='large'
          style={
            showSidebar
              ? {
                  borderBottom: 'none',
                  marginBottom: '0',
                  borderTop: 'none',
                  height: '51px',
                }
              : { borderTop: 'none', height: '52px' }
          }
        >
          <Container>
            <Menu.Item as={Link} to='/'>
              <img src={logo} alt='logo' style={{ marginRight: '0.75em' }} />
              <div style={{ fontSize: '20px' }}>
                <b>{systemName}</b>
              </div>
            </Menu.Item>
            <Menu.Menu position='right'>
              <Menu.Item onClick={toggleSidebar}>
                <Icon name={showSidebar ? 'close' : 'sidebar'} />
              </Menu.Item>
            </Menu.Menu>
          </Container>
        </Menu>
        {showSidebar ? (
          <Segment style={{ marginTop: 0, borderTop: '0' }}>
            <Menu secondary vertical style={{ width: '100%', margin: 0 }}>
              {renderButtons(true)}
              <Menu.Item>
                {userState.user ? (
                  <Button onClick={logout}>注销</Button>
                ) : (
                  <>
                    <Button
                      onClick={() => {
                        setShowSidebar(false);
                        navigate('/login');
                      }}
                    >
                      登录
                    </Button>
                    <Button
                      onClick={() => {
                        setShowSidebar(false);
                        navigate('/register');
                      }}
                    >
                      注册
                    </Button>
                  </>
                )}
              </Menu.Item>
            </Menu>
          </Segment>
        ) : (
          <></>
        )}
      </>
    );
  }

  return (
    <>
      <Menu borderless style={{ borderTop: 'none' }}>
        <Container>
          <Menu.Item as={Link} to='/' className={'hide-on-mobile'}>
            <img src={logo} alt='logo' style={{ marginRight: '0.75em' }} />
            <div style={{ fontSize: '20px' }}>
              <b>{systemName}</b>
            </div>
          </Menu.Item>
          {renderButtons(false)}
          <Menu.Menu position='right'>
            {userState.user ? (
              <Dropdown
                text={userState.user.userName}
                pointing
                className='link item'
              >
                <Dropdown.Menu>
                  <Dropdown.Item onClick={logout}>注销</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <Menu.Item
                name='登录'
                as={Link}
                to='/login'
                className='btn btn-link'
              />
            )}
          </Menu.Menu>
        </Container>
      </Menu>
    </>
  );
};

export default Header;
