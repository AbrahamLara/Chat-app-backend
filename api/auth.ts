import { Router } from 'express';
import { models } from '../models';
import {
  getRegisterFormErrors,
  registerErrorResponse,
} from '../utils/api/auth';
import { hashValue } from '../utils/misc';

const router = Router();
const SALT_ROUNDS = 10;
const { User } = models;

// This route handles the account creation process for registering users.
router.post('/register', async (req, res) => {
  // If there are errors with the values provided in the form, then return the errors.
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
    res
      .status(500)
      .json(
        registerErrorResponse([{ message: 'There was an error registering.' }])
      );
  }
});

export default router;
