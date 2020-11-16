import bcrypt from 'bcrypt';
import { Router } from 'express';
import { models } from '../models';
import {
  getLoginFormErrors,
  getRegisterFormErrors,
  loginErrorResponse,
  registerErrorResponse,
} from '../utils/api/auth';
import { generateToken, hashValue } from '../utils/misc';

const router = Router();
const SALT_ROUNDS = 10;
const { User } = models;

// This route handles the account creation process for registering users.
router.post('/register', async (req, res) => {
  // Determine if there are any errors with the given fields before proceeding.
  const formErrors = getRegisterFormErrors(req.body);
  if (formErrors) {
    res.status(400).json(registerErrorResponse(formErrors));
    return;
  }

  try {
    const { firstName, lastName, email, password } = req.body;
    // We want to determine if the provided email is already in use by an existing user.
    const [newUser, created] = await User.findOrCreate({
      where: { email },
      defaults: { firstName, lastName, password },
    });
    // If the user was not created, then that means that a user already exists with the given email.
    if (!created) {
      const message = 'The email provided is already in use.';
      res
        .status(400)
        .json(registerErrorResponse([{ message, field: 'email' }]));
      return;
    }
    // Salt and hash the provided user password.
    const [error, hashedPassword] = await hashValue(password, SALT_ROUNDS);
    if (error) {
      // Destroy the newly created user since hashing failed.
      newUser.destroy();
      // Send a response with the provided error message. It's better to send an error message just saying there was a
      // problem registering the user. Since this is just a fun little project, I say it's alright!
      res.status(500).json(registerErrorResponse([{ message: error }]));
      return;
    }
    // Update the user's current password with the hashed result.
    newUser.set('password', hashedPassword).save();

    res.json({ message: 'You have successfully registered to ChatApp!' });
  } catch (e) {
    // Destroy the new user instance upon error if created.
    const newUser = await User.findOne({ where: { email: req.body.email } });
    if (newUser) {
      newUser.destroy();
    }
    const message = 'There was an error registering.';
    res.status(500).json(registerErrorResponse([{ message }]));
  }
});

// This route
router.post('/login', async (req, res) => {
  // Determine if there are any errors with the given fields before proceeding.
  const formErrors = getLoginFormErrors(req.body);
  if (formErrors) {
    res.status(400).json(loginErrorResponse(formErrors));
    return;
  }

  try {
    const { email, password } = req.body;
    // Fetch the user with the provided email.
    const user = await User.findOne({ where: { email } });

    if (!user) {
      // Since we couldn't fetch a user with the provided email, complain!
      const message = 'There is no user with this email.';
      res.status(400).json(loginErrorResponse([{ message, field: 'email' }]));
      return;
    }
    // Determine if hashed password matches provided password.
    const hashedPassword = user.get('password') as string;
    const passwordMatchesHash = await bcrypt.compare(password, hashedPassword);

    if (!passwordMatchesHash) {
      // Since the provided password doesn't match the stored hash, complain!
      const message = 'Invalid credentials';
      res.status(400).json(loginErrorResponse([{ message }]));
      return;
    }
    // Generate a token tom be store client-side.
    const token = await generateToken({ userId: user.get('id') });
    res.json({ token });
  } catch (e) {
    res
      .status(500)
      .json(
        loginErrorResponse([{ message: 'An error occurred trying to login.' }])
      );
  }
});

export default router;
