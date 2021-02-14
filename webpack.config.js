 const path = require('path');

 module.exports = {
   mode: 'production',
   entry: './src/index.js',
   output: {
     filename: 'main.js',
     path: path.resolve(__dirname, 'dist'),
   },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    fallback: {
	  crypto: path.resolve(__dirname, 'node_modules/crypto-browserify'),
	  stream: path.resolve(__dirname, 'node_modules/stream-browserify')
	}
  }
 };