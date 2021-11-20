import { useContext, useState } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';
import Swal from 'sweetalert2';
import { AuthContext } from '../helpers/AuthContext';
import { useHistory } from 'react-router-dom';
import PageLanguage from '../enums/PageLanguage';
import { toast } from 'react-toastify';

type SignupDataType = {
	username: string;
	password: string;
	passwordAgain: string;
	languageToBackend: PageLanguage;
};

const SignupContainer = () => {
	const [signupUsername, setSignupUsername] = useState<string>('');
	const [signupPassword, setSignupPassword] = useState<string>('');
	const [passwordAgain, setPasswordAgain] = useState<string>('');
	const [hidePassword, setHidePassword] = useState<boolean>(true);
	const [isPassword, setIsPassword] = useState<boolean>(true);

	const { setAuthState, pageLanguage } = useContext(AuthContext);
	const history = useHistory();

	const handleSignup = async (): Promise<void> => {
		const data: SignupDataType = {
			username: signupUsername,
			password: signupPassword,
			passwordAgain,
			languageToBackend: pageLanguage
		};

		await axios
			.post('http://localhost:3001/api/register', data)
			.then((response: AxiosResponse) => {
				if (response.data.error) {
					toast.error(response.data.error, { theme: 'colored' });
				} else {
					localStorage.setItem('accessToken', response.data.token);

					console.log(response.data);

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
				const errorMessage =
					pageLanguage === PageLanguage.EN
						? 'There was an error with the registration, please try again!'
						: 'Hiba adódott a regisztrációval, kérjük próbálja újra!';
				toast.error(errorMessage, { theme: 'colored' });
			});
	};

	const togglePasswordIcon = (): void => {
		setHidePassword(!hidePassword);
		setIsPassword(!isPassword);
	};

	return {
		signupUsername,
		setSignupUsername,
		signupPassword,
		setSignupPassword,
		passwordAgain,
		setPasswordAgain,
		hidePassword,
		isPassword,
		setIsPassword,
		setHidePassword,
		handleSignup,
		togglePasswordIcon
	};
};

export default SignupContainer;
