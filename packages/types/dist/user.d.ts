export interface User {
    email: string;
    username: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare type CurrentUser = User & {
    token: string;
};
