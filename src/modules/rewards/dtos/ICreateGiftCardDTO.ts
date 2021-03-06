export default interface ICreateGiftCardDTO {
  provider_id: string;
  title: string;
  image_url: string;
  points: number;
  units_available: number;
  expiration_days: number;
  description: string;
}
