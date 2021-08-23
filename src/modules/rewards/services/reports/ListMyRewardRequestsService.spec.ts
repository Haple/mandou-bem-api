import { uuid } from 'uuidv4';
import CustomRewardRequest from '@modules/rewards/infra/typeorm/entities/CustomRewardRequest';
import { addDays, subDays } from 'date-fns';
import GiftCardRequest from '@modules/rewards/infra/typeorm/entities/GiftCardRequest';
import FakeQRCodeProvider from '@shared/container/providers/QRCodeProvider/fakes/FakeQRCodeProvider';
import FakeGiftCardRequestsRepository from '../../repositories/fakes/FakeGiftCardRequestsRepository';
import FakeCustomRewardsRequestsRepository from '../../repositories/fakes/FakeCustomRewardsRequestsRepository';
import ListMyRewardRequestsService from './ListMyRewardRequestsService';

let fakeQRCodeProvider: FakeQRCodeProvider;
let fakeGiftCardRequestsRepository: FakeGiftCardRequestsRepository;
let fakeCustomRewardsRequestsRepository: FakeCustomRewardsRequestsRepository;
let listRewardRequests: ListMyRewardRequestsService;

const custom_reward_request = {
  id: uuid(),
  custom_reward_id: 'fake-custom-reward-id',
  account_id: 'fake-account-id',
  user_id: 'fake-user-id',
  status: 'pending_approval',
  created_at: new Date(),
  user: {
    name: 'Fake Name',
    department_id: 'fake-department-id',
    position_id: 'fake-position-id',
    department: {
      department_name: 'Fake Department',
    },
    position: {
      position_name: 'Fake Position',
    },
  },
  custom_reward: {
    title: 'Fake Custom Reward Title',
  },
} as CustomRewardRequest;

const gift_card_request = {
  id: uuid(),
  gift_card_id: 'fake-gift-card-id',
  user_id: 'fake-user-id',
  status: 'use_available',
  created_at: new Date(),
  user: {
    name: 'Fake Name',
    account_id: 'fake-account-id',
    department_id: 'fake-department-id',
    position_id: 'fake-position-id',
    department: {
      department_name: 'Fake Department',
    },
    position: {
      position_name: 'Fake Position',
    },
  },
  gift_card: {
    title: 'Fake Gift Card Title',
    provider: {
      name: 'Fake Provider Name',
    },
  },
  expire_at: addDays(new Date(), 365),
  updated_at: new Date(),
} as GiftCardRequest;

describe('ListMyRewardRequests', () => {
  beforeEach(() => {
    fakeQRCodeProvider = new FakeQRCodeProvider();
    fakeGiftCardRequestsRepository = new FakeGiftCardRequestsRepository();
    fakeCustomRewardsRequestsRepository = new FakeCustomRewardsRequestsRepository();

    listRewardRequests = new ListMyRewardRequestsService(
      fakeQRCodeProvider,
      fakeGiftCardRequestsRepository,
      fakeCustomRewardsRequestsRepository,
    );
  });

  it('should be able to list my custom reward requests', async () => {
    await fakeCustomRewardsRequestsRepository.save(custom_reward_request);
    await fakeCustomRewardsRequestsRepository.save({
      ...custom_reward_request,
      id: uuid(),
      user_id: 'another-user-id',
    });

    const rewards = await listRewardRequests.execute({
      reward_type: 'custom_reward',
      user_id: custom_reward_request.user_id,
      start_date: subDays(new Date(), 1),
      end_date: addDays(new Date(), 1),
      page: 0,
      size: 2,
    });

    expect(rewards.total).toBe(1);
  });

  it('should be able to list my gift card requests', async () => {
    await fakeGiftCardRequestsRepository.save(gift_card_request);
    await fakeGiftCardRequestsRepository.save({
      ...gift_card_request,
      id: uuid(),
      user_id: 'another-user-id',
    });

    const rewards = await listRewardRequests.execute({
      reward_type: 'gift_card',
      user_id: gift_card_request.user_id,
      start_date: subDays(new Date(), 1),
      end_date: addDays(new Date(), 1),
      page: 0,
      size: 2,
    });

    expect(rewards.total).toBe(1);
  });
});
