import { uuid } from 'uuidv4';

import IFindDepartmentByNameDTO from '../../dtos/IFindDepartmentByNameDTO';
import ICreateDepartmentDTO from '../../dtos/ICreateDepartmentDTO';

import Department from '../../infra/typeorm/entities/Department';
import IDepartmentsRepository from '../IDepartmentsRepository';

class FakeDepartmentsRepository implements IDepartmentsRepository {
  private departments: Department[] = [];

  public async findById(id: string): Promise<Department | undefined> {
    const department = this.departments.find(d => d.id === id);

    return department;
  }

  public async findByName({
    account_id,
    department_name,
  }: IFindDepartmentByNameDTO): Promise<Department | undefined> {
    return this.departments.filter(
      department =>
        department.account_id === account_id &&
        department.department_name === department_name,
    )[0];
  }

  public async findAllFromAccount(account_id: string): Promise<Department[]> {
    return this.departments.filter(
      department => department.account_id === account_id,
    );
  }

  public async create(
    department_data: ICreateDepartmentDTO,
  ): Promise<Department> {
    const department = new Department();

    Object.assign(department, { id: uuid() }, department_data);

    this.departments.push(department);

    return department;
  }

  public async save(department: Department): Promise<Department> {
    const find_index = this.departments.findIndex(
      find_department => find_department.id === department.id,
    );

    this.departments[find_index] = department;

    return department;
  }

  public async remove(department: Department): Promise<void> {
    this.departments.splice(this.departments.indexOf(department), 1);
  }
}

export default FakeDepartmentsRepository;
