/**
 * Chat message responses for the chat api route.
 */
export enum ChatAPIMessage {
  INVALID_USER_IDS = 'The provided userIDs value is invalid.',
  BLANK_CHAT_NAME = 'Chat name must be a non-empty string.',
  BLANK_MESSAGE = 'Chat message must be a non-empty string.',
  ERROR_CREATING_CHAT = 'An error occurred attempting to create the group chat.',
  ERROR_FETCHING_CHAT = 'An error occurred fetching group chats.',
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
