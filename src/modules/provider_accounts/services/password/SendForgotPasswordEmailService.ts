import { injectable, inject } from 'tsyringe';
import path from 'path';

import AppError from '@shared/errors/AppError';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import IProviderAccountsRepository from '../../repositories/IProviderAccountsRepository';
import IProviderTokensRepository from '../../repositories/IProviderTokensRepository';

interface IRequest {
  email: string;
}

@injectable()
class SendForgotPasswordEmailService {
  constructor(
    @inject('ProviderAccountsRepository')
    private providerAccountsRepository: IProviderAccountsRepository,

    @inject('MailProvider')
    private mailProvider: IMailProvider,

    @inject('ProviderTokensRepository')
    private providerTokensRepository: IProviderTokensRepository,
  ) {}

  public async execute({ email }: IRequest): Promise<void> {
    const provider = await this.providerAccountsRepository.findByEmail(email);

    if (!provider) {
      throw new AppError('Provider does not exists');
    }

    const { token } = await this.providerTokensRepository.generate(provider.id);

    const forgotPasswordTemplate = path.resolve(
      __dirname,
      '..',
      '..',
      'views',
      'forgot_password.hbs',
    );

    await this.mailProvider.sendMail({
      to: {
        name: provider.name,
        email: provider.email,
      },
      subject: '[MandouBem] Recuperação de senha',
      templateData: {
        file: forgotPasswordTemplate,
        variables: {
          name: provider.name,
          link: `${process.env.APP_PROVIDER_WEB_URL}/reset-password?token=${token}`,
        },
      },
    });
  }
}

export default SendForgotPasswordEmailService;
