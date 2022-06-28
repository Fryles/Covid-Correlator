import React from "react";

class credits extends React.Component {
	render() {
		return (
			<div className="text-center">
				<h2 className=" mt-5">
					Developed by <a href="https://github.com/fryles">Myles Marr</a>
				</h2>
				<h3 className=" mt-5">
					Covid rate of infection data pulled from{" "}
					<a href="https://github.com/pomber/covid19">
						github.com/pomber/covid19
					</a>
				</h3>
				<h3 className=" mt-5">
					Dynamic line graphic done using <a href="https://nivo.rocks/">Nivo</a>
				</h3>
				<h3 className=" mt-5">
					Google Trends data scraped using{" "}
					<a href="https://www.npmjs.com/package/google-trends-api">
						google-trends-api
					</a>
				</h3>
			</div>
		);
	}
}
export default credits;
