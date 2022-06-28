import React from "react";
import Navbar from "./navbar";
import Graph from "./graph";
import Credits from "./credits";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

class main extends React.Component {
	render() {
		return (
			<>
				<Router>
					<Navbar />
					<Routes>
						<Route path="/" element={<Graph />} />
						<Route path="/credits" element={<Credits />} />
					</Routes>
				</Router>
			</>
		);
	}
}
export default main;
