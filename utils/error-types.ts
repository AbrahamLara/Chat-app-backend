// TODO: Repurpose/rename this file for general response message uses.

enum ErrorPayloadType {
  REGISTER = 'register',
  LOGIN = 'login',
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface GenericResponseMessage {
  message: string;
}

/**
 * Describes an error message for an invalid form field value.
 *
 * TODO: Repurpose as FormMessageResponse.
 */
interface FormErrorMessage {
  /**
   * The error message to display on the form.
   */
  message: string;

  /**
   * The form field the error message is for. This doesn't need to be provided if a form error wasn't due to an invalid
   * field value.
   */
  field?: string;
}

/**
 * Describes the payload to return for a failed request.
 */
interface ErrorPayload {
  /**
   * The error type.
   *
   * Note: This might not actually be needed.
   */
  type: ErrorPayloadType;

  /**
   * The error messages produced. Right now the backend only serves form errors.
   */
  errors: FormErrorMessage[];
}

export { FormErrorMessage, ErrorPayload, ErrorPayloadType };
