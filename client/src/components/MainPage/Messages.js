import { useSelector } from 'react-redux';
import { Accordion } from 'react-bootstrap';

import MessageItem from './MessageItem';

const Messages = () => {
  const messages = useSelector(state => state.user.messages);

  return (
    <Accordion className="mb-5" style={{ maxHeight: 500, overflow: 'auto' }}>
      {messages.map((message, index) => <MessageItem
        key={Math.random()}
        id={index}
        message={message}
      />).reverse()}
    </Accordion>
  );
};

export default Messages;