import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ProviderSessionsController from '../controllers/ProviderSessionsController';

const providerSessionsRouter = Router();
const providerSessionsController = new ProviderSessionsController();

providerSessionsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
  }),
  providerSessionsController.create,
);

export default providerSessionsRouter;
