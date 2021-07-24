import { container } from 'tsyringe';

import ITemplateProvider from './models/ITemplateProvider';

import HandlebarsTemplateProvider from './implementations/HandlebarsTemplateProvider';

container.registerSingleton<ITemplateProvider>(
  'TemplateProvider',
  HandlebarsTemplateProvider,
);
