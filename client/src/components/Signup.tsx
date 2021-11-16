import {useContext } from "react";
import PageLanguage from '../enums/PageLanguage';
import { AuthContext } from "../helpers/AuthContext";
import LoginSignupForm from "../shared/LoginSignupForm";

const Signup = (): JSX.Element => {
	const { pageLanguage } = useContext(AuthContext);

	return (
		<LoginSignupForm pageName={pageLanguage === PageLanguage.EN ? "Sign up" : "Regisztráció"} />
	);
}

export default Signup;