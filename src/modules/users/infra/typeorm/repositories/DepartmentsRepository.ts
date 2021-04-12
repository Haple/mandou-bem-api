import { getRepository, Repository } from 'typeorm';

import IFindDepartmentByNameDTO from '../../../dtos/IFindDepartmentByNameDTO';
import ICreateDepartmentDTO from '../../../dtos/ICreateDepartmentDTO';
import IDepartmentsRepository from '../../../repositories/IDepartmentsRepository';
import Department from '../entities/Department';

class DepartmentsRepository implements IDepartmentsRepository {
  private ormRepository: Repository<Department>;

  constructor() {
    this.ormRepository = getRepository(Department);
  }

  public async findByName({
    account_id,
    department_name,
  }: IFindDepartmentByNameDTO): Promise<Department | undefined> {
    const department = await this.ormRepository.findOne({
      where: {
        account_id,
        department_name,
      },
    });
    return department;
  }

  public async findById(id: string): Promise<Department | undefined> {
    const department = await this.ormRepository.findOne(id);

    return department;
  }

  public async findAllFromAccount(account_id: string): Promise<Department[]> {
    const departments = await this.ormRepository.find({
      where: {
        account_id,
      },
    });

    return departments;
  }

  public async create(
    department_data: ICreateDepartmentDTO,
  ): Promise<Department> {
    const department = this.ormRepository.create(department_data);

    await this.ormRepository.save(department);

    return department;
  }

  public async save(department: Department): Promise<Department> {
    return this.ormRepository.save(department);
  }

  public async remove(department: Department): Promise<void> {
    await this.ormRepository.softRemove(department);
  }
}

export default DepartmentsRepository;
