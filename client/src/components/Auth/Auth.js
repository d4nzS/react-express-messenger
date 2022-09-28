import { useDispatch } from 'react-redux';

import useInput from '../../hooks/use-input';
import { userActions } from '../../store';
import ws from '../../helpers/socket';

const Auth = () => {
  const dispatch = useDispatch();

  const {
    value: enteredName,
    isValid: enteredNameIsValid,
    hasError: nameInputHasError,
    valueChangeHandler: nameChangedHandler,
    inputBlurHandler: nameBlurHandler,
    reset: resetNameInput,
  } = useInput(value => !!value);

  const clickHandler = () => {
    if (!enteredName) {
      return;
    }

    ws.socket = new WebSocket('wss://guarded-everglades-79385.herokuapp.com');

    ws.socket.onopen = () => {
      dispatch(userActions.login({ username: enteredName }));

      ws.socket.send(JSON.stringify({
        event: 'connection',
        username: enteredName
      }));
    };

    ws.socket.onmessage = event => {
      const data = JSON.parse(event.data);

      switch (data.event) {
        case 'connection':
          dispatch(userActions.setUsers({ users: data.users }));

          if (data.messages) {
            dispatch(userActions.setMessages({ messages: data.messages }));
          }

          break;

        case 'newMessage':
          dispatch(userActions.updateMessages({ message: data.message }));
          break;

        case 'newUser':
          dispatch(userActions.updateUsers({ user: data.newUser.username }));
          break;
      }
    };

    resetNameInput();
  };

  return (
    <>
      <h2 className="text-center mb-2">Fast Auth</h2>

      <div className="mb-2">
        <label htmlFor="name" className="form-label">Enter your Name</label>
        <input
          type="text"
          id="name"
          required
          className={`form-control ${nameInputHasError && 'is-invalid'}`}
          onChange={nameChangedHandler}
          onBlur={nameBlurHandler}
          value={enteredName}
        />
        <div className="invalid-feedback">
          Enter your name
        </div>
      </div>

      <button
        type="submit"
        className="btn btn-primary"
        disabled={!enteredNameIsValid}
        onClick={clickHandler}
      >Login
      </button>
    </>
  );
};

export default Auth;