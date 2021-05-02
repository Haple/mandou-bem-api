import QRCode from 'qrcode';
import IQRCodeProvider from '../models/IQRCodeProvider';
import IQRCodeResponse from '../models/IQRCodeResponse';

class QRCodeProvider implements IQRCodeProvider {
  public async generateQRCode(text: string): Promise<IQRCodeResponse> {
    try {
      return {
        qr_code: await QRCode.toDataURL(text),
      };
    } catch (err) {
      console.error(`Fail to generate QR Code: ${err}`);
      throw err;
    }
  }
}

export default QRCodeProvider;
