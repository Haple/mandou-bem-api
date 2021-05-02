export default interface ICreateGiftCardRequestDTO {
  gift_card_id: string;
  user_id: string;
  expire_at: Date;
  status: 'use_available' | 'used';
}
