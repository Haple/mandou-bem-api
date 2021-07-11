import AppError from '@shared/errors/AppError';
import { addDays, subDays } from 'date-fns';

import FakeEnpsSurveyRepository from '@modules/enps/repositories/fakes/FakeEnpsSurveyRepository';
import CreateEnpsSurveyService from './CreateEnpsSurveyService';

let fakeEnpsSurveyRepository: FakeEnpsSurveyRepository;

let createEnpsSurvey: CreateEnpsSurveyService;

const DEFAULT_QUESTION =
  'Em uma escala de 0 a 10, qual a probabilidade de você recomendar esta empresa como um bom lugar para trabalhar?';

describe('CreateEnpsSurvey', () => {
  beforeEach(() => {
    fakeEnpsSurveyRepository = new FakeEnpsSurveyRepository();

    createEnpsSurvey = new CreateEnpsSurveyService(fakeEnpsSurveyRepository);
  });

  it('should be able to create a new ENPS Survey', async () => {
    const enps_survey = await createEnpsSurvey.execute({
      account_id: 'fake-account-id',
      question: 'Fake survey question',
      end_date: addDays(new Date(), 1),
      position_id: 'fake-position-id',
      department_id: 'fake-department-id',
    });

    expect(enps_survey).toHaveProperty('id');
  });

  it('should be able to create a new ENPS Survey with default question', async () => {
    const enps_survey = await createEnpsSurvey.execute({
      account_id: 'fake-account-id',
      end_date: addDays(new Date(), 1),
      position_id: 'fake-position-id',
      department_id: 'fake-department-id',
    });

    expect(enps_survey).toHaveProperty('id');
    expect(enps_survey.question).toBe(DEFAULT_QUESTION);
  });

  it('should not be able to create a new ENPS Survey with end date before today', async () => {
    await expect(
      createEnpsSurvey.execute({
        account_id: 'fake-account-id',
        question: 'Fake survey question',
        end_date: subDays(new Date(), 1),
        position_id: 'fake-position-id',
        department_id: 'fake-department-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
