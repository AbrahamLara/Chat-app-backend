/**
 * Chat message responses for the chat api route.
 */
export enum ChatAPIMessage {
  INVALID_USER_IDS = 'The provided userIDs value is invalid.',
  INVALID_CHAT_NAME = 'Chat name must be a non-empty string.',
  BLANK_MESSAGE = 'Chat message must be a non-empty string.',
  ERROR_CREATING_CHAT = 'An error occurred attempting to create the group chat.',
  ERROR_FETCHING_CHAT = 'An error occurred fetching group chats.',
}
