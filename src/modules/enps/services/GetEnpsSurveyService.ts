import { injectable, inject } from 'tsyringe';

import IEnpsSurveysRepository from '@modules/enps/repositories/IEnpsSurveysRepository';
import AppError from '@shared/errors/AppError';
import EnpsSurvey from '../infra/typeorm/entities/EnpsSurvey';

interface IRequest {
  enps_survey_id: string;
  account_id: string;
}

interface IResponse extends EnpsSurvey {
  total_responses: number;
  enps_score: number;
}

@injectable()
class GetEnpsSurveyService {
  constructor(
    @inject('EnpsSurveysRepository')
    private enpsSurveysRepository: IEnpsSurveysRepository,
  ) {}

  public async execute({
    account_id,
    enps_survey_id,
  }: IRequest): Promise<IResponse> {
    const enps_survey = await this.enpsSurveysRepository.findById(
      enps_survey_id,
    );

    if (!enps_survey || enps_survey.account_id !== account_id) {
      throw new AppError('Enps survey not found.', 404);
    }

    const { promoters, passives, detractors } = enps_survey;
    const total_responses = promoters + passives + detractors;
    const enps_score = ((promoters - detractors) / total_responses) * 100;

    return {
      ...enps_survey,
      total_responses,
      enps_score: Math.trunc(enps_score),
    };
  }
}

export default GetEnpsSurveyService;
