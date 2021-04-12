import AppError from '@shared/errors/AppError';

import FakeAccountsRepository from '@modules/users/repositories/fakes/FakeAccountsRepository';
import FakeDepartmentsRepository from '../../repositories/fakes/FakeDepartmentsRepository';
import UpdateDepartmentService from './UpdateDepartmentService';

let fakeAccountsRepository: FakeAccountsRepository;
let fakeDepartmentsRepository: FakeDepartmentsRepository;
let updateDepartment: UpdateDepartmentService;

describe('UpdateDepartment', () => {
  beforeEach(() => {
    fakeAccountsRepository = new FakeAccountsRepository();
    fakeDepartmentsRepository = new FakeDepartmentsRepository();

    updateDepartment = new UpdateDepartmentService(fakeDepartmentsRepository);
  });

  it('should be able to update a department', async () => {
    const account = await fakeAccountsRepository.create('Fake Labs');

    const department = await fakeDepartmentsRepository.create({
      account_id: account.id,
      department_name: 'Marketing',
    });

    await updateDepartment.execute({
      department_id: department.id,
      account_id: account.id,
      department_name: 'Marketing 2',
    });

    const updated_department = await fakeDepartmentsRepository.findById(
      department.id,
    );

    expect(updated_department).toBeDefined();
    expect(updated_department?.department_name).toBe('Marketing 2');
  });

  it('should not be able to update a department with same name from another', async () => {
    const account = await fakeAccountsRepository.create('Fake Labs');

    const department_1 = await fakeDepartmentsRepository.create({
      account_id: account.id,
      department_name: 'Marketing',
    });

    const department_2 = await fakeDepartmentsRepository.create({
      account_id: account.id,
      department_name: 'Marketing 2',
    });

    await expect(
      updateDepartment.execute({
        department_id: department_2.id,
        account_id: account.id,
        department_name: department_1.department_name,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update department with same name and different accounts', async () => {
    const account1 = await fakeAccountsRepository.create('Fake Labs 1');
    const account2 = await fakeAccountsRepository.create('Fake Labs 2');

    const department_1 = await fakeDepartmentsRepository.create({
      account_id: account1.id,
      department_name: 'Marketing',
    });

    const department_2 = await fakeDepartmentsRepository.create({
      account_id: account2.id,
      department_name: 'Marketing',
    });

    const updated_department = await updateDepartment.execute({
      department_id: department_2.id,
      account_id: account2.id,
      department_name: department_1.department_name,
    });

    expect(updated_department).toBeDefined();
    expect(updated_department?.department_name).toBe(
      department_1.department_name,
    );
  });

  it('should not be able to update department from another account', async () => {
    const account1 = await fakeAccountsRepository.create('Fake Labs 1');
    const account2 = await fakeAccountsRepository.create('Fake Labs 2');

    const account2_department = await fakeDepartmentsRepository.create({
      account_id: account2.id,
      department_name: 'Marketing',
    });

    await expect(
      updateDepartment.execute({
        department_id: account2_department.id,
        account_id: account1.id,
        department_name: 'Marketing 2',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
