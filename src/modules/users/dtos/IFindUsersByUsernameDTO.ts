export default interface IFindUsersByUsernameDTO {
  account_id: string;
  except_user_id?: string;
  username_like: string;
}
