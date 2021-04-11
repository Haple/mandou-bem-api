import AppError from '@shared/errors/AppError';

import FakeAccountsRepository from '@modules/users/repositories/fakes/FakeAccountsRepository';
import FakePositionsRepository from '../../repositories/fakes/FakePositionsRepository';
import DeletePositionService from './DeletePositionService';

let fakeAccountsRepository: FakeAccountsRepository;
let fakePositionsRepository: FakePositionsRepository;
let deletePosition: DeletePositionService;

describe('DeletePosition', () => {
  beforeEach(() => {
    fakeAccountsRepository = new FakeAccountsRepository();
    fakePositionsRepository = new FakePositionsRepository();

    deletePosition = new DeletePositionService(fakePositionsRepository);
  });

  it('should be able to delete position', async () => {
    const account = await fakeAccountsRepository.create('Fake Labs');

    const position = await fakePositionsRepository.create({
      account_id: account.id,
      position_name: 'Manager',
      points: 200,
    });

    await expect(
      deletePosition.execute({
        account_id: account.id,
        position_id: position.id,
      }),
    ).resolves.not.toThrow(AppError);
  });

  it('should not be able to delete position from another account', async () => {
    const account1 = await fakeAccountsRepository.create('Fake Labs 1');
    const account2 = await fakeAccountsRepository.create('Fake Labs 2');

    const account2_position = await fakePositionsRepository.create({
      account_id: account2.id,
      position_name: 'Manager',
      points: 200,
    });

    await expect(
      deletePosition.execute({
        account_id: account1.id,
        position_id: account2_position.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
