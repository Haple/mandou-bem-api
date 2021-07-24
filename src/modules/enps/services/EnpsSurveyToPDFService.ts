import { injectable, inject } from 'tsyringe';

import IEnpsSurveysRepository from '@modules/enps/repositories/IEnpsSurveysRepository';
import AppError from '@shared/errors/AppError';
import IPDFProvider from '@shared/container/providers/PDFProvider/models/IPDFProvider';
import path from 'path';
import { format } from 'date-fns';
import IEnpsAnswersRepository from '../repositories/IEnpsAnswersRepository';

interface IRequest {
  enps_survey_id: string;
  account_id: string;
}

@injectable()
class EnpsSurveyToPDFService {
  constructor(
    @inject('EnpsSurveysRepository')
    private enpsSurveysRepository: IEnpsSurveysRepository,
    @inject('EnpsAnswersRepository')
    private enpsAnswersRepository: IEnpsAnswersRepository,
    @inject('PDFProvider')
    private pdfProvider: IPDFProvider,
  ) {}

  public async execute({
    account_id,
    enps_survey_id,
  }: IRequest): Promise<Buffer> {
    const enps_survey = await this.enpsSurveysRepository.findById(
      enps_survey_id,
    );

    if (!enps_survey || enps_survey.account_id !== account_id) {
      throw new AppError('Enps survey not found.', 404);
    }

    const enps_answers = await this.enpsAnswersRepository.findAllFromSurvey(
      enps_survey_id,
    );

    const enpsSurveyTemplate = path.resolve(
      __dirname,
      '..',
      'views',
      'enps_survey_pdf.hbs',
    );

    const pdf = await this.pdfProvider.generatePDF({
      templateData: {
        file: enpsSurveyTemplate,
        variables: {
          enps_survey: {
            ...enps_survey,
            enps_score: enps_survey.getEnpScore() || '?',
            created_at_formatted: format(enps_survey.created_at, 'dd/MM/yyyy'),
            end_date_formatted: format(enps_survey.end_date, 'dd/MM/yyyy'),
            ended_at_formatted: enps_survey.ended_at
              ? format(enps_survey.ended_at, 'dd/MM/yyyy')
              : null,
            department_name: enps_survey.department?.department_name || 'Todos',
            position_name: enps_survey.position?.position_name || 'Todos',
          },
          enps_answers: enps_answers.map(answer => ({
            ...answer,
            created_at_formatted: format(enps_survey.created_at, 'dd/MM/yyyy'),
          })),
        },
      },
    });

    return pdf;
  }
}

export default EnpsSurveyToPDFService;
