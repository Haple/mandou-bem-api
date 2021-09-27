import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ProfileController from '../controllers/ProfileController';

import ensureProviderAuthenticated from '../middlewares/ensureProviderAuthenticated';

const profileRouter = Router();
const profileController = new ProfileController();

profileRouter.use(ensureProviderAuthenticated);

profileRouter.get('/', profileController.show);

profileRouter.put(
  '/',
  celebrate({
    [Segments.BODY]: {
      company_name: Joi.string().required(),
      cnpj: Joi.string().required(),
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      old_password: Joi.string(),
      password: Joi.string(),
      password_confirmation: Joi.string().valid(Joi.ref('password')),
    },
  }),
  profileController.update,
);

export default profileRouter;
