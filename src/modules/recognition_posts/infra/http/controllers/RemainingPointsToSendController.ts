import { Request, Response } from 'express';
import { container } from 'tsyringe';
import RemainingPointsToSendService from '@modules/recognition_posts/services/RemainingPointsToSendService';

export default class RemainingPointsToSendController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;

    const remainingPointsToSend = container.resolve(
      RemainingPointsToSendService,
    );

    const remaining_points = await remainingPointsToSend.execute({
      user_id: id,
    });

    return response.json(remaining_points);
  }
}
