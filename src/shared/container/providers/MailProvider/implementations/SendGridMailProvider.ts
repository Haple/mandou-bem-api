import sgMail, { MailService } from '@sendgrid/mail';

import { inject, injectable } from 'tsyringe';

import IMailTemplateProvider from '@shared/container/providers/MailTemplateProvider/models/IMailTemplateProvider';
import IMailProvider from '../models/IMailProvider';
import ISendMailDTO from '../dtos/ISendMailDTO';

@injectable()
export default class SendGridMailProvider implements IMailProvider {
  private client: MailService;

  constructor(
    @inject('MailTemplateProvider')
    private mailTemplateProvider: IMailTemplateProvider,
  ) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');
    this.client = sgMail;
  }

  public async sendMail({
    to,
    from,
    subject,
    templateData,
  }: ISendMailDTO): Promise<void> {
    console.log('Sending e-mail with SendGrid');

    try {
      const [message] = await this.client.send({
        from: {
          name: from?.name || 'Equipe MandouBem',
          email: from?.email || 'mandoubem2020@gmail.com',
        },
        to: {
          name: to.name,
          email: to.email,
        },
        subject,
        html: await this.mailTemplateProvider.parse(templateData),
      });

      console.log(
        'E-mail sent with SendGrid. Status code: %s',
        message.statusCode,
      );
    } catch (error) {
      console.log(
        `Error sending e-mail with SendGrid: ${JSON.stringify(error)}`,
      );
    }
  }
}
