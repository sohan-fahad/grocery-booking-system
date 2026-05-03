import { UserEntity } from "../entities";

export interface IAuthResponse {
    token: string;
    refreshToken: string;
    user: UserEntity;
}