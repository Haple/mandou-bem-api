import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IDepartmentsRepository from '../../repositories/IDepartmentsRepository';

interface IRequest {
  account_id: string;
  department_id: string;
}

@injectable()
class DeleteDepartmentService {
  constructor(
    @inject('DepartmentsRepository')
    private departmentsRepository: IDepartmentsRepository,
  ) {}

  public async execute({ account_id, department_id }: IRequest): Promise<void> {
    const department = await this.departmentsRepository.findById(department_id);

    if (department && department.account_id === account_id) {
      await this.departmentsRepository.remove(department);
      return;
    }

    throw new AppError('Department not found.', 404);
  }
}

export default DeleteDepartmentService;
