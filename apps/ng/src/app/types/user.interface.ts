// this is normalized in /api/users/me, hence id instead of _id
export interface CurrentUser {
  id: string;
  username: string;
  email: string;
  token: string;
}
