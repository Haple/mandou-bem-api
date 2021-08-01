import { injectable, inject } from 'tsyringe';

import path from 'path';
import IPDFProvider from '@shared/container/providers/PDFProvider/models/IPDFProvider';
import { format } from 'date-fns';
import IGiftCardRequestsRepository from '../../repositories/IGiftCardRequestsRepository';
import ICustomRewardRequestsRepository from '../../repositories/ICustomRewardRequestsRepository';

interface IRequest {
  reward_type: 'gift_card' | 'custom_reward';
  account_id: string;
  start_date: Date;
  end_date: Date;
  department_id?: string;
  position_id?: string;
}

interface IResponse {
  id: string;
  created_at: string;
  user_name: string;
  reward_title: string;
  status: string;
  position_name: string;
  department_name: string;
  position_id: string;
  department_id: string;
  provider_name?: string;
}

const status_format = {
  pending_approval: 'Pendente de aprovação',
  use_available: 'Disponível para utilização',
  used: 'Utilizado',
  reproved: 'Recusado',
};

@injectable()
class RewardRequestsToPDFService {
  constructor(
    @inject('GiftCardRequestsRepository')
    private giftCardRequestsRepository: IGiftCardRequestsRepository,
    @inject('CustomRewardRequestsRepository')
    private customRewardRequestsRepository: ICustomRewardRequestsRepository,
    @inject('PDFProvider')
    private pdfProvider: IPDFProvider,
  ) {}

  public async execute({
    reward_type,
    account_id,
    start_date,
    end_date,
    department_id,
    position_id,
  }: IRequest): Promise<Buffer> {
    if (reward_type === 'gift_card') {
      const gift_card_requests = await this.getGiftCardRequests({
        account_id,
        start_date,
        end_date,
        department_id,
        position_id,
      });

      const gift_card_template = path.resolve(
        __dirname,
        '..',
        '..',
        'views',
        'gift_card_requests_pdf.hbs',
      );

      return this.pdfProvider.generatePDF({
        templateData: {
          file: gift_card_template,
          variables: {
            gift_card_requests,
          },
        },
      });
    }

    const custom_reward_requests = await this.getCustomRewardsRequests({
      account_id,
      start_date,
      end_date,
      department_id,
      position_id,
    });

    const custom_reward_template = path.resolve(
      __dirname,
      '..',
      '..',
      'views',
      'custom_reward_requests_pdf.hbs',
    );

    return this.pdfProvider.generatePDF({
      templateData: {
        file: custom_reward_template,
        variables: {
          custom_reward_requests,
        },
      },
    });
  }

  private async getGiftCardRequests({
    account_id,
    start_date,
    end_date,
    department_id,
    position_id,
  }: Omit<IRequest, 'reward_type'>): Promise<IResponse[]> {
    const result = await this.giftCardRequestsRepository.findByAccountAndDate(
      account_id,
      start_date,
      end_date,

      department_id,
      position_id,
    );

    return result.map(
      r =>
        ({
          id: r.id,
          created_at: format(r.created_at, 'dd/MM/yyyy'),
          user_name: r.user.name,
          reward_title: r.gift_card.title,
          status: status_format[r.status],
          department_id: r.user.department.id,
          department_name: r.user.department.department_name,
          position_id: r.user.position.id,
          position_name: r.user.position.position_name,
          provider_name: r.gift_card.provider.company_name,
        } as IResponse),
    );
  }

  private async getCustomRewardsRequests({
    account_id,
    start_date,
    end_date,

    department_id,
    position_id,
  }: Omit<IRequest, 'reward_type'>): Promise<IResponse[]> {
    const result = await this.customRewardRequestsRepository.findByAccountAndDate(
      account_id,
      start_date,
      end_date,
      department_id,
      position_id,
    );

    return result.map(
      r =>
        ({
          id: r.id,
          created_at: format(r.created_at, 'dd/MM/yyyy'),
          user_name: r.user.name,
          reward_title: r.custom_reward.title,
          status: status_format[r.status],
          department_id: r.user.department.id,
          department_name: r.user.department.department_name,
          position_id: r.user.position.id,
          position_name: r.user.position.position_name,
        } as IResponse),
    );
  }
}

export default RewardRequestsToPDFService;
