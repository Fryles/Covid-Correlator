import React from "react";
import { NavLink } from "react-router-dom";

function navbar() {
	return (
		<nav className="navbar navbar-expand navbar-dark bg-dark">
			<NavLink to="/covid-correlator" className="navbar-brand m-2">
				Covid Correlator
			</NavLink>
			<div className="collapse navbar-collapse" id="navbarsSupportedContent">
				<ul className="navbar-nav">
					<li className="nav-item">
						<NavLink className="nav-link" to="/covid-correlator">
							Home
						</NavLink>
					</li>
					<li className="nav-item">
						<NavLink className="nav-link" to="/credits">
							Credits
						</NavLink>
					</li>
				</ul>
			</div>
		</nav>
	);
}

export default navbar;
