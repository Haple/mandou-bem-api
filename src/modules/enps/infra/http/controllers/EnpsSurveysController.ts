import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';
import CreateEnpsSurveyService from '@modules/enps/services/CreateEnpsSurveyService';
import GetEnpsSurveyService from '@modules/enps/services/GetEnpsSurveyService';
import EndEnpsSurveyService from '@modules/enps/services/EndEnpsSurveyService';
import GetAvailableEnpsSurveysService from '@modules/enps/services/GetAvailableEnpsSurveysService';
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

  public async show(request: Request, response: Response): Promise<Response> {
    const { enps_survey_id } = request.params;
    const { account_id } = request.user;

    const getEnpsSurvey = container.resolve(GetEnpsSurveyService);

    const enps_survey = await getEnpsSurvey.execute({
      enps_survey_id,
      account_id,
    });

    return response.json(classToClass(enps_survey));
  }

  public async end(request: Request, response: Response): Promise<Response> {
    const { enps_survey_id } = request.params;
    const { account_id } = request.user;

    const endEnpsSurvey = container.resolve(EndEnpsSurveyService);

    const enps_survey = await endEnpsSurvey.execute({
      enps_survey_id,
      account_id,
    });

    return response.json(classToClass(enps_survey));
  }

  public async showAvailable(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { account_id, id: user_id } = request.user;

    const getAvailableEnpsSurveys = container.resolve(
      GetAvailableEnpsSurveysService,
    );

    const enps_survey = await getAvailableEnpsSurveys.execute({
      user_id,
      account_id,
    });

    return response.json(classToClass(enps_survey));
  }
}
