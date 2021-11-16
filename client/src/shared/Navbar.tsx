import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../helpers/AuthContext';
import { useHistory } from 'react-router-dom';
import NavbarContainer from '../containers/NavbarContainer';
import axios, { AxiosError, AxiosResponse } from 'axios';
import HomeIcon from '@material-ui/icons/Home';
import AccountCircle from '@material-ui/icons/AccountCircle';
import ExitToAppRounded from '@material-ui/icons/ExitToAppRounded';
import Tooltip from '@material-ui/core/Tooltip';
import PageLanguage from '../enums/PageLanguage';

import "./Navbar.css";

function Navbar(): JSX.Element {
	const { pageLanguage } = useContext(AuthContext);
	const [authState, setAuthState] = useState({
		username: '',
		id: 0,
		status: false
	});

	const history = useHistory();
	const { handleLogout } = NavbarContainer();

	useEffect(() => {
		if (!localStorage.getItem('accessToken')) {
			history.push('/login');
			window.location.reload();
		} else {
			axios
				.get('http://localhost:3001/api/auth', {
					headers: {
						accessToken: localStorage.getItem('accessToken')!
					}
				})
				.then((response: AxiosResponse) => {
					if (response.data.error) {
						setAuthState({ ...authState, status: false });
					} else {
						setAuthState({
							username: response.data.username,
							id: response.data.user.id,
							status: true
						});
					}
				})
				.catch((error: AxiosError) => {
					console.log(error);
				});
		}
	}, []);

	return (
		<div className="navbar-container">
			<div className="icons-container">
				<img
					src="/cook_book.png"
					alt="page_logo"
					className="page-logo"
					onClick={() => {
						history.push('/');
					}}
				/>
				<ul>
					<Tooltip
						title={
							pageLanguage === PageLanguage.EN
								? 'Home Page'
								: 'Főoldal'
						}
						arrow
					>
						<li>
							<HomeIcon
								className="home-icon"
								onClick={() => {
									history.push('/');
								}}
							/>
						</li>
					</Tooltip>

					<Tooltip
						title={
							pageLanguage === PageLanguage.EN
								? 'Profile'
								: 'Profil'
						}
						arrow
					>
						<li>
							<AccountCircle
								className="profile-icon"
								onClick={() => history.push('/profile')}
							/>
						</li>
					</Tooltip>

					<Tooltip
						title={
							pageLanguage === PageLanguage.EN
								? 'Logout'
								: 'Kijelentkezés'
						}
						arrow
					>
						<li>
							<ExitToAppRounded
								className="logout-icon"
								onClick={handleLogout}
							/>
						</li>
					</Tooltip>
				</ul>
			</div>
		</div>
	);
}

export default Navbar;
