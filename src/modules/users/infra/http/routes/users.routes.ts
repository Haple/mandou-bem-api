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
      department_id: Joi.string().uuid().required(),
      position_id: Joi.string().uuid().required(),
    },
  }),
  usersController.create,
);

usersRouter.delete(
  '/:user_id',
  ensureIsAdmin,
  celebrate({
    [Segments.PARAMS]: {
      user_id: Joi.string().uuid().required(),
    },
  }),
  usersController.delete,
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

usersRouter.put(
  '/:user_id',
  ensureIsAdmin,
  celebrate({
    [Segments.PARAMS]: {
      user_id: Joi.string().uuid().required(),
    },
    [Segments.BODY]: {
      position_id: Joi.string().uuid().required(),
      department_id: Joi.string().uuid().required(),
    },
  }),
  usersController.update,
);

export default usersRouter;
