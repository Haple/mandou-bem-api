import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';
import CreateEnpsAnswerService from '@modules/enps/services/CreateEnpsAnswerService';
import ListEnpsAnswersService from '@modules/enps/services/ListEnpsAnswersService';

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

  public async index(request: Request, response: Response): Promise<Response> {
    const { enps_survey_id } = request.params;
    const page = (request.query.page as unknown) as number;
    const size = (request.query.size as unknown) as number;

    const listEnpsAnswers = container.resolve(ListEnpsAnswersService);

    const enps_answers = await listEnpsAnswers.execute({
      enps_survey_id,
      page,
      size,
    });

    return response.json(enps_answers);
  }
}
