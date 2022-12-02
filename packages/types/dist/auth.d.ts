export interface RegisterInput {
    email: string;
    username: string;
    password: string;
}
export interface LoginInput {
    email: string;
    password: string;
}
export interface EmailExistsInput {
    email: string;
}
