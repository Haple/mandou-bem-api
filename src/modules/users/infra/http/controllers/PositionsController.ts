import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';
import UpdatePositionService from '../../../services/positions/UpdatePositionService';
import DeletePositionService from '../../../services/positions/DeletePositionService';
import CreatePositionService from '../../../services/positions/CreatePositionService';
import PositionsRepository from '../../typeorm/repositories/PositionsRepository';

export default class PositionController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { position_name, points } = request.body;
    const { account_id } = request.user;

    const createPositionReward = container.resolve(CreatePositionService);

    const position = await createPositionReward.execute({
      position_name,
      points,
      account_id,
    });

    return response.json(classToClass(position));
  }

  public async index(request: Request, response: Response): Promise<Response> {
    const { account_id } = request.user;

    const positionsRepository = container.resolve(PositionsRepository);

    const positions = await positionsRepository.findAllFromAccount(account_id);

    return response.json(classToClass(positions));
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { position_id } = request.params;
    const { account_id } = request.user;

    const deletePosition = container.resolve(DeletePositionService);

    await deletePosition.execute({
      account_id,
      position_id,
    });

    return response.json();
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { position_id } = request.params;
    const { position_name, points } = request.body;
    const { account_id } = request.user;

    const updatePosition = container.resolve(UpdatePositionService);

    const position = await updatePosition.execute({
      position_id,
      position_name,
      points,
      account_id,
    });

    return response.json(classToClass(position));
  }
}
