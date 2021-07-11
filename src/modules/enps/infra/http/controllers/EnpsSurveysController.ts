import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';
import CreateEnpsSurveyService from '@modules/enps/services/CreateEnpsSurveyService';
import EnpsSurveysRepository from '../../typeorm/repositories/EnpsSurveysRepository';

export default class EnpsSurveysController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { question, end_date, position_id, department_id } = request.body;
    const { account_id } = request.user;

    const createEnpsSurvey = container.resolve(CreateEnpsSurveyService);

    const enps_survey = await createEnpsSurvey.execute({
      account_id,
      question,
      end_date,
      position_id,
      department_id,
    });

    return response.json(classToClass(enps_survey));
  }

  public async index(request: Request, response: Response): Promise<Response> {
    const { account_id } = request.user;

    const enpsSurveysRepository = container.resolve(EnpsSurveysRepository);

    const enps_surveys = await enpsSurveysRepository.findAllFromAccount(
      account_id,
    );

    return response.json(classToClass(enps_surveys));
  }
}
