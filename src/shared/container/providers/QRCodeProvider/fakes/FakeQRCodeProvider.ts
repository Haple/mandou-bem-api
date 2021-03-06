import IQRCodeProvider from '../models/IQRCodeProvider';
import IQRCodeResponse from '../models/IQRCodeResponse';

class FakeQRCodeProvider implements IQRCodeProvider {
  public async generateQRCode(text: string): Promise<IQRCodeResponse> {
    return {
      qr_code:
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHQAAAB0CAYAAABUmhYnAAAAAklEQVR4AewaftIAAALDSURBVO3BQW7sWAwEwSxC979yjpdcPUCQuv3NYUT8wRqjWKMUa5RijVKsUYo1SrFGKdYoxRqlWKMUa5RijVKsUYo1SrFGKdYoFw8l4ZtUuiScqHRJ6FROkvBNKk8Ua5RijVKsUS5epvKmJJyodEk4UemS0KmcqLwpCW8q1ijFGqVYo1x8WBLuULkjCb8pCXeofFKxRinWKMUa5eKPU+mS0CXhRGWSYo1SrFGKNcrF/4xKl4RO5S8r1ijFGqVYo1x8mMonJeEJlSdU/iXFGqVYoxRrlIuXJeE3qXRJOElCp3KShH9ZsUYp1ijFGiX+YJAkdCpdEjqVSYo1SrFGKdYo8QcPJKFT6ZLQqdyRhBOVkyTcoXKShE7lJAmdSpeETuWJYo1SrFGKNcrFL0tCp9Kp3JGETuWOJJyonCShU+mS8EnFGqVYoxRrlIsvS0KncpKETuU3JeFEpUtCp9Il4U3FGqVYoxRrlIsPU+mS0CWhU+lUuiR0Kk8koVM5ScIdKl0SOpU3FWuUYo1SrFEuXpaEO1S6JJyovEmlS8KJyh1J+KZijVKsUYo1ysVDKm9SuSMJJ0k4UXkiCZ3KiUqXhE7liWKNUqxRijXKxUNJ+CaVNyXhRKVLwhNJ6FTeVKxRijVKsUa5eJnKm5JwonKShBOVLgldEjqVO1S6JHxSsUYp1ijFGuXiw5Jwh8oTSbgjCXck4USlS0Kn0iWhU3miWKMUa5RijXIxjEqXhE7lTUnoknCHypuKNUqxRinWKBd/XBI6lTcloVPpVLokdCpdEk5UnijWKMUapVijXHyYyiepnKicJKFT6VROktCpdEnoVLokvKlYoxRrlGKNcvGyJHxTEu5Q6VROknBHEjqVLgmfVKxRijVKsUaJP1hjFGuUYo1SrFGKNUqxRinWKMUapVijFGuUYo1SrFGKNUqxRinWKMUa5T+U5BAEtK+zygAAAABJRU5ErkJggg==',
    };
  }
}

export default FakeQRCodeProvider;
