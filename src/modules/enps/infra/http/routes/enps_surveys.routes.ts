import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticaded from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import ensureIsAdmin from '@modules/users/infra/http/middlewares/ensureIsAdmin';

import EnpsSurveysController from '../controllers/EnpsSurveysController';
import EnpsAnswersController from '../controllers/EnpsAnswersController';

const enpsSurveysRouter = Router();
const enpsSurveysController = new EnpsSurveysController();
const enpsAnswersController = new EnpsAnswersController();

enpsSurveysRouter.use(ensureAuthenticaded);

enpsSurveysRouter.get(
  '/answers/available',
  enpsSurveysController.showAvailable,
);

enpsSurveysRouter.get(
  '/:enps_survey_id',
  ensureIsAdmin,
  celebrate({
    [Segments.PARAMS]: {
      enps_survey_id: Joi.string().uuid().required(),
    },
  }),
  enpsSurveysController.show,
);

enpsSurveysRouter.patch(
  '/:enps_survey_id/end',
  ensureIsAdmin,
  celebrate({
    [Segments.PARAMS]: {
      enps_survey_id: Joi.string().uuid().required(),
    },
  }),
  enpsSurveysController.end,
);

enpsSurveysRouter.get('/', ensureIsAdmin, enpsSurveysController.index);

enpsSurveysRouter.post(
  '/',
  ensureIsAdmin,
  celebrate({
    [Segments.BODY]: {
      question: Joi.string().allow(null),
      end_date: Joi.date().greater(new Date()).iso().required(),
      position_id: Joi.string().uuid().allow(null),
      department_id: Joi.string().uuid().allow(null),
    },
  }),
  enpsSurveysController.create,
);

enpsSurveysRouter.post(
  '/:enps_survey_id/answers',
  celebrate({
    [Segments.PARAMS]: {
      enps_survey_id: Joi.string().uuid().required(),
    },
    [Segments.BODY]: {
      answer: Joi.string().required(),
      score: Joi.number().positive().required(),
    },
  }),
  enpsAnswersController.create,
);

enpsSurveysRouter.get(
  '/:enps_survey_id/answers',
  celebrate({
    [Segments.PARAMS]: {
      enps_survey_id: Joi.string().uuid().required(),
    },
    [Segments.QUERY]: {
      page: Joi.number().default(0).min(0),
      size: Joi.number().positive().default(10).min(1),
    },
  }),
  enpsAnswersController.index,
);

enpsSurveysRouter.get(
  '/:enps_survey_id/pdf',
  celebrate({
    [Segments.PARAMS]: {
      enps_survey_id: Joi.string().uuid().required(),
    },
  }),
  enpsSurveysController.downloadPDF,
);

export default enpsSurveysRouter;
