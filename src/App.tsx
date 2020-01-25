import React from 'react';
import { BrowserRouter as Router, Link, Route } from 'react-router-dom';
import { Home } from './pages/home/Home';
import styles from './App.module.scss';

const App: React.FC = () => {
	return (
		<Router>
			<nav {...{ className: styles.nav }}>
				<ul>
					<li><Link {...{ to: '/' }}>Home</Link></li>
				</ul>
			</nav>
			<div {...{ className: styles.mainWrapper }}>
				<div {...{ className: styles.wrapper }}>
					<Route {...{ path: '/', exact: true, component: Home }}/>
				</div>
			</div>
		</Router>
	);
};

export default App;
