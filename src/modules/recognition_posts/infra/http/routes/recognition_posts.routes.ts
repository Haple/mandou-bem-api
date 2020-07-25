import { Router } from 'express';

import ensureAuthenticaded from '@modules/users/infra/http/middlewares/ensureAuthenticated';

import { celebrate, Segments, Joi } from 'celebrate';
import RecognitionPostsController from '../controllers/RecognitionPostsController';

const recognitionPostsRouter = Router();
const recognitionPostsController = new RecognitionPostsController();

recognitionPostsRouter.use(ensureAuthenticaded);

recognitionPostsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      to_user_id: Joi.string().uuid().required(),
      content: Joi.string().required(),
      recognition_points: Joi.number().positive().min(1).required(),
    },
  }),
  recognitionPostsController.create,
);

export default recognitionPostsRouter;
