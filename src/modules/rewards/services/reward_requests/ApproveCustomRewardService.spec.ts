import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import FakeQRCodeProvider from '@shared/container/providers/QRCodeProvider/fakes/FakeQRCodeProvider';
import AppError from '@shared/errors/AppError';

import { addDays } from 'date-fns';
import FakeCustomRewardsRequestsRepository from '../../repositories/fakes/FakeCustomRewardsRequestsRepository';
import ApproveCustomRewardService from './ApproveCustomRewardService';

let fakeRewardsRequestsRepository: FakeCustomRewardsRequestsRepository;
let fakeQRCodeProvider: FakeQRCodeProvider;
let fakeMailProvider: FakeMailProvider;
let approveCustomReward: ApproveCustomRewardService;

describe('ApproveCustomReward', () => {
  beforeEach(() => {
    fakeRewardsRequestsRepository = new FakeCustomRewardsRequestsRepository();
    fakeQRCodeProvider = new FakeQRCodeProvider();
    fakeMailProvider = new FakeMailProvider();

    approveCustomReward = new ApproveCustomRewardService(
      fakeRewardsRequestsRepository,
      fakeQRCodeProvider,
      fakeMailProvider,
    );
  });

  it('should be able to approve a custom reward', async () => {
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

    const reward_request = await fakeRewardsRequestsRepository.create({
      custom_reward_id: 'fake-custom-reward-id',
      account_id: 'fake-account-id',
      user_id: 'fake-user-id',
      status: 'pending_approval',
    });
    Object.assign(reward_request, {
      user: {
        id: 'fake-user-id',
        name: 'fake-name',
        email: 'fake@email.example',
      },
      account: {
        name: 'Fake Labs',
      },
      custom_reward: {
        id: 'fake-custom-reward-id',
        title: '14 Days Vacation',
        expiration_days: 7,
        description: 'fake description',

        units_available: 10,
        points: 50,
      },
    });

    const reward_request_updated = await approveCustomReward.execute({
      account_id: reward_request.account_id,
      custom_reward_request_id: reward_request.id,
    });

    expect(reward_request_updated).toHaveProperty('id');
    expect(reward_request_updated.status).toBe('use_available');
    expect(reward_request_updated.expire_at.toDateString()).toBe(
      addDays(new Date(), 7).toDateString(),
    );
    expect(sendMail).toBeCalled();
  });

  it('should not be able to approve a custom reward from another account', async () => {
    const reward_request = await fakeRewardsRequestsRepository.create({
      custom_reward_id: 'fake-custom-reward-id',
      account_id: 'fake-account-id',
      user_id: 'fake-user-id',
      status: 'pending_approval',
    });

    await expect(
      approveCustomReward.execute({
        account_id: 'another-fake-account-id',
        custom_reward_request_id: reward_request.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to approve a reward already approved', async () => {
    const reward_request = await fakeRewardsRequestsRepository.create({
      custom_reward_id: 'fake-custom-reward-id',
      account_id: 'fake-account-id',
      user_id: 'fake-user-id',
      status: 'use_available',
    });

    await expect(
      approveCustomReward.execute({
        account_id: reward_request.account_id,
        custom_reward_request_id: reward_request.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
