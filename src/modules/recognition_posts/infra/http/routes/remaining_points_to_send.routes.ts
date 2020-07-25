import { Router } from 'express';

import ensureAuthenticaded from '@modules/users/infra/http/middlewares/ensureAuthenticated';

import RemainingPointsToSendController from '../controllers/RemainingPointsToSendController';

const remainingPointsToSendRouter = Router();
const remainingPointsToSendController = new RemainingPointsToSendController();

remainingPointsToSendRouter.use(ensureAuthenticaded);

remainingPointsToSendRouter.get('/', remainingPointsToSendController.index);

export default remainingPointsToSendRouter;
