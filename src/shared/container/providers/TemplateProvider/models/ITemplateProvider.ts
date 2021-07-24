import IParseTemplateDTO from '../dtos/IParseTemplateDTO';

export default interface ITemplateProvider {
  parse(data: IParseTemplateDTO): Promise<string>;
}
