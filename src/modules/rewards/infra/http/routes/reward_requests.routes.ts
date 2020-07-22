import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticaded from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import ensureIsAdmin from '@modules/users/infra/http/middlewares/ensureIsAdmin';

import RewardRequestsController from '../controllers/RewardRequestsController';

const rewardRequestsRouter = Router();
const rewardRequestsController = new RewardRequestsController();

rewardRequestsRouter.use(ensureAuthenticaded);

rewardRequestsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      catalog_reward_id: Joi.string().uuid().required(),
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
  '/:reward_request_id/deliver',
  ensureIsAdmin,
  celebrate({
    [Segments.PARAMS]: {
      reward_request_id: Joi.string().uuid().required(),
    },
  }),
  rewardRequestsController.deliver,
);

export default rewardRequestsRouter;
