import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticaded from '@modules/users/infra/http/middlewares/ensureAuthenticated';

import MyRewardRequestsController from '../controllers/MyRewardRequestsController';

const myRewardRequestsRouter = Router();
const myRewardRequestsController = new MyRewardRequestsController();

myRewardRequestsRouter.use(ensureAuthenticaded);

myRewardRequestsRouter.get(
  '/',
  celebrate({
    [Segments.QUERY]: {
      reward_type: Joi.string().valid('gift_card', 'custom_reward'),
      start_date: Joi.date().less(new Date()).required(),
      end_date: Joi.date()
        .ruleset.greater(Joi.ref('start_date'))
        .rule({ message: 'end_date must be greater than start_date' })
        .required(),
      page: Joi.number().default(0).min(0),
      size: Joi.number().positive().default(10).min(1),
      status: Joi.string()
        .valid('pending_approval', 'use_available', 'used', 'reproved')
        .allow(null),
    },
  }),
  myRewardRequestsController.index,
);

export default myRewardRequestsRouter;
