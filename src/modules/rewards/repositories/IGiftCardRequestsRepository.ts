import GiftCardRequest from '../infra/typeorm/entities/GiftCardRequest';
import ICreateGiftCardRequestDTO from '../dtos/ICreateGiftCardRequestDTO';
import IPaginationDTO from '../dtos/IPaginationDTO';
import ICountByWeekDTO from '../dtos/ICountByWeekDTO';
import ICountByGiftCardDTO from '../dtos/ICountByGiftCardDTO';

export default interface IGiftCardRequestsRepository {
  countWeeklyRequests(provider_id: string): Promise<ICountByWeekDTO[]>;
  countWeeklyValidations(provider_id: string): Promise<ICountByWeekDTO[]>;
  countLastGiftCardRequests(
    provider_id: string,
  ): Promise<ICountByGiftCardDTO[]>;
  findByProviderAndDatePaginated(
    provider_id: string,
    startDate: Date,
    endDate: Date,
    page: number,
    size: number,
    gift_card_id?: string,
    status?: string,
  ): Promise<IPaginationDTO<GiftCardRequest>>;
  findByProviderAndDate(
    provider_id: string,
    startDate: Date,
    endDate: Date,
    gift_card_id?: string,
    status?: string,
  ): Promise<GiftCardRequest[]>;

  findByAccountAndDatePaginated(
    account_id: string,
    startDate: Date,
    endDate: Date,
    page: number,
    size: number,
    department_id?: string,
    position_id?: string,
    provider_id?: string,
    status?: string,
  ): Promise<IPaginationDTO<GiftCardRequest>>;
  findByUserAndDatePaginated(
    user_id: string,
    startDate: Date,
    endDate: Date,
    page: number,
    size: number,
    status?: string,
  ): Promise<IPaginationDTO<GiftCardRequest>>;
  findByAccountAndDate(
    account_id: string,
    startDate: Date,
    endDate: Date,
    department_id?: string,
    position_id?: string,
    provider_id?: string,
    status?: string,
  ): Promise<GiftCardRequest[]>;
  findById(id: string): Promise<GiftCardRequest | undefined>;
  create(data: ICreateGiftCardRequestDTO): Promise<GiftCardRequest>;
  save(gift_card_request: GiftCardRequest): Promise<GiftCardRequest>;
}
