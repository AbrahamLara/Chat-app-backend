/**
 * Chat message responses for the chat api route.
 */
import { ChatMessage, MessageAuthor } from './message-utils';

export enum ChatAPIMessage {
  INVALID_USER_IDS = 'The provided userIDs value is invalid.',
  BLANK_CHAT_NAME = 'Chat name must be a non-empty string.',
  BLANK_MESSAGE = 'Chat message must be a non-empty string.',
  ERROR_CREATING_CHAT = 'An error occurred attempting to create the group chat.',
  ERROR_FETCHING_CHAT = 'An error occurred fetching group chats.',
  ERROR_FETCHING_CHAT_MEMBERS = 'An error occurred fetching group chat members.',
}

/**
 * The create chat form fields provided by client-side.
 */
export interface CreateChatFormFields {
  /**
   * The name of the chat to create.
   */
  chatName: string;

  /**
   * The first message to send to the newly created chat.
   */
  message: string;

  /**
   * The list of user IDs to make members of the chat.
   */
  userIDs: string[];
}

/**
 * The form field names for creating a chat.
 */
export enum CreateChatFormField {
  CHAT_NAME = 'chatName',
  MESSAGE = 'message',
  USER_IDS = 'userIDs',
}

export interface UserTypingMessageData {
  /**
   * The id of the chat to broadcast to that a member is typing a message.
   */
  chatID: string;

  /**
   * An object describing the user who is currently typing.
   */
  user: MessageAuthor;

  /**
   * Determines if the user is typing.
   */
  isTyping: boolean;
}

export interface ChatCreatedData {
  chat: {
    /**
     * The id of the group chat.
     */
    id: string;

    /**
     * The name of the group chat.
     */
    name: string;

    /**
     * The object of the message to send to other user's in the chat.
     */
    message: ChatMessage;
  };

  /**
   * A list of user ids from members part of the newly created chat.
   */
  memberIDs: string[];
}
