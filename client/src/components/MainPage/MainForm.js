import { useState } from 'react';
import { useSelector } from "react-redux";

import useInput from '../../hooks/use-input';
import ws from '../../helpers/socket'

const MainForm = () => {
  const [recipientCandidates, setRecipientCandidates] = useState([]);

  const currentUser = useSelector(state => state.user.username);
  const users = useSelector(state => state.user.users);

  const {
    value: enteredRecipient,
    isValid: enteredRecipientIsValid,
    hasError: recipientInputHasError,
    valueChangeHandler: recipientChangedHandler,
    inputBlurHandler: recipientBlurHandler,
    reset: resetRecipientInput,
  } = useInput(value => !!value);

  const {
    value: enteredTitle,
    isValid: enteredTitleIsValid,
    hasError: titleInputHasError,
    valueChangeHandler: titleChangedHandler,
    inputBlurHandler: titleBlurHandler,
    reset: resetTitleInput,
  } = useInput(value => !!value);

  const {
    value: enteredMessage,
    isValid: enteredMessageIsValid,
    hasError: messageInputHasError,
    valueChangeHandler: messageChangedHandler,
    inputBlurHandler: messageBlurHandler,
    reset: resetMessageInput,
  } = useInput(value => !!value);

  const formIsValid = enteredRecipientIsValid
    && enteredTitleIsValid
    && enteredMessageIsValid;

  const putRecipientHandler = event => {
    const possibleUsers = users.filter(user => user.toLowerCase().includes(event.target.value.toLowerCase()));

    setRecipientCandidates(possibleUsers);
  };

  const recipientChangeHandler = event => {
    recipientChangedHandler(event)
    putRecipientHandler(event);
  };

  const recipientBluredHandler = event => {
    recipientBlurHandler(event);

    setRecipientCandidates([]);
  };

  const submitHandler = event => {
    event.preventDefault();

    if (!formIsValid) {
      return;
    }

    ws.socket.send(JSON.stringify({
      event: 'newMessage',
      message: {
        receiver: enteredRecipient,
        topic: enteredTitle,
        timeStamp: Date.now(),
        text: enteredMessage
      }
    }));

    resetRecipientInput();
    resetTitleInput();
    resetMessageInput();
  };

  return (
    <>
      <form onSubmit={submitHandler} className="mt-5">
        <div className="mb-3" style={{ position: 'relative' }}>
          <label htmlFor="recipient" className="form-label">Recipient</label>

          <input
            type="text"
            id="recipient"
            required
            className={`form-control ${recipientInputHasError && 'is-invalid'}`}
            onFocus={putRecipientHandler}
            onChange={recipientChangeHandler}
            onBlur={recipientBluredHandler}
            value={enteredRecipient}
          />

          <div style={{
            position: 'absolute',
            top: 70,
            zIndex: 10,
            background: 'white',
            borderLeft: '1px solid #DFDFDF',
            borderRight: '1px solid #DFDFDF'
          }}>
            {enteredRecipientIsValid && recipientCandidates.map(recipient =>
              <div style={{ borderBottom: "1px solid #DFDFDF", padding: 5 }} key={Math.random()}>{recipient}</div>)}
          </div>

          <div className="invalid-feedback">
            Choose a recipient
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="title" className="form-label">Title</label>
          <input
            type="text"
            id="title"
            required
            className={`form-control ${titleInputHasError && 'is-invalid'}`}
            onChange={titleChangedHandler}
            onBlur={titleBlurHandler}
            value={enteredTitle}
          />
          <div className="invalid-feedback">
            Enter the title
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="message" className="form-label">Message</label>
          <textarea
            id="message"
            required
            className={`form-control ${messageInputHasError && 'is-invalid'}`}
            onChange={messageChangedHandler}
            onBlur={messageBlurHandler}
            value={enteredMessage}
          ></textarea>

          <div className="invalid-feedback">
            Enter the message
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary mb-1"
          disabled={!formIsValid}
        >Send
        </button>
      </form>
    </>
  );
}

export default MainForm;