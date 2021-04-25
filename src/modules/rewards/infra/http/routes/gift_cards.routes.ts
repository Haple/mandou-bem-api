import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureProviderAuthenticated from '@modules/provider_accounts/infra/http/middlewares/ensureProviderAuthenticated';

import GiftCardController from '../controllers/GiftCardsController';

const giftCardsRouter = Router();
const giftCardController = new GiftCardController();

giftCardsRouter.use(ensureProviderAuthenticated);

giftCardsRouter.get('/', giftCardController.index);

giftCardsRouter.post(
  '/',
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
  giftCardController.create,
);

giftCardsRouter.delete(
  '/:gift_card_id',
  celebrate({
    [Segments.PARAMS]: {
      gift_card_id: Joi.string().uuid().required(),
    },
  }),
  giftCardController.delete,
);

giftCardsRouter.put(
  '/:gift_card_id',
  celebrate({
    [Segments.PARAMS]: {
      gift_card_id: Joi.string().uuid().required(),
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
  giftCardController.update,
);

export default giftCardsRouter;
