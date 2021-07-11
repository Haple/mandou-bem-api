import { injectable, inject } from 'tsyringe';
import { isAfter } from 'date-fns';

import IEnpsSurveysRepository from '@modules/enps/repositories/IEnpsSurveysRepository';
import AppError from '@shared/errors/AppError';
import EnpsSurvey from '../infra/typeorm/entities/EnpsSurvey';

interface IRequest {
  account_id: string;
  question?: string;
  end_date: Date;
  position_id?: string;
  department_id?: string;
}

const DEFAULT_QUESTION =
  'Em uma escala de 0 a 10, qual a probabilidade de você recomendar esta empresa como um bom lugar para trabalhar?';

@injectable()
class CreateEnpsSurveyService {
  constructor(
    @inject('EnpsSurveysRepository')
    private enpsSurveysRepository: IEnpsSurveysRepository,
  ) {}

  public async execute({
    account_id,
    question,
    end_date,
    department_id,
    position_id,
  }: IRequest): Promise<EnpsSurvey> {
    if (isAfter(new Date(), end_date)) {
      throw new AppError('End date should be after today');
    }

    const enps_survey = await this.enpsSurveysRepository.create({
      account_id,
      question: question || DEFAULT_QUESTION,
      end_date,
      department_id,
      position_id,
    });

    return enps_survey;
  }
}

export default CreateEnpsSurveyService;
