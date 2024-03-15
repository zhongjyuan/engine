import React, { useContext, useEffect } from 'react';
import { Card, Grid, Header, Segment } from 'semantic-ui-react';
import { API, showError, showNotice, timestamp2string } from '../../helpers';
import { StatusContext } from '../../context/Status';

const Home = () => {
  const [statusState, statusDispatch] = useContext(StatusContext);
  const homePageLink = localStorage.getItem('homePageLink') || '';

  const displayNotice = async () => {
    const res = await API.get('/api/notice');
    const { success, message, data } = res.data;
    if (success) {
      let oldNotice = localStorage.getItem('notice');
      if (data !== oldNotice && data !== '') {
        showNotice(data);
        localStorage.setItem('notice', data);
      }
    } else {
      showError(message);
    }
  };

  const getStartTimeString = () => {
    const timestamp = statusState?.status?.startTtime;
    return timestamp2string(timestamp);
  };

  useEffect(() => {
    displayNotice().then();
  }, []);
  return (
    <>
      {homePageLink !== '' ? (
        <>
          <iframe
            src={homePageLink}
            style={{ width: '100%', height: '100vh', border: 'none' }}
          />
        </>
      ) : (
        <>
          <Segment>
            <Header as='h3'>系统状况</Header>
            <Grid columns={2} stackable>
              <Grid.Column>
                <Card fluid>
                  <Card.Content>
                    <Card.Header>系统信息</Card.Header>
                    <Card.Meta>系统信息总览</Card.Meta>
                    <Card.Description>
                      <p>名称：{statusState?.status?.systemName}</p>
                      <p>版本：{statusState?.status?.version}</p>
                      <p>
                        源码：
                        <a
                          href='https://github.com/zhongjyuan/gin-file-server'
                          target='_blank'
                        >
                          https://github.com/zhongjyuan/gin-file-server
                        </a>
                      </p>
                      <p>启动时间：{getStartTimeString()}</p>
                    </Card.Description>
                  </Card.Content>
                </Card>
              </Grid.Column>
              <Grid.Column>
                <Card fluid>
                  <Card.Content>
                    <Card.Header>系统配置</Card.Header>
                    <Card.Meta>系统配置总览</Card.Meta>
                    <Card.Description>
                      <p>
                        邮箱验证：
                        {statusState?.status?.emailVerificationEnabled === true
                          ? '已启用'
                          : '未启用'}
                      </p>
                      <p>
                        GitHub 身份验证：
                        {statusState?.status?.gitHubOAuthEnabled === true
                          ? '已启用'
                          : '未启用'}
                      </p>
                      <p>
                        微信身份验证：
                        {statusState?.status?.weChatAuthEnabled === true
                          ? '已启用'
                          : '未启用'}
                      </p>
                      <p>
                        Turnstile 用户校验：
                        {statusState?.status?.turnstileCheckEnabled === true
                          ? '已启用'
                          : '未启用'}
                      </p>
                    </Card.Description>
                  </Card.Content>
                </Card>
              </Grid.Column>
            </Grid>
          </Segment>
        </>
      )}
    </>
  );
};

export default Home;
