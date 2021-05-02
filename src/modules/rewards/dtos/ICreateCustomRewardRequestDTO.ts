export default interface ICreateCustomRewardRequestDTO {
  custom_reward_id: string;
  account_id: string;
  user_id: string;
  status: 'pending_approval' | 'use_available' | 'used' | 'reproved';
}
