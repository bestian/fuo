var webpack = require('webpack')
module.exports = {
    publicPath: process.env.NODE_ENV === 'production'
    ? '/fuo/'
    : '/',
	lintOnSave: false,
	configureWebpack: {
		plugins: [
		new webpack.ProvidePlugin({
			semantic: "semantic-ui-css",
			Semantic: "semantic-ui-css",
			"semantic-ui": "semantic-ui-css",
		})]
	}
}