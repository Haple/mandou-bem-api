import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '@config/upload';
import { celebrate, Segments, Joi } from 'celebrate';

import ProfileController from '../controllers/ProfileController';
import UserAvatarController from '../controllers/UserAvatarController';

import ensureAuthenticaded from '../middlewares/ensureAuthenticated';

const userAvatarController = new UserAvatarController();

const upload = multer(uploadConfig.multer);
const profileRouter = Router();
const profileController = new ProfileController();

profileRouter.use(ensureAuthenticaded);

profileRouter.get('/', profileController.show);
profileRouter.put(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      old_password: Joi.string(),
      password: Joi.string(),
      password_confirmation: Joi.string().valid(Joi.ref('password')),
    },
  }),
  profileController.update,
);

profileRouter.patch(
  '/avatar',
  ensureAuthenticaded,
  upload.single('avatar'),
  userAvatarController.update,
);

export default profileRouter;
