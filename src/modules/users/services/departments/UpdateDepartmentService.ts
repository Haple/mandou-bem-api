import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IDepartmentsRepository from '../../repositories/IDepartmentsRepository';

import Department from '../../infra/typeorm/entities/Department';

interface IRequest {
  department_id: string;
  department_name: string;
  account_id: string;
}

@injectable()
class UpdateDepartmentService {
  constructor(
    @inject('DepartmentsRepository')
    private departmentsRepository: IDepartmentsRepository,
  ) {}

  public async execute({
    department_id,
    department_name,
    account_id,
  }: IRequest): Promise<Department> {
    const department = await this.departmentsRepository.findById(department_id);

    if (!department || department.account_id !== account_id) {
      throw new AppError('Department not found.');
    }

    const departmentWithSameName = await this.departmentsRepository.findByName({
      department_name,
      account_id,
    });

    if (departmentWithSameName && departmentWithSameName.id !== department_id) {
      throw new AppError('Department name already used.');
    }

    return this.departmentsRepository.save({
      ...department,
      department_name,
    });
  }
}

export default UpdateDepartmentService;
