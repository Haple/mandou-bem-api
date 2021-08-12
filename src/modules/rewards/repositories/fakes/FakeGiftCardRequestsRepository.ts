import { uuid } from 'uuidv4';

import ICreateGiftCardRequestDTO from '@modules/rewards/dtos/ICreateGiftCardRequestDTO';
import IPaginationDTO from '@modules/rewards/dtos/IPaginationDTO';
import { isAfter, isBefore } from 'date-fns';
import GiftCardRequest from '../../infra/typeorm/entities/GiftCardRequest';
import IGiftCardRequestsRepository from '../IGiftCardRequestsRepository';

class FakeGiftCardRequestsRepository implements IGiftCardRequestsRepository {
  private gift_card_requests: GiftCardRequest[] = [];

  public async findByUserAndDatePaginated(
    user_id: string,
    startDate: Date,
    endDate: Date,
    page: number,
    size: number,
  ): Promise<IPaginationDTO<GiftCardRequest>> {
    const indexMin = page * size;
    const indexMax = indexMin + size;
    const custom_reward_requests = this.gift_card_requests.filter(
      (crr, index) =>
        index >= indexMin &&
        index < indexMax &&
        crr.user_id === user_id &&
        isAfter(crr.created_at, startDate) &&
        isBefore(crr.created_at, endDate),
    );
    return {
      total: custom_reward_requests.length,
      result: custom_reward_requests,
    };
  }

  public async findByAccountAndDatePaginated(
    account_id: string,
    startDate: Date,
    endDate: Date,
    page: number,
    size: number,
    department_id?: string,
    position_id?: string,
  ): Promise<IPaginationDTO<GiftCardRequest>> {
    const indexMin = page * size;
    const indexMax = indexMin + size;
    const custom_reward_requests = this.gift_card_requests.filter(
      (crr, index) =>
        index >= indexMin &&
        index < indexMax &&
        crr.user.account_id === account_id &&
        isAfter(crr.created_at, startDate) &&
        isBefore(crr.created_at, endDate) &&
        (department_id ? crr.user.department_id === department_id : true) &&
        (position_id ? crr.user.position_id === position_id : true),
    );
    return {
      total: custom_reward_requests.length,
      result: custom_reward_requests,
    };
  }

  public async findByAccountAndDate(
    account_id: string,
    startDate: Date,
    endDate: Date,
    department_id?: string,
    position_id?: string,
  ): Promise<GiftCardRequest[]> {
    const custom_reward_requests = this.gift_card_requests.filter(
      crr =>
        crr.user.account_id === account_id &&
        isAfter(crr.created_at, startDate) &&
        isBefore(crr.created_at, endDate) &&
        (department_id ? crr.user.department_id === department_id : true) &&
        (position_id ? crr.user.position_id === position_id : true),
    );
    return custom_reward_requests;
  }

  public async findById(id: string): Promise<GiftCardRequest | undefined> {
    const gift_card_request = this.gift_card_requests.find(g => g.id === id);

    return gift_card_request;
  }

  public async create(
    gift_card_request_data: ICreateGiftCardRequestDTO,
  ): Promise<GiftCardRequest> {
    const gift_card_request = new GiftCardRequest();

    Object.assign(gift_card_request, { id: uuid() }, gift_card_request_data);

    this.gift_card_requests.push(gift_card_request);

    return gift_card_request;
  }

  public async save(
    gift_card_request: GiftCardRequest,
  ): Promise<GiftCardRequest> {
    const find_index = this.gift_card_requests.findIndex(
      find_gift_card_request =>
        find_gift_card_request.id === gift_card_request.id,
    );

    if (find_index === -1) {
      this.gift_card_requests.push(gift_card_request);
      return gift_card_request;
    }

    this.gift_card_requests[find_index] = gift_card_request;

    return gift_card_request;
  }
}

export default FakeGiftCardRequestsRepository;
