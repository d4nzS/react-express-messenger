const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  messages: []
});

module.exports = model('User', UserSchema);