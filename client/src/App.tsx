import axios, { AxiosError, AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import Login from './components/Login';
import Profile from './components/Profile';
import Signup from './components/Signup';
import PageLanguage from './enums/PageLanguage';
import { AuthContext } from './helpers/AuthContext';

export type AuthType = {
	username: string;
	id: number;
	google_id?: number | null;
	status: boolean;
};

const App = (): JSX.Element => {
	const [authState, setAuthState] = useState<AuthType>({
		username: '',
		id: 0,
		google_id: null,
		status: false
	});

	const [pageLanguage, setPageLanguage] = useState<PageLanguage>(
		PageLanguage.EN
	);

	useEffect(() => {
		const returnedLanguage = localStorage.getItem('pageLanguage')!;

		setPageLanguage(returnedLanguage as PageLanguage);
	}, []);

	const authenticate = async (): Promise<void> => {
		await axios
		.get('http://localhost:3001/api/auth', {
			params: {
				languageToBackend: pageLanguage
			},
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
					google_id: response.data.google_id,
					status: true
				});
			}
		})
		.catch((error: AxiosError) => {
			console.log(error);
		});
	};

	useEffect(() => {
		authenticate();
	}, []);

	return (
		<div className="App">
			<AuthContext.Provider
				value={{ authState, setAuthState, pageLanguage, authenticate }}
			>
				<Router>
					<Switch>
						<>
							<Route exact path='/' component={Home} />
							<Route exact path='/profile' component={Profile} />
							<Route exact path='/login' component={Login} />
							<Route exact path='/signup' component={Signup} />
						</>
					</Switch>
				</Router>
			</AuthContext.Provider>
		</div>
	);
}

export default App;
