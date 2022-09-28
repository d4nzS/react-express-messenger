const express = require('express');
const mongoose = require('mongoose');
const expressWs = require('express-ws');

const UserModel = require('./models/user-model');

const PORT = process.env.PORT ?? 5000;
const DB_URL = 'mongodb+srv://root:root@cluster0.ff8oqxb.mongodb.net/?retryWrites=true&w=majority';

const app = express();
const wsServer = expressWs(app);
const wss = wsServer.getWss();

app.ws('/', ws => {
  ws.on('message', async msg => {
    const message = JSON.parse(msg);

    switch (message.event) {
      case 'connection':
        const usersData = await UserModel.find();
        const users = usersData.map(user => user.username);

        const visitor = await UserModel.findOne({
          username: message.username
        });
        ws.username = message.username;

        if (!visitor) {
          const newUser = new UserModel({
            username: message.username,
            messages: [] });

          await newUser.save();

          ws.send(JSON.stringify({
            event: 'connection',
            users,
          }));

          wss.clients.forEach(client => client.send(JSON.stringify({
            event: 'newUser',
            newUser
          })));

          return;
        }

        ws.send(JSON.stringify({
          event: 'connection',
          users,
          messages: visitor.messages
        }));

        break;

      case 'newMessage':
        const sender = await UserModel.findOne({ username: ws.username });

        sender.messages.push(message.message);
        await sender.save();

        const receiver = await UserModel.findOne({ username: message.message.receiver });

        delete message.message.receiver;

        if (receiver) {
          message.message.isChecked = false;
          message.message.sender = ws.username;
          message.message.messageType = 'received';

          receiver.messages.push(message.message);
          receiver.save();

          wss.clients.forEach(client => {
            if (client.username === receiver.username) {
              client.send(JSON.stringify({
                event: "newMessage",
                message: message.message
              }));
            }
          })
        }

        break;

      case 'check':
        const user = await UserModel.findOne({ username: ws.username });

        user.messages[message.index].isChecked = true;
        user.markModified('messages');
        await user.save();

        break;
    }
  });
});

const startApp = async () => {
    try {
      await mongoose.connect(DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });

      app.listen(PORT, () => {
        console.log(`Server has been started on ${PORT} PORT`);
      });
    } catch (err) {
      console.log(err);
    }
}

startApp();