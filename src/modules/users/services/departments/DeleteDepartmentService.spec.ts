import AppError from '@shared/errors/AppError';

import FakeAccountsRepository from '@modules/users/repositories/fakes/FakeAccountsRepository';
import FakeDepartmentsRepository from '../../repositories/fakes/FakeDepartmentsRepository';
import DeleteDepartmentService from './DeleteDepartmentService';

let fakeAccountsRepository: FakeAccountsRepository;
let fakeDepartmentsRepository: FakeDepartmentsRepository;
let deleteDepartment: DeleteDepartmentService;

describe('DeleteDepartment', () => {
  beforeEach(() => {
    fakeAccountsRepository = new FakeAccountsRepository();
    fakeDepartmentsRepository = new FakeDepartmentsRepository();

    deleteDepartment = new DeleteDepartmentService(fakeDepartmentsRepository);
  });

  it('should be able to delete department', async () => {
    const account = await fakeAccountsRepository.create('Fake Labs');

    const department = await fakeDepartmentsRepository.create({
      account_id: account.id,
      department_name: 'Marketing',
    });

    await expect(
      deleteDepartment.execute({
        account_id: account.id,
        department_id: department.id,
      }),
    ).resolves.not.toThrow(AppError);
  });

  it('should not be able to delete department from another account', async () => {
    const account1 = await fakeAccountsRepository.create('Fake Labs 1');
    const account2 = await fakeAccountsRepository.create('Fake Labs 2');

    const account2_department = await fakeDepartmentsRepository.create({
      account_id: account2.id,
      department_name: 'Marketing',
    });

    await expect(
      deleteDepartment.execute({
        account_id: account1.id,
        department_id: account2_department.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
