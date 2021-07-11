import { injectable, inject } from 'tsyringe';

import IEnpsSurveysRepository from '@modules/enps/repositories/IEnpsSurveysRepository';
import AppError from '@shared/errors/AppError';
import EnpsSurvey from '../infra/typeorm/entities/EnpsSurvey';

interface IRequest {
  enps_survey_id: string;
  account_id: string;
}

@injectable()
class EndEnpsSurveyService {
  constructor(
    @inject('EnpsSurveysRepository')
    private enpsSurveysRepository: IEnpsSurveysRepository,
  ) {}

  public async execute({
    account_id,
    enps_survey_id,
  }: IRequest): Promise<EnpsSurvey> {
    const enps_survey = await this.enpsSurveysRepository.findById(
      enps_survey_id,
    );

    if (!enps_survey || enps_survey.account_id !== account_id) {
      throw new AppError('Enps survey not found.', 404);
    }

    const enps_survey_updated = await this.enpsSurveysRepository.save({
      ...enps_survey,
      ended_at: new Date(),
    });

    return enps_survey_updated;
  }
}

export default EndEnpsSurveyService;
