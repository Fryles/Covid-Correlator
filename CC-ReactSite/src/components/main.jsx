import React from "react";
import Navbar from "./navbar";
import Graph from "./graph";
import Credits from "./credits";
import { HashRouter, Route, Routes } from "react-router-dom";

class main extends React.Component {
	render() {
		return (
			<>
				<React.StrictMode>
					<HashRouter>
						<Navbar />
						<Routes>
							<Route path="/covid-correlator" element={<Graph />} />
							<Route path="/credits" element={<Credits />} />
						</Routes>
					</HashRouter>
				</React.StrictMode>
			</>
		);
	}
}
export default main;
