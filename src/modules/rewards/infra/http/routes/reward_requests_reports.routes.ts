import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticaded from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import ensureIsAdmin from '@modules/users/infra/http/middlewares/ensureIsAdmin';

import RewardRequestsReportController from '../controllers/RewardRequestsReportController';

const rewardRequestsReportRouter = Router();
const rewardRequestsReportController = new RewardRequestsReportController();

rewardRequestsReportRouter.use(ensureAuthenticaded);
rewardRequestsReportRouter.use(ensureIsAdmin);

rewardRequestsReportRouter.get(
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
      position_id: Joi.string().uuid().allow(null),
      department_id: Joi.string().uuid().allow(null),
      provider_id: Joi.string().uuid().allow(null),
      status: Joi.string()
        .valid('pending_approval', 'use_available', 'used', 'reproved')
        .allow(null),
    },
  }),
  rewardRequestsReportController.index,
);

rewardRequestsReportRouter.get(
  '/pdf',
  celebrate({
    [Segments.QUERY]: {
      reward_type: Joi.string().valid('gift_card', 'custom_reward'),
      start_date: Joi.date().less(new Date()).required(),
      end_date: Joi.date()
        .ruleset.greater(Joi.ref('start_date'))
        .rule({ message: 'end_date must be greater than start_date' })
        .required(),
      position_id: Joi.string().uuid().allow(null),
      department_id: Joi.string().uuid().allow(null),
      provider_id: Joi.string().uuid().allow(null),
      status: Joi.string()
        .valid('pending_approval', 'use_available', 'used', 'reproved')
        .allow(null),
    },
  }),
  rewardRequestsReportController.downloadPDF,
);

export default rewardRequestsReportRouter;
