import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticaded from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import ensureIsAdmin from '@modules/users/infra/http/middlewares/ensureIsAdmin';

import CustomRewardRequestsController from '../controllers/CustomRewardRequestsController';

const rewardRequestsRouter = Router();
const rewardRequestsController = new CustomRewardRequestsController();

rewardRequestsRouter.use(ensureAuthenticaded);

rewardRequestsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      custom_reward_id: Joi.string().uuid().required(),
    },
  }),
  rewardRequestsController.create,
);

rewardRequestsRouter.get(
  '/',
  ensureIsAdmin,
  celebrate({
    [Segments.QUERY]: {
      status: Joi.string().valid('CREATED', 'DELIVERED'),
    },
  }),
  rewardRequestsController.index,
);

rewardRequestsRouter.patch(
  '/:custom_reward_request_id/deliver',
  ensureIsAdmin,
  celebrate({
    [Segments.PARAMS]: {
      custom_reward_request_id: Joi.string().uuid().required(),
    },
  }),
  rewardRequestsController.deliver,
);

export default rewardRequestsRouter;
