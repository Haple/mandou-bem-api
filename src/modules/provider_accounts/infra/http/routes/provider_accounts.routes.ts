import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ProviderAccountsController from '../controllers/ProviderAccountsController';

const providerAccountsRouter = Router();
const providerAccountsController = new ProviderAccountsController();

providerAccountsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      company_name: Joi.string().required(),
      cnpj: Joi.string().required(),
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      password_confirmation: Joi.string().required().valid(Joi.ref('password')),
    },
  }),
  providerAccountsController.create,
);

export default providerAccountsRouter;
