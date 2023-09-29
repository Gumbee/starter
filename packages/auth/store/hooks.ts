import { useAuthStore } from '.';

export const useUser = () => useAuthStore((s) => s.user);
export const useSetUser = () => useAuthStore((s) => s.setUser);
export const useSetUserIfEmpty = () => useAuthStore((s) => s.setUserIfEmpty);
