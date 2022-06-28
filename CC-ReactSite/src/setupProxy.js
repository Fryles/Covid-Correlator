const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
	app.use(
		"/api",
		createProxyMiddleware({
			target: "https://covid-correlator.herokuapp.com/",
			changeOrigin: true,
		})
	);
};
