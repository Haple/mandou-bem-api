import Department from '../infra/typeorm/entities/Department';
import ICreateDepartmentDTO from '../dtos/ICreateDepartmentDTO';
import IFindDepartmentByNameDTO from '../dtos/IFindDepartmentByNameDTO';

export default interface IDepartmentsRepository {
  findAllFromAccount(account_id: string): Promise<Department[]>;
  findById(id: string): Promise<Department | undefined>;
  findByName(data: IFindDepartmentByNameDTO): Promise<Department | undefined>;
  create(data: ICreateDepartmentDTO): Promise<Department>;
  save(department: Department): Promise<Department>;
  remove(department: Department): Promise<void>;
}
