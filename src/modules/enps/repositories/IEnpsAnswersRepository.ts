import EnpsAnswer from '../infra/typeorm/entities/EnpsAnswer';
import ICreateEnpsAnswerDTO from '../dtos/ICreateEnpsAnswerDTO';
import IPaginationDTO from '../dtos/IPaginationDTO';

export default interface IEnpsAnswersRepository {
  findAllFromSurvey(enps_survey_id: string): Promise<EnpsAnswer[]>;
  findAllFromSurveyPaginated(
    enps_survey_id: string,
    page: number,
    size: number,
  ): Promise<IPaginationDTO<EnpsAnswer>>;
  findAllFromUserAndSurveys(
    user_id: string,
    surveys_ids: string[],
  ): Promise<EnpsAnswer[]>;
  create(data: ICreateEnpsAnswerDTO): Promise<EnpsAnswer>;
  save(enpsAnswer: EnpsAnswer): Promise<EnpsAnswer>;
}
