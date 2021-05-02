import IQRCodeResponse from './IQRCodeResponse';

export default interface IQRCodeProvider {
  generateQRCode(text: string): Promise<IQRCodeResponse>;
}
