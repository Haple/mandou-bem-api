export default interface ICreateUserDTO {
  account_id: string;
  name: string;
  email: string;
  password: string;
  is_admin?: boolean;
  position_id?: string;
  department_id?: string;
}
