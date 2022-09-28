import { useDispatch } from 'react-redux';
import { Accordion } from 'react-bootstrap';

import { userActions } from '../../store';
import ws from "../../helpers/socket";

const MessageItem = ({ message, id }) => {
  const dispatch = useDispatch();

  const clickHandler = () => {
    if (!message.isChecked) {
      dispatch(userActions.readMessage({ id }));
      ws.socket.send(JSON.stringify({ event: 'check', index: id }));
    }
  };

  return (
    <Accordion.Item eventKey={id}>
      <Accordion.Header onClick={clickHandler}>
        <div className={`
          w-100 
          d-flex 
          flex-column 
          flex-lg-row 
          justify-content-between 
          align-items-lg-center 
          ${!message.isChecked && 'text-danger'}`
        }>
          <div>From: {message.receiver ? message.receiver : message.sender}</div>
          <div className="w-100 text-lg-center">{message.topic}</div>
          <div>{new Date(message.timeStamp).toLocaleString()}</div>
        </div>
      </Accordion.Header>

      <Accordion.Body>
        {message.text}
      </Accordion.Body>
    </Accordion.Item>
  );
};

export default MessageItem;