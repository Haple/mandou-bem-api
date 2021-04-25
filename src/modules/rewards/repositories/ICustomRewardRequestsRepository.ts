import CustomRewardRequest from '../infra/typeorm/entities/CustomRewardRequest';
import ICreateCustomRewardRequestDTO from '../dtos/ICreateCustomRewardRequestDTO';

export default interface ICustomRewardRequestsRepository {
  findAllFromAccount(account_id: string): Promise<CustomRewardRequest[]>;
  findById(id: string): Promise<CustomRewardRequest | undefined>;
  create(data: ICreateCustomRewardRequestDTO): Promise<CustomRewardRequest>;
  save(
    custom_reward_request: CustomRewardRequest,
  ): Promise<CustomRewardRequest>;
}
