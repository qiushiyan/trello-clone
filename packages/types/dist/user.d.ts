export interface User {
    email: string;
    username: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare type CurrentUser = Omit<User, "password"> & {
    id: string;
    token: string;
};
