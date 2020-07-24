import { Router } from 'express';

import ensureAuthenticaded from '@modules/users/infra/http/middlewares/ensureAuthenticated';

import CatalogRewardController from '../controllers/RemainingPointsToSendController';

const catalogRewardsRouter = Router();
const catalogRewardController = new CatalogRewardController();

catalogRewardsRouter.use(ensureAuthenticaded);

catalogRewardsRouter.get('/', catalogRewardController.index);

export default catalogRewardsRouter;
