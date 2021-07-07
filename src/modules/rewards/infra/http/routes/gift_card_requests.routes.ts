import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticaded from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import ensureProviderAuthenticated from '@modules/provider_accounts/infra/http/middlewares/ensureProviderAuthenticated';

import GiftCardRequestsController from '../controllers/GiftCardRequestsController';

const giftCardRequestsRouter = Router();
const giftCardRequestsController = new GiftCardRequestsController();

giftCardRequestsRouter.use(ensureAuthenticaded);

giftCardRequestsRouter.post(
  '/',
  ensureAuthenticaded,
  celebrate({
    [Segments.BODY]: {
      gift_card_id: Joi.string().uuid().required(),
    },
  }),
  giftCardRequestsController.create,
);

giftCardRequestsRouter.get(
  '/:gift_card_request_id',
  ensureProviderAuthenticated,
  celebrate({
    [Segments.PARAMS]: {
      gift_card_request_id: Joi.string().uuid().required(),
    },
  }),
  giftCardRequestsController.show,
);

giftCardRequestsRouter.patch(
  '/:gift_card_request_id/validate',
  ensureProviderAuthenticated,
  celebrate({
    [Segments.PARAMS]: {
      gift_card_request_id: Joi.string().uuid().required(),
    },
  }),
  giftCardRequestsController.validate,
);

export default giftCardRequestsRouter;
