import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { AuthContext } from '../helpers/AuthContext';
import IconButton from '@material-ui/core/IconButton';
import { GoogleLogin, GoogleLoginResponse } from 'react-google-login';
import {
	findFlagUrlByNationality,
	findFlagUrlByCountryName
} from 'country-flags-svg';
import '../components/Login.css';
import SignupContainer from '../containers/SignupContainer';
import LoginContainer from '../containers/LoginContainer';
import PageLanguage from '../enums/PageLanguage';
import { Divider } from '@material-ui/core';

const LoginSignupForm = (pageName: string): JSX.Element => {
	const { pageLanguage } = useContext(AuthContext);
	const hungarianFlagUrl = findFlagUrlByNationality('Hungarian');
	const englishFlagUrl = findFlagUrlByCountryName('United Kingdom');
	const navigate = useNavigate();

	const {
		setSignupUsername,
		setSignupPassword,
		setPasswordAgain,
		handleSignup
	} = SignupContainer();

	const {
		setLoginUsername,
		setLoginPassword,
		isPassword,
		handleLogin,
		loginGoogle,
		hidePassword,
		togglePasswordIcon,
		handleChangeLanguage
	} = LoginContainer();

	return (
		<div className="login-page-container">
			<div className="login-page-title-container">
				<h1 className="login-page-main-title">Recipy</h1>
				<h3 className="login-page-subtitle">
					{pageLanguage === PageLanguage.EN
						? 'What should I cook today?'
						: 'Mit főzzek ma?'}
				</h3>

				<div>
					<IconButton
						onClick={() => {
							handleChangeLanguage(PageLanguage.HU);
						}}
					>
						<img src={hungarianFlagUrl} alt="flag-icon" />
					</IconButton>
				</div>
			</div>

			<div className="login-page-card-container">
				<div className="login-page-card-header-container">
					<div>
						<h1>
							{pageName}
						</h1>
					</div>
				</div>

				<div className="login-form-container">
					<div>
						<input
							type="text"
							className="credentials-input-field"
							id="login-username"
							placeholder={
								pageLanguage === PageLanguage.EN
									? 'Username'
									: 'Felhasználónév'
							}
							autoComplete="off"
							onChange={(
								event: React.ChangeEvent<HTMLInputElement>
							) => {
								pageName === 'Login' ||
								pageName === 'Bejelentkezés'
									? setLoginUsername(event.target.value)
									: setSignupUsername(event.target.value);
							}}
						/>
					</div>

					<div>
						<input
							type={isPassword ? 'password' : 'text'}
							className="credentials-input-field"
							id="login-password"
							placeholder={
								pageLanguage === PageLanguage.EN
									? 'Password'
									: 'Jelszó'
							}
							autoComplete="off"
							onChange={(
								event: React.ChangeEvent<HTMLInputElement>
							) => {
								pageName === 'Login' ||
								pageName === 'Bejelentkezés'
									? setLoginPassword(event.target.value)
									: setSignupPassword(event.target.value);
							}}
						/>
						<span onClick={() => togglePasswordIcon()}>
							{hidePassword
								? <EyeOutlined className="show-password-icon" />
								: <EyeInvisibleOutlined className="show-password-icon" />}
						</span>
					</div>

					{(pageName === 'Sign up' || pageName === 'Regisztráció') &&
						<div>
							<input
								type={isPassword ? 'password' : 'text'}
								className="credentials-input-field"
								id="login-password-again"
								placeholder={
									pageLanguage === PageLanguage.EN
										? 'Confirm password'
										: 'Jelszó megerősítése'
								}
								autoComplete="off"
								onChange={(
									event: React.ChangeEvent<HTMLInputElement>
								) => {
									setPasswordAgain(event.target.value);
								}}
							/>
						</div>}

					<div className="login-button-container">
						<button
							className="login-button"
							type="button"
							onClick={() =>
								pageName === 'Login' ||
								pageName === 'Bejelentkezés'
									? handleLogin()
									: handleSignup()}
						>
							{pageName}
						</button>
					</div>

					{(pageName === 'Login' || pageName === 'Bejelentkezés') &&
						<div>
							<div>
								<h3 className="or-google-login">
									{pageLanguage === PageLanguage.EN
										? 'or'
										: 'vagy'}
								</h3>
							</div>

							<GoogleLogin
								className="google-login-button"
								clientId={process.env.REACT_APP_CLIENT_ID as string}
								buttonText={
									pageLanguage === PageLanguage.EN
										? 'Sign in'
										: 'Bejelentkezés'
								}
								onSuccess={loginGoogle}
								onFailure={loginGoogle}
								cookiePolicy={'single_host_origin'}
							/>
						</div>}
				</div>
			</div>
		</div>
	);
};

export default LoginSignupForm;
