import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticaded from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import ensureIsAdmin from '@modules/users/infra/http/middlewares/ensureIsAdmin';

import DepartmentsController from '../controllers/DepartmentsController';

const departmentsRouter = Router();
const departmentsController = new DepartmentsController();

departmentsRouter.use(ensureAuthenticaded);

departmentsRouter.get('/', departmentsController.index);

departmentsRouter.post(
  '/',
  ensureIsAdmin,
  celebrate({
    [Segments.BODY]: {
      department_name: Joi.string().required(),
    },
  }),
  departmentsController.create,
);

departmentsRouter.delete(
  '/:department_id',
  ensureIsAdmin,
  celebrate({
    [Segments.PARAMS]: {
      department_id: Joi.string().uuid().required(),
    },
  }),
  departmentsController.delete,
);

departmentsRouter.put(
  '/:department_id',
  ensureIsAdmin,
  celebrate({
    [Segments.PARAMS]: {
      department_id: Joi.string().uuid().required(),
    },
    [Segments.BODY]: {
      department_name: Joi.string().required(),
    },
  }),
  departmentsController.update,
);

export default departmentsRouter;
