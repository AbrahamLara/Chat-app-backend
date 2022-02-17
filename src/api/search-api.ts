import { Op } from 'sequelize';
import { Request, Router } from 'express';
import { models } from '../../models';
import { SearchAPIMessage } from '../utils/search-utils';
import { createGenericResponse } from '../utils/response-utils';
import { DecryptAuthTokenDataMiddleware } from '../middleware/decrypt-auth-token-data-middleware';
import { TokenData } from '../utils/token-utils';

const router = Router();
const { User } = models;

router.use(DecryptAuthTokenDataMiddleware);

// This route performs a search on users using the provided name url query parameter. In order to perform a search, an
// auth token will be required.
router.get('/users', async (req: Request, res) => {
  const { userID } = req.tokenData as TokenData;
  const { name } = req.query;

  // If the name query param is empty, return an error message.
  if (!name) {
    res
      .status(404)
      .json(createGenericResponse(SearchAPIMessage.BLANK_NAME_SEARCH));
    return;
  }

  try {
    // Find all user's names matching the provided string pattern. Do not return the name of the user who performed
    // the search using the userID in the token data.
    const names = await User.findAll({
      attributes: ['id', 'name'],
      where: {
        name: {
          [Op.iLike]: `%${name}%`,
        },
        id: {
          [Op.not]: userID,
        },
      },
      limit: 10,
    });

    res.json({ results: names });
  } catch (event) {
    res.status(500).json(createGenericResponse(SearchAPIMessage.SEARCH_ERROR));
  }
});

// This route fetches a user profile using the provided token.
router.get('/user/profile', async (req: Request, res) => {
  try {
    const { userID, userName } = req.tokenData as TokenData;
    const userModel = await User.findByPk(userID);

    if (!userModel) {
      res
        .status(404)
        .json(createGenericResponse(SearchAPIMessage.SEARCH_ERROR));
      return;
    }

    res.json({
      id: userID,
      name: userName,
      email: userModel.getDataValue('email'),
    });
  } catch {
    res.status(500).json(createGenericResponse(SearchAPIMessage.SEARCH_ERROR));
  }
});

export default router;
