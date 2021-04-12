import AppError from '@shared/errors/AppError';

import FakeAccountsRepository from '@modules/users/repositories/fakes/FakeAccountsRepository';
import FakeDepartmentsRepository from '../../repositories/fakes/FakeDepartmentsRepository';
import CreateDepartmentService from './CreateDepartmentService';

let fakeAccountsRepository: FakeAccountsRepository;
let fakeDepartmentsRepository: FakeDepartmentsRepository;
let createDepartment: CreateDepartmentService;

describe('CreateDepartment', () => {
  beforeEach(() => {
    fakeAccountsRepository = new FakeAccountsRepository();
    fakeDepartmentsRepository = new FakeDepartmentsRepository();

    createDepartment = new CreateDepartmentService(fakeDepartmentsRepository);
  });

  it('should be able to create a new department', async () => {
    const account = await fakeAccountsRepository.create('Fake Labs');

    const department = await createDepartment.execute({
      account_id: account.id,
      department_name: 'Marketing',
    });

    expect(department).toHaveProperty('id');
  });

  it('should not be able to create a new department with same name from another', async () => {
    const account = await fakeAccountsRepository.create('Fake Labs');

    await createDepartment.execute({
      account_id: account.id,
      department_name: 'Marketing',
    });

    await expect(
      createDepartment.execute({
        account_id: account.id,
        department_name: 'Marketing',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to create department with same name and different accounts', async () => {
    const account1 = await fakeAccountsRepository.create('Fake Labs 1');
    const account2 = await fakeAccountsRepository.create('Fake Labs 2');

    await createDepartment.execute({
      account_id: account1.id,
      department_name: 'Marketing',
    });

    const department = await createDepartment.execute({
      account_id: account2.id,
      department_name: 'Marketing',
    });

    expect(department).toHaveProperty('id');
  });
});
