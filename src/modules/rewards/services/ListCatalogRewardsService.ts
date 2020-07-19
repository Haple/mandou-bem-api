import { injectable, inject } from 'tsyringe';

import ICatalogRewardsRepository from '../repositories/ICatalogRewardsRepository';

import CatalogReward from '../infra/typeorm/entities/CatalogReward';

interface IRequest {
  account_id: string;
  username_like?: string;
  except_user_id: string;
}

@injectable()
class ListCatalogRewardsService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: ICatalogRewardsRepository,
  ) {}

  public async execute({
    account_id,
    username_like,
    except_user_id,
  }: IRequest): Promise<CatalogReward[]> {
    if (username_like) {
      return this.usersRepository.findUsersByUsername({
        account_id,
        except_user_id,
        username_like,
      });
    }
    return this.usersRepository.findAllUsers({
      account_id,
      except_user_id,
    });
  }
}

export default ListCatalogRewardsService;
