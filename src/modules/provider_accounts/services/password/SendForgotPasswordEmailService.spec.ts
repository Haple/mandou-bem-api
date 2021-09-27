import AppError from '@shared/errors/AppError';

import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import FakeProviderAccountsRepository from '../../repositories/fakes/FakeProviderAccountsRepository';
import FakeProviderTokensRepository from '../../repositories/fakes/FakeProviderTokensRepository';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';

let fakeProviderAccountsRepository: FakeProviderAccountsRepository;
let fakeMailProvider: FakeMailProvider;
let fakeProviderTokensRepository: FakeProviderTokensRepository;
let sendForgotPasswordEmail: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmail', () => {
  beforeEach(() => {
    fakeProviderAccountsRepository = new FakeProviderAccountsRepository();
    fakeMailProvider = new FakeMailProvider();
    fakeProviderTokensRepository = new FakeProviderTokensRepository();

    sendForgotPasswordEmail = new SendForgotPasswordEmailService(
      fakeProviderAccountsRepository,
      fakeMailProvider,
      fakeProviderTokensRepository,
    );
  });

  it('should be able to recover the password using the email', async () => {
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

    await fakeProviderAccountsRepository.create({
      company_name: 'Aleph Labs',
      cnpj: '00.000.000/0000-00',
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    await sendForgotPasswordEmail.execute({
      email: 'johndoe@example.com',
    });

    expect(sendMail).toHaveBeenCalled();
  });

  it('should not be able to recover a non-existing user passowrd', async () => {
    await expect(
      sendForgotPasswordEmail.execute({
        email: 'johndoe@example.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should generate a forgot password token', async () => {
    const generateToken = jest.spyOn(fakeProviderTokensRepository, 'generate');

    const provider = await fakeProviderAccountsRepository.create({
      company_name: 'Aleph Labs',
      cnpj: '00.000.000/0000-00',
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    await sendForgotPasswordEmail.execute({
      email: 'johndoe@example.com',
    });

    expect(generateToken).toHaveBeenCalledWith(provider.id);
  });
});
