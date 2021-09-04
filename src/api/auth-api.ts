import bcrypt from 'bcryptjs';
import { Router } from 'express';
import { models } from '../models';
import {
  AuthFormField,
  LoginResponseMessage,
  RegisterResponseMessage,
} from '../utils/auth-utils';
import { hashValue } from '../utils/misc-utils';
import { SequelizeModel } from '../utils/database-utils';
import {
  createGenericMessage,
  getLoginErrorMessages,
  getLoginFormErrors,
  getRegisterErrorMessages,
  getRegisterFormErrors,
} from '../utils/message-utils';
import { generateToken } from '../utils/token-utils';

const router = Router();
const SALT_ROUNDS = 10;
const { User } = models;

// This route handles the account creation process for registering users.
router.post('/register', async (req, res) => {
  // Determine if there are any errors with the given fields before proceeding.
  const formErrors = getRegisterFormErrors(req.body);
  if (formErrors) {
    res.status(400).json(getRegisterErrorMessages(formErrors));
    return;
  }

  let newUserModel: SequelizeModel | null = null;

  try {
    const { name, email, password } = req.body;
    // We want to determine if the provided email is already in use by an existing user.
    const [userModel, created] = await User.findOrCreate({
      where: { email },
      defaults: { name, password },
    });

    newUserModel = userModel;

    // If the user was not created, then that means that a user already exists with the given email.
    if (!created) {
      const message = RegisterResponseMessage.EMAIL_IN_USE;
      res
        .status(400)
        .json(getRegisterErrorMessages([{ message, field: 'email' }]));
      return;
    }

    // Salt and hash the provided user password.
    const hashedPassword = await hashValue(password, SALT_ROUNDS);

    // Update the user's current password with the hashed result.
    newUserModel.set('password', hashedPassword).save();

    res.json(createGenericMessage(RegisterResponseMessage.REGISTER_SUCCEEDED));
  } catch (event) {
    if (newUserModel) {
      newUserModel.destroy();
    }

    const message = createGenericMessage(
      RegisterResponseMessage.REGISTER_FAILED
    );
    res.status(500).json(getRegisterErrorMessages([message]));
  }
});

// This route handles logging in users and sending back a token to authorize user actions.
router.post('/login', async (req, res) => {
  // Determine if there are any errors with the given fields before proceeding.
  const formErrors = getLoginFormErrors(req.body);
  if (formErrors) {
    res.status(400).json(getLoginErrorMessages(formErrors));
    return;
  }

  try {
    const { email, password } = req.body;
    // Fetch the user with the provided email.
    const user = await User.findOne({ where: { email } });

    if (!user) {
      // Since we couldn't fetch a user with the provided email, complain!
      const message = LoginResponseMessage.INVALID_EMAIL;
      res
        .status(400)
        .json(getLoginErrorMessages([{ message, field: AuthFormField.EMAIL }]));
      return;
    }

    // Determine if hashed password matches provided password.
    const hashedPassword = user.get(AuthFormField.PASSWORD) as string;
    const passwordMatchesHash = await bcrypt.compare(password, hashedPassword);

    if (!passwordMatchesHash) {
      // Since the provided password doesn't match the stored hash, complain!
      const message = createGenericMessage(
        LoginResponseMessage.INVALID_CREDENTIALS
      );
      res.status(400).json(getLoginErrorMessages([message]));
      return;
    }

    // Generate a token to be store client-side.
    const token = await generateToken({ userID: user.get('id') });

    res.json({ token });
  } catch (event) {
    // Something went wrong attempting to login a user.
    const message = createGenericMessage(LoginResponseMessage.LOGIN_FAILED);
    res.status(500).json(getLoginErrorMessages([message]));
  }
});

export default router;
