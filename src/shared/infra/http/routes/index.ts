import { Router } from 'express';

import providerAccountsRouter from '@modules/provider_accounts/infra/http/routes/provider_accounts.routes';
import accountsRouter from '@modules/users/infra/http/routes/accounts.routes';
import usersRouter from '@modules/users/infra/http/routes/users.routes';
import positionsRouter from '@modules/users/infra/http/routes/positions.routes';
import departmentsRouter from '@modules/users/infra/http/routes/departments.routes';

import providerSessionsRouter from '@modules/provider_accounts/infra/http/routes/provider_sessions.routes';
import sessionsRouter from '@modules/users/infra/http/routes/sessions.routes';
import passwordRouter from '@modules/users/infra/http/routes/password.routes';
import profileRouter from '@modules/users/infra/http/routes/profile.routes';
import customRewardsRouter from '@modules/rewards/infra/http/routes/custom_rewards.routes';
import giftCardsRouter from '@modules/rewards/infra/http/routes/gift_cards.routes';
import rewardsRequestsRouter from '@modules/rewards/infra/http/routes/custom_reward_requests.routes';
import remainingPointsToSendRouter from '@modules/recognition_posts/infra/http/routes/remaining_points_to_send.routes';
import recognitionPostsRouter from '@modules/recognition_posts/infra/http/routes/recognition_posts.routes';
import recognitionRankingRouter from '@modules/recognition_posts/infra/http/routes/recognition_ranking.routes';

const routes = Router();

routes.use('/provider/accounts', providerAccountsRouter);
routes.use('/provider/sessions', providerSessionsRouter);
routes.use('/accounts', accountsRouter);
routes.use('/positions', positionsRouter);
routes.use('/departments', departmentsRouter);
routes.use('/users', usersRouter);
routes.use('/profile', profileRouter);
routes.use('/password', passwordRouter);
routes.use('/sessions', sessionsRouter);

routes.use('/gift-cards', giftCardsRouter);
routes.use('/custom-rewards', customRewardsRouter);
routes.use('/custom-reward-requests', rewardsRequestsRouter);
routes.use('/remaining-points', remainingPointsToSendRouter);
routes.use('/recognition-posts', recognitionPostsRouter);
routes.use('/recognition-ranking', recognitionRankingRouter);

export default routes;
