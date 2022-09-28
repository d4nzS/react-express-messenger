import { configureStore, createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    username: null,
    isLoggedIn: false,
    users: [],
    messages: []
  },
  reducers: {
    login(state, action) {
      state.username = action.payload.username;
      state.isLoggedIn = true;
    },

    setUsers(state, action) {
      state.users = action.payload.users
    },

    updateUsers(state, action) {
      state.users.push(action.payload.user);
    },

    setMessages(state, action) {
      state.messages = action.payload.messages;
    },

    updateMessages(state, action) {
      state.messages.push(action.payload.message);
    },

    readMessage(state, action) {
      state.messages[action.payload.id].isChecked = true;
    }
  }
});

export const userActions = userSlice.actions;

const store = configureStore({
  reducer: {
    user: userSlice.reducer
  }
});

export default store;