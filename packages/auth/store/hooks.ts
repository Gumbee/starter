import { useAuthStore } from '.';

export const useUser = () => useAuthStore((s) => ({ user: s.user, initializing: s.initializing, loading: s.loading }));
export const useLoading = () => useAuthStore((s) => s.loading);
export const useSetUser = () => useAuthStore((s) => s.setUser);
export const useSetUserIfEmpty = () => useAuthStore((s) => s.setUserIfEmpty);
export const useSetInitializing = () => useAuthStore((s) => s.setInitializing);
export const useSetLoading = () => useAuthStore((s) => s.setLoading);
