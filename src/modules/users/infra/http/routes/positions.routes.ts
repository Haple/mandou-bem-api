import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticaded from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import ensureIsAdmin from '@modules/users/infra/http/middlewares/ensureIsAdmin';

import PositionsController from '../controllers/PositionsController';

const positionsRouter = Router();
const positionsController = new PositionsController();

positionsRouter.use(ensureAuthenticaded);

positionsRouter.get('/', positionsController.index);

positionsRouter.post(
  '/',
  ensureIsAdmin,
  celebrate({
    [Segments.BODY]: {
      position_name: Joi.string().required(),
      points: Joi.number().positive().required(),
    },
  }),
  positionsController.create,
);

positionsRouter.delete(
  '/:position_id',
  ensureIsAdmin,
  celebrate({
    [Segments.PARAMS]: {
      position_id: Joi.string().uuid().required(),
    },
  }),
  positionsController.delete,
);

positionsRouter.put(
  '/:position_id',
  ensureIsAdmin,
  celebrate({
    [Segments.PARAMS]: {
      position_id: Joi.string().uuid().required(),
    },
    [Segments.BODY]: {
      position_name: Joi.string().required(),
      points: Joi.number().positive().required(),
    },
  }),
  positionsController.update,
);

export default positionsRouter;
