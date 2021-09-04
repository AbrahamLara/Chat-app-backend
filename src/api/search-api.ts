import { Op } from 'sequelize';
import { Request, Router } from 'express';
import { models } from '../models';
import { SearchResponseMessage } from '../utils/search-utils';
import { createGenericMessage } from '../utils/message-utils';
import { DecryptAuthTokenDataMiddleware } from '../middleware/decrypt-auth-token-data-middleware';

const router = Router();
const { User } = models;

router.use(DecryptAuthTokenDataMiddleware);

// This route performs a user search using the provided name url parameter. In order to perform a search, an auth
// token will be required.
router.get('/user', async (req: Request, res) => {
  const { query, tokenData } = req;
  const { name } = query;

  if (!tokenData) {
    res
      .status(500)
      .json(createGenericMessage(SearchResponseMessage.SEARCH_ERROR));
    return;
  }

  // If the name query param is empty, return an error message.
  if (!name) {
    res
      .status(404)
      .json(createGenericMessage(SearchResponseMessage.BLANK_NAME_SEARCH));
    return;
  }

  try {
    // Find all user's names matching the provided string pattern. Do not return the name of the user who performed
    // the search using the userID in the token data.
    const names = await User.findAll({
      attributes: ['name'],
      where: {
        name: {
          [Op.iLike]: `%${name}%`,
        },
        id: {
          [Op.not]: tokenData.userID,
        },
      },
      limit: 10,
    });

    res.json({ results: names });
  } catch (event) {
    res
      .status(500)
      .json(createGenericMessage(SearchResponseMessage.SEARCH_ERROR));
  }
});

export default router;
