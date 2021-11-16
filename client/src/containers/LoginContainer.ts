import { useState, useContext } from "react";
import axios, { AxiosError, AxiosResponse } from "axios";
import Swal from "sweetalert2";
import { AuthContext } from "../helpers/AuthContext";
import { useHistory } from 'react-router-dom';
import PageLanguage from '../enums/PageLanguage';
import { GoogleLoginResponse, GoogleLoginResponseOffline, UseGoogleLoginResponse } from 'react-google-login';

type LoginDataType = {
    username: string;
    password: string;
    languageToBackend: PageLanguage;
};

type GoogleLoginDataType = {
    username: string;
    google_id: string;
    languageToBackend: PageLanguage;
};

const LoginContainer = () => {
    const [loginUsername, setLoginUsername] = useState<string>('');
    const [loginPassword, setLoginPassword] = useState<string>('');
    const [hidePassword, setHidePassword] = useState<boolean>(true);
    const [isPassword, setIsPassword] = useState<boolean>(true);

    const { setAuthState, pageLanguage } = useContext(AuthContext);
    const history = useHistory();

    const handleChangeLanguage = (languageType: PageLanguage): void => {
        localStorage.setItem('pageLanguage', languageType);
        window.location.reload();
    }

    const togglePasswordIcon = (): void => {
        setHidePassword(!hidePassword);
        setIsPassword(!isPassword);
    };

    const handleLogin = (): void => {
        const data: LoginDataType = {
            username: loginUsername,
            password: loginPassword,
            languageToBackend: pageLanguage
        };

        axios.post('http://localhost:3001/api/login', data)
        .then((response: AxiosResponse) => {
            if (response.data.error) {
                Swal.fire({
                    title: '',
                    text: response.data.error,
                    type: 'error'
                });
            } else {
                localStorage.setItem('accessToken', response.data.token);

                setAuthState({
                    username: response.data.username,
                    id: response.data.id,
                    google_id: response.data.google_id,
                    status: true
                });

                history.push('/');
            }
        })
        .catch((error: AxiosError) => {
            console.log(error);
        });
    };

    const loginGoogle = (response: GoogleLoginResponse | GoogleLoginResponseOffline): void => {
        
        const data: GoogleLoginDataType= {
                username: 'profileObj' in response ? response?.profileObj.givenName : '',
                google_id: 'profileObj' in response ? response.profileObj.googleId : '',
                languageToBackend: pageLanguage
        };

        axios.post('http://localhost:3001/api/login', data)
        .then((response: AxiosResponse) => {
            if (response.data.error) {
                Swal.fire({
                    title: '',
                    text: response.data.error,
                    type: 'error'
                });
            } else {
                localStorage.setItem('accessToken', response.data.token);
                
                setAuthState({
                    username: response.data.username,
                    id: response.data.id,
                    google_id: response.data.google_id,
                    status: true
                });

                history.push('/');
            }
        })
        .catch((error: AxiosError) => {
            console.log(error);
        });
    };

    return {
		loginUsername,
		setLoginUsername,
		loginPassword,
		setLoginPassword,
		isPassword,
		setIsPassword,
		handleLogin,
		loginGoogle,
		hidePassword,
		setHidePassword,
		togglePasswordIcon,
		handleChangeLanguage
	};
}

export default LoginContainer
