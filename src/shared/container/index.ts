import { container } from 'tsyringe';

import '@modules/users/providers';
import './providers';

import IAccountsRepository from '@modules/users/repositories/IAccountsRepository';
import AccountsRepository from '@modules/users/infra/typeorm/repositories/AccountsRepository';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';

import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';
import UserTokensRepository from '@modules/users/infra/typeorm/repositories/UserTokensRepository';

import ICatalogRewardsRepository from '@modules/rewards/repositories/ICatalogRewardsRepository';
import CatalogRewardsRepository from '@modules/rewards/infra/typeorm/repositories/CatalogRewardsRepository';

import RewardRequestsRepository from '@modules/rewards/infra/typeorm/repositories/RewardRequestsRepository';
import IRewardRequestsRepository from '@modules/rewards/repositories/IRewardRequestsRepository';

import IRecognitionPostsRepository from '@modules/recognition_posts/repositories/IRecognitionPostsRepository';
import RecognitionPostsRepository from '@modules/recognition_posts/infra/typeorm/repositories/RecognitionPostsRepository';

import IPositionsRepository from '@modules/users/repositories/IPositionsRepository';
import PositionsRepository from '@modules/users/infra/typeorm/repositories/PositionsRepository';

import IDepartmentsRepository from '@modules/users/repositories/IDepartmentsRepository';
import DepartmentsRepository from '@modules/users/infra/typeorm/repositories/DepartmentsRepository';

import RemainingPointsToSendService from '@modules/recognition_posts/services/RemainingPointsToSendService';

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

container.registerSingleton<ICatalogRewardsRepository>(
  'CatalogRewardsRepository',
  CatalogRewardsRepository,
);

container.registerSingleton<IRewardRequestsRepository>(
  'RewardRequestsRepository',
  RewardRequestsRepository,
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

container.registerSingleton<RemainingPointsToSendService>(
  'RemainingPointsToSendService',
  RemainingPointsToSendService,
);
