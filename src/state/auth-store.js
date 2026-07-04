import { createContext, useContext } from 'react';

export const AuthStore = createContext(null);
export const useAuth = () => useContext(AuthStore);
