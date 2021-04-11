import AppError from '@shared/errors/AppError';

import FakeAccountsRepository from '@modules/users/repositories/fakes/FakeAccountsRepository';
import FakePositionsRepository from '../../repositories/fakes/FakePositionsRepository';
import CreatePositionService from './CreatePositionService';

let fakeAccountsRepository: FakeAccountsRepository;
let fakePositionsRepository: FakePositionsRepository;
let createPosition: CreatePositionService;

describe('CreatePosition', () => {
  beforeEach(() => {
    fakeAccountsRepository = new FakeAccountsRepository();
    fakePositionsRepository = new FakePositionsRepository();

    createPosition = new CreatePositionService(fakePositionsRepository);
  });

  it('should be able to create a new position', async () => {
    const account = await fakeAccountsRepository.create('Fake Labs');

    const position = await createPosition.execute({
      account_id: account.id,
      position_name: 'Manager',
      points: 200,
    });

    expect(position).toHaveProperty('id');
  });

  it('should not be able to create a new position with same name from another', async () => {
    const account = await fakeAccountsRepository.create('Fake Labs');

    await createPosition.execute({
      account_id: account.id,
      position_name: 'Manager',
      points: 200,
    });

    await expect(
      createPosition.execute({
        account_id: account.id,
        position_name: 'Manager',
        points: 150,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to create position with same name and different accounts', async () => {
    const account1 = await fakeAccountsRepository.create('Fake Labs 1');
    const account2 = await fakeAccountsRepository.create('Fake Labs 2');

    await createPosition.execute({
      account_id: account1.id,
      position_name: 'Manager',
      points: 200,
    });

    const position = await createPosition.execute({
      account_id: account2.id,
      position_name: 'Manager',
      points: 200,
    });

    expect(position).toHaveProperty('id');
  });
});
