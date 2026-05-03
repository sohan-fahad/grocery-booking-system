import { UserEntity } from "@/lib/models/entities";
import { SessionUtils } from "@/lib/utils";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface IAuthenticationStore {
    isLoggedIn: boolean;
    setIsLoggedIn: (isLoggedIn: boolean) => void;
    user: UserEntity | null;
    setUser: (user: UserEntity | null) => void;
    token: string | null;
    setToken: (token: string | null) => void;
    logout: () => void;
    _hasHydrated: boolean;
    setHasHydrated: (state: boolean) => void;
}

export const useAuthenticationStore = create<IAuthenticationStore>()(
    persist(
        (set) => ({
            isLoggedIn: false,
            user: null,
            token: null,
            _hasHydrated: false,
            setIsLoggedIn: (isLoggedIn: boolean) => set({ isLoggedIn: isLoggedIn }),
            setUser: (user: UserEntity | null) => set({ user }),
            setToken: (token: string | null) => {
                set({ token });
                SessionUtils.setToken(token || '');
            },
            logout: () => {
                set({
                    isLoggedIn: false,
                    user: null,
                    token: null
                })
                SessionUtils.removeToken();
            },
            setHasHydrated: (state: boolean) => set({ _hasHydrated: state }),
        }),
        {
            name: "auth-storage",
            partialize: (state) => ({
                isLoggedIn: state.isLoggedIn,
                user: state.user,
            }),
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true);
            },
        }
    )
);
