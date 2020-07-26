import { Router } from 'express';

import ensureAuthenticaded from '@modules/users/infra/http/middlewares/ensureAuthenticated';

import { celebrate, Segments, Joi } from 'celebrate';
import RecognitionPostsController from '../controllers/RecognitionPostsController';
import CommentsController from '../controllers/CommentsController';

const recognitionPostsRouter = Router();
const recognitionPostsController = new RecognitionPostsController();
const commentsController = new CommentsController();

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

recognitionPostsRouter.post(
  '/:recognition_post_id/comments',
  celebrate({
    [Segments.PARAMS]: {
      recognition_post_id: Joi.string().required(),
    },
    [Segments.BODY]: {
      content: Joi.string().required(),
    },
  }),
  commentsController.create,
);

recognitionPostsRouter.get('/', recognitionPostsController.index);

export default recognitionPostsRouter;
