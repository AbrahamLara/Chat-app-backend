import {
  AuthFormField,
  EMAIL_REGEX,
  LoginAPIMessage,
  LoginFormFields,
  PASSWORD_REGEX,
  RegisterAPIMessage,
  RegisterFormFields,
} from './auth-utils';
import {
  ChatAPIMessage,
  CreateChatFormField,
  CreateChatFormFields,
} from './chat-utils';

export enum ApiRoute {
  REGISTER = 'register',
  LOGIN = 'login',
  CHAT = 'chat',
  MESSAGE = 'message',
}

interface GenericResponse {
  /**
   * Generic message to send as response.
   */
  message: string;
}

/**
 * Describes an error message for an invalid form field value.
 */
export interface FormErrorResponse extends GenericResponse {
  /**
   * The form field the error message is for. This doesn't need to be provided if a form error wasn't due to an invalid
   * field value.
   */
  field?: string;
}

/**
 * Describes the payload to return for a failed request.
 */
export interface ErrorPayload {
  /**
   * The error message type represented as the api route sending the error payload.
   *
   * Note: This might not actually be needed.
   */
  type: ApiRoute;

  /**
   * The error messages produced. Right now the backend only serves form errors.
   */
  errors: FormErrorResponse[];
}

/**
 * Creates a generic message object.
 */
export function createGenericResponse(message: string): GenericResponse {
  return { message };
}

/**
 * Creates a form error message object.
 */
export function createFormErrorResponse(
  message: string,
  field: string
): FormErrorResponse {
  return { message, field };
}

/**
 * Returns an array of errors from the provided register fields.
 *
 * @param fields Register form fields
 */
export function getRegisterFormErrors(
  fields: RegisterFormFields
): FormErrorResponse[] | null {
  const { name, email, password, confPassword } = fields;
  const errors: FormErrorResponse[] = [];
  // Check that all the fields are filled.
  if (!name && !email && !password && !confPassword) {
    errors.push(createGenericResponse(RegisterAPIMessage.FIELDS_ARE_BLANK));
  }

  // If no name is provided in the form, return error message to remind the user.
  if (!name) {
    errors.push(
      createFormErrorResponse(RegisterAPIMessage.BLANK_NAME, AuthFormField.NAME)
    );
  }

  // Determine if provided email is valid even if validation is done client-side.
  if (!RegExp(EMAIL_REGEX).test(email)) {
    errors.push(
      createFormErrorResponse(
        RegisterAPIMessage.INVALID_EMAIL,
        AuthFormField.EMAIL
      )
    );
  }

  // Determine if provided password is valid even if validation is done client-side.
  if (!RegExp(PASSWORD_REGEX).test(password)) {
    errors.push(
      createFormErrorResponse(
        RegisterAPIMessage.INVALID_PASSWORD,
        AuthFormField.PASSWORD
      )
    );
  }

  // The confirmation password must equal the original password.
  if (!confPassword) {
    errors.push(
      createFormErrorResponse(
        RegisterAPIMessage.BLANK_CONF_PASSWORD,
        AuthFormField.CONF_PASSWORD
      )
    );
  } else if (password !== confPassword) {
    errors.push(
      createFormErrorResponse(
        RegisterAPIMessage.INVALID_CONFIRMATION_PASSWORD,
        AuthFormField.CONF_PASSWORD
      )
    );
  }

  return errors.length ? errors : null;
}

/**
 * Returns an array of errors from the provided login fields.
 *
 * @param fields Login form fields
 */
export function getLoginFormErrors(
  fields: LoginFormFields
): FormErrorResponse[] | null {
  const { email, password } = fields;
  const errors: FormErrorResponse[] = [];
  // Check that email and password are filled.
  if (!email && !password) {
    errors.push(createGenericResponse(LoginAPIMessage.FIELDS_ARE_BLANK));
  }

  if (!email) {
    errors.push(
      createFormErrorResponse(LoginAPIMessage.BLANK_EMAIL, AuthFormField.EMAIL)
    );
  }

  if (!password) {
    errors.push(
      createFormErrorResponse(
        LoginAPIMessage.BLANK_PASSWORD,
        AuthFormField.PASSWORD
      )
    );
  }

  return errors.length ? errors : null;
}

/**
 * Returns an array of errors from the provided create chat form fields.
 *
 * @param fields Create chat form fields
 */
export function getCreateChatFormErrors(
  fields: CreateChatFormFields
): FormErrorResponse[] | null {
  const { chatName, message, userIDs } = fields;
  const errors: FormErrorResponse[] = [];
  // Check that the fields are filled.
  if (!chatName) {
    errors.push(
      createFormErrorResponse(
        ChatAPIMessage.BLANK_CHAT_NAME,
        CreateChatFormField.CHAT_NAME
      )
    );
  }

  if (!message) {
    errors.push(
      createFormErrorResponse(
        ChatAPIMessage.BLANK_MESSAGE,
        CreateChatFormField.MESSAGE
      )
    );
  }

  if (!userIDs.length) {
    errors.push(
      createFormErrorResponse(
        ChatAPIMessage.INVALID_USER_IDS,
        CreateChatFormField.USER_IDS
      )
    );
  }

  return errors.length ? errors : null;
}

/**
 * Creates a register form error response.
 */
export function getRegisterErrorResponse(
  errors: FormErrorResponse[]
): ErrorPayload {
  return { type: ApiRoute.REGISTER, errors };
}

/**
 * Creates a login form error response.
 */
export function getLoginErrorResponse(
  errors: FormErrorResponse[]
): ErrorPayload {
  return { type: ApiRoute.LOGIN, errors };
}

/**
 * Creates an error response for the create chat form.
 */
export function getCreateChatErrorResponse(
  errors: FormErrorResponse[]
): ErrorPayload {
  return { type: ApiRoute.CHAT, errors };
}
