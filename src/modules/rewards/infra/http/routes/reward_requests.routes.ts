import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticaded from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import ensureIsAdmin from '@modules/users/infra/http/middlewares/ensureIsAdmin';

import RewardRequestsController from '../controllers/RewardRequestsController';

const rewardRequestsRouter = Router();
const rewardRequestsController = new RewardRequestsController();

rewardRequestsRouter.use(ensureAuthenticaded);

rewardRequestsRouter.get('/', ensureIsAdmin, rewardRequestsController.index);

rewardRequestsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      catalog_reward_id: Joi.string().uuid().required(),
    },
  }),
  rewardRequestsController.create,
);

rewardRequestsRouter.patch(
  '/:reward_request_id/deliver',
  celebrate({
    [Segments.PARAMS]: {
      reward_request_id: Joi.string().uuid().required(),
    },
  }),
  rewardRequestsController.deliver,
);

export default rewardRequestsRouter;
