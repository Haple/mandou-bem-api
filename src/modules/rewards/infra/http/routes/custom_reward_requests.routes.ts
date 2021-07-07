import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticaded from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import ensureIsAdmin from '@modules/users/infra/http/middlewares/ensureIsAdmin';

import CustomRewardRequestsController from '../controllers/CustomRewardRequestsController';

const customRewardRequestsRouter = Router();
const customRewardRequestsController = new CustomRewardRequestsController();

customRewardRequestsRouter.use(ensureAuthenticaded);

customRewardRequestsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      custom_reward_id: Joi.string().uuid().required(),
    },
  }),
  customRewardRequestsController.create,
);

customRewardRequestsRouter.get(
  '/',
  ensureIsAdmin,
  celebrate({
    [Segments.QUERY]: {
      status: Joi.string().valid(
        'pending_approval',
        'use_available',
        'used',
        'reproved',
      ),
    },
  }),
  customRewardRequestsController.index,
);

customRewardRequestsRouter.patch(
  '/:custom_reward_request_id/approve',
  ensureIsAdmin,
  celebrate({
    [Segments.PARAMS]: {
      custom_reward_request_id: Joi.string().uuid().required(),
    },
  }),
  customRewardRequestsController.approve,
);

customRewardRequestsRouter.patch(
  '/:custom_reward_request_id/reprove',
  ensureIsAdmin,
  celebrate({
    [Segments.PARAMS]: {
      custom_reward_request_id: Joi.string().uuid().required(),
    },
    [Segments.BODY]: {
      reprove_reason: Joi.string().required(),
    },
  }),
  customRewardRequestsController.reprove,
);

customRewardRequestsRouter.get(
  '/:custom_reward_request_id',
  ensureIsAdmin,
  celebrate({
    [Segments.PARAMS]: {
      custom_reward_request_id: Joi.string().uuid().required(),
    },
  }),
  customRewardRequestsController.show,
);

customRewardRequestsRouter.patch(
  '/:custom_reward_request_id/validate',
  ensureIsAdmin,
  celebrate({
    [Segments.PARAMS]: {
      custom_reward_request_id: Joi.string().uuid().required(),
    },
  }),
  customRewardRequestsController.validate,
);

export default customRewardRequestsRouter;
