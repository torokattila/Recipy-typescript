import { createContext, useState } from 'react';
import { AuthType } from '../App';
import PageLanguage from '../enums/PageLanguage';

const authState = {
    username: '',
    id: 0,
    google_id: null,
    status: false
};
const setAuthState = () => {};
const pageLanguage: PageLanguage = PageLanguage.EN;

type ContextType = {
    authState: AuthType,
    setAuthState: React.Dispatch<React.SetStateAction<AuthType>>,
    pageLanguage: PageLanguage
}

export const AuthContext: React.Context<ContextType> = createContext<ContextType>({ authState, setAuthState, pageLanguage });
