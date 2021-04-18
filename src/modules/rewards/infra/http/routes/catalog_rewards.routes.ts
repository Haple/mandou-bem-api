import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticaded from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import ensureIsAdmin from '@modules/users/infra/http/middlewares/ensureIsAdmin';

import CatalogRewardController from '../controllers/CatalogRewardController';

const catalogRewardsRouter = Router();
const catalogRewardController = new CatalogRewardController();

catalogRewardsRouter.use(ensureAuthenticaded);

catalogRewardsRouter.get('/', catalogRewardController.index);

catalogRewardsRouter.post(
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
  catalogRewardController.create,
);

catalogRewardsRouter.delete(
  '/:catalog_reward_id',
  ensureIsAdmin,
  celebrate({
    [Segments.PARAMS]: {
      catalog_reward_id: Joi.string().uuid().required(),
    },
  }),
  catalogRewardController.delete,
);

catalogRewardsRouter.put(
  '/:catalog_reward_id',
  ensureIsAdmin,
  celebrate({
    [Segments.PARAMS]: {
      catalog_reward_id: Joi.string().uuid().required(),
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
  catalogRewardController.update,
);

export default catalogRewardsRouter;
