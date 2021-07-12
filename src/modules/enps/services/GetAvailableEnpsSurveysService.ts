import { injectable, inject } from 'tsyringe';

import IEnpsSurveysRepository from '@modules/enps/repositories/IEnpsSurveysRepository';
import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import EnpsSurvey from '../infra/typeorm/entities/EnpsSurvey';
import IEnpsAnswersRepository from '../repositories/IEnpsAnswersRepository';

interface IRequest {
  user_id: string;
  account_id: string;
}

@injectable()
class GetAvailableEnpsSurveyService {
  constructor(
    @inject('EnpsSurveysRepository')
    private enpsSurveysRepository: IEnpsSurveysRepository,
    @inject('EnpsAnswersRepository')
    private enpsAnswersRepository: IEnpsAnswersRepository,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({
    account_id,
    user_id,
  }: IRequest): Promise<EnpsSurvey[]> {
    const user = await this.usersRepository.findById(user_id);

    if (!user || user.account_id !== account_id) {
      throw new AppError('User not found.');
    }

    const enps_surveys = await this.enpsSurveysRepository.findAllAvailable({
      account_id,
      department_id: user.department_id,
      position_id: user.position_id,
    });

    if (enps_surveys.length === 0) {
      throw new AppError('There is no enps survey available.', 404);
    }

    const enps_answers = await this.enpsAnswersRepository.findAllFromUserAndSurveys(
      user_id,
      enps_surveys.map(enps_survey => enps_survey.id),
    );

    const answered_surveys = enps_answers.map(
      enps_answer => enps_answer.enps_survey_id,
    );

    const surveys_available = enps_surveys.filter(
      enps_survey => !answered_surveys.includes(enps_survey.id),
    );

    if (surveys_available.length === 0) {
      throw new AppError('All surveys available are already answered.', 409);
    }

    return surveys_available;
  }
}

export default GetAvailableEnpsSurveyService;
