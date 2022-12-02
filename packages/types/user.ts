export interface User {
  email: string;
  username: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CurrentUser = User & { token: string };
