import PropTypes from 'prop-types';
import Label from 'ui-component/Label';
import Tooltip from '@mui/material/Tooltip';
import { timestamp2string } from 'utils/common';

const ResponseTimeLabel = ({ testTime, responseTime, handle_action }) => {
  let color = 'default';
  let time = responseTime / 1000;
  time = time.toFixed(2) + ' 秒';

  if (responseTime === 0) {
    color = 'default';
  } else if (responseTime <= 1000) {
    color = 'success';
  } else if (responseTime <= 3000) {
    color = 'primary';
  } else if (responseTime <= 5000) {
    color = 'secondary';
  } else {
    color = 'error';
  }
  let title = (
    <>
      点击测速
      <br />
      {testTime != 0 ? '上次测速时间：' + timestamp2string(testTime) : '未测试'}
    </>
  );

  return (
    <Tooltip title={title} placement="top" onClick={handle_action}>
      <Label color={color}> {responseTime == 0 ? '未测试' : time} </Label>
    </Tooltip>
  );
};

ResponseTimeLabel.propTypes = {
  testTime: PropTypes.number,
  responseTime: PropTypes.number,
  handle_action: PropTypes.func
};

export default ResponseTimeLabel;
