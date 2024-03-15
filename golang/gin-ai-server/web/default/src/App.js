import React, { lazy, Suspense, useContext, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';

import { API, getLogo, getSystemName, showError, showNotice } from './helpers';

import { UserContext } from './context/User';
import { StatusContext } from './context/Status';

import Loading from './components/Loading';
import { PrivateRoute } from './components/PrivateRoute';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';
import GitHubOAuth from './components/GitHubOAuth';
import PasswordResetForm from './components/PasswordResetForm';
import PasswordResetConfirm from './components/PasswordResetConfirm';

import User from './pages/User';
import NotFound from './pages/NotFound';
import Setting from './pages/Setting';
import AddUser from './pages/User/AddUser';
import EditUser from './pages/User/EditUser';
import Channel from './pages/Channel';
import Token from './pages/Token';
import EditToken from './pages/Token/EditToken';
import EditChannel from './pages/Channel/EditChannel';
import Redemption from './pages/Redemption';
import EditRedemption from './pages/Redemption/EditRedemption';
import TopUp from './pages/TopUp';
import Log from './pages/Log';
import Chat from './pages/Chat';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));

function App() {
  const [userState, userDispatch] = useContext(UserContext);
  const [statusState, statusDispatch] = useContext(StatusContext);

  const loadUser = () => {
    let user = localStorage.getItem('user');
    if (user) {
      let data = JSON.parse(user);
      userDispatch({ type: 'login', payload: data });
    }
  };

  const loadStatus = async () => {
    const res = await API.get('/api/status');
    const { success, data } = res.data;
    if (success) {
      localStorage.setItem('status', JSON.stringify(data));
      statusDispatch({ type: 'set', payload: data });
      localStorage.setItem('systemName', data.systemName);
      localStorage.setItem('logo', data.logo);
      localStorage.setItem('footerHtml', data.footerHtml);
      localStorage.setItem('quotaPerUnit', data.quotaPerUnit);
      localStorage.setItem('displayInCurrencyEnabled', data.displayInCurrencyEnabled);
      if (data.chatLink) {
        localStorage.setItem('chatLink', data.chatLink);
      } else {
        localStorage.removeItem('chatLink');
      }
      if (
        data.version !== process.env.REACT_APP_VERSION &&
        data.version !== 'v0.0.0' &&
        process.env.REACT_APP_VERSION !== ''
      ) {
        showNotice(
          `新版本可用：${data.version}，请使用快捷键 Shift + F5 刷新页面`
        );
      }
    } else {
      showError('无法正常连接至服务器！');
    }
  };

  useEffect(() => {
    loadUser();
    loadStatus().then();
    let systemName = getSystemName();
    if (systemName) {
      document.title = systemName;
    }
    let logo = getLogo();
    if (logo) {
      let linkElement = document.querySelector("link[rel~='icon']");
      if (linkElement) {
        linkElement.href = logo;
      }
    }
  }, []);

  return (
    <Routes>
      <Route
        path='/'
        element={
          <Suspense fallback={<Loading></Loading>}>
            <Home />
          </Suspense>
        }
      />
      <Route
        path='/channel'
        element={
          <PrivateRoute>
            <Channel />
          </PrivateRoute>
        }
      />
      <Route
        path='/channel/edit/:id'
        element={
          <Suspense fallback={<Loading></Loading>}>
            <EditChannel />
          </Suspense>
        }
      />
      <Route
        path='/channel/add'
        element={
          <Suspense fallback={<Loading></Loading>}>
            <EditChannel />
          </Suspense>
        }
      />
      <Route
        path='/token'
        element={
          <PrivateRoute>
            <Token />
          </PrivateRoute>
        }
      />
      <Route
        path='/token/edit/:id'
        element={
          <Suspense fallback={<Loading></Loading>}>
            <EditToken />
          </Suspense>
        }
      />
      <Route
        path='/token/add'
        element={
          <Suspense fallback={<Loading></Loading>}>
            <EditToken />
          </Suspense>
        }
      />
      <Route
        path='/redemption'
        element={
          <PrivateRoute>
            <Redemption />
          </PrivateRoute>
        }
      />
      <Route
        path='/redemption/edit/:id'
        element={
          <Suspense fallback={<Loading></Loading>}>
            <EditRedemption />
          </Suspense>
        }
      />
      <Route
        path='/redemption/add'
        element={
          <Suspense fallback={<Loading></Loading>}>
            <EditRedemption />
          </Suspense>
        }
      />
      <Route
        path='/user'
        element={
          <PrivateRoute>
            <User />
          </PrivateRoute>
        }
      />
      <Route
        path='/user/edit/:id'
        element={
          <Suspense fallback={<Loading></Loading>}>
            <EditUser />
          </Suspense>
        }
      />
      <Route
        path='/user/edit'
        element={
          <Suspense fallback={<Loading></Loading>}>
            <EditUser />
          </Suspense>
        }
      />
      <Route
        path='/user/add'
        element={
          <Suspense fallback={<Loading></Loading>}>
            <AddUser />
          </Suspense>
        }
      />
      <Route
        path='/user/reset'
        element={
          <Suspense fallback={<Loading></Loading>}>
            <PasswordResetConfirm />
          </Suspense>
        }
      />
      <Route
        path='/login'
        element={
          <Suspense fallback={<Loading></Loading>}>
            <LoginForm />
          </Suspense>
        }
      />
      <Route
        path='/register'
        element={
          <Suspense fallback={<Loading></Loading>}>
            <RegisterForm />
          </Suspense>
        }
      />
      <Route
        path='/reset'
        element={
          <Suspense fallback={<Loading></Loading>}>
            <PasswordResetForm />
          </Suspense>
        }
      />
      <Route
        path='/oauth/github'
        element={
          <Suspense fallback={<Loading></Loading>}>
            <GitHubOAuth />
          </Suspense>
        }
      />
      <Route
        path='/setting'
        element={
          <PrivateRoute>
            <Suspense fallback={<Loading></Loading>}>
              <Setting />
            </Suspense>
          </PrivateRoute>
        }
      />
      <Route
        path='/topup'
        element={
          <PrivateRoute>
            <Suspense fallback={<Loading></Loading>}>
              <TopUp />
            </Suspense>
          </PrivateRoute>
        }
      />
      <Route
        path='/log'
        element={
          <PrivateRoute>
            <Log />
          </PrivateRoute>
        }
      />
      <Route
        path='/about'
        element={
          <Suspense fallback={<Loading></Loading>}>
            <About />
          </Suspense>
        }
      />
      <Route
        path='/chat'
        element={
          <Suspense fallback={<Loading></Loading>}>
            <Chat />
          </Suspense>
        }
      />
      <Route path='*' element={<NotFound />} />
    </Routes>
  );
}

export default App;
