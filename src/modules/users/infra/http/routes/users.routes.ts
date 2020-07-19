import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticaded from '../middlewares/ensureAuthenticated';
import ensureIsAdmin from '../middlewares/ensureIsAdmin';
import UsersController from '../controllers/UsersController';

const usersRouter = Router();
const usersController = new UsersController();

usersRouter.use(ensureAuthenticaded);

usersRouter.post(
  '/',
  ensureIsAdmin,
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
    },
  }),
  usersController.create,
);

usersRouter.get(
  '/',
  celebrate({
    [Segments.QUERY]: {
      username_like: Joi.string(),
    },
  }),
  usersController.index,
);

export default usersRouter;
