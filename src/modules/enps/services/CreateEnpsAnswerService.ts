import { injectable, inject } from 'tsyringe';

import IEnpsAnswersRepository from '@modules/enps/repositories/IEnpsAnswersRepository';
import AppError from '@shared/errors/AppError';
import IEnpsSurveysRepository from '../repositories/IEnpsSurveysRepository';
import GetAvailableEnpsSurveyService from './GetAvailableEnpsSurveysService';
import EnpsAnswer from '../infra/typeorm/entities/EnpsAnswer';
import EnpsSurvey from '../infra/typeorm/entities/EnpsSurvey';

interface IRequest {
  account_id: string;
  enps_survey_id: string;
  user_id: string;
  answer: string;
  score: number;
}

@injectable()
class CreateEnpsAnswerService {
  constructor(
    @inject('EnpsSurveysRepository')
    private enpsSurveysRepository: IEnpsSurveysRepository,
    @inject('EnpsAnswersRepository')
    private enpsAnswersRepository: IEnpsAnswersRepository,
    @inject('GetAvailableEnpsSurveyService')
    private getAvailableEnpsSurveyService: GetAvailableEnpsSurveyService,
  ) {}

  public async execute({
    account_id,
    enps_survey_id,
    user_id,
    answer,
    score,
  }: IRequest): Promise<EnpsAnswer> {
    const enps_survey = await this.enpsSurveysRepository.findById(
      enps_survey_id,
    );

    if (!enps_survey || enps_survey.account_id !== account_id) {
      throw new AppError('Enps survey not found', 404);
    }

    const available_enps_surveys = await this.getAvailableEnpsSurveyService.execute(
      {
        account_id,
        user_id,
      },
    );

    const available_ids = available_enps_surveys.map(survey => survey.id);

    if (!available_ids.includes(enps_survey_id)) {
      throw new AppError('Enps survey is unavailable', 409);
    }

    const enps_answer = await this.enpsAnswersRepository.create({
      enps_survey_id,
      user_id,
      answer,
      score,
    });

    await this.enpsSurveysRepository.save({
      ...enps_survey,
      promoters: score >= 9 ? enps_survey.promoters + 1 : enps_survey.promoters,
      passives:
        score >= 7 && score <= 8
          ? enps_survey.passives + 1
          : enps_survey.passives,
      detractors:
        score <= 6 ? enps_survey.detractors + 1 : enps_survey.detractors,
    } as EnpsSurvey);

    return enps_answer;
  }
}

export default CreateEnpsAnswerService;
