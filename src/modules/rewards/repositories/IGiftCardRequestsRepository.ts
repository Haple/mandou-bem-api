import GiftCardRequest from '../infra/typeorm/entities/GiftCardRequest';
import ICreateGiftCardRequestDTO from '../dtos/ICreateGiftCardRequestDTO';
import IPaginationDTO from '../dtos/IPaginationDTO';

export default interface IGiftCardRequestsRepository {
  findByAccountAndDatePaginated(
    account_id: string,
    startDate: Date,
    endDate: Date,
    page: number,
    size: number,
    department_id?: string,
    position_id?: string,
  ): Promise<IPaginationDTO<GiftCardRequest>>;
  findByAccountAndDate(
    account_id: string,
    startDate: Date,
    endDate: Date,
    department_id?: string,
    position_id?: string,
  ): Promise<GiftCardRequest[]>;
  findById(id: string): Promise<GiftCardRequest | undefined>;
  create(data: ICreateGiftCardRequestDTO): Promise<GiftCardRequest>;
  save(gift_card_request: GiftCardRequest): Promise<GiftCardRequest>;
}
