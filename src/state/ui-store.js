import { createContext,useContext } from 'react';
export const UiStore=createContext(null);
export const useUi=()=>useContext(UiStore);
