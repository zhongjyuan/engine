import React from 'react';

const Chat = () => {
  const chatLink = localStorage.getItem('chatLink');

  return (
    <iframe
      src={chatLink}
      style={{ width: '100%', height: '85vh', border: 'none' }}
    />
  );
};

export default Chat;
