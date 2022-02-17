import { Server } from 'socket.io';
import { createServer } from './server';
import { sequelize } from '../models';
import { SendChatMessageData } from './utils/message-utils';
import { ChatCreatedData, UserTypingMessageData } from './utils/chat-utils';

const SERVER_PORT = 5000;
const SOCKET_PORT = 8000;

sequelize.sync().then(() => {
  const server = createServer();
  const io = new Server(server);

  io.on('connection', socket => {
    socket.on(
      'chat:update:send',
      (data: SendChatMessageData | UserTypingMessageData) => {
        io.emit(`chat:update:receive--${data.chatID}`, data);
      }
    );

    socket.on('chat:created', (data: ChatCreatedData) => {
      data.memberIDs.forEach(memberID => {
        io.emit(`user:chat:joined--${memberID}`, data.chat);
      });
    });
  });

  server.listen(SERVER_PORT, () => {
    console.log(`Server listening on port ${SERVER_PORT}`);
    io.listen(SOCKET_PORT);
    console.log(`Socket listening on port ${SOCKET_PORT}`);
  });
});
