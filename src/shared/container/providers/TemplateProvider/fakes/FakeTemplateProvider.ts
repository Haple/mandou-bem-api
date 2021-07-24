import ITemplateProvider from '../models/ITemplateProvider';

class FakeTemplateProvider implements ITemplateProvider {
  public async parse(): Promise<string> {
    return 'Mail content';
  }
}

export default FakeTemplateProvider;
