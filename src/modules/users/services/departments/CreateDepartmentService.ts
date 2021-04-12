import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IDepartmentsRepository from '../../repositories/IDepartmentsRepository';

import Department from '../../infra/typeorm/entities/Department';

interface IRequest {
  department_name: string;
  account_id: string;
}

@injectable()
class CreateDepartmentService {
  constructor(
    @inject('DepartmentsRepository')
    private departmentsRepository: IDepartmentsRepository,
  ) {}

  public async execute({
    department_name,
    account_id,
  }: IRequest): Promise<Department> {
    const departmentWithSameName = await this.departmentsRepository.findByName({
      department_name,
      account_id,
    });

    if (departmentWithSameName) {
      throw new AppError('Department name already used.');
    }

    const department = await this.departmentsRepository.create({
      department_name,
      account_id,
    });

    return department;
  }
}

export default CreateDepartmentService;
