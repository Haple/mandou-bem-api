declare namespace Express {
  export interface Request {
    user: {
      id: string;
      account_id: string;
      is_admin: boolean;
    };
  }
}
