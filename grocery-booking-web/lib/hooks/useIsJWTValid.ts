import { jwtDecode } from "jwt-decode";
import { SessionUtils } from "../utils";

export function useIsJWTValid() {
    const token = SessionUtils.getToken();
    if (!token) {
        return false;
    }
    try {
        const decoded = jwtDecode(token);
        return decoded.exp && decoded.exp > Date.now() / 1000;
    } catch (error) {
        return false;
    }
};