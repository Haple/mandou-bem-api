import AppError from '@shared/errors/AppError';

import FakeEnpsSurveyRepository from '@modules/enps/repositories/fakes/FakeEnpsSurveyRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import { addDays, subDays } from 'date-fns';
import GetAvailableEnpsSurveysService from './GetAvailableEnpsSurveysService';
import FakeEnpsAnswersRepository from '../repositories/fakes/FakeEnpsAnswersRepository';

let fakeEnpsSurveyRepository: FakeEnpsSurveyRepository;
let fakeEnpsAnswersRepository: FakeEnpsAnswersRepository;
let fakeUsersRepository: FakeUsersRepository;

let getAvailableEnpsSurveys: GetAvailableEnpsSurveysService;

describe('GetAvailableEnpsSurveys', () => {
  beforeEach(() => {
    fakeEnpsSurveyRepository = new FakeEnpsSurveyRepository();
    fakeEnpsAnswersRepository = new FakeEnpsAnswersRepository();
    fakeUsersRepository = new FakeUsersRepository();

    getAvailableEnpsSurveys = new GetAvailableEnpsSurveysService(
      fakeEnpsSurveyRepository,
      fakeEnpsAnswersRepository,
      fakeUsersRepository,
    );
  });

  it('should be able to get available ENPS Surveys', async () => {
    const saved_enps_survey = await fakeEnpsSurveyRepository.create({
      account_id: 'fake-account-id',
      end_date: addDays(new Date(), 1),
      question: 'fake question',
    });

    const user = await fakeUsersRepository.create({
      account_id: 'fake-account-id',
      email: 'fake@email.example',
      name: 'fake name',
      password: 'fake pass',
      position_id: 'fake-position-id',
      department_id: 'fake-department-id',
    });

    const enps_surveys = await getAvailableEnpsSurveys.execute({
      account_id: 'fake-account-id',
      user_id: user.id,
    });

    expect(enps_surveys[0].id).toBe(saved_enps_survey.id);
  });

  it('should not be able to get ENPS Surveys from another department', async () => {
    await fakeEnpsSurveyRepository.create({
      account_id: 'fake-account-id',
      end_date: addDays(new Date(), 1),
      question: 'fake question',
      department_id: 'another-department-id',
    });

    const user = await fakeUsersRepository.create({
      account_id: 'fake-account-id',
      email: 'fake@email.example',
      name: 'fake name',
      password: 'fake pass',
      position_id: 'fake-position-id',
      department_id: 'fake-department-id',
    });

    await expect(
      getAvailableEnpsSurveys.execute({
        account_id: 'fake-account-id',
        user_id: user.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to get ENPS Surveys from another position', async () => {
    await fakeEnpsSurveyRepository.create({
      account_id: 'fake-account-id',
      end_date: addDays(new Date(), 1),
      question: 'fake question',
      position_id: 'another-position-id',
    });

    const user = await fakeUsersRepository.create({
      account_id: 'fake-account-id',
      email: 'fake@email.example',
      name: 'fake name',
      password: 'fake pass',
      position_id: 'fake-position-id',
      department_id: 'fake-department-id',
    });

    await expect(
      getAvailableEnpsSurveys.execute({
        account_id: 'fake-account-id',
        user_id: user.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to get ENPS Surveys already ended', async () => {
    const saved_enps_survey = await fakeEnpsSurveyRepository.create({
      account_id: 'fake-account-id',
      end_date: addDays(new Date(), 1),
      question: 'fake question',
      position_id: 'another-position-id',
    });
    await fakeEnpsSurveyRepository.save({
      ...saved_enps_survey,
      ended_at: subDays(new Date(), 1),
    });

    const user = await fakeUsersRepository.create({
      account_id: 'fake-account-id',
      email: 'fake@email.example',
      name: 'fake name',
      password: 'fake pass',
      position_id: 'fake-position-id',
      department_id: 'fake-department-id',
    });

    await expect(
      getAvailableEnpsSurveys.execute({
        account_id: 'fake-account-id',
        user_id: user.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to get ENPS Surveys already expired', async () => {
    await fakeEnpsSurveyRepository.create({
      account_id: 'fake-account-id',
      end_date: subDays(new Date(), 1),
      question: 'fake question',
      position_id: 'another-position-id',
    });

    const user = await fakeUsersRepository.create({
      account_id: 'fake-account-id',
      email: 'fake@email.example',
      name: 'fake name',
      password: 'fake pass',
      position_id: 'fake-position-id',
      department_id: 'fake-department-id',
    });

    await expect(
      getAvailableEnpsSurveys.execute({
        account_id: 'fake-account-id',
        user_id: user.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to get an already answered ENPS Survey', async () => {
    const saved_enps_survey = await fakeEnpsSurveyRepository.create({
      account_id: 'fake-account-id',
      end_date: addDays(new Date(), 1),
      question: 'fake question',
    });

    const user = await fakeUsersRepository.create({
      account_id: 'fake-account-id',
      email: 'fake@email.example',
      name: 'fake name',
      password: 'fake pass',
    });

    await fakeEnpsAnswersRepository.create({
      user_id: user.id,
      enps_survey_id: saved_enps_survey.id,
      answer: 'fake answer',
      score: 10,
    });

    await expect(
      getAvailableEnpsSurveys.execute({
        account_id: 'fake-account-id',
        user_id: user.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to get available ENPS Surveys without user', async () => {
    await expect(
      getAvailableEnpsSurveys.execute({
        account_id: 'another-fake-account-id',
        user_id: 'fake-user-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to get available ENPS Surveys with user from another account', async () => {
    const user = await fakeUsersRepository.create({
      account_id: 'fake-account-id',
      email: 'fake@email.example',
      name: 'fake name',
      password: 'fake pass',
    });

    await expect(
      getAvailableEnpsSurveys.execute({
        account_id: 'another-fake-account-id',
        user_id: user.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to get available ENPS Surveys from another account', async () => {
    await fakeEnpsSurveyRepository.create({
      account_id: 'another-fake-account-id',
      end_date: new Date(),
      question: 'fake question',
    });

    const user = await fakeUsersRepository.create({
      account_id: 'fake-account-id',
      email: 'fake@email.example',
      name: 'fake name',
      password: 'fake pass',
    });

    await expect(
      getAvailableEnpsSurveys.execute({
        account_id: 'fake-account-id',
        user_id: user.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
