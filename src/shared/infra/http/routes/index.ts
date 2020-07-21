import { Router } from 'express';

import accountsRouter from '@modules/users/infra/http/routes/accounts.routes';
import usersRouter from '@modules/users/infra/http/routes/users.routes';
import sessionsRouter from '@modules/users/infra/http/routes/sessions.routes';
import passwordRouter from '@modules/users/infra/http/routes/password.routes';
import profileRouter from '@modules/users/infra/http/routes/profile.routes';
import catalogRewardsRouter from '@modules/rewards/infra/http/routes/catalog_rewards.routes';
import rewardsRequestsRouter from '@modules/rewards/infra/http/routes/reward_requests.routes';

const routes = Router();

routes.use('/accounts', accountsRouter);
routes.use('/users', usersRouter);
routes.use('/profile', profileRouter);
routes.use('/password', passwordRouter);
routes.use('/sessions', sessionsRouter);

routes.use('/catalog-rewards', catalogRewardsRouter);
routes.use('/reward-requests', rewardsRequestsRouter);

export default routes;
