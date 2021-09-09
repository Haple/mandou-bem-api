import { Router } from 'express';

import ensureAuthenticaded from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import ProviderAccountsController from '../controllers/ProvidersController';

const providersRouter = Router();
const providersController = new ProviderAccountsController();

providersRouter.use(ensureAuthenticaded);

providersRouter.get('/', providersController.index);

export default providersRouter;
