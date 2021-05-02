import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticaded from '@modules/users/infra/http/middlewares/ensureAuthenticated';

import GiftCardRequestsController from '../controllers/GiftCardRequestsController';

const giftCardRequestsRouter = Router();
const giftCardRequestsController = new GiftCardRequestsController();

giftCardRequestsRouter.use(ensureAuthenticaded);

giftCardRequestsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      gift_card_id: Joi.string().uuid().required(),
    },
  }),
  giftCardRequestsController.create,
);

export default giftCardRequestsRouter;
