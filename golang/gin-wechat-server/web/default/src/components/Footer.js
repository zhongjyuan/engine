import React, { useEffect, useState } from 'react';
import { Container, Segment } from 'semantic-ui-react';

import { getFooterHTML, getSystemName } from '../helpers';

const Footer = () => {
  // 获取系统名称
  const systemName = getSystemName();

  // 设置页脚内容的状态
  const [footer, setFooter] = useState(getFooterHTML());

  // 剩余检查次数
  let remainCheckTimes = 5;

  // 加载页脚内容
  const loadFooter = () => {
    // 从localStorage中获取页脚HTML
    let footerHtml = localStorage.getItem('footerHtml');
    if (footerHtml) {
      // 更新页脚内容的状态
      setFooter(footerHtml);
    }
  };

  // 在组件加载时和剩余检查次数发生变化时执行
  useEffect(() => {
    const timer = setInterval(() => {
      if (remainCheckTimes <= 0) {
        clearInterval(timer); // 清除定时器
        return;
      }
      remainCheckTimes--; // 剩余检查次数减少
      loadFooter(); // 加载页脚内容
    }, 200);

    return () => clearTimeout(timer); // 组件卸载时清除定时器
  }, []);

  return (
    <Segment vertical>
      <Container textAlign='center'>
        {footer ? (
          <div
            className='custom-footer'
            dangerouslySetInnerHTML={{ __html: footer }}
          ></div>
        ) : (
          <div className='custom-footer'>
            <a href='https://gitee.com/zhongjyuan/one-api' target='_blank'>
              {systemName} {process.env.REACT_APP_VERSION}{' '}
            </a>
            由{' '}
            <a href='https://gitee.com/zhongjyuan' target='_blank'>
              ZHONGJYUAN
            </a>{' '}
            构建，源代码遵循{' '}
            <a href='https://opensource.org/licenses/mit-license.php'>
              MIT 协议
            </a>
          </div>
        )}
      </Container>
    </Segment>
  );
};

export default Footer;
