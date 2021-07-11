import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticaded from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import ensureIsAdmin from '@modules/users/infra/http/middlewares/ensureIsAdmin';

import EnpsSurveysController from '../controllers/EnpsSurveysController';

const enpsSurveysRouter = Router();
const enpsSurveysController = new EnpsSurveysController();

enpsSurveysRouter.use(ensureAuthenticaded);

enpsSurveysRouter.post(
  '/',
  ensureIsAdmin,
  celebrate({
    [Segments.BODY]: {
      question: Joi.string(),
      end_date: Joi.date().greater(new Date()).iso().required(),
      position_id: Joi.string().uuid(),
      department_id: Joi.string().uuid(),
    },
  }),
  enpsSurveysController.create,
);

export default enpsSurveysRouter;
