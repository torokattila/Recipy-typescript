import axios, { AxiosError, AxiosResponse } from 'axios';
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import './App.css';
import Home from './components/Home';
import PageLanguage from './enums/PageLanguage';
import { AuthContext } from './helpers/AuthContext';

export type AuthType = {
	username: string;
	id: number;
	google_id?: number | null;
	status: boolean;
};

function App(): JSX.Element {
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

	useEffect(() => {
		axios
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
	}, []);

	return (
		<div className="App">
			<AuthContext.Provider value={{ authState, setAuthState, pageLanguage }}>
        <Router>
          <>
            <Route path='/'>
              <Home />
            </Route>
          </>
        </Router>
      </AuthContext.Provider>
		</div>
	);
}

export default App;
