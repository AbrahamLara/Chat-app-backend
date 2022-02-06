import { Request, Router } from 'express';
import { Op, col, fn } from 'sequelize';
import { models } from '../../models';
import { DecryptAuthTokenDataMiddleware } from '../middleware/decrypt-auth-token-data-middleware';
import { TokenData } from '../utils/token-utils';
import { createGenericResponse } from '../utils/response-utils';
import { ChatAPIMessage } from '../utils/chat-utils';

interface CreateChatPayload {
  /**
   * The list of user ids that will be part of the user chat.
   */
  userIDs: string[];

  /**
   * The name of the user chat.
   */
  chatName: string;

  /**
   * The first message to be sent to the chat.
   */
  message: string;
}

const router = Router();
const { User, Chat, UserChat, Message, MessageRecipient } = models;

router.use(DecryptAuthTokenDataMiddleware);

// This route handles creating a group chat given the ids of users who will join the chat and returns information on
// the newly created chat.
router.post('/', async (req: Request, res) => {
  const { userID, userName } = req.tokenData as TokenData;
  const { userIDs, chatName, message } = req.body as CreateChatPayload;

  // Return an error message if the provided userIDs value is invalid.
  if (!Array.isArray(userIDs) || !userIDs.length) {
    res
      .status(400)
      .json(createGenericResponse(ChatAPIMessage.INVALID_USER_IDS));
    return;
  }
  // Return an error message if the provided chat name is invalid.
  if (!chatName) {
    res
      .status(400)
      .json(createGenericResponse(ChatAPIMessage.INVALID_CHAT_NAME));
    return;
  }
  // Return an error message if the provided chat message is blank.
  if (!message) {
    res.status(400).json(createGenericResponse(ChatAPIMessage.BLANK_MESSAGE));
    return;
  }

  // A list of user id's that will be part of the group chat.
  const chatUserIDs = userIDs.concat(userID);

  try {
    // Create the group chat and remember the id.
    const chatModel = await Chat.create({ name: chatName, isGroup: true });
    const chatID = chatModel.getDataValue('id');

    // Create a list of chat user records to create.
    const chatUserRecords = chatUserIDs.map(id => ({
      userID: id,
      chatID,
    }));

    // Create the message to send to the group chat and remember the id.
    const messageModel = await Message.create({
      message,
      userID,
      chatID,
    });
    const messageID = messageModel.getDataValue('id');

    // Create the user chats that will associate a user with a chat.
    const userChatModels = await UserChat.bulkCreate(chatUserRecords);
    // Create a list of message recipient records so every user in the chat can see the message.
    const messageRecipientRecords = userChatModels.map(userChatModel => ({
      userChatID: userChatModel.getDataValue('id'),
      userID: userChatModel.getDataValue('userID'),
      messageID,
    }));

    // Create a record of all message receipts for users in the chat who will receive the message.
    await MessageRecipient.bulkCreate(messageRecipientRecords);

    res.json({
      chat: {
        id: chatID,
        name: chatName,
        isGroup: true,
        createdAt: messageModel.getDataValue('createdAt'),
        message: {
          author: userName,
          text: message,
        },
      },
    });
  } catch (event) {
    res
      .status(500)
      .json(createGenericResponse(ChatAPIMessage.ERROR_CREATING_CHAT));
  }
});

// This route retrieves the all the latest messages sent to the group chats the user is part of in descending order.
router.get('/', async (req: Request, res) => {
  const { userID } = req.tokenData as TokenData;

  try {
    // Get a list of the latest message receipts for all the chats the user is part of.
    const latestMessageRecords: any = await MessageRecipient.findAll({
      raw: true,
      attributes: [
        'userChatID',
        [fn('max', col('MessageRecipient.createdAt')), 'createdAt'],
      ],
      where: { userID },
      group: ['userChatID'],
    });
    // Using the latest message receipts info we fetched for each chat, use it to retrieve the info on the message,
    // user, and chat.
    const latestChatMessageRecords = await MessageRecipient.findAll({
      raw: true,
      attributes: [],
      where: { [Op.or]: latestMessageRecords },
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: Message,
          attributes: ['message', 'createdAt'],
          include: [{ model: User, attributes: ['name'] }],
        },
        {
          model: UserChat,
          attributes: [],
          include: [{ model: Chat, attributes: ['id', 'name'] }],
        },
      ],
    });
    // Using the latest message records, create a new object which will hold the necessary info on the
    const chats = latestChatMessageRecords.map((latestChatMessage: any) => ({
      name: latestChatMessage['UserChat.Chat.name'],
      id: latestChatMessage['UserChat.Chat.id'],
      message: {
        author: latestChatMessage['Message.User.name'],
        text: latestChatMessage['Message.message'],
        createdAt: latestChatMessage['Message.createdAt'],
      },
    }));

    res.json({ chats });
  } catch (event) {
    res
      .status(500)
      .json(createGenericResponse(ChatAPIMessage.ERROR_FETCHING_CHAT));
  }
});

export default router;
