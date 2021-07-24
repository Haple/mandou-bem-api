import handlebars from 'handlebars';
import fs from 'fs';
import { promisify } from 'util';

import IParseTemplateDTO from '../dtos/IParseTemplateDTO';
import ITemplateProvider from '../models/ITemplateProvider';

class HandlebarsTemplateProvider implements ITemplateProvider {
  public async parse({ file, variables }: IParseTemplateDTO): Promise<string> {
    const readFile = promisify(fs.readFile);

    const templateFileContent = await readFile(file, {
      encoding: 'utf-8',
    });

    const parseTemplate = handlebars.compile(templateFileContent);

    return parseTemplate(variables);
  }
}

export default HandlebarsTemplateProvider;
