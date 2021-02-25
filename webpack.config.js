const path = require('path');
module.exports = {
 mode: 'development',
 entry: './src/index.ts',
 target: 'node',
  output: {
  path: path.resolve(__dirname, 'dist'),
  filename: 'index.js'
  },
 module: {
   rules: [
     {
       test: /\.ts$/,
       use: 'ts-loader',
     },
   ],
 },
 resolve: {
   extensions: [
     '.ts', '.js',
   ]
 },
};
