import { Router } from 'express';

import ensureAuthenticaded from '@modules/users/infra/http/middlewares/ensureAuthenticated';

import { celebrate, Joi, Segments } from 'celebrate';
import CatalogController from '../controllers/CatalogController';

const catalogRouter = Router();
const catalogController = new CatalogController();

catalogRouter.use(ensureAuthenticaded);

catalogRouter.get('/', catalogController.index);

catalogRouter.post(
  '/gift-card/switch',
  celebrate({
    [Segments.BODY]: {
      gift_card_id: Joi.string().uuid().required(),
      status: Joi.bool().required(),
    },
  }),
  catalogController.switchGiftCard,
);

export default catalogRouter;
