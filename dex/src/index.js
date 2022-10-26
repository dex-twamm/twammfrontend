import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import './index.css';
import AllProviders from './providers';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<StrictMode>
		<AllProviders>
			<Router>
				<App />
			</Router>
		</AllProviders>
	</StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
