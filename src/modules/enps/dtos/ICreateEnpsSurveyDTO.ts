export default interface ICreateEnpsSurveyDTO {
  account_id: string;
  question: string;
  end_date: Date;
  position_id?: string;
  department_id?: string;
}
