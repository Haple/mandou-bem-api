import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';
import UpdateDepartmentService from '../../../services/departments/UpdateDepartmentService';
import DeleteDepartmentService from '../../../services/departments/DeleteDepartmentService';
import CreateDepartmentService from '../../../services/departments/CreateDepartmentService';
import DepartmentsRepository from '../../typeorm/repositories/DepartmentsRepository';

export default class DepartmentsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { department_name } = request.body;
    const { account_id } = request.user;

    const createDepartment = container.resolve(CreateDepartmentService);

    const department = await createDepartment.execute({
      department_name,
      account_id,
    });

    return response.json(classToClass(department));
  }

  public async index(request: Request, response: Response): Promise<Response> {
    const { account_id } = request.user;

    const departmentsRepository = container.resolve(DepartmentsRepository);

    const departments = await departmentsRepository.findAllFromAccount(
      account_id,
    );

    return response.json(classToClass(departments));
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { department_id } = request.params;
    const { account_id } = request.user;

    const deleteDepartment = container.resolve(DeleteDepartmentService);

    await deleteDepartment.execute({
      account_id,
      department_id,
    });

    return response.json();
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { department_id } = request.params;
    const { department_name } = request.body;
    const { account_id } = request.user;

    const updateDepartment = container.resolve(UpdateDepartmentService);

    const department = await updateDepartment.execute({
      department_id,
      department_name,
      account_id,
    });

    return response.json(classToClass(department));
  }
}
