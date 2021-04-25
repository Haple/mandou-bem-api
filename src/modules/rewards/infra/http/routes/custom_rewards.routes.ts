import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticaded from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import ensureIsAdmin from '@modules/users/infra/http/middlewares/ensureIsAdmin';

import CustomRewardController from '../controllers/CustomRewardController';

const customRewardsRouter = Router();
const customRewardController = new CustomRewardController();

customRewardsRouter.use(ensureAuthenticaded);

customRewardsRouter.get('/', customRewardController.index);

customRewardsRouter.post(
  '/',
  ensureIsAdmin,
  celebrate({
    [Segments.BODY]: {
      title: Joi.string().required(),
      image_url: Joi.string().uri().required(),
      points: Joi.number().positive().required(),
      units_available: Joi.number().positive().required(),
      expiration_days: Joi.number().positive().required(),
      description: Joi.string().required(),
    },
  }),
  customRewardController.create,
);

customRewardsRouter.delete(
  '/:custom_reward_id',
  ensureIsAdmin,
  celebrate({
    [Segments.PARAMS]: {
      custom_reward_id: Joi.string().uuid().required(),
    },
  }),
  customRewardController.delete,
);

customRewardsRouter.put(
  '/:custom_reward_id',
  ensureIsAdmin,
  celebrate({
    [Segments.PARAMS]: {
      custom_reward_id: Joi.string().uuid().required(),
    },
    [Segments.BODY]: {
      title: Joi.string().required(),
      image_url: Joi.string().uri().required(),
      points: Joi.number().positive().required(),
      units_available: Joi.number().positive().required(),
      expiration_days: Joi.number().positive().required(),
      description: Joi.string().required(),
    },
  }),
  customRewardController.update,
);

export default customRewardsRouter;
