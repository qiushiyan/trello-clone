// extended by mongoose, hence no id
export interface User {
  email: string;
  username: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

// normalized user
export type CurrentUser = Omit<User, "password"> & {
  id: string;
  token: string;
};
