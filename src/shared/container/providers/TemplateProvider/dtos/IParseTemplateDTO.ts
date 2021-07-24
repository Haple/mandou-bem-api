interface ITemplateVariables {
  [key: string]: string | number | Record<string, any> | Record<string, any>[];
}

export default interface IParseTemplateDTO {
  file: string;
  variables: ITemplateVariables;
}
