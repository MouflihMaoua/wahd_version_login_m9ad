import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            role: null, // 'particulier', 'artisan', 'admin'
            loading: false, // Ajout de la propriété loading manquante

            setAuth: (user, token) => set({
                user,
                token,
                isAuthenticated: !!token,
                role: user?.role || null,
                loading: false
            }),

            setLoading: (loading) => set({ loading }),

            logout: () => set({
                user: null,
                token: null,
                isAuthenticated: false,
                role: null,
                loading: false
            }),

            updateUser: (userData) => set((state) => ({
                user: { ...state.user, ...userData }
            })),
        }),
        {
            name: 'artisan-connect-auth',
        }
    )
);
