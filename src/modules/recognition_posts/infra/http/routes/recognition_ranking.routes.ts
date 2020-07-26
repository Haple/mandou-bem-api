import { Router } from 'express';

import ensureAuthenticaded from '@modules/users/infra/http/middlewares/ensureAuthenticated';

import RecognitionRankingController from '../controllers/RecognitionRankingController';

const recognitionRankingRouter = Router();
const recognitionRankingController = new RecognitionRankingController();

recognitionRankingRouter.use(ensureAuthenticaded);

recognitionRankingRouter.get('/', recognitionRankingController.index);

export default recognitionRankingRouter;
