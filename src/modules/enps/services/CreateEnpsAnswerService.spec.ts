import AppError from '@shared/errors/AppError';
import { addDays } from 'date-fns';

import FakeEnpsSurveyRepository from '@modules/enps/repositories/fakes/FakeEnpsSurveyRepository';
import FakeEnpsAnswersRepository from '@modules/enps/repositories/fakes/FakeEnpsAnswersRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import User from '@modules/users/infra/typeorm/entities/User';
import CreateEnpsAnswerService from './CreateEnpsAnswerService';
import GetAvailableEnpsSurveysService from './GetAvailableEnpsSurveysService';
import EnpsSurvey from '../infra/typeorm/entities/EnpsSurvey';

let fakeEnpsSurveyRepository: FakeEnpsSurveyRepository;
let fakeEnpsAnswersRepository: FakeEnpsAnswersRepository;
let fakeUsersRepository: FakeUsersRepository;

let createEnpsAnswer: CreateEnpsAnswerService;
let getAvailableEnpsSurveys: GetAvailableEnpsSurveysService;

let user: User;
let enps_survey: EnpsSurvey;

describe('CreateEnpsAnswer', () => {
  beforeEach(async () => {
    fakeEnpsSurveyRepository = new FakeEnpsSurveyRepository();
    fakeEnpsAnswersRepository = new FakeEnpsAnswersRepository();
    fakeUsersRepository = new FakeUsersRepository();

    getAvailableEnpsSurveys = new GetAvailableEnpsSurveysService(
      fakeEnpsSurveyRepository,
      fakeEnpsAnswersRepository,
      fakeUsersRepository,
    );

    createEnpsAnswer = new CreateEnpsAnswerService(
      fakeEnpsSurveyRepository,
      fakeEnpsAnswersRepository,
      getAvailableEnpsSurveys,
    );

    user = await fakeUsersRepository.create({
      account_id: 'fake-account-id',
      email: 'fake@email.example',
      name: 'fake name',
      password: 'fake pass',
      position_id: 'fake-position-id',
      department_id: 'fake-department-id',
    });

    enps_survey = await fakeEnpsSurveyRepository.create({
      account_id: 'fake-account-id',
      end_date: addDays(new Date(), 1),
      question: 'fake question',
    });
  });

  it('should be able to create a new ENPS Answer', async () => {
    const enps_answer = await createEnpsAnswer.execute({
      account_id: 'fake-account-id',
      enps_survey_id: enps_survey.id,
      user_id: user.id,
      answer: 'fake-answer',
      score: 10,
    });

    expect(enps_answer).toHaveProperty('id');
  });

  it('should update ENPS Survey when receive an ENPS Answer with a promoter score', async () => {
    const enps_answer = await createEnpsAnswer.execute({
      account_id: 'fake-account-id',
      enps_survey_id: enps_survey.id,
      user_id: user.id,
      answer: 'fake-answer',
      score: 9,
    });

    const updated_survey = await fakeEnpsSurveyRepository.findById(
      enps_survey.id,
    );

    expect(enps_answer).toHaveProperty('id');
    expect(updated_survey?.promoters).toBe(1);
    expect(updated_survey?.passives).toBe(0);
    expect(updated_survey?.detractors).toBe(0);
  });

  it('should update ENPS Survey when receive an ENPS Answer with a passive score', async () => {
    const enps_answer = await createEnpsAnswer.execute({
      account_id: 'fake-account-id',
      enps_survey_id: enps_survey.id,
      user_id: user.id,
      answer: 'fake-answer',
      score: 7,
    });

    const updated_survey = await fakeEnpsSurveyRepository.findById(
      enps_survey.id,
    );

    expect(enps_answer).toHaveProperty('id');
    expect(updated_survey?.promoters).toBe(0);
    expect(updated_survey?.passives).toBe(1);
    expect(updated_survey?.detractors).toBe(0);
  });

  it('should update ENPS Survey when receive an ENPS Answer with a detractor score', async () => {
    const enps_answer = await createEnpsAnswer.execute({
      account_id: 'fake-account-id',
      enps_survey_id: enps_survey.id,
      user_id: user.id,
      answer: 'fake-answer',
      score: 6,
    });

    const updated_survey = await fakeEnpsSurveyRepository.findById(
      enps_survey.id,
    );

    expect(enps_answer).toHaveProperty('id');
    expect(updated_survey?.promoters).toBe(0);
    expect(updated_survey?.passives).toBe(0);
    expect(updated_survey?.detractors).toBe(1);
  });

  it('should not be able to create a new ENPS Answer to unknown ENPS Survey', async () => {
    await expect(
      createEnpsAnswer.execute({
        account_id: 'fake-account-id',
        enps_survey_id: 'unknown-enps-survey',
        user_id: user.id,
        answer: 'fake-answer',
        score: 10,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new ENPS Answer to an survey from another account', async () => {
    await expect(
      createEnpsAnswer.execute({
        account_id: 'another-fake-account-id',
        enps_survey_id: enps_survey.id,
        user_id: user.id,
        answer: 'fake-answer',
        score: 10,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new ENPS Answer to an unavailable survey', async () => {
    await fakeEnpsSurveyRepository.create({
      account_id: 'fake-account-id',
      end_date: addDays(new Date(), 1),
      question: 'another fake available question',
    });

    await createEnpsAnswer.execute({
      account_id: 'fake-account-id',
      enps_survey_id: enps_survey.id,
      user_id: user.id,
      answer: 'fake-answer',
      score: 10,
    });

    await expect(
      createEnpsAnswer.execute({
        account_id: 'fake-account-id',
        enps_survey_id: enps_survey.id,
        user_id: user.id,
        answer: 'fake-answer',
        score: 10,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
