import { Router } from 'express';

import ensureAuthenticaded from '@modules/users/infra/http/middlewares/ensureAuthenticated';

import CatalogController from '../controllers/CatalogController';

const catalogRouter = Router();
const catalogController = new CatalogController();

catalogRouter.use(ensureAuthenticaded);

catalogRouter.get('/', catalogController.index);

export default catalogRouter;
