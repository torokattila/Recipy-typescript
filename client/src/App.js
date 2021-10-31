import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { AuthContext } from "./helpers/AuthContext";
import { useState, useEffect } from "react";
import axios from "axios";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Home from "./components/Home";
import Profile from "./components/Profile";

function App() {
	const [authState, setAuthState] = useState({
		username: "",
		id: 0,
		google_id: null,
		status: false
	});
	const [pageLanguage, setpageLanguage] = useState("EN");

	useEffect(() => {
		const returnedLanguage = localStorage.getItem("pageLanguage");

		setpageLanguage(returnedLanguage);
	}, []);

	useEffect(() => {
		axios
			.get("http://localhost:3001/api/auth", {
				params: {
					languageToBackend: pageLanguage
				},
				headers: {
					accessToken: localStorage.getItem("accessToken")
				}
			})
			.then(response => {
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
			.catch(error => {
				console.log(error);
			});
	}, []);

	return (
		<div className="App">
			<AuthContext.Provider value={{ authState, setAuthState, pageLanguage }}>
				<Router>
					<Switch>
						<>
							<Route exact path="/" component={Home} />
							<Route exact path="/profile" component={Profile} />
							<Route exact path="/login" component={Login} />
							<Route exact path="/signup" component={Signup} />
						</>
					</Switch>
				</Router>
			</AuthContext.Provider>
		</div>
	);
}

export default App;
