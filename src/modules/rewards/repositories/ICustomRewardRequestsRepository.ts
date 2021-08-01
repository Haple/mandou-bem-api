import CustomRewardRequest from '../infra/typeorm/entities/CustomRewardRequest';
import ICreateCustomRewardRequestDTO from '../dtos/ICreateCustomRewardRequestDTO';
import IPaginationDTO from '../dtos/IPaginationDTO';

export default interface ICustomRewardRequestsRepository {
  findByAccountAndDatePaginated(
    account_id: string,
    startDate: Date,
    endDate: Date,
    page: number,
    size: number,
    department_id?: string,
    position_id?: string,
  ): Promise<IPaginationDTO<CustomRewardRequest>>;
  findByAccountAndDate(
    account_id: string,
    startDate: Date,
    endDate: Date,
    department_id?: string,
    position_id?: string,
  ): Promise<CustomRewardRequest[]>;
  findAllFromAccount(account_id: string): Promise<CustomRewardRequest[]>;
  findById(id: string): Promise<CustomRewardRequest | undefined>;
  create(data: ICreateCustomRewardRequestDTO): Promise<CustomRewardRequest>;
  save(
    custom_reward_request: CustomRewardRequest,
  ): Promise<CustomRewardRequest>;
}
