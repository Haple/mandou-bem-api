export default interface ICreateRewardRequestDTO {
  catalog_reward_id: string;
  account_id: string;
  user_id: string;
  status: 'CREATED' | 'DELIVERED';
}
