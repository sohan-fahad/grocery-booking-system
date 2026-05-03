import { LoginInput, RegisterInput } from "@/lib/schemas";
import HttpClient from "../http.service";
import { IAuthResponse, IBaseResponse } from "@/lib/models/responses";


export class AuthApiService {

    static async signIn(data: LoginInput) {
        const response = await HttpClient.post<IBaseResponse<IAuthResponse>>('/web/auth/login', {
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    }

    static async signUp(data: RegisterInput) {
        const { phoneNumber, ...rest } = data;
        const body: Record<string, unknown> = { ...rest };
        if (phoneNumber?.trim()) {
            body.phoneNumber = phoneNumber.trim();
        }
        const response = await HttpClient.post<IBaseResponse<IAuthResponse>>('/web/auth/register', {
            body: JSON.stringify(body),
        });
        return response.data;
    }
}
