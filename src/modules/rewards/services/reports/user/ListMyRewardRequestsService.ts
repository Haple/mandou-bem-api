import { injectable, inject } from 'tsyringe';

import IPaginationDTO from '@modules/enps/dtos/IPaginationDTO';
import IQRCodeProvider from '@shared/container/providers/QRCodeProvider/models/IQRCodeProvider';
import IGiftCardRequestsRepository from '../../../repositories/IGiftCardRequestsRepository';
import ICustomRewardRequestsRepository from '../../../repositories/ICustomRewardRequestsRepository';

interface IRequest {
  reward_type: 'gift_card' | 'custom_reward';
  user_id: string;
  start_date: Date;
  end_date: Date;
  page: number;
  size: number;
  status?: string;
}

interface IResponse {
  id: string;
  reward_title: string;
  provider_name: string;
  points: number;
  reward_type: 'gift_card' | 'custom_reward';
  status: string;
  created_at: Date;
  updated_at: Date;
  expire_at: Date;
  description: string;
  image_url: string;
  qr_code: string;
  reprove_reason?: string;
}

@injectable()
class ListMyRewardRequestsService {
  constructor(
    @inject('QRCodeProvider')
    private qrCodeProvider: IQRCodeProvider,
    @inject('GiftCardRequestsRepository')
    private giftCardRequestsRepository: IGiftCardRequestsRepository,
    @inject('CustomRewardRequestsRepository')
    private customRewardRequestsRepository: ICustomRewardRequestsRepository,
  ) {}

  public async execute({
    reward_type,
    user_id,
    start_date,
    end_date,
    page,
    size,
    status,
  }: IRequest): Promise<IPaginationDTO<IResponse>> {
    if (reward_type === 'gift_card') {
      return this.getGiftCardRequests({
        user_id,
        start_date,
        end_date,
        page,
        size,
        status,
      });
    }

    return this.getCustomRewardsRequests({
      user_id,
      start_date,
      end_date,
      page,
      size,
      status,
    });
  }

  private async getGiftCardRequests({
    user_id,
    start_date,
    end_date,
    page,
    size,
    status,
  }: Omit<IRequest, 'reward_type'>): Promise<IPaginationDTO<IResponse>> {
    const {
      result,
      total,
    } = await this.giftCardRequestsRepository.findByUserAndDatePaginated(
      user_id,
      start_date,
      end_date,
      page,
      size,
      status,
    );

    const gift_card_requests = await Promise.all(
      result.map(
        async r =>
          ({
            id: r.id,
            reward_title: r.gift_card.title,
            provider_name: r.gift_card.provider.company_name,
            points: r.gift_card.points,
            reward_type: 'gift_card',
            status: r.status,
            created_at: r.created_at,
            updated_at: r.updated_at,
            expire_at: r.expire_at,
            description: r.gift_card.description,
            image_url: r.gift_card.image_url,
            qr_code: (await this.qrCodeProvider.generateQRCode(r.id)).qr_code,
          } as IResponse),
      ),
    );

    return {
      result: gift_card_requests,
      total,
    };
  }

  private async getCustomRewardsRequests({
    user_id,
    start_date,
    end_date,
    page,
    size,
    status,
  }: Omit<IRequest, 'reward_type'>): Promise<IPaginationDTO<IResponse>> {
    const {
      result,
      total,
    } = await this.customRewardRequestsRepository.findByUserAndDatePaginated(
      user_id,
      start_date,
      end_date,
      page,
      size,
      status,
    );

    const custom_reward_requests = await Promise.all(
      result.map(
        async r =>
          ({
            id: r.id,
            reward_title: r.custom_reward.title,
            provider_name: '(sua empresa)',
            points: r.custom_reward.points,
            reward_type: 'custom_reward',
            status: r.status,
            created_at: r.created_at,
            updated_at: r.updated_at,
            expire_at: r.expire_at,
            image_url: r.custom_reward.image_url,
            qr_code: (await this.qrCodeProvider.generateQRCode(r.id)).qr_code,
            description: r.custom_reward.description,
            reprove_reason: r.reprove_reason,
          } as IResponse),
      ),
    );

    return {
      result: custom_reward_requests,
      total,
    };
  }
}

export default ListMyRewardRequestsService;
