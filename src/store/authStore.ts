import { create } from "zustand";

interface AuthState {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false, // Por defecto el usuario no está autenticado
  login: () => set({ isAuthenticated: true }),
  logout: () => set({ isAuthenticated: false }),
}));

export default useAuthStore;
