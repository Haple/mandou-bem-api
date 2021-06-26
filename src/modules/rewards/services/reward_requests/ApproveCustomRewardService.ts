import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import CustomRewardRequest from '@modules/rewards/infra/typeorm/entities/CustomRewardRequest';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import path from 'path';
import { addDays, format } from 'date-fns';
import IQRCodeProvider from '@shared/container/providers/QRCodeProvider/models/IQRCodeProvider';
import ICustomRewardRequestsRepository from '../../repositories/ICustomRewardRequestsRepository';

interface IRequest {
  custom_reward_request_id: string;
  account_id: string;
}

@injectable()
class ApproveCustomRewardService {
  constructor(
    @inject('CustomRewardRequestsRepository')
    private customRewardRequestsRepository: ICustomRewardRequestsRepository,
    @inject('QRCodeProvider')
    private qrCodeProvider: IQRCodeProvider,
    @inject('MailProvider')
    private mailProvider: IMailProvider,
  ) {}

  public async execute({
    custom_reward_request_id,
    account_id,
  }: IRequest): Promise<CustomRewardRequest> {
    const custom_reward_request = await this.customRewardRequestsRepository.findById(
      custom_reward_request_id,
    );

    if (
      !custom_reward_request ||
      custom_reward_request.account_id !== account_id
    ) {
      throw new AppError('Custom reward request not found.');
    }

    if (custom_reward_request.status !== 'pending_approval') {
      throw new AppError('Unable to approve custom reward request.');
    }

    const reward_request_updated = await this.customRewardRequestsRepository.save(
      {
        ...custom_reward_request,
        status: 'use_available',
        expire_at: addDays(
          new Date(),
          custom_reward_request.custom_reward.expiration_days,
        ),
      },
    );

    const { qr_code } = await this.qrCodeProvider.generateQRCode(
      custom_reward_request.id,
    );

    const giftCardRequestTemplate = path.resolve(
      __dirname,
      '..',
      '..',
      'views',
      'custom_reward_approved.hbs',
    );

    await this.mailProvider.sendMail({
      to: {
        name: custom_reward_request.user.name,
        email: custom_reward_request.user.email,
      },
      subject: '[MandouBem] Resgate de Prêmio Customizado',
      templateData: {
        file: giftCardRequestTemplate,
        variables: {
          name: custom_reward_request.user.name,
          title: custom_reward_request.custom_reward.title,
          company_name: custom_reward_request.account.company_name,
          description: custom_reward_request.custom_reward.description,
          expire_at: format(reward_request_updated.expire_at, 'dd/MM/yyyy'),
          id: reward_request_updated.id,
          qr_code,
        },
      },
    });

    return reward_request_updated;
  }
}

export default ApproveCustomRewardService;
