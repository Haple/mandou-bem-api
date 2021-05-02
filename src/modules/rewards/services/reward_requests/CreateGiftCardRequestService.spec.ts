import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeQRCodeProvider from '@shared/container/providers/QRCodeProvider/fakes/FakeQRCodeProvider';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import { addDays } from 'date-fns';
import FakeGiftCardsRepository from '../../repositories/fakes/FakeGiftCardsRepository';
import FakeGiftCardRequestsRepository from '../../repositories/fakes/FakeGiftCardRequestsRepository';
import CreateGiftCardRequestService from './CreateGiftCardRequestService';

let fakeGiftCardsRepository: FakeGiftCardsRepository;
let fakeGiftCardRequestsRepository: FakeGiftCardRequestsRepository;
let fakeUsersRepository: FakeUsersRepository;
let fakeQRCodeProvider: FakeQRCodeProvider;
let fakeMailProvider: FakeMailProvider;
let creatGiftCardRequest: CreateGiftCardRequestService;

describe('CreateGiftCardRequest', () => {
  beforeEach(() => {
    fakeGiftCardsRepository = new FakeGiftCardsRepository();
    fakeGiftCardRequestsRepository = new FakeGiftCardRequestsRepository();
    fakeQRCodeProvider = new FakeQRCodeProvider();
    fakeMailProvider = new FakeMailProvider();
    fakeUsersRepository = new FakeUsersRepository();

    creatGiftCardRequest = new CreateGiftCardRequestService(
      fakeGiftCardRequestsRepository,
      fakeGiftCardsRepository,
      fakeUsersRepository,
      fakeQRCodeProvider,
      fakeMailProvider,
    );
  });

  it('should be able to create a new gift card request', async () => {
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

    const user = await fakeUsersRepository.create({
      account_id: 'fake-account-1',
      name: 'John Doe',
      email: 'johndoe@corp.com',
      password: '1234',
      position_id: 'fake-position-id',
      department_id: 'fake-department-id',
    });
    user.recognition_points = 200;
    await fakeUsersRepository.save(user);

    const gift_card = await fakeGiftCardsRepository.create({
      provider_id: 'fake-provider-1',
      title: 'Netflix',
      image_url: 'https://google.com',
      points: 50,
      units_available: 10,
      expiration_days: 100,
      description: 'fake description',
    });

    const gift_card_request = await creatGiftCardRequest.execute({
      account_id: 'fake-account-1',
      user_id: user.id,
      gift_card_id: gift_card.id,
    });

    const updated_user = await fakeUsersRepository.findById(user.id);
    const updated_gift_card = await fakeGiftCardsRepository.findById(
      gift_card.id,
    );

    expect(gift_card_request).toHaveProperty('id');
    expect(gift_card_request.expire_at.toDateString()).toBe(
      addDays(new Date(), 100).toDateString(),
    );
    expect(updated_user?.recognition_points).toBe(150);
    expect(updated_gift_card?.units_available).toBe(9);
    expect(sendMail).toBeCalled();
  });

  it('should not be able to request gift card with insufficient recognition points', async () => {
    const user = await fakeUsersRepository.create({
      account_id: 'fake-account-1',
      name: 'John Doe',
      email: 'johndoe@corp.com',
      password: '1234',
      position_id: 'fake-position-id',
      department_id: 'fake-department-id',
    });
    user.recognition_points = 10;
    await fakeUsersRepository.save(user);

    const gift_card = await fakeGiftCardsRepository.create({
      provider_id: 'fake-provider-1',
      title: 'Netflix',
      image_url: 'https://google.com',
      points: 50,
      units_available: 10,
      expiration_days: 100,
      description: 'fake description',
    });

    await expect(
      creatGiftCardRequest.execute({
        account_id: 'fake-account-1',
        user_id: user.id,
        gift_card_id: gift_card.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to request gift card with no units available', async () => {
    const user = await fakeUsersRepository.create({
      account_id: 'fake-account-1',
      name: 'John Doe',
      email: 'johndoe@corp.com',
      password: '1234',
      position_id: 'fake-position-id',
      department_id: 'fake-department-id',
    });
    user.recognition_points = 10;
    await fakeUsersRepository.save(user);

    const gift_card = await fakeGiftCardsRepository.create({
      provider_id: 'fake-provider-1',
      title: 'Netflix',
      image_url: 'https://google.com',
      points: 50,
      units_available: 0,
      expiration_days: 100,
      description: 'fake description',
    });

    await expect(
      creatGiftCardRequest.execute({
        account_id: 'fake-account-1',
        user_id: user.id,
        gift_card_id: gift_card.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to request gift card with not found gift card id', async () => {
    const user = await fakeUsersRepository.create({
      account_id: 'fake-account-1',
      name: 'John Doe',
      email: 'johndoe@corp.com',
      password: '1234',
      position_id: 'fake-position-id',
      department_id: 'fake-department-id',
    });
    user.recognition_points = 200;
    await fakeUsersRepository.save(user);

    await expect(
      creatGiftCardRequest.execute({
        account_id: 'fake-account-1',
        user_id: user.id,
        gift_card_id: 'not-found-gift-card-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to request gift card with not found user id', async () => {
    await expect(
      creatGiftCardRequest.execute({
        account_id: 'fake-account-1',
        user_id: 'not-found-user-id',
        gift_card_id: 'not-found-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
