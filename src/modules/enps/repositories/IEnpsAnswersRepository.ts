import EnpsAnswer from '../infra/typeorm/entities/EnpsAnswer';
import ICreateEnpsAnswerDTO from '../dtos/ICreateEnpsAnswerDTO';

export default interface IEnpsAnswersRepository {
  findAllFromUserAndSurveys(
    user_id: string,
    surveys_ids: string[],
  ): Promise<EnpsAnswer[]>;
  create(data: ICreateEnpsAnswerDTO): Promise<EnpsAnswer>;
  save(enpsAnswer: EnpsAnswer): Promise<EnpsAnswer>;
}
