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
import CatalogRewardRepository from '@modules/rewards/infra/typeorm/repositories/CatalogRewardsRepository';

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
  'CatalogRewardRepository',
  CatalogRewardRepository,
);
