import RewardRequest from '../infra/typeorm/entities/RewardRequest';
import ICreateRewardRequestDTO from '../dtos/ICreateRewardRequestDTO';

export default interface IRewardRequestsRepository {
  findAllFromAccount(account_id: string): Promise<RewardRequest[]>;
  findById(id: string): Promise<RewardRequest | undefined>;
  create(data: ICreateRewardRequestDTO): Promise<RewardRequest>;
  save(reward_request: RewardRequest): Promise<RewardRequest>;
}
