import { container } from 'tsyringe';

import './providers';

import IProviderAccountsRepository from '@modules/provider_accounts/repositories/IProviderAccountsRepository';
import ProviderAccountsRepository from '@modules/provider_accounts/infra/typeorm/repositories/ProviderAccountsRepository';

import IAccountsRepository from '@modules/users/repositories/IAccountsRepository';
import AccountsRepository from '@modules/users/infra/typeorm/repositories/AccountsRepository';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';

import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';
import UserTokensRepository from '@modules/users/infra/typeorm/repositories/UserTokensRepository';

import ICustomRewardsRepository from '@modules/rewards/repositories/ICustomRewardsRepository';
import CustomRewardsRepository from '@modules/rewards/infra/typeorm/repositories/CustomRewardsRepository';

import CustomRewardRequestsRepository from '@modules/rewards/infra/typeorm/repositories/CustomRewardRequestsRepository';
import ICustomRewardRequestsRepository from '@modules/rewards/repositories/ICustomRewardRequestsRepository';

import IRecognitionPostsRepository from '@modules/recognition_posts/repositories/IRecognitionPostsRepository';
import RecognitionPostsRepository from '@modules/recognition_posts/infra/typeorm/repositories/RecognitionPostsRepository';

import IPositionsRepository from '@modules/users/repositories/IPositionsRepository';
import PositionsRepository from '@modules/users/infra/typeorm/repositories/PositionsRepository';

import IDepartmentsRepository from '@modules/users/repositories/IDepartmentsRepository';
import DepartmentsRepository from '@modules/users/infra/typeorm/repositories/DepartmentsRepository';

import IEnpsSurveysRepository from '@modules/enps/repositories/IEnpsSurveysRepository';
import EnpsSurveysRepository from '@modules/enps/infra/typeorm/repositories/EnpsSurveysRepository';

import RemainingPointsToSendService from '@modules/recognition_posts/services/RemainingPointsToSendService';

import IGiftCardsRepository from '@modules/rewards/repositories/IGiftCardsRepository';
import GiftCardsRepository from '@modules/rewards/infra/typeorm/repositories/GiftCardsRepository';
import IGiftCardRequestsRepository from '@modules/rewards/repositories/IGiftCardRequestsRepository';
import GiftCardRequestsRepository from '@modules/rewards/infra/typeorm/repositories/GiftCardRequestsRepository';

container.registerSingleton<IProviderAccountsRepository>(
  'ProviderAccountsRepository',
  ProviderAccountsRepository,
);

container.registerSingleton<IAccountsRepository>(
  'AccountsRepository',
  AccountsRepository,
);

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository,
);

container.registerSingleton<IUserTokensRepository>(
  'UserTokensRepository',
  UserTokensRepository,
);

container.registerSingleton<ICustomRewardsRepository>(
  'CustomRewardsRepository',
  CustomRewardsRepository,
);

container.registerSingleton<ICustomRewardRequestsRepository>(
  'CustomRewardRequestsRepository',
  CustomRewardRequestsRepository,
);

container.registerSingleton<IRecognitionPostsRepository>(
  'RecognitionPostsRepository',
  RecognitionPostsRepository,
);

container.registerSingleton<IPositionsRepository>(
  'PositionsRepository',
  PositionsRepository,
);

container.registerSingleton<IDepartmentsRepository>(
  'DepartmentsRepository',
  DepartmentsRepository,
);

container.registerSingleton<IGiftCardsRepository>(
  'GiftCardsRepository',
  GiftCardsRepository,
);

container.registerSingleton<IGiftCardRequestsRepository>(
  'GiftCardRequestsRepository',
  GiftCardRequestsRepository,
);

container.registerSingleton<RemainingPointsToSendService>(
  'RemainingPointsToSendService',
  RemainingPointsToSendService,
);

container.registerSingleton<IEnpsSurveysRepository>(
  'EnpsSurveysRepository',
  EnpsSurveysRepository,
);
