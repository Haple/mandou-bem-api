import { Router } from 'express';

import ProviderAccountsController from '../controllers/ProvidersController';

const providerAccountsRouter = Router();
const providerAccountsController = new ProviderAccountsController();

providerAccountsRouter.get('/', providerAccountsController.index);

export default providerAccountsRouter;
