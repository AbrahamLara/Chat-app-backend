export enum MessageAPIMessage {
  BLANK_MESSAGE = 'Chat message must be a non-empty string.',
  ERROR_SENDING_MESSAGE = 'An error occurred attempting to send message',
}

export interface MessageAuthor {
  /**
   * The id of the user who wrote the message to the chat.
   */
  id: string;

  /**
   * The name of the user who wrote the message to the chat.
   */
  name: string;
}

export interface ChatMessage {
  /**
   * The chat message text sent by the author.
   */
  text: string;

  /**
   * The author of the chat message.
   */
  author: MessageAuthor;

  /**
   * The timestamp of when the chat message was created.
   */
  createdAt: string;
}

export interface SendChatMessageData {
  /**
   * The id of the chat to broadcast the newly created message to.
   */
  chatID: string;

  /**
   * The object of the message to send to other user's in the chat.
   */
  message: ChatMessage;
}
