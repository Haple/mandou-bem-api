import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IGiftCardsRepository from '@modules/rewards/repositories/IGiftCardsRepository';
import IGiftCardRequestsRepository from '@modules/rewards/repositories/IGiftCardRequestsRepository';
import { addDays, format } from 'date-fns';
import path from 'path';

import IQRCodeProvider from '@shared/container/providers/QRCodeProvider/models/IQRCodeProvider';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import IAccountGiftCardsRepository from '@modules/rewards/repositories/IAccountGiftCardsRepository';

interface IRequest {
  gift_card_id: string;
  user_id: string;
  account_id: string;
}

interface IResponse {
  id: string;
  expire_at: Date;
  qr_code: string;
}

@injectable()
class CreateGiftCardRequestService {
  constructor(
    @inject('AccountGiftCardsRepository')
    private accountGiftCardsRepository: IAccountGiftCardsRepository,
    @inject('GiftCardRequestsRepository')
    private giftCardRequestsRepository: IGiftCardRequestsRepository,
    @inject('GiftCardsRepository')
    private giftCardsRepository: IGiftCardsRepository,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('QRCodeProvider')
    private qrCodeProvider: IQRCodeProvider,
    @inject('MailProvider')
    private mailProvider: IMailProvider,
  ) {}

  public async execute({
    gift_card_id,
    user_id,
    account_id,
  }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findById(user_id);

    if (!user || user.account_id !== account_id) {
      throw new AppError('User not found.');
    }

    const gift_card = await this.giftCardsRepository.findById(gift_card_id);

    if (!gift_card) {
      throw new AppError('Gift card not found.');
    }

    const gift_card_enabled = await this.accountGiftCardsRepository.findById(
      account_id,
      gift_card.id,
    );

    if (!gift_card_enabled) {
      throw new AppError('Gift card is not enabled.');
    }

    if (user.recognition_points < gift_card.points) {
      throw new AppError('Insufficient recognition points.');
    }

    if (gift_card.units_available <= 0) {
      throw new AppError('No units available.');
    }

    const gift_card_request = await this.giftCardRequestsRepository.create({
      user_id,
      gift_card_id,
      status: 'use_available',
      expire_at: addDays(new Date(), gift_card.expiration_days),
    });

    user.recognition_points -= gift_card.points;
    this.usersRepository.save(user);

    gift_card.units_available -= 1;
    this.giftCardsRepository.save(gift_card);

    const { qr_code } = await this.qrCodeProvider.generateQRCode(
      gift_card_request.id,
    );

    const giftCardRequestTemplate = path.resolve(
      __dirname,
      '..',
      '..',
      'views',
      'gift_card_request.hbs',
    );

    await this.mailProvider.sendMail({
      to: {
        name: user.name,
        email: user.email,
      },
      subject: '[MandouBem] Resgate de Vale-Presente',
      templateData: {
        file: giftCardRequestTemplate,
        variables: {
          name: user.name,
          title: gift_card.title,
          company_name: gift_card.provider.name,
          description: gift_card.description,
          expire_at: format(gift_card_request.expire_at, 'dd/MM/yyyy'),
          id: gift_card_request.id,
          qr_code,
        },
      },
    });

    return {
      id: gift_card_request.id,
      expire_at: gift_card_request.expire_at,
      qr_code,
    };
  }
}

export default CreateGiftCardRequestService;
