import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import AccountsController from '../controllers/AccountsController';

const accountsRouter = Router();
const accountsController = new AccountsController();

accountsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      company_name: Joi.string().required(),
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      password_confirmation: Joi.string().required().valid(Joi.ref('password')),
    },
  }),
  accountsController.create,
);

export default accountsRouter;
