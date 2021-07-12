import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';
import CreateEnpsAnswerService from '@modules/enps/services/CreateEnpsAnswerService';

export default class EnpsAnswersController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { enps_survey_id } = request.params;
    const { answer, score } = request.body;
    const { account_id, id: user_id } = request.user;

    const createEnpsAnswer = container.resolve(CreateEnpsAnswerService);

    const enps_answer = await createEnpsAnswer.execute({
      account_id,
      user_id,
      enps_survey_id,
      answer,
      score,
    });

    return response.json(classToClass(enps_answer));
  }
}
