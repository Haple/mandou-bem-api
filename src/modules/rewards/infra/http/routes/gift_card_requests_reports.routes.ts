import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureProviderAuthenticated from '@modules/provider_accounts/infra/http/middlewares/ensureProviderAuthenticated';

import GiftCardRequestsReportController from '../controllers/GiftCardRequestsReportController';

const giftCardRequestsReportRouter = Router();
const giftCardRequestsReportController = new GiftCardRequestsReportController();

giftCardRequestsReportRouter.use(ensureProviderAuthenticated);

giftCardRequestsReportRouter.get(
  '/',
  celebrate({
    [Segments.QUERY]: {
      start_date: Joi.date().less(new Date()).required(),
      end_date: Joi.date()
        .ruleset.greater(Joi.ref('start_date'))
        .rule({ message: 'end_date must be greater than start_date' })
        .required(),
      page: Joi.number().default(0).min(0),
      size: Joi.number().positive().default(10).min(1),
      gift_card_id: Joi.string().uuid().allow(null),
      status: Joi.string().valid('use_available', 'used').allow(null),
    },
  }),
  giftCardRequestsReportController.index,
);

giftCardRequestsReportRouter.get(
  '/pdf',
  celebrate({
    [Segments.QUERY]: {
      start_date: Joi.date().less(new Date()).required(),
      end_date: Joi.date()
        .ruleset.greater(Joi.ref('start_date'))
        .rule({ message: 'end_date must be greater than start_date' })
        .required(),
      gift_card_id: Joi.string().uuid().allow(null),
      status: Joi.string().valid('use_available', 'used').allow(null),
    },
  }),
  giftCardRequestsReportController.downloadPDF,
);

giftCardRequestsReportRouter.get(
  '/summary',
  giftCardRequestsReportController.summary,
);

export default giftCardRequestsReportRouter;
