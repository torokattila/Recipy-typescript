import { useContext } from 'react';
import PageLanguage from '../enums/PageLanguage';
import { AuthContext } from '../helpers/AuthContext';
import LoginSignupForm from '../shared/LoginSignupForm';

const Login = (): JSX.Element => {
    const { pageLanguage } = useContext(AuthContext);

    return (
        <LoginSignupForm pageName={pageLanguage === PageLanguage.EN ? 'Login' : 'Bejelentkezés'} />
    )
};

export default Login;