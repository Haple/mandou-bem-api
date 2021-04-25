export default interface ICreateCustomRewardRequestDTO {
  custom_reward_id: string;
  account_id: string;
  user_id: string;
  status: 'CREATED' | 'DELIVERED';
}
