import { Navigate } from 'react-router-dom';

import { history } from '../helpers';

/**
 * 私有路由组件，用于限制未登录用户的访问权限
 * @param {Object} props 组件属性
 * @param {ReactNode} props.children 子组件
 * @returns {ReactNode} 根据登录状态返回子组件或重定向到登录页
 */
function PrivateRoute({ children }) {
  if (!localStorage.getItem('user')) {
    return <Navigate to='/login' state={{ from: history.location }} />;
  }
  return children;
}

export { PrivateRoute };
