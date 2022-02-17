import { Request, Router } from 'express';
import { Op, col, fn } from 'sequelize';
import { models } from '../../models';
import { DecryptAuthTokenDataMiddleware } from '../middleware/decrypt-auth-token-data-middleware';
import { TokenData } from '../utils/token-utils';
import { createGenericResponse } from '../utils/response-utils';
import { MessageAPIMessage } from '../utils/message-utils';
import { AuthorizationMessage } from '../utils/auth-utils';

const router = Router();
const { User, UserChat, Message, MessageRecipient } = models;

router.use(DecryptAuthTokenDataMiddleware);

router.post('/:chatID', async (req: Request, res) => {
  const { userID, userName } = req.tokenData as TokenData;
  const { chatID } = req.params;
  const { message } = req.body;

  if (!message) {
    res
      .status(400)
      .json(createGenericResponse(MessageAPIMessage.BLANK_MESSAGE));
    return;
  }

  try {
    // Check if the user is allowed to send a message to the group chat they are attempting to send a message to.
    const isUserInChat = await UserChat.findOne({ where: { chatID, userID } });
    if (!isUserInChat) {
      res
        .status(403)
        .json(createGenericResponse(AuthorizationMessage.UNAUTHORIZED));
      return;
    }

    // Create the message to send to the group chat and remember the id.
    const messageModel = await Message.create({
      message,
      userID,
      chatID,
    });
    const messageID = messageModel.getDataValue('id');

    // Fetch the user chats associated with each user in the group chat to create recipient records for the message.
    const userChatModels = await UserChat.findAll({ where: { chatID } });
    const messageRecipientRecords = userChatModels.map(userChatModel => ({
      userChatID: userChatModel.getDataValue('id'),
      userID: userChatModel.getDataValue('userID'),
      messageID,
    }));
    // Create a record of all message receipts for users in the chat who will receive the message.
    await MessageRecipient.bulkCreate(messageRecipientRecords);

    res.json({
      message: {
        id: messageID,
        text: message,
        author: {
          id: userID,
          name: userName,
        },
        createdAt: messageModel.getDataValue('createdAt'),
      },
    });
  } catch (event) {
    res
      .status(500)
      .json(createGenericResponse(MessageAPIMessage.ERROR_SENDING_MESSAGE));
  }
});

router.get('/:chatID', async (req: Request, res) => {
  const { userID } = req.tokenData as TokenData;
  const { chatID } = req.params;

  try {
    // Fetch the user chat model of the user attempting to fetch chat messages.
    const userChatModel = await UserChat.findOne({
      where: { chatID, userID },
      attributes: ['id'],
    });
    // Check that the user belongs to the chat they are attempting to fetch messages for.
    if (!userChatModel) {
      res.status(403).json(AuthorizationMessage.UNAUTHORIZED);
      return;
    }

    // Get all the message receipts for using the user chat id that was fetched for the given user chat id.
    const userChatID = userChatModel.getDataValue('id');
    const messageReceiptRecords: any = await MessageRecipient.findAll({
      raw: true,
      attributes: ['userChatID', [fn('max', col('createdAt')), 'createdAt']],
      where: { userChatID },
      group: ['userChatID', 'createdAt'],
    });

    // Using the retrieved message receipt records for a user chat, fetch all the message records.
    const messageRecords = await MessageRecipient.findAll({
      raw: true,
      where: { [Op.or]: messageReceiptRecords },
      order: [['createdAt', 'ASC']],
      attributes: ['createdAt'],
      include: [
        {
          model: Message,
          attributes: ['id', 'message'],
          include: [{ model: User, attributes: ['id', 'name'] }],
        },
      ],
    });
    // Using the message records, create an object to hold only the information needed for each message.
    const messages = messageRecords.map((messageRecord: any) => ({
      id: messageRecord['Message.id'],
      text: messageRecord['Message.message'],
      author: {
        name: messageRecord['Message.User.name'],
        id: messageRecord['Message.User.id'],
      },
      createdAt: messageRecord.createdAt,
    }));

    res.json({ messages });
  } catch (event) {
    res
      .status(500)
      .json(createGenericResponse(MessageAPIMessage.ERROR_SENDING_MESSAGE));
  }
});

export default router;
